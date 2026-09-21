#!/usr/bin/env node
/**
 * Scans public sources for street closures, demonstrations, markets and other city events in
 * central Oslo, and writes data/city-events.json for the app to merge into its calendar.
 * Runs on a schedule (see .github/workflows/scan-city-events.yml). No API keys needed.
 *
 * Sources:
 *   - Politiloggen (Norwegian police log) — Oslo municipality, last 72h.
 *   - Entur situation exchange (Ruter disruptions) — tram/bus/metro detours caused by events.
 *   - Google News RSS — Norwegian headlines; the catch-all for demonstrations the police log skips
 *     (the police log did NOT record the 19 Sep 2026 Karl Johans gate demonstration).
 *
 * Everything found here is unverified: it is shown in the app as "auto-detected" so a human can
 * check dates/times. Matching is keyword + central-location based, so expect some noise and misses.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_PATH = path.resolve(__dirname, "..", "data", "city-events.json");

const POLICE_BASE = "https://api.politiloggen.politiet.no";
const ENTUR_URL = "https://api.entur.io/journey-planner/v3/graphql";
const LOOKBACK_HOURS = Number(process.env.LOOKBACK_HOURS || 72);
const KEEP_DAYS = 400;            // the app's calendar spans Dec 2025 – Dec 2026
const MAX_EVENT_SPAN_DAYS = 2;    // Ruter notices longer than this are roadworks, not events
const NEWS_MAX_AGE_DAYS = Number(process.env.NEWS_MAX_AGE_DAYS || 4);
const NEWS_QUERIES = [
  "demonstrasjon Oslo",
  "demonstranter Karl Johan",
  "gate stengt Oslo sentrum",
  "marked Oslo stengt",
  "markering Oslo sentrum",
  "fakkeltog Oslo",
  // announcements ahead of time: police warnings and organisers' plans
  "politiet varsler stengte veier Oslo",
  "demonstrasjon i morgen Oslo",
  "demonstrasjon lørdag Oslo",
  "kan bli stengt Oslo sentrum",
];

/* Central-Oslo places where a closure matters to cruise/port operations. */
const LOCATION_RE = new RegExp([
  "karl johan", "rådhusplassen", "radhusplassen", "aker brygge", "tjuvholmen", "filipstad", "akershus",
  "festningsplassen", "youngstorget", "stortinget", "universitetsplassen", "egertorget", "eufemias",
  "bjørvika", "sentrum", "grønland", "majorstuen", "frogner", "slottsplassen", "slottet",
  "jernbanetorget", "oslo s\\b", "tollbugata", "nationaltheatret", "solli plass", "operaen", "vika\\b",
  "revierkaia", "vippetangen", "bygdøy allé", "grensen", "dronningens gate", "øvre slottsgate",
  "bogstadveien", "hegdehaugsveien", "valkyriegata", "majorstua", "kirkeveien",
].join("|"), "i");

/* Something that suggests people gathering or a road being shut. "demonstra" also matches demonstrasjonstog. */
const UNPLANNED_RE = /demonstra|manifesta|protest|fakkeltog|aksjon|markering|stengt|stengte|stenges|sperret|sperring|omkjøring|kjører ikke|folkemengde/i;
const EVENT_RE = /marked|festival|konsert|arrangement|maraton|parade|løpet|feiring|utstilling/i;
/* Words that mean a real event (not roadworks) — enough on their own for a Ruter notice, which is Oslo-only anyway. */
const STRONG_EVENT_RE = /demonstra|manifesta|arrangement|markedsdag|marked\b|maraton|løpet|festival|parade|fakkeltog|konsert|markering|feiring/i;
const ACTIVITY_RE = new RegExp(`${UNPLANNED_RE.source}|${EVENT_RE.source}`, "i");

const osloFmt = new Intl.DateTimeFormat("sv-SE", {
  timeZone: "Europe/Oslo", year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", hour12: false,
});
/** ISO timestamp -> { date:"YYYY-MM-DD", time:"HH:MM" } in Oslo local time. */
function osloParts(iso){
  const [date, time] = osloFmt.format(new Date(iso)).split(" ");
  return { date, time };
}
function classify(text){ return UNPLANNED_RE.test(text) ? "unplanned" : "event"; }
function clip(s, n){ s = (s || "").replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; }
async function readJson(p, fallback){ try{ return JSON.parse(await readFile(p, "utf8")); } catch { return fallback; } }
async function getJson(url, opts){
  const res = await fetch(url, { signal: AbortSignal.timeout(30_000), ...opts });
  if(!res.ok) throw new Error(`${url} -> HTTP ${res.status}`);
  return res.json();
}

/* ---------- Politiloggen ---------- */
async function fromPolice(){
  const from = new Date(Date.now() - LOOKBACK_HOURS * 3600e3).toISOString();
  const messages = [];
  for(let skip = 0; skip < 1000; skip += 50){          // Take is capped at 50 by the API
    const q = new URLSearchParams({ DateFrom: from, Take: "50", Skip: String(skip) });
    q.append("Districts", "Oslo");
    q.append("Municipalities", "Oslo");                 // Oslo Politidistrikt also covers Asker and Bærum
    const page = await getJson(`${POLICE_BASE}/messages?${q}`);
    messages.push(...(page.messages || []));
    if(!page.hasMoreResults) break;
  }
  const threads = new Map();
  for(const m of messages){
    if(!threads.has(m.threadId)) threads.set(m.threadId, []);
    threads.get(m.threadId).push(m);
  }
  const events = [];
  for(const [threadId, msgs] of threads){
    msgs.sort((a, b) => a.createdOn.localeCompare(b.createdOn));
    const text = msgs.map(m => m.text).join(" ");
    const haystack = `${text} ${msgs[0].area || ""}`;
    const isArrangement = msgs[0].category === "Arrangement";
    if(!LOCATION_RE.test(haystack) || !(isArrangement || ACTIVITY_RE.test(haystack))) continue;
    const start = osloParts(msgs[0].createdOn);
    const last = osloParts(msgs[msgs.length - 1].updatedOn || msgs[msgs.length - 1].createdOn);
    events.push({
      id: `police:${threadId}`, source: "Politiloggen",
      date: start.date, type: classify(haystack),
      title: `${msgs[0].category}${msgs[0].area ? ` — ${msgs[0].area}` : ""}`,
      start: start.time, end: last.date === start.date && last.time !== start.time ? last.time : null,
      desc: clip(text, 320),
      url: "https://politiloggen.politiet.no/",
    });
  }
  return events;
}

/* ---------- Entur / Ruter ---------- */
async function fromRuter(){
  const query = `{ situations(authorities:["RUT"]) {
    situationNumber summary{value language} description{value language} validityPeriod{startTime endTime}
  } }`;
  const data = await getJson(ENTUR_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "ET-Client-Name": "oslo-ops-pulse-city-events" },
    body: JSON.stringify({ query }),
  });
  if(data.errors) throw new Error(`Entur: ${JSON.stringify(data.errors).slice(0, 200)}`);
  const pick = (arr) => (arr || []).find(x => x.language === "no")?.value || (arr || [])[0]?.value || "";
  const events = [];
  for(const s of data.data?.situations || []){
    const summary = pick(s.summary), desc = pick(s.description);
    const haystack = `${summary} ${desc}`;
    const isEvent = STRONG_EVENT_RE.test(haystack);
    if(!ACTIVITY_RE.test(haystack) || !(isEvent || LOCATION_RE.test(haystack))) continue;
    const startIso = s.validityPeriod?.startTime, endIso = s.validityPeriod?.endTime;
    if(!startIso) continue;
    if(endIso && (new Date(endIso) - new Date(startIso)) > MAX_EVENT_SPAN_DAYS * 86400e3) continue;
    const start = osloParts(startIso), end = endIso ? osloParts(endIso) : null;
    events.push({
      id: `ruter:${s.situationNumber}`, source: "Ruter",
      date: start.date, type: classify(haystack),
      title: clip(summary, 90), start: start.time,
      end: end && end.date === start.date ? end.time : null,
      desc: clip(desc || summary, 320),
      url: "https://ruter.no/en/traffic-info/",
    });
  }
  return events;
}


const WEEKDAYS = { søndag:0, mandag:1, tirsdag:2, onsdag:3, torsdag:4, fredag:5, lørdag:6 };
const FUTURE_CUE_RE = /varsler|kan bli|blir |stenges|skal |vil |ventet|planlagt|arrangeres|markerer/i;
/** Best guess at the day an article's event happens: "i morgen" / a weekday name in a forward-looking headline
 *  point ahead of the publish date; otherwise the event is assumed to be on the publish day. */
function newsEventDate(title, pubIso){
  const pubDate = osloParts(pubIso).date;
  const t = title.toLowerCase();
  const shift = (n) => { const d = new Date(`${pubDate}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
  if(/\bi morgen\b|\bimorgen\b/.test(t)) return shift(1);
  if(FUTURE_CUE_RE.test(t)){
    for(const [name, dow] of Object.entries(WEEKDAYS)){
      if(!t.includes(name)) continue;
      const pubDow = new Date(`${pubDate}T12:00:00Z`).getUTCDay();
      return shift((dow - pubDow + 7) % 7);
    }
  }
  return pubDate;
}

/* ---------- Organiser pages ---------- */
/* Recurring events whose organiser publishes the dates long in advance. Add an entry to watch another page.
   Dates are read from the text around `keyword`; the year comes from the date, else the text nearby, else this year. */
const WATCHED_PAGES = [
  {
    id: "bogstadveien-markedsdag", source: "Bogstadveien.no",
    url: "https://www.bogstadveien.no/markedsdag", keyword: /markedsdag/gi,
    title: "Market day — Bogstadveien, Majorstuen", type: "event",
    desc: "Twice-yearly market day: Bogstadveien, Hegdehaugsveien and Valkyriegata are closed to cars and trams (Ruter reroutes tram 12 around Majorstuen), with about 1.2 km of stalls set up before opening.",
  },
];
const MONTHS = { januar:1, februar:2, mars:3, april:4, mai:5, juni:6, juli:7, august:8, september:9, oktober:10, november:11, desember:12 };
const NB_DATE_RE = /(\d{1,2})\.\s*(januar|februar|mars|april|mai|juni|juli|august|september|oktober|november|desember)(?:\s+(?:i\s+)?((?:19|20)\d\d))?/gi;

function pageText(html){
  return html.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/\s+/g, " ");
}

async function fromWatchedPages(){
  const events = [];
  const thisYear = Number(osloParts(new Date().toISOString()).date.slice(0, 4));
  for(const page of WATCHED_PAGES){
    let text;
    try{
      const res = await fetch(page.url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30_000) });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      text = pageText(await res.text());
    }catch(err){ console.error(`Watched page ${page.url} failed: ${err.message}`); continue; }

    const found = new Map();   // date -> { start, end }
    for(const k of text.matchAll(page.keyword)){
      const window = text.slice(Math.max(0, k.index - 120), k.index + 160);
      const year = Number(window.match(/\b(20\d\d)\b/)?.[1] || thisYear);
      const times = window.match(/(\d{1,2})[:.](\d{2})\s*(?:til|-|–)\s*(\d{1,2})[:.](\d{2})/);
      for(const d of window.matchAll(NB_DATE_RE)){
        if(d[3] && Number(d[3]) < thisYear - 1) continue;   // history ("the first one was on 15 October 1988"), not a schedule
        const date = `${d[3] || year}-${String(MONTHS[d[2].toLowerCase()]).padStart(2, "0")}-${String(d[1]).padStart(2, "0")}`;
        if(!found.has(date)) found.set(date, times ? { start: `${times[1].padStart(2, "0")}:${times[2]}`, end: `${times[3].padStart(2, "0")}:${times[4]}` } : {});
      }
    }
    for(const [date, t] of found){
      events.push({
        id: `watch:${page.id}:${date}`, source: page.source, date, type: page.type, title: page.title,
        start: t.start || null, end: t.end || null, desc: page.desc, url: page.url,
      });
    }
  }
  return events;
}

/* ---------- News ---------- */
const decode = (s) => s.replace(/<!\[CDATA\[|\]\]>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function fromNews(){
  const seen = new Set();
  const events = [];
  for(const q of NEWS_QUERIES){
    const url = "https://news.google.com/rss/search?" + new URLSearchParams({
      q: `${q} when:${NEWS_MAX_AGE_DAYS}d`, hl: "no", gl: "NO", ceid: "NO:no",
    });
    let xml;
    try{
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(30_000) });
      if(!res.ok) throw new Error(`HTTP ${res.status}`);
      xml = await res.text();
    }catch(err){ console.error(`News query "${q}" failed: ${err.message}`); continue; }

    for(const m of xml.matchAll(/<item>([\s\S]*?)<\/item>/g)){
      const item = m[1];
      const rawTitle = decode(item.match(/<title>([\s\S]*?)<\/title>/)?.[1] || "");
      const link = decode(item.match(/<link>([\s\S]*?)<\/link>/)?.[1] || "").trim();
      const pub = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/)?.[1];
      if(!rawTitle || !link || !pub) continue;
      if(Date.now() - new Date(pub) > NEWS_MAX_AGE_DAYS * 86400e3) continue;
      const dash = rawTitle.lastIndexOf(" - ");
      const title = dash > 0 ? rawTitle.slice(0, dash) : rawTitle;
      const outlet = dash > 0 ? rawTitle.slice(dash + 3) : "news";
      if(!ACTIVITY_RE.test(title) || !LOCATION_RE.test(title)) continue;
      const key = title.toLowerCase().replace(/[^a-zæøå0-9]+/g, " ").trim();
      if(seen.has(key)) continue;
      seen.add(key);
      events.push({ date: newsEventDate(title, new Date(pub).toISOString()), type: classify(title), title, outlet, link });
    }
  }
  // Outlets repeat the same story, so collapse to one entry per day and type.
  const byDay = new Map();
  for(const e of events){
    const key = `${e.date}:${e.type}`;
    if(!byDay.has(key)) byDay.set(key, []);
    byDay.get(key).push(e);
  }
  return [...byDay.entries()].map(([key, group]) => {
    const [first, ...rest] = group;
    const others = rest.length ? ` ${rest.length} other report${rest.length > 1 ? "s" : ""} the same day (${[...new Set(rest.map(r => r.outlet))].slice(0, 3).join(", ")}).` : "";
    return {
      id: `news:${key}`, source: `News (${first.outlet})`,
      date: first.date, type: first.type,
      title: clip(first.title, 110), start: null, end: null,
      desc: `Headline reported by ${first.outlet}.${others} Auto-detected from the news feed — the date is inferred from the headline, so check dates and times.`,
      url: first.link,
    };
  });
}


/** Opt-in push via ntfy.sh (free, no account): set the NTFY_TOPIC secret and subscribe to that topic in the ntfy app. */
async function notifyNew(events){
  const topic = process.env.NTFY_TOPIC;
  if(!topic || !events.length) return;
  const todayKey = osloParts(new Date().toISOString()).date;
  const soon = new Date(Date.now() + 7 * 86400e3).toISOString();
  const relevant = events.filter(e => e.date >= todayKey && e.date <= osloParts(soon).date).slice(0, 5); // cap, so a first run can't flood
  for(const e of relevant){
    try{
      await fetch(`https://ntfy.sh/${encodeURIComponent(topic)}`, {
        method: "POST", signal: AbortSignal.timeout(15_000),
        headers: { Title: `Oslo Ops Pulse: ${e.date}${e.start ? " " + e.start : ""}`.replace(/[^ -~]/g, "?"), Tags: e.type === "unplanned" ? "warning" : "tada" },
        body: `${e.title} (${e.source})`,
      });
    }catch(err){ console.error(`Notification failed: ${err.message}`); }
  }
}

async function main(){
  const sources = { Politiloggen: fromPolice, Ruter: fromRuter, News: fromNews, "Organiser pages": fromWatchedPages };
  const found = [];
  let failures = 0;
  for(const [name, fn] of Object.entries(sources)){
    try{
      const list = await fn();
      console.log(`${name}: ${list.length} matching item(s)`);
      found.push(...list);
    }catch(err){
      failures++;
      console.error(`${name} failed: ${err.message}`);
    }
  }
  if(failures === Object.keys(sources).length){
    console.error("All sources failed — leaving data/city-events.json untouched.");
    process.exit(1);
  }

  const existing = await readJson(OUT_PATH, []);
  const now = new Date().toISOString();
  const byId = new Map(existing.map(e => [e.id, e]));
  const addedEvents = [];
  for(const e of found){
    const prev = byId.get(e.id);
    if(!prev) addedEvents.push(e);
    byId.set(e.id, { ...e, detectedAt: prev?.detectedAt || now });
  }
  const cutoff = osloParts(new Date(Date.now() - KEEP_DAYS * 86400e3).toISOString()).date;
  const merged = [...byId.values()].filter(e => e.date >= cutoff)
    .sort((a, b) => (a.date + (a.start || "")).localeCompare(b.date + (b.start || "")));

  const next = JSON.stringify(merged, null, 2) + "\n";
  if(next !== JSON.stringify(existing, null, 2) + "\n") await writeFile(OUT_PATH, next);
  await notifyNew(addedEvents);
  console.log(`${addedEvents.length} new, ${merged.length} total event(s) in data/city-events.json.`);
}

main().catch(err => { console.error(err); process.exit(1); });

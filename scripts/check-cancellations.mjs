#!/usr/bin/env node
/**
 * Checks each cruise call once, shortly before its arrival, against live AIS vessel-tracking
 * data, and writes data/flags.json with any that look off (e.g. the ship's AIS destination
 * isn't Oslo). Meant to run once a day (see .github/workflows/check-cancellations.yml).
 *
 * This NEVER confirms a cancellation on its own — it only flags a call for a human to verify.
 * If a flag turns out to be real, add the call to CANCELLATIONS in app.js by hand; that's the
 * only thing that actually marks a call cancelled in the UI.
 *
 * Requires a VESSELAPI_KEY env var. The free VesselAPI tier allows 150 API requests/month, so
 * this script:
 *   - checks each call at most once (data/checked-calls.json remembers what's already been
 *     checked, so re-running the same day or a stray extra run doesn't burn budget twice), and
 *   - tracks actual monthly usage in data/api-usage.json and stops calling the API once it's
 *     within a safety margin of the cap, logging what got skipped instead of guessing.
 *
 * The /search/vessels call uses filter.name (a bare `name` param 400s — VesselAPI rejects any
 * query param it doesn't recognize). The ETA endpoint's exact response field for "destination"
 * hasn't been confirmed against a real match yet — if flags come back oddly, check that first.
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const APP_JS_PATH = path.join(ROOT, "app.js");
const FLAGS_PATH = path.join(ROOT, "data", "flags.json");
const CHECKED_LOG_PATH = path.join(ROOT, "data", "checked-calls.json");
const USAGE_PATH = path.join(ROOT, "data", "api-usage.json");

const API_KEY = process.env.VESSELAPI_KEY;
const API_BASE = "https://api.vesselapi.com/v1";
const LOOKAHEAD_DAYS = 1;        // only check a call once it's within a day of arriving
const GRACE_DAYS_PAST = 1;       // keep a flag around briefly after its call date, then drop it
const CHECKED_LOG_KEEP_DAYS = 30; // trim the checked-calls log after this long

const MONTHLY_LIMIT = Number(process.env.VESSELAPI_MONTHLY_LIMIT || 150);
const SAFETY_MARGIN = 20; // leave headroom for manual re-runs and the odd retry
const REQUEST_BUDGET = MONTHLY_LIMIT - SAFETY_MARGIN;

function pad2(n){ return String(n).padStart(2, "0"); }
function isoKey(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function monthKey(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}`; }
function addDays(d, n){ const r = new Date(d); r.setDate(r.getDate()+n); return r; }
function stripLineComments(s){ return s.replace(/\/\/.*$/gm, ""); }
async function readJson(p, fallback){ try{ return JSON.parse(await readFile(p, "utf8")); } catch { return fallback; } }

async function loadCalls(){
  const src = await readFile(APP_JS_PATH, "utf8");
  const match = src.match(/const RAW = (\[[\s\S]*?\n\]);/);
  if(!match) throw new Error("Could not find RAW data array in app.js");
  const raw = JSON.parse(match[1]);
  return raw.map(r => ({
    etaDate:r[0], etaTime:r[1], etdDate:r[2], etdTime:r[3],
    ship:r[4], pax:r[5], line:r[6], quay:r[7], from:r[8], to:r[9]
  }));
}

async function loadManualCancellations(){
  const src = await readFile(APP_JS_PATH, "utf8");
  const block = src.match(/const CANCELLATIONS = \[([\s\S]*?)\n\];/);
  if(!block) return [];
  const clean = stripLineComments(block[1]);
  const entries = [];
  const re = /ship:"([^"]+)",\s*etaDate:"([^"]+)"/g;
  let m;
  while((m = re.exec(clean))) entries.push({ ship:m[1], etaDate:m[2] });
  return entries;
}

/** Tiny wrapper so every actual HTTP call to VesselAPI counts against the monthly budget. */
function makeMeteredFetch(usage){
  return async (url, opts) => {
    usage.used += 1;
    return fetch(url, opts);
  };
}

/**
 * Best-effort check on whether a ship's live AIS data still looks consistent with its
 * scheduled Oslo call. Returns { ok:true } if fine, or { ok:false, reason } to flag it.
 * Costs up to 2 requests against the VesselAPI budget (search + eta lookup).
 */
async function checkShip(meteredFetch, shipName, etaDate){
  const searchUrl = `${API_BASE}/search/vessels?filter.name=${encodeURIComponent(shipName)}`;
  const searchRes = await meteredFetch(searchUrl, { headers: { Authorization: `Bearer ${API_KEY}` } });
  if(!searchRes.ok) throw new Error(`VesselAPI search failed (${searchRes.status}) for ${shipName}`);
  const searchData = await searchRes.json();
  const vessel = searchData?.vessels?.[0] ?? searchData?.data?.[0] ?? null;
  if(!vessel){
    return { ok:false, reason:`AIS search returned no vessel matching "${shipName}" — verify the call is still happening.` };
  }

  const idType = vessel.mmsi ? "mmsi" : vessel.imo ? "imo" : "id";
  const id = vessel.mmsi ?? vessel.imo ?? vessel.id;
  const etaRes = await meteredFetch(`${API_BASE}/vessel/${id}/eta?filter.idType=${idType}`, {
    headers: { Authorization: `Bearer ${API_KEY}` }
  });
  if(!etaRes.ok){
    return { ok:false, reason:`Found vessel "${shipName}" but couldn't read its live destination/ETA (status ${etaRes.status}).` };
  }
  const etaData = await etaRes.json();
  const destination = (etaData?.destination || etaData?.vesselEta?.destination || "").toUpperCase();

  if(!destination){
    return { ok:false, reason:`AIS data for "${shipName}" has no reported destination ahead of its ${etaDate} Oslo call.` };
  }
  if(!destination.includes("OSLO") && !destination.includes("OSL")){
    return { ok:false, reason:`AIS reports "${shipName}" is currently headed to "${destination}", not Oslo, ahead of its scheduled ${etaDate} call.` };
  }
  return { ok:true };
}

async function main(){
  if(!API_KEY){
    console.error("VESSELAPI_KEY is not set — nothing to check. Add it as a repo secret to enable this.");
    process.exit(1);
  }

  const today = new Date();
  const todayKey = isoKey(today);
  const thisMonth = monthKey(today);
  const windowEndKey = isoKey(addDays(today, LOOKAHEAD_DAYS));
  const graceCutoffKey = isoKey(addDays(today, -GRACE_DAYS_PAST));
  const checkedLogCutoffKey = isoKey(addDays(today, -CHECKED_LOG_KEEP_DAYS));

  const [calls, manualCancellations, checkedLog, usageRaw] = await Promise.all([
    loadCalls(), loadManualCancellations(),
    readJson(CHECKED_LOG_PATH, []),
    readJson(USAGE_PATH, { month: thisMonth, used: 0 })
  ]);

  const usage = usageRaw.month === thisMonth ? usageRaw : { month: thisMonth, used: 0 };
  const meteredFetch = makeMeteredFetch(usage);

  const isManuallyCancelled = (c) => manualCancellations.some(m => m.ship===c.ship && m.etaDate===c.etaDate);
  const alreadyChecked = (c) => checkedLog.some(x => x.ship===c.ship && x.etaDate===c.etaDate);

  const candidates = calls.filter(c =>
    c.etaDate >= todayKey && c.etaDate <= windowEndKey && !isManuallyCancelled(c) && !alreadyChecked(c)
  );

  let existingFlags = await readJson(FLAGS_PATH, []);
  const keptFlags = existingFlags.filter(f => f.etaDate >= graceCutoffKey);

  const newlyChecked = [];
  const freshFlags = [];
  let skippedForBudget = 0;

  for(const c of candidates){
    if(usage.used + 2 > REQUEST_BUDGET){
      skippedForBudget++;
      continue; // leave it off the checked log so a later run (still within the window) retries it
    }
    try{
      const result = await checkShip(meteredFetch, c.ship, c.etaDate);
      newlyChecked.push({ ship:c.ship, etaDate:c.etaDate, checkedAt:new Date().toISOString() });
      if(!result.ok){
        freshFlags.push({ ship:c.ship, etaDate:c.etaDate, reason:result.reason, checkedAt:new Date().toISOString() });
      }
    }catch(err){
      console.error(`Skipping ${c.ship} (${c.etaDate}): ${err.message}`);
    }
  }

  const combinedFlags = [...keptFlags, ...freshFlags];
  const combinedCheckedLog = [...checkedLog, ...newlyChecked].filter(x => x.etaDate >= checkedLogCutoffKey);

  await Promise.all([
    writeFile(FLAGS_PATH, JSON.stringify(combinedFlags, null, 2) + "\n"),
    writeFile(CHECKED_LOG_PATH, JSON.stringify(combinedCheckedLog, null, 2) + "\n"),
    writeFile(USAGE_PATH, JSON.stringify(usage, null, 2) + "\n"),
  ]);

  console.log(
    `Checked ${newlyChecked.length} call(s) this run (${freshFlags.length} newly flagged, ` +
    `${combinedFlags.length} open flag(s) total). VesselAPI usage this month: ${usage.used}/${MONTHLY_LIMIT}.` +
    (skippedForBudget ? ` Skipped ${skippedForBudget} call(s) to stay under budget — they'll be retried next run.` : "")
  );
}

main().catch(err => { console.error(err); process.exit(1); });

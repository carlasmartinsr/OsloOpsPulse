/* ---------- data ---------- */
/* Each call: [etaDate, etaTime, etdDate, etdTime, ship, pax|null, line|null, quay, from|null, to|null] */
const RAW = [
["2025-12-31","11:00","2026-01-01","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","Hamburg"],
["2026-01-02","08:00","2026-01-02","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-01-06","08:00","2026-01-06","18:00","AIDAprima",4350,"AIDA","FIL","Kiel","Gothenburg"],
["2026-01-08",null,"2026-01-14",null,"Color Magic",null,"Color Line","REV",null,null],
["2026-01-13","14:00","2026-01-14","18:00","AIDAnova",6654,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-01-15",null,"2026-01-20",null,"MS Nordrøna",null,null,"SAK",null,null],
["2026-01-16","08:00","2026-01-16","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-01-27","13:45","2026-01-28","18:00","AIDAnova",6656,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-01-30","08:00","2026-01-30","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-02-04","13:00","2026-02-06","13:00","AIDAprima",4350,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-02-12","07:45","2026-02-12","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-02-13","08:00","2026-02-13","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-02-13","09:00","2026-02-13","20:00","Mein Schiff 3",2750,"TUI","FIL","Bremerhaven","Bremerhaven"],
["2026-02-20","08:00","2026-02-20","20:00","AIDAprima",4350,"AIDA","FIL","Kristiansand","TBA"],
["2026-02-26","08:00","2026-02-26","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-02-27","08:00","2026-02-27","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-03-06","08:00","2026-03-06","20:00","AIDAprima",4350,"AIDA","FIL","Kristiansand","TBA"],
["2026-03-12","08:00","2026-03-12","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-03-13","08:00","2026-03-13","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-03-14","08:00","2026-03-16","06:00","AIDAprima",4350,"AIDA","FIL","Kiel","Aarhus"],
["2026-03-19","11:00","2026-03-20","21:00","AIDAprima",4350,"AIDA","FIL","Kiel","Aarhus"],
["2026-03-24","16:00","2026-03-25","18:00","Ambition",1904,"Ambassador","FIL","London Tilbury","Gothenburg"],
["2026-03-25","09:00","2026-03-25","18:00","AIDAdiva",2566,"AIDA","REV","Kristiansand","Gothenburg"],
["2026-03-26","08:00","2026-03-26","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-03-27","08:00","2026-03-27","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-04-03","08:00","2026-04-03","20:00","AIDAprima",4350,"AIDA","FIL","Kristiansand","TBA"],
["2026-04-05","10:30","2026-04-06","17:00","Ambience",1100,"Ambassador","REV","Kristiansand","TBA"],
["2026-04-09","08:00","2026-04-09","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-04-10","08:00","2026-04-10","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-04-10","07:00","2026-04-10","17:00","Rotterdam",2650,"Holland America","FIL","Kristiansand","Rotterdam"],
["2026-04-13","08:00","2026-04-13","18:00","AIDAmar",2580,"AIDA","REV","Hamburg","Copenhagen"],
["2026-04-16","08:00","2026-04-16","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-04-17","08:00","2026-04-17","20:00","Viking Vela",998,"Viking","REV","Kristiansand","TBA"],
["2026-04-22","08:00","2026-04-22","18:00","AIDAmar",2580,"AIDA","REV","Kristiansand","Skagen"],
["2026-04-23","08:00","2026-04-23","18:00","Viking Vela",998,"Viking","REV","Skagen","Kristiansand"],
["2026-04-24","08:00","2026-04-24","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-04-24","09:00","2026-04-24","18:00","MSC Preziosa",4345,"MSC","FIL","Copenhagen","Hamburg"],
["2026-04-28","08:00","2026-04-28","17:00","Spirit of Adventure",999,"Saga","REV","TBA","TBA"],
["2026-04-28","08:00","2026-04-28","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-04-29","12:00","2026-04-30","18:00","Viking Neptune",930,"Viking","REV","Stavanger","TBA"],
["2026-04-29","10:00","2026-04-29","18:00","Rotterdam",2650,"Holland America","FIL","Rotterdam","Kristiansand"],
["2026-05-01","12:00","2026-05-02","18:00","Viking Vela",998,"Viking","REV","Kristiansand","TBA"],
["2026-05-01","08:00","2026-05-01","19:00","Sapphire Princess",3168,"Princess","FIL","Ijmuiden","Gothenburg"],
["2026-05-05","07:00","2026-05-05","17:00","Sapphire Princess",3168,"Princess","FIL","Skagen","Gdynia"],
["2026-05-07","08:00","2026-05-07","18:00","AIDAmar",2580,"AIDA","REV","Gothenburg","TBA"],
["2026-05-07","08:00","2026-05-07","19:00","MSC Preziosa",4345,"MSC","FIL","Kristiansand","Skagen"],
["2026-05-08","08:00","2026-05-08","23:00","Mein Schiff 3",2750,"TUI","FIL","Kristiansand","Bremerhaven"],
["2026-05-11","08:00","2026-05-11","18:00","Mein Schiff 7",3132,"TUI","FIL","Stavanger","TBA"],
["2026-05-14","08:00","2026-05-14","22:00","Britannia",4372,"P&O","FIL","Åndalsnes","Copenhagen"],
["2026-05-15","09:00","2026-05-15","20:00","Artania",1260,"Phoenix Reisen","REV","Skagen","Bremerhaven"],
["2026-05-16","08:00","2026-05-16","18:00","Hanseatic Spirit",230,"Hapag-Lloyd","FIL","TBA","Hamburg"],
["2026-05-16","11:30","2026-05-17","18:30","Balmoral",1275,"Fred. Olsen","REV","Arendal","Newcastle"],
["2026-05-18","08:00","2026-05-19","12:00","Viking Neptune",930,"Viking","REV","TBA","TBA"],
["2026-05-19","07:00","2026-05-19","16:00","Sky Princess",4450,"Princess","FIL","Kristiansand","Copenhagen"],
["2026-05-20","08:00","2026-05-21","12:00","Viking Vela",998,"Viking","FIL","TBA","Stavanger"],
["2026-05-20","08:00","2026-05-21","14:00","AIDAbella",2566,"AIDA","REV","Kristiansand","Copenhagen"],
["2026-05-23","08:00","2026-05-23","18:00","SeaDream II",100,"SeaDream","REV","TBA","TBA"],
["2026-05-23","08:00","2026-05-23","18:00","Celebrity Eclipse",2850,"Celebrity","FIL","Amsterdam","Skagen"],
["2026-05-25","09:00","2026-05-25","19:00","Sapphire Princess",3168,"Princess","FIL","Visby","Skagen"],
["2026-05-25","09:30","2026-05-26","08:00","Balmoral",1275,"Fred. Olsen","REV","TBA","TBA"],
["2026-05-26","09:00","2026-05-26","18:00","Celebrity Apex",2918,"Celebrity","FIL","Visby","Kristiansand"],
["2026-05-27","08:00","2026-05-27","20:00","Viking Neptune",930,"Viking","REV","TBA",null],
["2026-05-27","13:00","2026-05-28","18:00","AIDAnova",6654,"AIDA","FIL","Copenhagen","Kiel"],
["2026-06-02","08:00","2026-06-02","18:00","Viking Neptune",930,"Viking","REV","TBA",null],
["2026-06-02","07:00","2026-06-02","16:00","Rotterdam",2650,"Holland America","FIL","Rotterdam","Kristiansand"],
["2026-06-05","08:00","2026-06-05","18:00","Mein Schiff 7",3132,"TUI","FIL","Kristiansand","TBA"],
["2026-06-06","09:00","2026-06-06","19:00","Sapphire Princess",3168,"Princess","FIL","Gdynia","Skagen"],
["2026-06-08","08:00","2026-06-08","18:00","AIDAnova",6654,"AIDA","FIL","Kiel","Kristiansand"],
["2026-06-09","12:00","2026-06-09","21:00","Sapphire Princess",3168,"Princess","REV","Skagen","Gdynia"],
["2026-06-10","07:00","2026-06-10","17:00","Insignia",803,"Oceania","REV","Ijmuiden","Lysekil"],
["2026-06-11","07:00","2026-06-11","20:00","Le Laperouse",184,"Ponant","FIL","TBA","TBA"],
["2026-06-12","08:00","2026-06-12","23:00","Mein Schiff Relax",3998,"TUI","FIL","Kiel","Kiel"],
["2026-06-14","08:00","2026-06-14","18:00","SeaDream II",100,"SeaDream","FIL","TBA","TBA"],
["2026-06-14","08:00","2026-06-14","18:00","AIDAmar",2580,"AIDA","REV","Warnemünde","Gothenburg"],
["2026-06-15","07:00","2026-06-15","18:00","Silver Spirit",540,"Silversea","REV","Ålborg","Skagen"],
["2026-06-16","10:00","2026-06-16","21:00","Norwegian Sun",1936,"Norwegian Cruise Line","REV","Copenhagen","Warnemünde"],
["2026-06-19","07:00","2026-06-19","16:00","MSC Magnifica",3223,"MSC","FIL","Kristiansand","Copenhagen"],
["2026-06-21","12:00","2026-06-22","18:00","Viking Sky",930,"Viking","REV","Stavanger","TBA"],
["2026-06-23","08:00","2026-06-23","18:00","Celebrity Eclipse",2850,"Celebrity","FIL","Amsterdam","Skagen"],
["2026-06-24","08:00","2026-06-24","23:59","Europa",408,"Hapag-Lloyd","REV","Arendal","Travemünde"],
["2026-06-25","07:00","2026-06-25","20:00","Le Laperouse",184,"Ponant","FIL","TBA","TBA"],
["2026-06-26","08:00","2026-06-26","20:00","Viking Vela",998,"Viking","REV","Kristiansand","Skagen"],
["2026-06-30","10:00","2026-06-30","20:00","Sapphire Princess",3168,"Princess","REV","Gdynia","Skagen"],
["2026-06-30","07:00","2026-06-30","17:00","Rotterdam",2650,"Holland America","FIL","Rotterdam","Kristiansand"],
["2026-07-01","12:00","2026-07-02","18:00","Viking Saturn",930,"Viking","REV","Stavanger","Aalborg"],
["2026-07-02","08:00","2026-07-02","18:00","Viking Vela",998,"Viking","FIL","Skagen","Kristiansand"],
["2026-07-03","08:00","2026-07-03","19:00","Ambition",1904,"Ambassador","SAK","Dundee","Gothenburg"],
["2026-07-03","08:00","2026-07-03","23:00","Mein Schiff 3",2750,"TUI","REV","Kristiansand","TBA"],
["2026-07-03","07:00","2026-07-03","16:00","MSC Magnifica",3223,"MSC","FIL","Farsund","Copenhagen"],
["2026-07-06","08:00","2026-07-06","18:00","SeaDream II",100,"SeaDream","REV","TBA","TBA"],
["2026-07-06","08:00","2026-07-06","18:00","AIDAnova",6654,"AIDA","FIL","TBA","Kristiansand"],
["2026-07-08","08:00","2026-07-09","17:00","Aurora",2050,"P&O","REV","Ålesund","Southampton"],
["2026-07-08","07:00","2026-07-08","15:00","Nieuw Statendam",2650,"Holland America","FIL","Visby","Dover"],
["2026-07-10","08:00","2026-07-11","18:00","Viking Sky",930,"Viking","REV","TBA","Stavanger"],
["2026-07-10","08:00","2026-07-10","23:00","Mein Schiff Relax",3998,"TUI","FIL","Kiel","TBA"],
["2026-07-12","09:00","2026-07-12","18:00","Silver Dawn",660,"Silversea","REV","Visby","Gothenburg"],
["2026-07-12","10:00","2026-07-12","20:00","Sapphire Princess",3168,"Princess","FIL","Visby","Skagen"],
["2026-07-13","06:00","2026-07-13","18:00","Sirena",684,"Norwegian Cruise Line","FIL","Arendal","Ålborg"],
["2026-07-14","08:00","2026-07-14","18:00","Crystal Serenity",1144,"Crystal","FIL","Hamburg","Copenhagen"],
["2026-07-15","08:00","2026-07-15","23:59","Seabourn Ovation",704,"Seabourn","REV","Amsterdam","Gothenburg"],
["2026-07-17","08:00","2026-07-17","16:00","MSC Magnifica",3223,"MSC","REV","Kristiansand","Copenhagen"],
["2026-07-17","07:00","2026-07-17","18:00","Celebrity Eclipse",2850,"Celebrity","FIL","Amsterdam","Skagen"],
["2026-07-19","07:00","2026-07-19","19:00","World Navigator",200,"Mystic Cruises","FIL","TBA","Måløy"],
["2026-07-20","08:00","2026-07-21","12:00","Viking Saturn",930,"Viking","REV","Aalborg","Stavanger"],
["2026-07-20","08:00","2026-07-20","18:00","AIDAnova",6654,"AIDA","FIL","TBA","Kristiansand"],
["2026-07-21","08:00","2026-07-21","18:00","Seabourn Ovation",704,"Seabourn","FIL","Gothenburg","Rotterdam"],
["2026-07-22","11:30","2026-07-23","23:59","Seven Seas Navigator",490,"Regent Seven Seas","REV","Antwerpen","Copenhagen"],
["2026-07-24","08:00","2026-07-24","18:00","Deutschland",600,"Phoenix Reisen","REV","Lysekil","Skagen"],
["2026-07-24","09:00","2026-07-24","19:00","Sapphire Princess",3168,"Princess","FIL","Gdynia","Skagen"],
["2026-07-27","23:00","2026-07-28","18:00","SeaDream II",100,"SeaDream","REV","TBA","TBA"],
["2026-07-27","15:00","2026-07-28","16:30","Sapphire Princess",3168,"Princess","FIL","Skagen","Gdynia"],
["2026-07-28","19:00","2026-07-29","20:00","Vista",null,"Oceania","REV","Haugesund","Amsterdam"],
["2026-07-30","08:00","2026-07-30","21:00","Azamara Journey",181,"Azamara","FIL","Skagen","Arendal"],
["2026-07-30","08:00","2026-07-31","15:00","Silver Spirit",540,"Silversea","REV","Kristiansand","TBA"],
["2026-07-31","09:00","2026-07-31","16:30","MSC Magnifica",3223,"MSC","FIL","Kristiansand","Copenhagen"],
["2026-07-31","16:00","2026-08-01","17:00","Marina",1250,"Oceania","REV","Lysekil","Kristiansand"],
["2026-08-02","12:00","2026-08-03","18:00","Viking Jupiter",930,"Viking","REV","Stavanger","TBA"],
["2026-08-04","08:00","2026-08-04","18:00","Seabourn Ovation",704,"Seabourn","FIL","Gothenburg","Kristiansand"],
["2026-08-04","07:00","2026-08-04","16:00","Rotterdam",2650,"Holland America","REV","Rotterdam","Kristiansand"],
["2026-08-05","08:00","2026-08-05","20:00","Viking Neptune",930,"Viking","REV","TBA",null],
["2026-08-05","10:00","2026-08-05","21:00","Norwegian Sun",1936,"Norwegian Cruise Line","FIL","Copenhagen","Warnemünde"],
["2026-08-06","08:00","2026-08-06","18:00","AIDAnova",6654,"AIDA","FIL","Skagen","Kiel"],
["2026-08-08","12:00","2026-08-09","18:00","Silver Spirit",540,"Silversea","FIL","Aalborg","Kristiansand"],
["2026-08-09","08:00","2026-08-09","18:00","Viking Mira",998,"Viking","REV","Kristiansand","TBA"],
["2026-08-11","08:00","2026-08-11","18:00","SeaDream II",100,"SeaDream","FIL","TBA","TBA"],
["2026-08-11","08:00","2026-08-11","18:00","Viking Neptune",930,"Viking","REV","Narvik","Kristiansand"],
["2026-08-14","08:00","2026-08-14","16:00","MSC Magnifica",3223,"MSC","FIL","Kristiansand","Copenhagen"],
["2026-08-15","07:00","2026-08-15","17:00","Seven Seas Grandeur",744,"Regent Seven Seas","FIL","Rosendal","Kristiansand"],
["2026-08-15","08:00","2026-08-15","18:00","Viking Mira",998,"Viking","REV","TBA","Kristiansand"],
["2026-08-16","08:00","2026-08-16","18:00","AIDAmar",2580,"AIDA","REV","Gothenburg","TBA"],
["2026-08-16","07:00","2026-08-16","17:00","Celebrity Eclipse",2850,"Celebrity","FIL","Amsterdam","Skagen"],
["2026-08-17","09:00","2026-08-17","19:00","Sapphire Princess",3168,"Princess","REV","Visby","Skagen"],
["2026-08-17","17:45","2026-08-18","18:00","AIDAnova",6654,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-08-19","12:00","2026-08-20","18:00","Viking Neptune",930,"Viking","REV","Kristiansand","TBA"],
["2026-08-20","08:00","2026-08-20","18:00","Seven Seas Mariner",779,"Regent Seven Seas","FIL","Lysekil","Skagen"],
["2026-08-21","08:00","2026-08-22","12:00","Viking Jupiter",930,"Viking","REV","TBA","Stavanger"],
["2026-08-21","09:00","2026-08-21","23:00","Mein Schiff Relax",3998,"TUI","FIL","Kristiansand","TBA"],
["2026-08-25","07:00","2026-08-25","16:00","Sky Princess",4450,"Princess","FIL","Kristiansand","Skagen"],
["2026-08-26","08:00","2026-08-26","18:00","Scenic Eclipse II",237,"Scenic","REV","Gothenburg","Kristiansand"],
["2026-08-28","07:00","2026-08-28","16:00","MSC Magnifica",3223,"MSC","FIL","Kristiansand","Copenhagen"],
["2026-08-29","07:00","2026-08-29","17:00","Insignia",803,"Oceania","FIL","Copenhagen","Skagen"],
["2026-09-01","08:00","2026-09-01","18:00","AIDAnova",6654,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-09-02","07:00","2026-09-03","18:00","Queen Anne",2992,"Cunard","FIL","Kristiansand","Southampton"],
["2026-09-03","21:00","2026-09-04","18:00","AIDAbella",2566,"AIDA","REV","Kiel","Skagen"],
["2026-09-05","08:00","2026-09-05","23:55","Explora I",3999,"Explora Journeys (MSC)","REV","Gothenburg","Hamburg"],
["2026-09-06","08:00","2026-09-06","17:00","Seven Seas Voyager",708,"Regent Seven Seas","REV","Kristiansand","Gothenburg"],
["2026-09-06","10:00","2026-09-06","21:00","Norwegian Sun",1936,"Norwegian Cruise Line","FIL","Copenhagen","Warnemünde"],
["2026-09-07","07:00","2026-09-08","22:00","Seven Seas Grandeur",744,"Regent Seven Seas","FIL","Copenhagen","Kristiansand"],
["2026-09-07","08:00","2026-09-08","12:00","Viking Neptune",930,"Viking","REV","TBA","TBA"],
["2026-09-09","08:00","2026-09-09","18:00","Amadea",618,"Phoenix Reisen","FIL","Lysekil","Aalborg"],
["2026-09-11","08:00","2026-09-11","16:00","MSC Magnifica",3223,"MSC","FIL","Kristiansand","Copenhagen"],
["2026-09-13","08:00","2026-09-13","17:00","Seven Seas Voyager",708,"Regent Seven Seas","REV","Lysekil","Kristiansand"],
["2026-09-14","12:00","2026-09-14","21:00","Nieuw Statendam",2650,"Holland America","FIL","Rotterdam","Kristiansand"],
["2026-09-15","10:00","2026-09-15","18:00","AIDAbella",2566,"AIDA","REV","Skagen","Kiel"],
["2026-09-15","08:00","2026-09-16","14:00","Rotterdam",2650,"Holland America","FIL","Rotterdam","Copenhagen"],
["2026-09-17","08:00","2026-09-17","18:00","AIDAmar",2580,"AIDA","REV","Gothenburg","TBA"],
["2026-09-18","08:00","2026-09-18","23:00","Mein Schiff Relax",3998,"TUI","FIL","Kiel","Kiel"],
["2026-09-22","08:00","2026-09-22","18:00","MSC Preziosa",4345,"MSC","FIL","Stavanger","Hamburg"],
["2026-09-23","08:00","2026-09-23","18:00","Artania",1260,"Phoenix Reisen","REV","Hamburg","Sandnes"],
["2026-09-25","08:00","2026-09-25","23:00","Mein Schiff 3",2750,"TUI","FIL","Bremerhaven","Kristiansand"],
["2026-09-25","08:00","2026-09-25","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-09-28","10:00","2026-09-28","20:00","AIDAnova",6654,"AIDA","FIL","Skagen","Kiel"],
["2026-09-29","10:00","2026-09-29","18:00","AIDAbella",2566,"AIDA","REV","Skagen","Kiel"],
["2026-09-29","08:00","2026-09-30","16:00","Nieuw Statendam",2650,"Holland America","FIL","Kristiansand","Dover"],
["2026-10-01","08:00","2026-10-01","20:00","Mein Schiff 7",3132,"TUI","FIL","Kiel","Kristiansand"],
["2026-10-05","08:00","2026-10-05","18:30","Sky Princess",4450,"Princess","FIL","Skagen","Kristiansand"],
["2026-10-09","08:00","2026-10-09","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-10-12","08:00","2026-10-12","18:00","Amera",749,"Phoenix Reisen","REV","Bremerhaven","Gothenburg"],
["2026-10-12","08:00","2026-10-12","18:00","AIDAnova",6654,"AIDA","FIL","TBA","Kristiansand"],
["2026-10-13","14:00","2026-10-14","23:59","Liberty of the Seas",4635,"Royal Caribbean","FIL","Southampton","Stavanger"],
["2026-10-16","08:00","2026-10-16","18:00","MSC Preziosa",4345,"MSC","FIL","Kristiansand","Hamburg"],
["2026-10-19","08:00","2026-10-19","23:00","Mein Schiff Relax",3998,"TUI","FIL","Kristiansand","Hamburg"],
["2026-10-23","08:00","2026-10-23","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-10-23","09:00","2026-10-23","20:00","Mein Schiff Relax",3984,"TUI","FIL","Hamburg","Hamburg"],
["2026-10-26","08:00","2026-10-26","18:00","AIDAnova",6654,"AIDA","FIL","TBA","Kristiansand"],
["2026-10-29","08:00","2026-10-29","18:00","Mein Schiff Flow",4070,"TUI","FIL","Copenhagen","Kristiansand"],
["2026-10-31","08:00","2026-10-31","18:30","Sky Princess",4450,"Princess","FIL","Skagen","Rotterdam"],
["2026-11-05","10:00","2026-11-05","20:00","AIDAluna",2050,"AIDA","REV","Copenhagen","TBA"],
["2026-11-06","08:00","2026-11-06","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-11-12","08:00","2026-11-12","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-11-20","08:00","2026-11-20","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-11-26","08:00","2026-11-26","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","TBA"],
["2026-11-27","08:00","2026-11-27","19:00","Mein Schiff Flow",3998,"TUI","FIL","Kristiansand","Kiel"],
["2026-11-30","08:00","2026-11-30","20:00","Mein Schiff 3",2750,"TUI","REV","Bremerhaven","Kiel"],
["2026-12-02","10:00","2026-12-02","22:00","Amadea",618,"Phoenix Reisen","REV","Kristiansand","Skagen"],
["2026-12-04","08:00","2026-12-04","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-12-07","08:30","2026-12-07","21:00","Mein Schiff 3",2750,"TUI","REV","Kristiansand","Kiel"],
["2026-12-08","14:00","2026-12-09","18:00","AIDAnova",6654,"AIDA","FIL","Kristiansand","Copenhagen"],
["2026-12-18","08:00","2026-12-18","22:00","Trollfjord",500,"Hurtigruten","REV","Kristiansand","Kristiansand"],
["2026-12-22","14:00","2026-12-23","18:00","AIDAnova",6654,"AIDA","FIL","Copenhagen","Kristiansand"],
["2026-12-23","08:00","2026-12-24","17:00","Aurora",2050,"P&O","REV","TBA","TBA"],
["2026-12-26","08:00","2026-12-27","18:00","Spirit of Adventure",999,"Saga","REV","TBA","TBA"]
];

const CALLS = RAW.map(r => ({
  etaDate:r[0], etaTime:r[1], etdDate:r[2], etdTime:r[3],
  ship:r[4], pax:r[5], line:r[6], quay:r[7], from:r[8], to:r[9]
}));

/* ---------- cancellations ---------- */
/* Mark a scheduled call as cancelled without removing it from the booking list.
   Matched by ship + etaDate. Add an entry here as soon as a call is cancelled or postponed. */
const CANCELLATIONS = [
  // { ship:"AIDAnova", etaDate:"2026-01-13", reason:"Cancelled by operator — technical issue, no replacement call." },
];
function cancellationFor(c){
  return CANCELLATIONS.find(x => x.ship===c.ship && x.etaDate===c.etaDate) || null;
}
CALLS.forEach(c=>{
  const can = cancellationFor(c);
  c.cancelled = !!can;
  c.cancelReason = can ? can.reason : null;
});

/* ---------- automatic review flags ---------- */
/* data/flags.json is written by scripts/check-cancellations.mjs, run on a schedule (see
   .github/workflows/check-cancellations.yml). It cross-checks upcoming calls against live AIS
   vessel-tracking data and flags ones that look off — it never confirms a cancellation on its own.
   A flagged call still needs a human to check and, if real, add it to CANCELLATIONS above. */
let REVIEW_FLAGS = [];
function reviewFlagFor(c){
  return REVIEW_FLAGS.find(x => x.ship===c.ship && x.etaDate===c.etaDate) || null;
}
function applyReviewFlags(){
  CALLS.forEach(c=>{
    const flag = c.cancelled ? null : reviewFlagFor(c);
    c.reviewFlag = !!flag;
    c.reviewReason = flag ? flag.reason : null;
  });
}
applyReviewFlags();
fetch("data/flags.json", { cache:"no-store" })
  .then(r => r.ok ? r.json() : [])
  .then(flags => { REVIEW_FLAGS = Array.isArray(flags) ? flags : []; applyReviewFlags(); renderAll(); })
  .catch(()=>{ /* no flags file yet, or opened as a local file — review flags just stay empty */ });

/* ---------- holidays & events ---------- */
/* type: "holiday" (official Norwegian public holiday) | "event" (planned city event affecting port/city operations)
   | "unplanned" (unannounced disruption discovered after publication — e.g. a state funeral, a snap national day of
   mourning, a strike or a security closure — anything that wasn't on the calendar when the season was planned) */
const OCCASIONS = [
  // { date:"2026-06-10", type:"unplanned", title:"State Funeral", start:"12:00", end:"15:00",
  //   desc:"Unannounced national day of mourning declared with short notice; flags at half-mast, road closures near the Palace and cathedral expected to extend down to the harbour.", url:null },
  { date:"2025-12-31", type:"event", title:"New Year's Eve", start:null, end:"00:00", desc:"Fireworks over the harbour and Aker Brygge from midnight; large crowds along the waterfront near the cruise terminals.", url:null },
  { date:"2026-01-01", type:"holiday", title:"New Year's Day", start:null, end:null, desc:"Nyttårsdag — national public holiday. Most shops and services closed.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-04-02", type:"holiday", title:"Maundy Thursday", start:null, end:null, desc:"Skjærtorsdag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-04-03", type:"holiday", title:"Good Friday", start:null, end:null, desc:"Langfredag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-04-05", type:"holiday", title:"Easter Sunday", start:null, end:null, desc:"Første påskedag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-04-06", type:"holiday", title:"Easter Monday", start:null, end:null, desc:"Andre påskedag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-05-01", type:"holiday", title:"Labour Day", start:null, end:null, desc:"Arbeidernes dag — national public holiday; union marches in central Oslo.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-05-14", type:"holiday", title:"Ascension Day", start:null, end:null, desc:"Kristi himmelfartsdag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-05-17", type:"holiday", title:"Constitution Day (17. mai)", start:"10:00", end:"13:00", desc:"Norway's National Day. The Barnetoget children's parade passes the Royal Palace and central streets around the harbour are closed to traffic through early afternoon.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-05-24", type:"holiday", title:"Whit Sunday", start:null, end:null, desc:"Første pinsedag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-05-25", type:"holiday", title:"Whit Monday", start:null, end:null, desc:"Andre pinsedag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-09-12", type:"event", title:"DNB Oslo Maraton", start:"09:00", end:"18:00", desc:"City-wide road race starting and finishing at Rådhusplassen, right by the harbour. Marathon starts 09:00, half marathon 13:00, 10K 16:20 — rolling street closures through the city centre until the evening.", url:"https://oslomaraton.no/en/" },
  { date:"2026-09-19", type:"unplanned", title:"Demonstration — Karl Johans gate", start:null, end:null,
    desc:"Demonstration against executions closed Karl Johans gate at the university for about 20 minutes. Added by hand from a field report; exact times not recorded.", url:null },
  { date:"2026-10-08", type:"event", title:"Oktoberfest Oslo", start:"16:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Thu). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-09", type:"event", title:"Oktoberfest Oslo", start:"15:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Fri). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-10", type:"event", title:"Oktoberfest Oslo", start:"12:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Sat). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-15", type:"event", title:"Oktoberfest Oslo", start:"16:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Thu). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-16", type:"event", title:"Oktoberfest Oslo", start:"15:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Fri). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-17", type:"event", title:"Oktoberfest Oslo", start:"12:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Sat). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-22", type:"event", title:"Oktoberfest Oslo", start:"16:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Thu). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-23", type:"event", title:"Oktoberfest Oslo", start:"15:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Fri). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-10-24", type:"event", title:"Oktoberfest Oslo", start:"12:00", end:null, desc:"Large Oktoberfest tent at Youngstorget, a block north of Karl Johans gate (Sat). Runs three weekends: 8–10, 15–17 and 22–24 October; doors open 16:00 Thu, 15:00 Fri, 12:00 Sat. Crowds around Youngstorget in the evenings; no street closure announced by the organiser.", url:"https://www.oktoberfestoslo.com/?lang=en" },
  { date:"2026-11-07", type:"event", title:"Jul i Vinterland opens — Spikersuppa", start:null, end:null,
    desc:"Christmas market with ice rink and Ferris wheel in Spikersuppa, on Karl Johans gate in front of Stortinget and Nationaltheatret. Runs 7 Nov 2026 – 3 Jan 2027, closed 24 December. Busy pedestrian area between the station and the harbour throughout the season.", url:"https://www.julivinterland.no/" },
  { date:"2026-11-29", type:"event", title:"Christmas tree lighting — Universitetsplassen (date unconfirmed)", start:null, end:null,
    desc:"By tradition the Salvation Army lights the city's Christmas tree at Universitetsplassen on the first Sunday of Advent, which falls on 29 Nov in 2026. Date is inferred from that tradition; time and programme not yet published. Expect crowds at the top of Karl Johans gate.", url:null },
  { date:"2026-12-10", type:"event", title:"Nobel Peace Prize Day", start:"13:00", end:null,
    desc:"Award ceremony at Oslo City Hall (Rådhuset, on Rådhusplassen by the harbour) at 13:00. In the evening a torchlight procession (fakkeltog) walks up Karl Johans gate to the Grand Hotel, where the banquet is held — expect police, crowds and closures on Karl Johans gate and around Rådhusplassen. Procession time not yet published.", url:"https://www.nobelpeaceprize.org/nobels-fredspris/om-nobels-fredspris/slik-feires-fredsprisen/" },
  { date:"2026-12-25", type:"holiday", title:"Christmas Day", start:null, end:null, desc:"Første juledag — national public holiday.", url:"https://publicholidays.no/2026-dates/" },
  { date:"2026-12-26", type:"holiday", title:"St. Stephen's Day", start:null, end:null, desc:"Andre juledag — national public holiday.", url:"https://publicholidays.no/2026-dates/" }
];
function occasionsOn(dateKey){ return OCCASIONS.filter(o=>o.date===dateKey); }

/* ---------- auto-detected city events ---------- */
/* data/city-events.json is written by scripts/scan-city-events.mjs on a schedule (see
   .github/workflows/scan-city-events.yml). It pulls from the police log, Ruter disruptions and news
   headlines, so it can catch demonstrations and street closures nobody listed above. Everything in it
   is unverified — it is shown with an "Auto-detected" badge. To keep one, copy it into OCCASIONS by hand. */
function escapeHTML(s){ return String(s ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch])); }
fetch("data/city-events.json", { cache:"no-store" })
  .then(r => r.ok ? r.json() : [])
  .then(events => {
    if(!Array.isArray(events)) return;
    const seen = new Set(OCCASIONS.map(o => o.date + "|" + o.title.toLowerCase()));
    events.forEach(e=>{
      if(!e || !/^\d{4}-\d{2}-\d{2}$/.test(e.date) || !e.title || seen.has(e.date + "|" + String(e.title).toLowerCase())) return;
      OCCASIONS.push({
        date:e.date, type:e.type==="event" ? "event" : "unplanned",
        title:escapeHTML(e.title), start:e.start || null, end:e.end || null,
        desc:escapeHTML(e.desc), url:/^https:\/\//.test(e.url || "") ? e.url : null,
        auto:true, source:escapeHTML(e.source)
      });
    });
    renderAll();
  })
  .catch(()=>{ /* no events file yet, or opened as a local file — only hand-entered occasions show */ });

/* ---------- icons ---------- */
const ICON_SHIP = `<svg class="icon-ship" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 16l2-7h14l2 7"/><path d="M2 20c2 1.6 4 1.6 6 0s4-1.6 6 0 4 1.6 6 0"/><path d="M12 3v6"/><path d="M9 6h6"/></svg>`;
const ICON_FLAG = `<svg class="icon-flag" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 21V4"/><path d="M5 4h14l-3 4 3 4H5"/></svg>`;
const ICON_EVENT = `<svg class="icon-event" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2l1.8 5.6L19.5 9l-4.6 3.4L16.5 18 12 14.6 7.5 18l1.6-5.6L4.5 9l5.7-1.4z"/></svg>`;
const ICON_ALERT = `<svg class="icon-alert" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l10 18H2z"/><path d="M12 10v4"/><path d="M12 17.5v.01"/></svg>`;
const ICON_CANCEL = `<svg class="icon-cancel" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M8 8l8 8"/></svg>`;
const ICON_REVIEW = `<svg class="icon-review" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 0 1 5 0c0 1.6-2.2 1.9-2.4 3.5"/><path d="M12 17v.01"/></svg>`;

const QUAY_NAMES = { FIL:"Filipstad", REV:"Revierkaia", SAK:"Søndre Akershuskai" };

const LINE_COLOR_VAR = {
  "AIDA":"--c-aida", "MSC":"--c-msc", "TUI":"--c-tui", "Holland America":"--c-hal",
  "Princess":"--c-princess", "Viking":"--c-viking", "Hurtigruten":"--c-hurtigruten"
};
function lineColor(line){ return `var(${LINE_COLOR_VAR[line] || "--c-other"})`; }

const COUNTRY = {
  "kristiansand":"NO","stavanger":"NO","hamburg":"DE","kiel":"DE","gothenburg":"SE","copenhagen":"DK",
  "bremerhaven":"DE","london tilbury":"UK","rotterdam":"NL","skagen":"DK","ijmuiden":"NL","gdynia":"PL",
  "åndalsnes":"NO","arendal":"NO","newcastle":"UK","aalborg":"DK","ålborg":"DK","amsterdam":"NL","visby":"SE",
  "warnemünde":"DE","ålesund":"NO","southampton":"UK","sandnes":"NO","dover":"UK","narvik":"NO",
  "rosendal":"NO","antwerpen":"BE","lysekil":"SE","travemünde":"DE","måløy":"NO","farsund":"NO",
  "dundee":"UK","haugesund":"NO"
};
function countryOf(city){
  if(!city || city==="TBA") return null;
  return COUNTRY[city.toLowerCase()] || null;
}
function ccodeClass(code){
  if(code==="NO") return "no"; if(code==="DK") return "dk"; if(code==="DE") return "de"; return "";
}

/* ---------- helpers ---------- */
function toDateObj(s){ const [y,m,d]=s.split("-").map(Number); return new Date(y, m-1, d); }
function fmtMonthYear(d){ return d.toLocaleDateString("en-GB",{month:"long", year:"numeric"}); }
function fmtDayLabel(d){ return d.toLocaleDateString("en-GB",{weekday:"long", day:"numeric", month:"long", year:"numeric"}); }
function pad2(n){ return String(n).padStart(2,"0"); }
function isoKey(d){ return `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`; }
function paxFmt(p){ return p==null ? "—" : p.toLocaleString("en-US"); }

const today = new Date();
const todayKey = isoKey(today);

const minMonth = new Date(2025,11,1);
const maxMonth = new Date(2026,11,1);
let currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
if(currentMonth < minMonth) currentMonth = new Date(minMonth);
if(currentMonth > maxMonth) currentMonth = new Date(maxMonth);
let selectedDayKey = null;

let activeSearch = "";
let activeLine = "";

let compactMode = window.matchMedia("(max-width: 560px)").matches;
window.matchMedia("(max-width: 560px)").addEventListener("change", (e)=>{
  compactMode = e.matches;
  renderCalGrid();
});

function callMatchesFilter(c){
  if(activeLine && c.line !== activeLine) return false;
  if(activeSearch){
    const s = activeSearch.toLowerCase();
    if(!c.ship.toLowerCase().includes(s) && !(c.line||"").toLowerCase().includes(s)) return false;
  }
  return true;
}

/* ---------- route chip render ---------- */
function routeHTML(c){
  const fromC = countryOf(c.from), toC = countryOf(c.to);
  const fromChip = fromC ? `<span class="ccode ${ccodeClass(fromC)}">${fromC}</span>` : "";
  const toChip = toC ? `<span class="ccode ${ccodeClass(toC)}">${toC}</span>` : "";
  const fromTxt = c.from || "TBA";
  const toTxt = c.to || "TBA";
  return `<span>${fromTxt}</span>${fromChip}<span style="color:var(--ink-faint)">→</span><span>${toTxt}</span>${toChip}`;
}

/* ---------- stats ---------- */
function renderStats(){
  const upcoming = CALLS.filter(c => `${c.etaDate}T${c.etaTime||"00:00"}` >= `${todayKey}T00:00`)
                         .sort((a,b)=> (a.etaDate+ (a.etaTime||"")).localeCompare(b.etaDate+(b.etaTime||"")));
  const next = upcoming[0];
  const thisMonthKey = `${currentMonth.getFullYear()}-${pad2(currentMonth.getMonth()+1)}`;
  const inMonth = CALLS.filter(c => c.etaDate.startsWith(thisMonthKey));
  const monthPax = inMonth.reduce((s,c)=> s + (c.pax||0), 0);

  const counts = {};
  CALLS.forEach(c=>{ if(c.etaDate>="2026-01-01" && c.etaDate<="2026-12-31"){ const mk=c.etaDate.slice(0,7); counts[mk]=(counts[mk]||0)+1; }});
  let busiest = null;
  Object.entries(counts).forEach(([k,v])=>{ if(!busiest || v>busiest[1]) busiest=[k,v]; });
  const busiestLabel = busiest ? new Date(busiest[0]+"-01").toLocaleDateString("en-GB",{month:"long"}) : "—";

  const monthOccasions = OCCASIONS.filter(o => o.date.startsWith(thisMonthKey));
  const monthHolidays = monthOccasions.filter(o => o.type==="holiday");
  const monthEvents = monthOccasions.filter(o => o.type==="event");
  const monthUnplanned = monthOccasions.filter(o => o.type==="unplanned");
  const monthCancelled = inMonth.filter(c => c.cancelled);
  const activeReviews = CALLS.filter(c => c.reviewFlag && `${c.etaDate}T${c.etaTime||"00:00"}` >= `${todayKey}T00:00`);

  const stats = [
    {
      label:"Next arrival",
      value: next ? next.ship : "—",
      sub: next ? `${toDateObj(next.etaDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"})} · ${next.etaTime||"—"} · ${paxFmt(next.pax)} pax` : "No more calls in this dataset"
    },
    {
      label:`Cruise ships in ${fmtMonthYear(currentMonth)}`,
      value: String(inMonth.length),
      sub:`${monthPax.toLocaleString("en-US")} passengers total`
    },
    {
      label:`Events in ${fmtMonthYear(currentMonth)}`,
      value: `<span style="color:var(--c-event)">${monthEvents.length}</span>`,
      sub: monthEvents.length ? monthEvents.map(o=>o.title).join(", ") : "None scheduled"
    },
    {
      label:`Holidays in ${fmtMonthYear(currentMonth)}`,
      value: `<span style="color:var(--c-holiday)">${monthHolidays.length}</span>`,
      sub: monthHolidays.length ? monthHolidays.map(o=>o.title).join(", ") : "None"
    },
    { label:"Total 2026 calls", value:"190", sub:"Dec 2025 – Dec 2026, official Oslo Havn list" },
    { label:"Busiest month", value:busiestLabel, sub:busiest ? `${busiest[1]} port calls` : "" },
    {
      label:`Disruptions in ${fmtMonthYear(currentMonth)}`,
      value: `<span style="color:var(--c-unplanned)">${monthUnplanned.length + monthCancelled.length}</span>`,
      sub: [...monthUnplanned.map(o=>o.title), ...(monthCancelled.length?[`${monthCancelled.length} cancelled call${monthCancelled.length>1?"s":""}`]:[])].join(", ") || "None"
    },
    {
      label:"Needs review",
      value: `<span class="review-count">${activeReviews.length}</span>`,
      sub: activeReviews.length ? "Auto-flagged from AIS tracking — unconfirmed" : "No open flags from the AIS check"
    },
  ];

  document.getElementById("stats").innerHTML = stats.map(s => `
    <div class="stat">
      <div class="label">${s.label}</div>
      <div class="value">${s.value}<span class="sub">${s.sub}</span></div>
    </div>`).join("");
}

/* ---------- legend ---------- */
function renderLegend(){
  const lines = ["AIDA","MSC","TUI","Holland America","Princess","Viking","Hurtigruten"];
  document.getElementById("legend").innerHTML = lines.map(l=>`
    <span class="legend-item"><span class="dot" style="background:${lineColor(l)}"></span>${l==="Holland America"?"HAL":l}</span>
  `).join("")
  + `<span class="legend-item"><span class="dot" style="background:var(--c-other)"></span>Other line</span>`
  + `<span class="legend-item">${ICON_FLAG}&nbsp;Holiday</span>`
  + `<span class="legend-item">${ICON_EVENT}&nbsp;Event</span>`
  + `<span class="legend-item">${ICON_ALERT}&nbsp;Unplanned</span>`
  + `<span class="legend-item">${ICON_CANCEL}&nbsp;Cancelled</span>`
  + `<span class="legend-item">${ICON_REVIEW}&nbsp;Needs review</span>`;

  const sel = document.getElementById("lineFilter");
  const allLines = Array.from(new Set(CALLS.map(c=>c.line).filter(Boolean))).sort();
  sel.innerHTML = `<option value="">All cruise lines</option>` + allLines.map(l=>`<option value="${l}">${l}</option>`).join("");
}

/* ---------- calendar ---------- */
function renderCalendarNav(){
  document.getElementById("monthLabel").textContent = fmtMonthYear(currentMonth);
  document.getElementById("btnPrev").disabled = currentMonth <= minMonth;
  document.getElementById("btnNext").disabled = currentMonth >= maxMonth;
}

function renderCalDow(){
  const dows = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  document.getElementById("calDow").innerHTML = dows.map(d=>`<div class="cal-dow">${d}</div>`).join("");
}

function renderCalGrid(){
  const y = currentMonth.getFullYear(), m = currentMonth.getMonth();
  const firstDay = new Date(y,m,1);
  const startOffset = (firstDay.getDay()+6)%7; // Monday=0
  const daysInMonth = new Date(y,m+1,0).getDate();
  const daysInPrevMonth = new Date(y,m,0).getDate();

  const callsByDay = {};
  CALLS.forEach(c=>{ if(!callMatchesFilter(c)) return; (callsByDay[c.etaDate] = callsByDay[c.etaDate]||[]).push(c); });

  let cells = "";
  for(let i=0;i<startOffset;i++){
    const dnum = daysInPrevMonth - startOffset + i + 1;
    cells += `<div class="cal-day pad"><div class="num">${dnum}</div></div>`;
  }
  for(let d=1; d<=daysInMonth; d++){
    const key = `${y}-${pad2(m+1)}-${pad2(d)}`;
    const dayCalls = (callsByDay[key]||[]).slice().sort((a,b)=>(a.etaTime||"").localeCompare(b.etaTime||""));
    const dayOccasions = occasionsOn(key);
    const holiday = dayOccasions.find(o=>o.type==="holiday");
    const event = dayOccasions.find(o=>o.type==="event");
    const unplanned = dayOccasions.find(o=>o.type==="unplanned");
    const anyCancelled = dayCalls.some(c=>c.cancelled);
    const anyReview = dayCalls.some(c=>c.reviewFlag);
    const isToday = key===todayKey;
    const isPast = key < todayKey;
    const isSelected = key===selectedDayKey;

    const iconsHTML = (dayCalls.length||holiday||event||unplanned) ? `<div class="day-icons">
        ${dayCalls.length?ICON_SHIP:""}${holiday?ICON_FLAG:""}${event?ICON_EVENT:""}${unplanned?ICON_ALERT:""}${anyCancelled?ICON_CANCEL:""}${anyReview?ICON_REVIEW:""}
      </div>` : "";

    let bodyHTML;
    if(compactMode){
      const shownDots = dayCalls.slice(0,6);
      const extraDots = dayCalls.length - shownDots.length;
      bodyHTML = dayCalls.length ? `<div class="dot-row">
          ${shownDots.map(c=>`<span class="pdot ${c.cancelled?"cancelled":c.reviewFlag?"review":""}" style="background:${lineColor(c.line)}"></span>`).join("")}
          ${extraDots>0?`<span class="pmore">+${extraDots}</span>`:""}
        </div>` : "";
    }else{
      const shown = dayCalls.slice(0,3);
      const extra = dayCalls.length - shown.length;
      bodyHTML = `${shown.map(c=>`<div class="ship-chip ${c.cancelled?"cancelled":c.reviewFlag?"review":""}" title="${c.ship} — ${c.line||""}${c.cancelled?" — CANCELLED":c.reviewFlag?" — needs review":""}"><span class="dot" style="background:${lineColor(c.line)}"></span>${c.ship}</div>`).join("")}
        ${extra>0?`<div class="more">+${extra} more</div>`:""}
        ${holiday?`<div class="day-label holiday">${holiday.title}</div>`:""}
        ${event?`<div class="day-label event">${event.title}</div>`:""}
        ${unplanned?`<div class="day-label unplanned">${unplanned.title}</div>`:""}`;
    }

    cells += `<div class="cal-day clickable ${isToday?"today":""} ${isPast?"past":""} ${isSelected?"selected":""} ${holiday?"is-holiday":""} ${unplanned?"is-unplanned":""}" data-day="${key}">
      <div class="cal-day-top"><div class="num">${d}</div>${iconsHTML}</div>
      ${bodyHTML}
    </div>`;
  }
  const totalCells = startOffset + daysInMonth;
  const trailing = (7 - (totalCells % 7)) % 7;
  for(let i=1;i<=trailing;i++){
    cells += `<div class="cal-day pad"><div class="num">${i}</div></div>`;
  }
  document.getElementById("calGrid").innerHTML = cells;

  document.querySelectorAll(".cal-day.clickable").forEach(el=>{
    el.addEventListener("click", ()=>{
      selectedDayKey = el.dataset.day === selectedDayKey ? null : el.dataset.day;
      renderCalGrid();
      renderDetail();
      if(selectedDayKey && compactMode){
        document.getElementById("detail").scrollIntoView({behavior:"smooth", block:"start"});
      }
    });
  });
}

function occasionIcon(type){
  if(type==="holiday") return ICON_FLAG;
  if(type==="unplanned") return ICON_ALERT;
  return ICON_EVENT;
}
function occasionCardHTML(o){
  const timeStr = o.start ? `${o.start}${o.end?" – "+o.end:""}` : (o.end ? `Until ${o.end}` : "All day");
  return `<div class="occasion-row ${o.type}">
    <div class="occasion-icon">${occasionIcon(o.type)}</div>
    <div class="occasion-body">
      <div class="occasion-title">${o.title} <span class="occasion-kind">${o.type}</span>${o.auto?` <span class="occasion-auto" title="Found automatically in ${o.source}; not verified">Auto-detected · ${o.source}</span>`:""}</div>
      <div class="occasion-time mono">${timeStr}</div>
      <div class="occasion-desc">${o.desc}</div>
      ${o.url?`<a class="occasion-link" href="${o.url}" target="_blank" rel="noopener">More info →</a>`:""}
    </div>
  </div>`;
}

function renderDetail(){
  const box = document.getElementById("detail");
  let dayCalls, heading, dayOccasions = [];
  if(selectedDayKey){
    dayCalls = CALLS.filter(c=>c.etaDate===selectedDayKey && callMatchesFilter(c));
    dayOccasions = occasionsOn(selectedDayKey);
    heading = fmtDayLabel(toDateObj(selectedDayKey));
  } else {
    dayCalls = CALLS.filter(c => `${c.etaDate}T${c.etaTime||"00:00"}` >= `${todayKey}T00:00` && callMatchesFilter(c))
                     .sort((a,b)=> (a.etaDate+(a.etaTime||"")).localeCompare(b.etaDate+(b.etaTime||"")))
                     .slice(0,6);
    heading = "Next scheduled arrivals";
  }

  const occasionsHTML = dayOccasions.map(occasionCardHTML).join("");

  if(dayCalls.length===0){
    box.innerHTML = `<h3>${heading}</h3>${occasionsHTML}<div class="empty-note">No cruise ships scheduled${selectedDayKey?" that day":""}${activeLine||activeSearch?" matching this filter":""}.</div>`;
    return;
  }

  box.innerHTML = `<h3>${heading} <span class="count">· ${dayCalls.length} call${dayCalls.length>1?"s":""}</span></h3>` +
    occasionsHTML +
    dayCalls.map(c=>{
      const multiDay = c.etdDate !== c.etaDate;
      return `<div class="call-row">
        <div class="call-ship">
          <span class="dot" style="background:${lineColor(c.line)}"></span>
          <div>
            <div class="call-ship-name ${c.cancelled?"cancelled":""}">${ICON_SHIP} ${c.ship}${c.cancelled?` <span class="cancel-badge">Cancelled</span>`:c.reviewFlag?` <span class="review-badge">Needs review</span>`:""}</div>
            <div class="call-line">${c.line||"Operator not listed"} · ${QUAY_NAMES[c.quay]||c.quay}</div>
            ${c.cancelled && c.cancelReason?`<div class="cancel-reason">${c.cancelReason}</div>`:""}
            ${!c.cancelled && c.reviewFlag && c.reviewReason?`<div class="review-reason">${c.reviewReason}</div>`:""}
          </div>
        </div>
        <div class="call-route">${routeHTML(c)}</div>
        <div class="call-times mono">
          <span class="arr">Arr ${toDateObj(c.etaDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"})} ${c.etaTime||"—"}</span>
          <span class="dep">Dep ${multiDay? toDateObj(c.etdDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"})+" ":""}${c.etdTime||"—"}</span>
          <span class="pax">${paxFmt(c.pax)} passengers</span>
        </div>
      </div>`;
    }).join("");
}

/* ---------- agenda ---------- */
function renderAgenda(){
  const list = CALLS.filter(callMatchesFilter)
    .slice()
    .sort((a,b)=> (a.etaDate+(a.etaTime||"")).localeCompare(b.etaDate+(b.etaTime||"")));

  if(list.length===0){
    document.getElementById("agendaList").innerHTML = `<div class="no-results">No calls match your search.</div>`;
    return;
  }

  let html = "";
  let lastMonth = "";
  const shownOccasions = new Set();
  list.forEach(c=>{
    const d = toDateObj(c.etaDate);
    const monthKey = fmtMonthYear(d);
    if(monthKey !== lastMonth){
      html += `<div class="month-head">${monthKey}</div>`;
      lastMonth = monthKey;
      OCCASIONS.filter(o=>fmtMonthYear(toDateObj(o.date))===monthKey).forEach(o=>{
        if(shownOccasions.has(o.date+o.title)) return;
        shownOccasions.add(o.date+o.title);
        const od = toDateObj(o.date);
        html += `<div class="agenda-occasion ${o.type}">${occasionIcon(o.type)} <span><b>${od.getDate()} ${od.toLocaleDateString("en-GB",{month:"short"})}</b> — ${o.title}${o.start?` (${o.start}${o.end?"–"+o.end:""})`:""}</span></div>`;
      });
    }
    const multiDay = c.etdDate !== c.etaDate;
    html += `<div class="agenda-row ${c.etaDate===todayKey?"today-row":""}">
      <div class="ad-date">
        <div class="dow">${d.toLocaleDateString("en-GB",{weekday:"short"})}</div>
        <div class="dnum">${d.getDate()}</div>
      </div>
      <div class="ad-ship">
        <span class="dot" style="background:${lineColor(c.line)}"></span>
        <span class="ad-ship-name ${c.cancelled?"cancelled":""}">${c.ship}</span>
        ${c.cancelled?`<span class="cancel-badge">Cancelled</span>`:c.reviewFlag?`<span class="review-badge">Needs review</span>`:""}
        <span class="ad-line">${c.line||"Operator not listed"} · ${QUAY_NAMES[c.quay]||c.quay}</span>
        <div class="ad-route">${routeHTML(c)}</div>
        ${c.cancelled && c.cancelReason?`<div class="cancel-reason">${c.cancelReason}</div>`:""}
        ${!c.cancelled && c.reviewFlag && c.reviewReason?`<div class="review-reason">${c.reviewReason}</div>`:""}
      </div>
      <div class="ad-times mono">
        <div>Arr ${c.etaTime||"—"}</div>
        <div>Dep ${multiDay? d.toLocaleDateString("en-GB",{day:"numeric",month:"short"}).split(" ")[0]+" "+toDateObj(c.etdDate).toLocaleDateString("en-GB",{day:"numeric",month:"short"})+" ":""}${c.etdTime||"—"}</div>
        <div class="pax">${paxFmt(c.pax)} pax</div>
      </div>
    </div>`;
  });
  document.getElementById("agendaList").innerHTML = html;
}

/* ---------- render all ---------- */
function renderAll(){
  renderStats();
  renderCalendarNav();
  renderCalGrid();
  renderDetail();
  renderAgenda();
}

/* ---------- events ---------- */
document.getElementById("btnPrev").addEventListener("click", ()=>{
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()-1, 1);
  if(currentMonth < minMonth) currentMonth = new Date(minMonth);
  selectedDayKey = null;
  renderAll();
});
document.getElementById("btnNext").addEventListener("click", ()=>{
  currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth()+1, 1);
  if(currentMonth > maxMonth) currentMonth = new Date(maxMonth);
  selectedDayKey = null;
  renderAll();
});
document.getElementById("btnToday").addEventListener("click", ()=>{
  let t = new Date(today.getFullYear(), today.getMonth(), 1);
  if(t < minMonth) t = new Date(minMonth); if(t > maxMonth) t = new Date(maxMonth);
  currentMonth = t;
  selectedDayKey = todayKey;
  renderAll();
});
document.getElementById("search").addEventListener("input", (e)=>{
  activeSearch = e.target.value.trim();
  renderAll();
});
document.getElementById("lineFilter").addEventListener("change", (e)=>{
  activeLine = e.target.value;
  renderAll();
});
document.getElementById("viewToggle").addEventListener("click", (e)=>{
  const btn = e.target.closest("button[data-view]");
  if(!btn) return;
  document.querySelectorAll("#viewToggle button").forEach(b=>b.classList.toggle("active", b===btn));
  const isCal = btn.dataset.view==="calendar";
  document.getElementById("calendarView").hidden = !isCal;
  document.getElementById("agendaView").hidden = isCal;
});

/* ---------- init ---------- */
renderCalDow();
renderLegend();
renderAll();

#!/usr/bin/env node
// Finds the dealer in OpenStreetMap and on Google Maps, grades the pin, draws the map image and
// saves a report that `dealers.mjs plan` reads (coordinates are never retyped by hand).
//
//   node .claude/skills/add-dealer/scripts/locate.mjs --name "Iskra servis" \
//     --street "Mije Kovačevića" --number 10 --place Beograd [--municipality Palilula] \
//     [--pin "<OSM or Google Maps link | lat,lng>"] [--no-google]
//
// OSM services are used within their usage policies (1 request per second, identifying
// User-Agent, no bulk jobs); Google Maps is one browser search per dealer.
import fs from "node:fs";
import path from "node:path";
import { parseArgs, print, fail } from "./lib/cli.mjs";
import { writeChoicePage, openInBrowser } from "./lib/choicepage.mjs";
import { WORK_DIR, SITES, REPO_ROOT } from "./lib/paths.mjs";
import { loadDealers } from "./lib/dealers-io.mjs";
import { locate } from "./lib/pin.mjs";
import { googleLookup, resolveGoogleLink } from "./lib/google.mjs";
import { renderPinImage } from "./lib/mapimage.mjs";
import { requestCount } from "./lib/http.mjs";
import { mapLinks, coordsFromLink, round7 } from "./lib/geo.mjs";
import { normalizeHouseNumber, slugify } from "./lib/text.mjs";

const args = parseArgs(process.argv.slice(2));
if (!args.place) fail("Nedostaje --place (naselje, npr. Beograd, Borča, Ugrinovci).");
if (!args.pin && !args.street) fail("Nedostaje --street (ili --pin za tačku koju je poslao Aleksa).");

let manual = null;
if (args.pin) {
  const pin = String(args.pin).trim();
  const plain = pin.match(/^(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)$/);
  let c = plain ? { lat: Number(plain[1]), lng: Number(plain[2]) } : coordsFromLink(pin);
  // Short Google links (maps.app.goo.gl) carry no coordinates until the page is opened.
  if (!c && /google\.|goo\.gl/i.test(pin)) c = await resolveGoogleLink(pin).catch(() => null);
  if (!c) fail("Iz --pin ne mogu da pročitam koordinate. Pošalji „lat,lng“, OSM link ili Google Maps link radnje.");
  manual = { lat: round7(c.lat), lng: round7(c.lng), from: pin };
}

const input = {
  name: args.name ?? "",
  id: args.id ?? (args.name ? slugify(args.name) : ""),
  street: args.street ?? "",
  numberRaw: args.number ? String(args.number) : "",
  hn: normalizeHouseNumber(args.number),
  place: args.place,
  municipality: args.municipality ?? "",
  manual,
};

const existing = [];
for (const [site, file] of Object.entries(SITES)) {
  for (const d of await loadDealers(path.join(REPO_ROOT, file))) existing.push({ ...d, site });
}

const result = await locate(input, existing, { google: args["no-google"] ? null : (inp) => googleLookup(inp) });
const outDir = path.join(WORK_DIR, input.id || "dealer");
fs.mkdirSync(outDir, { recursive: true });

// Red = OpenStreetMap, blue = Google Maps, orange = the point the requester sent.
const COLOR = { osm: "red", google: "blue", manual: "orange" };
const candidates = Object.fromEntries(Object.entries(result.candidates).map(([k, c]) => [k, { ...c, color: COLOR[k], links: mapLinks(c) }]));
let image = null;
const marks = Object.values(candidates).map((c) => ({ lat: c.lat, lng: c.lng, color: c.color }));
if (marks.length) image = await renderPinImage(marks, path.join(outDir, "pin.png"));

const report = {
  verdict: result.verdict,
  reasons: result.reasons,
  agreementM: result.agreement,
  candidates,
  input,
  image: image ? { file: image.file, legend: "crveno = OpenStreetMap, plavo = Google mape, narandžasto = tačka koju je poslao Aleksa" } : null,
  checks: {
    google: result.google,
    reverse: result.ev.reverse ?? null,
    photon: result.ev.photon ?? null,
    nearbyDealers: result.ev.nearby ?? [],
    addressCandidates: result.ev.addressHits.map(({ osm, road, houseNumber, settlement, rank, kind, lat, lng }) => ({ osm, road, houseNumber, settlement, rank, kind, lat, lng })),
    shopCandidates: result.ev.shopHits.map(({ osm, name, road, houseNumber, settlement, kind, nameOk, lat, lng }) => ({ osm, name, road, houseNumber, settlement, kind, nameOk, lat, lng })),
  },
  requests: requestCount,
  createdAt: new Date().toISOString(),
};
const reportFile = path.join(outDir, "locate.json");
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));

// The terminal cannot show pictures: when the requester has to choose, open a simple page with
// the image and what each colour means in their browser.
let page = null;
if (image && result.verdict !== "green") {
  page = writeChoicePage({ name: input.name || "Diler", candidates, imageFile: image.file });
  if (!args["no-open"]) openInBrowser(page);
}

print({
  verdict: report.verdict,
  reasons: report.reasons.map((r) => `${r.level.toUpperCase()}: ${r.msg}`),
  candidates: Object.fromEntries(
    Object.entries(candidates).map(([k, c]) => [k, { lat: c.lat, lng: c.lng, color: c.color, name: c.name, address: c.address, osm: c.osm, links: c.links }]),
  ),
  agreementM: report.agreementM,
  image: report.image?.file ?? null,
  page,
  report: reportFile,
});

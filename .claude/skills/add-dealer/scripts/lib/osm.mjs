// OpenStreetMap (Nominatim) checks for a dealer pin (reference.md, decision 2):
// - physical shop: the pin comes from the requester's Google Maps link; OSM only checks that it
//   sits on the stated street and in the stated settlement;
// - online dealer: the pin is the registered office, geocoded here.
// OSM Serbia carries 99.75 % of the official RGZ address register, so a house-level hit is the
// official address point.
//
// Polite use per https://operations.osmfoundation.org/policies/nominatim/: identifying
// User-Agent, at most one request per second (kept across runs), results cached for a day,
// one dealer at a time.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { WORK_DIR } from "./common.mjs";
import { distanceM, distanceToLineM, inSerbia, round7 } from "./geo.mjs";
import { normalizeHouseNumber, similarity, simple, toLatin, words } from "./text.mjs";

const NOMINATIM = "https://nominatim.openstreetmap.org";
const USER_AGENT = "StridonAddDealerSkill/2.0 (dealer map of dcksrbija.rs and sgtools.rs)";

// How close the pin must be to count as "on the stated street": to the address point of the
// stated number (the shop can be another building on the same lot or a corner building), or to
// the street's centre line (a shop set back behind a yard or a parking lot). These limits pass
// every correct pin of the 120-shop test in reference.md; a pin elsewhere on the shop's own
// street still passes, which OSM cannot tell apart (the requester's link decides the building).
const NEAR = { addressPoint: 75, streetLine: 50 };
// Half-size of the box around the pin in which the street's segments are looked up (~400 m).
const BOX = { lat: 0.0036, lng: 0.005 };

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function nominatim(endpoint, params) {
  const qs = new URLSearchParams({ format: "jsonv2", addressdetails: "1", ...params });
  const url = `${NOMINATIM}/${endpoint}?${qs}`;
  const dir = path.join(WORK_DIR, "cache");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${createHash("sha1").update(url).digest("hex")}.json`);
  try {
    if (Date.now() - fs.statSync(file).mtimeMs < 864e5) return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {}

  const stamp = path.join(dir, "last-nominatim");
  let last = 0;
  try {
    last = Number(fs.readFileSync(stamp, "utf8")) || 0;
  } catch {}
  const wait = last + 1100 - Date.now();
  if (wait > 0) await sleep(wait);
  fs.writeFileSync(stamp, String(Date.now()));

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "sr-Latn,sr,en" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`OpenStreetMap (Nominatim) je vratio HTTP ${res.status}`);
  const body = await res.json();
  fs.writeFileSync(file, JSON.stringify(body));
  return body;
}

const ADMIN_PREFIX = /^(gradska opština|opština|grad)\s+/i;
const placeKey = (name) => simple(toLatin(name).replace(ADMIN_PREFIX, ""));

// "Novi Beograd" matches "Beograd (Novi Beograd)" (OSM and RGZ write Belgrade districts that
// way) by whole words, so "Bor" never matches "Borča". "Gradska opština Voždovac" is read as
// "Voždovac", on both sides.
function matchesPlace(names, place) {
  if (!place) return false;
  const want = words(toLatin(place).replace(ADMIN_PREFIX, ""));
  const wantKey = want.join("");
  return names.filter(Boolean).some((n) => {
    if (placeKey(n) === wantKey || similarity(placeKey(n), wantKey) >= 0.85) return true;
    const w = words(n);
    for (let i = 0; i + want.length <= w.length; i++) if (want.every((x, j) => w[i + j] === x)) return true;
    return false;
  });
}

function describe(hit, input) {
  const a = hit.address ?? {};
  // Settlement names only. For a village OSM Serbia puts the municipality in `city` ("Opština
  // Bečej"), so a pin in Bačko Gradište would pass as "Bečej", and "Glavna 65" exists in both.
  const names = [a.village, a.town, a.city, a.suburb, a.city_district, a.hamlet, a.quarter, a.neighbourhood].filter(
    (n) => n && !/^(gradska\s+)?opština\b|^grad\s/i.test(n),
  );
  const road = a.road ?? a.pedestrian ?? a.footway ?? a.square ?? "";
  return {
    osm: `${hit.osm_type}/${hit.osm_id}`,
    lat: round7(hit.lat),
    lng: round7(hit.lon),
    rank: hit.place_rank,
    road,
    houseNumber: a.house_number ?? "",
    settlement: a.village ?? a.town ?? a.suburb ?? a.city_district ?? a.city ?? a.hamlet ?? "",
    streetOk: similarity(road, input.street) >= 0.8,
    hnOk: Boolean(input.hn) && normalizeHouseNumber(a.house_number) === input.hn,
    // The municipality is only a search hint: matching it here would let a pin in Bačko Gradište
    // pass as "Bečej" again.
    placeOk: matchesPlace(names, input.place),
    // Interpolated numbers are guesses along a street, not a mapped building.
    interpolated: hit.category === "place" && hit.type === "house" && hit.osm_type === "way",
    geometry: hit.geojson,
  };
}

const isAddressPoint = (c) => c.hnOk && c.streetOk && c.placeOk && !c.interpolated && c.rank >= 30 && inSerbia(c.lat, c.lng);

async function addressPoints(input) {
  if (!input.hn) return [];
  const street = `${input.street} ${input.numberRaw}`;
  const tries = [{ street, city: input.place }, { q: `${street}, ${input.place}` }];
  if (input.municipality) tries.push({ street, city: input.municipality });
  const found = new Map();
  for (const params of tries) {
    const hits = await nominatim("search", { ...params, countrycodes: "rs", limit: "5" });
    for (const h of hits.map((x) => describe(x, input)).filter(isAddressPoint)) found.set(h.osm, h);
    if (found.size) break;
  }
  return [...found.values()];
}

// The street's mapped segments near the pin, with their geometry. Only a box around the pin:
// a long street has more segments than Nominatim returns, and without the box they could all
// come from its far end.
async function streetSegments(input, point) {
  const hits = await nominatim("search", {
    street: input.street,
    city: input.place,
    countrycodes: "rs",
    viewbox: [point.lng - BOX.lng, point.lat + BOX.lat, point.lng + BOX.lng, point.lat - BOX.lat].join(","),
    bounded: "1",
    polygon_geojson: "1",
    dedupe: "0",
    limit: "40",
  });
  return hits
    .map((h) => describe(h, input))
    .filter((c) => c.streetOk && c.placeOk && /LineString/.test(c.geometry?.type ?? ""));
}

function lines(geometry) {
  return geometry.type === "LineString" ? [geometry.coordinates] : geometry.coordinates;
}

// Is the pin on `input.street` in `input.place`: the road at the pin, else the address point
// within NEAR.addressPoint, else the street's centre line within NEAR.streetLine.
async function onStreet(point, input, rv) {
  if (rv.streetOk) return { ok: true, how: `OSM na tom mestu ima „${`${rv.road} ${rv.houseNumber}`.trim()}“` };
  const points = await addressPoints(input);
  const nearest = points.map((p) => ({ ...p, d: distanceM(point, p) })).sort((a, b) => a.d - b.d)[0];
  if (nearest && nearest.d <= NEAR.addressPoint) return { ok: true, how: `adresa „${input.street} ${input.numberRaw}“ je ${nearest.d} m od tačke` };
  const segments = await streetSegments(input, point);
  const d = Math.min(...segments.flatMap((s) => lines(s.geometry).map((l) => distanceToLineM(point, l))));
  if (Number.isFinite(d) && d <= NEAR.streetLine) return { ok: true, how: `ulica „${input.street}“ je ${d} m od tačke` };
  return { ok: false, d };
}

// Is the pin on the stated street and in the stated settlement? Never moves the pin.
export async function checkPin(point, input) {
  const rv = describe(await nominatim("reverse", { lat: String(point.lat), lon: String(point.lng), zoom: "18" }), input);
  const at = `${rv.road} ${rv.houseNumber}`.trim() || "nema adrese";
  const atPin = { road: rv.road, houseNumber: rv.houseNumber, settlement: rv.settlement };
  if (!rv.placeOk) {
    // When the pin is on the stated street of the settlement it is in, only the settlement name
    // differs (a shop in Borča with "Beograd" in its address, corner buildings included): that
    // settlement is offered to the requester.
    const there = rv.settlement ? await onStreet(point, { ...input, place: rv.settlement }, rv) : { ok: false };
    return {
      ok: false,
      reasons: [`Tačka je u naselju „${rv.settlement || "nepoznato"}“, a adresa kaže „${input.place}“.`],
      atPin,
      suggestedPlace: there.ok ? rv.settlement : null,
    };
  }
  const near = await onStreet(point, input, rv);
  if (near.ok) return { ok: true, reasons: [], how: near.how, atPin };
  return {
    ok: false,
    reasons: [
      Number.isFinite(near.d)
        ? `Tačka nije u ulici „${input.street}“: ulica je ${near.d} m daleko, a na mestu tačke OSM ima „${at}“.`
        : `Ulica „${input.street}“ nije u krugu od 400 m od tačke; na mestu tačke OSM ima „${at}“.`,
    ],
    atPin,
  };
}

// Registered office of an online dealer: the official address point, or nothing.
export async function geocodeOffice(input) {
  const points = await addressPoints(input);
  if (!points.length) {
    return { error: `OSM nema adresu „${input.street} ${input.numberRaw}, ${input.place}“ sa kućnim brojem.` };
  }
  const settlements = new Set(points.map((p) => simple(p.settlement)));
  if (settlements.size > 1 && points.some((p) => distanceM(p, points[0]) > NEAR.addressPoint)) {
    return { error: `Ista adresa postoji u više naselja (${[...new Set(points.map((p) => p.settlement))].join(", ")}); navedi tačno naselje.` };
  }
  const p = points[0];
  return { lat: p.lat, lng: p.lng, how: `OSM adresna tačka ${p.osm} („${p.road} ${p.houseNumber}, ${p.settlement}“)` };
}

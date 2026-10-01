// Finds a dealer's pin in OpenStreetMap and on Google Maps and grades it green / yellow / red.
//
// Why these sources (research 2026-09-30 and 2026-10-01, existing dealers as ground truth):
// - Nominatim hit the house number for 18 of 20 dealers; free, no key.
// - OSM Serbia imported 99.75 % of the RGZ address register, so RGZ, Nominatim and Photon are
//   NOT independent votes for a coordinate. Independent evidence is a shop mapped in OSM under
//   the dealer's name, the map image, and a human.
// - Google Maps knows small shops that have no official house number, but its listings can be
//   stale (an old address kept after a move). Compared on 25 dealers, Google and OSM agreed for
//   16 and each was right where the other failed, so both are checked (see decide()). Google is
//   searched in a browser like a person would (lib/google.mjs), not through an API.
import { getJson, query } from "./http.mjs";
import { distanceM, inSerbia, round7 } from "./geo.mjs";
import { normalizeHouseNumber, similarity, simple, toCyrillic, toLatin, nameMatches } from "./text.mjs";

const NOMINATIM = "https://nominatim.openstreetmap.org";
const PHOTON = "https://photon.komoot.io/api";

export const T = { agree: 30, near: 150, dealerClash: 50, googleAgree: 10 };

const placeKey = (name) => simple(toLatin(name).replace(/^(gradska opština|opština|grad)\s+/i, ""));
const words = (s) =>
  toLatin(s)
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

// "Novi Beograd" matches "Beograd (Novi Beograd)" (OSM and RGZ write Belgrade districts that
// way) by whole words, so "Bor" never matches "Borča".
export function matchesPlace(names, place) {
  if (!place) return false;
  const want = words(place);
  const wantKey = want.join("");
  return names.filter(Boolean).some((n) => {
    if (placeKey(n) === wantKey || similarity(placeKey(n), wantKey) >= 0.85) return true;
    const w = words(n);
    for (let i = 0; i + want.length <= w.length; i++) if (want.every((x, j) => w[i + j] === x)) return true;
    return false;
  });
}

export function classifyHit(hit, input) {
  const a = hit.address ?? {};
  const lat = round7(hit.lat);
  const lng = round7(hit.lon);
  const road = a.road ?? a.pedestrian ?? a.footway ?? a.square ?? "";
  const names = [a.village, a.town, a.city, a.suburb, a.city_district, a.municipality, a.county, a.hamlet, a.quarter, a.neighbourhood];
  return {
    osm: `${hit.osm_type}/${hit.osm_id}`,
    lat,
    lng,
    rank: hit.place_rank,
    kind: `${hit.category}=${hit.type}`,
    name: hit.name ?? "",
    road,
    houseNumber: a.house_number ?? "",
    settlement: a.village ?? a.town ?? a.suburb ?? a.city_district ?? a.city ?? a.hamlet ?? "",
    rural: Boolean(a.village || a.hamlet),
    hnOk: Boolean(input.hn) && normalizeHouseNumber(a.house_number) === input.hn,
    streetOk: similarity(road, input.street) >= 0.8,
    placeOk: matchesPlace(names, input.place) || matchesPlace(names, input.municipality),
    inSerbia: inSerbia(lat, lng),
    // Interpolated numbers are guesses along a street, not a mapped building.
    interpolated: hit.category === "place" && hit.type === "house" && hit.osm_type === "way",
    isShop: ["shop", "craft", "office"].includes(hit.category),
  };
}

const isAddressMatch = (c) => c.hnOk && c.streetOk && c.placeOk && c.inSerbia && !c.interpolated && c.rank >= 30;

async function nominatimSearch(params, input) {
  const hits = await getJson(
    query(`${NOMINATIM}/search`, { ...params, countrycodes: "rs", addressdetails: 1, format: "jsonv2", limit: 5 }),
  );
  return hits.map((h) => classifyHit(h, input));
}

async function searchAddress(input) {
  const street = [input.street, input.numberRaw].filter(Boolean).join(" ");
  const tries = [{ street, city: input.place }, { q: `${street}, ${input.place}` }];
  if (input.municipality) tries.push({ street, city: input.municipality }, { q: `${street}, ${input.municipality}` });
  const seen = new Map();
  for (const params of tries) {
    for (const c of await nominatimSearch(params, input)) if (!seen.has(c.osm)) seen.set(c.osm, c);
    if ([...seen.values()].some(isAddressMatch)) break;
  }
  return [...seen.values()];
}

async function searchShop(input) {
  if (!input.name) return [];
  const hits = await nominatimSearch({ q: `${input.name}, ${input.place}` }, input);
  return hits.map((c) => ({ ...c, nameOk: nameMatches(input.name, c.name) }));
}

async function reverse(point, input) {
  const hit = await getJson(
    query(`${NOMINATIM}/reverse`, { lat: point.lat, lon: point.lng, zoom: 18, addressdetails: 1, format: "jsonv2" }),
  );
  const c = classifyHit(hit, input);
  return { ...c, distance: distanceM(point, c) };
}

async function photon(input) {
  const q = toCyrillic(`${input.street} ${input.numberRaw}, ${input.place}`);
  const res = await getJson(query(PHOTON, { q, limit: 5, bbox: "18.8,42.2,23.05,46.2" }));
  // Every feature with the same street, number and settlement; the same address can exist in
  // two villages of one municipality (Glavna 65 in Bečej and in Bačko Gradište).
  const matches = (res.features ?? [])
    .map((f) => {
      const p = f.properties ?? {};
      const [lng, lat] = f.geometry.coordinates; // Photon is [lng, lat]
      return {
        lat: round7(lat),
        lng: round7(lng),
        road: p.street ?? "",
        houseNumber: p.housenumber ?? "",
        settlement: p.district ?? p.city ?? p.locality ?? "",
        ok:
          normalizeHouseNumber(p.housenumber) === input.hn &&
          similarity(p.street, input.street) >= 0.8 &&
          (matchesPlace([p.city, p.district, p.locality, p.county], input.place) ||
            matchesPlace([p.city, p.district, p.locality, p.county], input.municipality)),
      };
    })
    .filter((h) => h.ok);
  return { query: q, matches };
}

export function choosePoint(input, ev) {
  if (input.manual) return { point: input.manual, source: "manual" };
  const matches = ev.addressHits.filter(isAddressMatch);
  const address = matches.find((m) => !m.isShop) ?? matches[0] ?? null;
  const settlements = new Set(matches.map((m) => simple(m.settlement)));
  const ambiguous =
    settlements.size > 1 && matches.some((m) => distanceM(m, address) > T.near)
      ? [...new Set(matches.map((m) => m.settlement))]
      : null;
  // Shops come from the name search and from the address search itself: at Segedinski put 86
  // the address search returns the building and the shop "SU alati" (Sualati) on the same lot,
  // while the name search finds nothing.
  const namedAtAddress = matches.filter((m) => m.isShop && nameMatches(input.name ?? "", m.name));
  const shops = [...namedAtAddress, ...ev.shopHits.filter((s) => s.nameOk && s.isShop && s.inSerbia && s.placeOk)].filter(
    (s, i, all) => all.findIndex((x) => x.osm === s.osm) === i,
  );
  // A shop mapped under the dealer's name beats the address node (Filip did the same for
  // Sualati, Tim Komerc, Fish & Food and Prodavnica Alata), if it is near the address.
  // Without an address node the shop must still sit on the requested street (and number,
  // unless the address is "bb").
  const shop =
    shops.find((s) => address && distanceM(s, address) <= T.near) ??
    shops.find((s) => !address && s.streetOk && (!input.hn || s.hnOk)) ??
    null;
  const point = shop ?? address;
  return {
    point: point ? { lat: point.lat, lng: point.lng } : null,
    source: shop ? "osm-shop" : address ? "osm-address" : null,
    osm: point?.osm ?? null,
    address,
    shop,
    otherShops: shops.filter((s) => s !== shop),
    ambiguous,
  };
}

// Pure grading, so it can be tested without the network.
export function judge(input, ev, choice) {
  const reasons = [];
  const add = (level, code, msg, data) => reasons.push(data ? { level, code, msg, data } : { level, code, msg });
  const { point } = choice;

  if (input.manual) {
    add("yellow", "manual", "Ručni pin: Aleksa mora izričito da potvrdi tačku na slici i na mapi.");
    if (!inSerbia(point.lat, point.lng)) add("red", "outside", "Tačka je van Srbije (možda su zamenjeni lat i lng).");
  } else {
    if (!input.hn) {
      add(
        point ? "yellow" : "red",
        "no_number",
        point
          ? "Adresa nema kućni broj (bb); pin je nađen po imenu radnje u OSM-u."
          : "Adresa nema kućni broj (bb), a radnja nije ucrtana u OSM-u: treba ručni pin.",
      );
    } else if (!point) {
      add(
        "red",
        "no_house_match",
        "Kućni broj nije nađen (samo ulica ili naselje) i radnja nije ucrtana pod tim imenom: treba ručni pin. Takva adresa često ne postoji ni u zvaničnom registru.",
      );
    }
    if (choice.ambiguous) {
      add("red", "ambiguous", `Ista adresa postoji u više naselja (${choice.ambiguous.join(", ")}); navedi tačno naselje ili opštinu.`);
    }
    if (choice.source === "osm-shop") {
      const d = choice.address ? distanceM(choice.shop, choice.address) : null;
      add("ok", "shop", `Pin je na radnji ucrtanoj u OSM-u („${choice.shop.name}“)${d === null ? "" : `, ${d} m od adresne tačke`}.`, { name: choice.shop.name, distance: d });
    }
    for (const s of choice.otherShops ?? []) {
      const d = point ? distanceM(s, point) : null;
      add("yellow", "shop_elsewhere", `U OSM-u postoji i „${s.name}“ (${s.road} ${s.houseNumber}, ${s.settlement})${d === null ? "" : `, ${d} m od pina`}; proveri koja je prava radnja.`);
    }
    const a = choice.address;
    if (a && input.numberRaw && a.houseNumber.toLowerCase().replace(/\s/g, "") !== String(input.numberRaw).toLowerCase().replace(/\s/g, "")) {
      add("yellow", "number_spelling", `Broj je u OSM-u „${a.houseNumber}“, a u zahtevu „${input.numberRaw}“; potvrdi da je to isti objekat.`);
    }
    if (point && (choice.shop ?? a)?.rural) add("yellow", "rural", "Seosko naselje: na slici proveri da pin stoji na pravom objektu.");
  }

  if (point) {
    const rv = ev.reverse;
    if (rv) {
      if (!rv.placeOk) add("red", "reverse_place", `Obrnuto geokodiranje pina daje naselje „${rv.settlement}“, a ne „${input.place}“.`);
      else if (input.hn && !(rv.hnOk && rv.streetOk)) {
        add(
          input.manual ? "ok" : "yellow",
          "reverse_address",
          `Na mestu pina OSM ima „${rv.road} ${rv.houseNumber}“ (${rv.distance} m), ne „${input.street} ${input.numberRaw}“.`,
        );
      } else if (rv.distance > T.agree) add("yellow", "reverse_far", `Najbliža adresa pinu je ${rv.distance} m daleko.`);
      else add("ok", "reverse", `Obrnuto geokodiranje: „${rv.road} ${rv.houseNumber}“, ${rv.settlement} (${rv.distance} m).`, { distance: rv.distance });
    }
    // Photon only knows addresses, so it is compared with the address point, not the shop.
    const reference = choice.source === "osm-shop" && choice.address ? choice.address : point;
    const photonDistances = (ev.photon?.matches ?? []).map((m) => distanceM(reference, m));
    if (photonDistances.length) {
      const d = Math.min(...photonDistances);
      add(d > T.agree ? "yellow" : "ok", "photon", `Photon (drugi pretraživač, ćirilica) stavlja adresu ${d} m od ${reference === point ? "pina" : "adresne tačke"}.`, { distance: d });
    }
    for (const n of ev.nearby ?? []) {
      add("yellow", "near_dealer", `Pin je ${n.distance} m od postojećeg dilera „${n.name}“ (${n.site}); proveri da nije greška.`);
    }
  }

  const verdict = reasons.some((r) => r.level === "red") ? "red" : reasons.some((r) => r.level === "yellow") ? "yellow" : "green";
  return { verdict, reasons };
}

// Final verdict, by the owner's rule (2026-10-01): Google Maps and OpenStreetMap are both checked.
// Within 10 m of each other the pin is green and goes straight to the PR; otherwise the requester
// looks at both points on the map image and says which one is right.
export function decide(input, osm, google) {
  const reasons = [...osm.reasons];
  const add = (level, code, msg, data) => reasons.push(data ? { level, code, msg, data } : { level, code, msg });
  const candidates = {};
  const point = osm.choice.point;

  if (input.manual) {
    candidates.manual = { lat: point.lat, lng: point.lng, from: input.manual.from };
    return { verdict: osm.verdict === "red" ? "red" : "yellow", reasons, candidates, agreement: null };
  }

  if (point) candidates.osm = { lat: point.lat, lng: point.lng, source: osm.choice.source, osm: osm.choice.osm };
  if (google?.match) candidates.google = { ...google.match };

  if (!google || google.error) {
    add("yellow", "google_unavailable", `Google provera nije urađena${google?.error ? ` (${google.error})` : ""}, pa Aleksa mora da potvrdi tačku.`);
  } else if (!google.match) {
    const seen = google.results.map((r) => r.name).filter(Boolean).slice(0, 3);
    add("info", "google_none", `Google ne zna radnju „${input.name}“ na ovoj adresi${seen.length ? ` (vratio je: ${seen.join(", ")})` : ""}.`);
  }

  let agreement = null;
  if (candidates.osm && candidates.google) {
    agreement = distanceM(candidates.osm, candidates.google);
    add(
      agreement <= T.googleAgree ? "ok" : "yellow",
      "google_vs_osm",
      agreement <= T.googleAgree
        ? `Google („${candidates.google.name}“) i OpenStreetMap se slažu: ${agreement} m.`
        : `Google („${candidates.google.name}“) i OpenStreetMap se razilaze ${agreement} m: Aleksa bira tačnu tačku na slici.`,
      { distance: agreement, name: candidates.google.name },
    );
  } else if (candidates.google) {
    add("yellow", "google_only", `Samo Google zna ovu radnju („${candidates.google.name}“${candidates.google.address ? `, ${candidates.google.address}` : ""}); Aleksa potvrđuje tačku.`);
  } else if (candidates.osm && google && !google.error) {
    add("yellow", "osm_only", "Samo OpenStreetMap ima ovu adresu, Google je ne zna; Aleksa potvrđuje tačku.");
  }

  // A pin that reverse-geocodes into another settlement cannot be green even if Google agrees.
  const osmBroken = osm.reasons.some((r) => r.code === "reverse_place");
  const verdict =
    !candidates.osm && !candidates.google ? "red"
    : agreement !== null && agreement <= T.googleAgree && !osmBroken ? "green"
    : "yellow";
  // Once two independent sources agree, OSM's own doubts are notes; when the requester decides,
  // OSM's red findings are part of the explanation, not a stop.
  const final = reasons.map((r) =>
    verdict === "green" && r.level === "yellow" ? { ...r, level: "info" }
    : verdict === "yellow" && r.code === "no_house_match" ? { ...r, level: "info", msg: "OpenStreetMap nema ovaj kućni broj (često ga nema ni zvanični registar)." }
    : verdict === "yellow" && r.level === "red" ? { ...r, level: "yellow" }
    : r,
  );
  return { verdict, reasons: final, candidates, agreement };
}

export async function locate(input, existingDealers, { google } = {}) {
  const ev = { addressHits: [], shopHits: [] };
  if (!input.manual) {
    ev.addressHits = await searchAddress(input);
    ev.shopHits = await searchShop(input);
  }
  const choice = choosePoint(input, ev);
  if (choice.point) {
    ev.reverse = await reverse(choice.point, input);
    if (!input.manual && input.hn) ev.photon = await photon(input);
    const near = new Map();
    for (const d of existingDealers) {
      if (d.id === input.id || nameMatches(input.name ?? "", d.name)) continue;
      const distance = distanceM(choice.point, d.coordinates);
      if (distance > T.dealerClash) continue;
      const seen = near.get(d.id);
      near.set(d.id, { id: d.id, name: d.name, site: seen ? `${seen.site}, ${d.site}` : d.site, distance });
    }
    ev.nearby = [...near.values()];
  }
  const osm = { ...judge(input, ev, choice), choice };
  let g = null;
  if (!input.manual && google) {
    try {
      g = await google(input);
    } catch (err) {
      g = { error: String(err.message).split(/\r?\n/)[0] };
    }
  }
  return { ...decide(input, osm, g), choice, ev, google: g };
}

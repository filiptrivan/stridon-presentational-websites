import { test } from "node:test";
import assert from "node:assert/strict";
import { choosePoint, judge, decide, matchesPlace } from "../lib/pin.mjs";
import { googleNameMatches } from "../lib/google.mjs";

const input = { name: "Iskra servis", street: "Mije Kovačevića", numberRaw: "10", hn: "10", place: "Beograd", municipality: "" };

const address = (over = {}) => ({
  osm: "way/1", lat: 44.8153247, lng: 20.49229, rank: 30, kind: "building=yes", name: "",
  road: "Mije Kovačevića", houseNumber: "10", settlement: "Palilula", rural: false,
  hnOk: true, streetOk: true, placeOk: true, inSerbia: true, interpolated: false, isShop: false, ...over,
});
const reverseOk = { ...address(), distance: 0 };
const grade = (inp, ev) => judge(inp, ev, choosePoint(inp, ev));

test("green: house-number match confirmed by reverse geocoding", () => {
  const r = grade(input, { addressHits: [address()], shopHits: [], reverse: reverseOk });
  assert.equal(r.verdict, "green");
});

test("red: only the street was found", () => {
  const r = grade(input, { addressHits: [address({ hnOk: false, rank: 26, houseNumber: "" })], shopHits: [] });
  assert.equal(r.verdict, "red");
  assert.ok(r.reasons.some((x) => x.code === "no_house_match"));
});

test("red: interpolated number is not a mapped building", () => {
  const r = grade(input, { addressHits: [address({ interpolated: true })], shopHits: [] });
  assert.equal(r.verdict, "red");
});

test("red: the same address in two settlements far apart", () => {
  const hits = [address({ settlement: "Zemun" }), address({ osm: "way/2", settlement: "Ugrinovci", lat: 44.8965, lng: 20.2467 })];
  const r = grade({ ...input, street: "Zemunska" }, { addressHits: hits, shopHits: [], reverse: reverseOk });
  assert.equal(r.verdict, "red");
  assert.ok(r.reasons.some((x) => x.code === "ambiguous"));
});

test("red: reverse geocoding lands in another settlement", () => {
  const r = grade(input, { addressHits: [address()], shopHits: [], reverse: { ...reverseOk, placeOk: false, settlement: "Pančevo" } });
  assert.equal(r.verdict, "red");
});

test("a named shop near the address wins and stays green", () => {
  const shop = address({ osm: "node/9", lat: 44.8154, lng: 20.4924, name: "Iskra servis", isShop: true, nameOk: true, kind: "shop=hardware" });
  const ev = { addressHits: [address()], shopHits: [shop], reverse: reverseOk };
  const choice = choosePoint(input, ev);
  assert.equal(choice.source, "osm-shop");
  assert.equal(judge(input, ev, choice).verdict, "green");
});

test("settlement written as a Belgrade district still matches, by whole words only", () => {
  assert.ok(matchesPlace(["Beograd (Novi Beograd)"], "Novi Beograd"));
  assert.ok(matchesPlace(["Gradska opština Palilula"], "Palilula"));
  assert.ok(matchesPlace(["Grad Beograd"], "Beograd"));
  assert.ok(!matchesPlace(["Borča"], "Bor"));
  assert.ok(!matchesPlace(["Bačko Gradište"], "Bečej"));
});

// Segedinski put 86: the address search returns the building and, on the same lot, the shop
// "SU alati" where the existing pin is; the name search returns nothing.
test("a shop with the dealer's name among the address hits wins over the building", () => {
  const inp = { ...input, name: "Sualati 024", street: "Segedinski put", numberRaw: "86", hn: "86", place: "Subotica" };
  const building = address({ osm: "way/1533235825", lat: 46.1007439, lng: 19.6966873, road: "Segedinski put", houseNumber: "86" });
  const suAlati = address({ osm: "node/13972369578", lat: 46.099807, lng: 19.6966443, road: "Segedinski put", houseNumber: "86", name: "SU alati", isShop: true, kind: "shop=hardware" });
  const other = address({ osm: "node/13972369579", lat: 46.0996083, lng: 19.6967102, road: "Segedinski put", houseNumber: "86", name: "Citronix", isShop: true, kind: "shop=hardware" });
  const choice = choosePoint(inp, { addressHits: [building, suAlati, other], shopHits: [] });
  assert.equal(choice.source, "osm-shop");
  assert.equal(choice.osm, "node/13972369578");
});

test("yellow: number spelled differently, rural place, nearby dealer, Photon disagreement", () => {
  const spelled = grade({ ...input, numberRaw: "10-A", hn: "10a" }, { addressHits: [address({ houseNumber: "10a" })], shopHits: [], reverse: reverseOk });
  assert.equal(spelled.verdict, "yellow");
  const rural = grade(input, { addressHits: [address({ rural: true })], shopHits: [], reverse: reverseOk });
  assert.equal(rural.verdict, "yellow");
  const near = grade(input, { addressHits: [address()], shopHits: [], reverse: reverseOk, nearby: [{ id: "x", name: "X", site: "dck", distance: 12 }] });
  assert.equal(near.verdict, "yellow");
  const photon = grade(input, { addressHits: [address()], shopHits: [], reverse: reverseOk, photon: { matches: [{ lat: 44.8165, lng: 20.4923 }] } });
  assert.equal(photon.verdict, "yellow");
  // Same street and number in two villages of one municipality: the nearest one counts.
  const twoVillages = grade(input, { addressHits: [address()], shopHits: [], reverse: reverseOk, photon: { matches: [{ lat: 44.9, lng: 20.4 }, { lat: 44.8153247, lng: 20.49229 }] } });
  assert.equal(twoVillages.verdict, "green");
});

// Final rule (2026-10-01): green only when Google Maps and OSM agree within 10 m.
const osmResult = (inp, ev) => {
  const choice = choosePoint(inp, ev);
  return { ...judge(inp, ev, choice), choice };
};
const found = { addressHits: [address()], shopHits: [], reverse: reverseOk };
const googleAt = (lat, lng, name = "Iskra Servis doo") => ({ results: [{ name, lat, lng }], match: { name, address: "", lat, lng } });

test("green only when Google and OSM agree within 10 m", () => {
  const near = decide(input, osmResult(input, found), googleAt(44.8153247, 20.4923)); // about 1 m
  assert.equal(near.verdict, "green");
  assert.deepEqual(Object.keys(near.candidates).sort(), ["google", "osm"]);
  const eleven = decide(input, osmResult(input, found), googleAt(44.8154237, 20.49229)); // 11 m
  assert.equal(eleven.verdict, "yellow");
  assert.ok(eleven.reasons.some((r) => r.code === "google_vs_osm" && r.level === "yellow"));
});

test("one source only, or no Google check at all, means the requester decides", () => {
  const noOsm = { addressHits: [address({ hnOk: false, rank: 26, houseNumber: "" })], shopHits: [] };
  const onlyGoogle = decide(input, osmResult(input, noOsm), googleAt(44.7859094, 20.5297614, "Iskra servis"));
  assert.equal(onlyGoogle.verdict, "yellow");
  assert.deepEqual(Object.keys(onlyGoogle.candidates), ["google"]);
  const onlyOsm = decide(input, osmResult(input, found), { results: [], match: null });
  assert.equal(onlyOsm.verdict, "yellow");
  const failed = decide(input, osmResult(input, found), { error: "nema pregledača" });
  assert.equal(failed.verdict, "yellow");
  assert.ok(failed.reasons.some((r) => r.code === "google_unavailable"));
});

test("red when neither source knows the shop", () => {
  const nothing = { addressHits: [], shopHits: [] };
  assert.equal(decide(input, osmResult(input, nothing), { results: [], match: null }).verdict, "red");
});

test("Google agreeing does not rescue a pin that lands in another settlement", () => {
  const ev = { ...found, reverse: { ...reverseOk, placeOk: false, settlement: "Pančevo" } };
  assert.equal(decide(input, osmResult(input, ev), googleAt(44.8153247, 20.4923)).verdict, "yellow");
});

test("Google names match by whole words", () => {
  assert.ok(googleNameMatches("Sualati 024", "SUALATI"));
  assert.ok(googleNameMatches("Sualati 024", "SU alati"));
  assert.ok(googleNameMatches("Elektro 025", "Prodavnica Elektromaterijala Elektro025"));
  assert.ok(googleNameMatches("Kolor gradnja", "Колор градња"));
  assert.ok(googleNameMatches("MB Alati i Oprema", "MB Alati"));
  assert.ok(!googleNameMatches("Triar", "TRIARVET veterinarska ambulanta Batajnica Ugrinovci VETERINAR"));
  assert.ok(!googleNameMatches("Alati i Oprema", "Mixal"));
  assert.ok(!googleNameMatches("Alati i Oprema", "Super alati"));
  assert.ok(googleNameMatches("Alati i Oprema", "Alati i oprema doo"));
  assert.ok(googleNameMatches("DMP Cosmos Electric", "Cosmos electric"));
  assert.ok(googleNameMatches("Stolarski Centar Vera Krstić", "Stolarski Centar"));
  assert.ok(!googleNameMatches("Alati DMS", "Alati Pro"));
});

test("hand-placed pin is at best yellow, and red outside Serbia", () => {
  const manual = { ...input, manual: { lat: 44.8153, lng: 20.4922 } };
  assert.equal(grade(manual, { addressHits: [], shopHits: [], reverse: reverseOk }).verdict, "yellow");
  const swapped = { ...input, manual: { lat: 20.4922, lng: 44.8153 } };
  assert.equal(grade(swapped, { addressHits: [], shopHits: [] }).verdict, "red");
});

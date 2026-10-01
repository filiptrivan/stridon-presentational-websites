import { test } from "node:test";
import assert from "node:assert/strict";
import { toLatin, toCyrillic, simple, similarity, normalizeHouseNumber, slugify, nameMatches } from "../lib/text.mjs";
import { coordsFromLink, inSerbia, distanceM } from "../lib/geo.mjs";

test("script conversion", () => {
  assert.equal(toLatin("Мије Ковачевића"), "Mije Kovačevića");
  assert.equal(toLatin("Љубе Ненадовића"), "Ljube Nenadovića");
  assert.equal(toCyrillic("Mije Kovačevića 10, Beograd"), "Мије Ковачевића 10, Београд");
  assert.equal(toCyrillic("Njegoševa"), "Његошева");
  assert.equal(toCyrillic("Džordža Vašingtona"), "Џорџа Вашингтона");
});

test("comparison keys", () => {
  assert.equal(simple("Đure Jakšića"), simple("Djure Jaksica"));
  assert.equal(simple("Ђуре Јакшића"), "djurejaksica");
  assert.ok(similarity("Kneza Mihajla", "Кнеза Михаила") >= 0.8);
  assert.ok(similarity("Ulica Paunova", "Paunova") === 1);
  assert.ok(similarity("Paunova", "Zemunska") < 0.5);
});

test("house numbers", () => {
  assert.equal(normalizeHouseNumber("10-A"), "10a");
  assert.equal(normalizeHouseNumber("10 a"), "10a");
  assert.equal(normalizeHouseNumber("10А"), "10a"); // Cyrillic А
  assert.equal(normalizeHouseNumber("141G"), "141g");
  assert.equal(normalizeHouseNumber("12/3"), "12/3");
  assert.equal(normalizeHouseNumber("bb"), null);
  assert.equal(normalizeHouseNumber("B.B."), null);
  assert.equal(normalizeHouseNumber(""), null);
});

test("ids follow the existing entries", () => {
  assert.equal(slugify("Gvožđara 021 Plus"), "gvozdara-021-plus");
  assert.equal(slugify("Fish & Food"), "fish-and-food");
  assert.equal(slugify("Srnić Alati"), "srnic-alati");
  assert.equal(slugify("Stridon Group D.O.O."), "stridon-group-d-o-o");
});

test("company name matching ignores generic words", () => {
  assert.ok(nameMatches("Iskra servis", "Искра сервис"));
  assert.ok(nameMatches("Tim Komerc", "Tim Komerc DOO"));
  assert.ok(!nameMatches("Alati DMS", "Alati Pro"));
  assert.ok(!nameMatches("Gvožđara Matica 10", "Gvožđara Nikolić"));
});

test("map links and bounds", () => {
  assert.deepEqual(coordsFromLink("https://www.google.com/maps/place/X/@44.81,20.49,17z/data=!3d44.8153!4d20.4922"), { lat: 44.8153, lng: 20.4922, kind: "place" });
  assert.deepEqual(coordsFromLink("https://www.openstreetmap.org/?mlat=44.8153&mlon=20.4922#map=19/44.8153/20.4922"), { lat: 44.8153, lng: 20.4922, kind: "marker" });
  assert.deepEqual(coordsFromLink("https://www.openstreetmap.org/#map=19/44.8153/20.4922"), { lat: 44.8153, lng: 20.4922, kind: "viewport" });
  assert.equal(coordsFromLink("https://maps.app.goo.gl/abc"), null);
  assert.ok(inSerbia(44.8153, 20.4922));
  assert.ok(!inSerbia(20.4922, 44.8153)); // swapped lat/lng
  // Bečej vs the wrong "Glavna 65" Photon once returned in Bačko Gradište: about 9.5 km.
  const d = distanceM({ lat: 45.6198748, lng: 20.0406751 }, { lat: 45.5346931, lng: 20.0317921 });
  assert.ok(d > 9400 && d < 9600, `${d}`);
});

import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { REPO_ROOT, SITES } from "../lib/paths.mjs";
import { loadDealers, readText, insertEntry, simulateInsert, checkSites, checkEntry } from "../lib/dealers-io.mjs";

const entry = {
  id: "test-diler",
  name: "Test Diler",
  address: "Mije Kovačevića 10",
  city: "Beograd",
  phone: "011/123-4567",
  website: "https://example.rs/",
  category: "dealer",
  coordinates: { lat: 44.8153247, lng: 20.49229 },
};

// Copies of the real files (dck imports ./service-centers, so it comes along).
function copySite(site) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), `add-dealer-test-${site}-`));
  const src = path.join(REPO_ROOT, SITES[site]);
  for (const f of fs.readdirSync(path.dirname(src))) {
    if (f.endsWith(".ts")) fs.copyFileSync(path.join(path.dirname(src), f), path.join(dir, f));
  }
  return path.join(dir, "dealers.ts");
}

test("current dealer data passes validation", async () => {
  const bySite = {};
  for (const [site, file] of Object.entries(SITES)) bySite[site] = await loadDealers(path.join(REPO_ROOT, file));
  const { errors } = checkSites(bySite);
  assert.deepEqual(errors, []);
});

for (const site of Object.keys(SITES)) {
  for (const position of ["dealers", "online"]) {
    test(`${site}: inserting at "${position}" matches the simulation and keeps line endings`, async () => {
      const file = copySite(site);
      const before = await loadDealers(file);
      const { text, eol } = readText(file);
      fs.writeFileSync(file, insertEntry(text, eol, { ...entry, category: position === "online" ? "online" : "dealer" }, position, before));
      const after = await loadDealers(file);
      const expected = simulateInsert(before, { ...entry, category: position === "online" ? "online" : "dealer" }, position).next;
      assert.deepEqual(after.map((d) => d.id), expected.map((d) => d.id));
      assert.deepEqual(after.find((d) => d.id === entry.id).coordinates, entry.coordinates);
      const written = fs.readFileSync(file, "utf8");
      if (eol === "\r\n") assert.equal(written.split("\r\n").length, written.split("\n").length, "mixed line endings");
      assert.equal(written.split(eol).length, text.split(eol).length + 10);
    });
  }
}

test("dealer position keeps the product-page first 6; online position changes it", async () => {
  const dck = await loadDealers(path.join(REPO_ROOT, SITES.dck));
  const shop = simulateInsert(dck, entry, "dealers");
  assert.deepEqual(shop.top6After, shop.top6Before);
  const online = simulateInsert(dck, { ...entry, category: "online" }, "online");
  assert.notDeepEqual(online.top6After, online.top6Before);
});

test("rules catch the dangerous mistakes", async () => {
  const dck = await loadDealers(path.join(REPO_ROOT, SITES.dck));
  const dup = checkSites({ dck: [...dck, { ...dck[0] }] });
  assert.ok(dup.errors.some((e) => e.includes("se ponavlja")));
  const swapped = checkEntry({ ...entry, coordinates: { lat: 20.49229, lng: 44.8153247 } }, { strict: true });
  assert.ok(swapped.errors.some((e) => e.includes("van Srbije")));
  const postal = checkEntry({ ...entry, address: "Mije Kovačevića 10, 11000" }, { strict: true });
  assert.ok(postal.errors.some((e) => e.includes("poštanski")));
  const sg = await loadDealers(path.join(REPO_ROOT, SITES["sg-tools"]));
  const differs = checkSites({ dck, "sg-tools": sg.map((d, i) => (i === 0 ? { ...d, phone: "000/000-000" } : d)) });
  assert.ok(differs.errors.some((e) => e.includes("razlikuje")));
});

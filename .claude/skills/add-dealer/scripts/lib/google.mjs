// Searches google.com/maps for the dealer by name and address and reads the place's
// coordinates from the page URL (`!3d<lat>!4d<lng>`), exactly as a person would copy them.
// One search per dealer, results cached for a day. No API key.
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { launchBrowser } from "./browser.mjs";
import { coordsFromLink, round7 } from "./geo.mjs";
import { toLatin } from "./text.mjs";
import { WORK_DIR } from "./paths.mjs";

const GENERIC = new Set([
  "doo", "pr", "szr", "str", "stur", "alati", "alat", "oprema", "gvozdjara", "gvozdara", "prodavnica",
  "servis", "centar", "group", "shop", "beograd", "trgovina", "radnja",
]);
const tokens = (s) =>
  toLatin(s)
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter(Boolean);

// Whole-word match, stricter than the OSM one: "Triar" must not match "TRIARVET veterinarska
// ambulanta", while "Sualati 024" matches "SU alati" and "Elektro 025" matches "Elektro025".
export function googleNameMatches(dealerName, placeName) {
  const a = tokens(dealerName);
  const b = tokens(placeName);
  if (!a.length || !b.length) return false;
  if (b.includes(a.join("")) || a.includes(b.join("")) || a.join("") === b.join("")) return true;
  const distinctive = a.filter((w) => w.length >= 2 && !GENERIC.has(w) && w !== "i");
  // A name made only of generic words ("Alati i Oprema") must match in full, or "Super alati" would.
  if (!distinctive.length) return a.filter((w) => w !== "i").every((w) => b.includes(w));
  return distinctive.some((w) => b.includes(w));
}

// Google puts icon glyphs (private-use characters) and line breaks into visible labels.
const tidy = (s) => String(s ?? "").replace(/[\uE000-\uF8FF]/g, "").replace(/\s+/g, " ").trim();

async function search(page, query) {
  await page.goto(`https://www.google.com/maps/search/${encodeURIComponent(query)}?hl=sr`, { waitUntil: "domcontentloaded", timeout: 30000 });
  if (/consent\.google\./.test(page.url())) {
    const accept = page.getByRole("button", { name: /Accept all|Prihvati sve|Прихвати све/i }).first();
    if (await accept.count()) {
      await accept.click();
      await page.waitForURL(/\/maps\//, { timeout: 15000 }).catch(() => {});
    }
  }
  let kind = "none";
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    if (/!3d-?\d/.test(page.url())) {
      kind = "place";
      break;
    }
    if (await page.locator('div[role="feed"] a[href*="/maps/place/"]').count()) {
      kind = "list";
      break;
    }
  }
  const results = [];
  if (kind === "place") {
    await page.waitForTimeout(800);
    const c = coordsFromLink(page.url());
    const name = (await page.locator("h1").allInnerTexts().catch(() => [])).map(tidy).filter(Boolean).join(" | ");
    const address = tidy(await page.locator('button[data-item-id="address"]').first().innerText({ timeout: 1500 }).catch(() => ""));
    results.push({ name, address, lat: c ? round7(c.lat) : null, lng: c ? round7(c.lng) : null });
  } else if (kind === "list") {
    const links = page.locator('div[role="feed"] a[href*="/maps/place/"]');
    const n = Math.min(await links.count(), 5);
    for (let i = 0; i < n; i++) {
      const c = coordsFromLink(await links.nth(i).getAttribute("href"));
      results.push({ name: tidy(await links.nth(i).getAttribute("aria-label")), address: "", lat: c ? round7(c.lat) : null, lng: c ? round7(c.lng) : null });
    }
  }
  return { kind, results };
}

// Opens any Google Maps link (also short maps.app.goo.gl links) and returns the place coordinates.
export async function resolveGoogleLink(link, { install = false } = {}) {
  const { browser } = await launchBrowser({ install });
  try {
    const page = await (await browser.newContext({ locale: "sr-RS" })).newPage();
    await page.goto(link, { waitUntil: "domcontentloaded", timeout: 30000 });
    for (let i = 0; i < 30 && !/!3d-?\d/.test(page.url()); i++) await page.waitForTimeout(500);
    return coordsFromLink(page.url());
  } finally {
    await browser.close();
  }
}

export async function googleLookup(input, { install = false } = {}) {
  const query = `${input.name}, ${[input.street, input.numberRaw].filter(Boolean).join(" ")}, ${input.place}`;
  const cacheDir = path.join(WORK_DIR, "cache");
  const cacheFile = path.join(cacheDir, `google-${createHash("sha1").update(query).digest("hex")}.json`);
  let found;
  try {
    if (Date.now() - fs.statSync(cacheFile).mtimeMs < 864e5) found = JSON.parse(fs.readFileSync(cacheFile, "utf8"));
  } catch {}
  let used = "cache";
  if (!found) {
    const launched = await launchBrowser({ install });
    used = launched.used;
    try {
      // Headless browsers announce themselves in the User-Agent; look like the normal browser.
      const probe = await launched.browser.newPage();
      const userAgent = (await probe.evaluate(() => navigator.userAgent)).replace("Headless", "");
      await probe.close();
      const context = await launched.browser.newContext({ locale: "sr-RS", userAgent, viewport: { width: 1280, height: 900 } });
      found = await search(await context.newPage(), query);
    } finally {
      await launched.browser.close();
    }
    fs.mkdirSync(cacheDir, { recursive: true });
    fs.writeFileSync(cacheFile, JSON.stringify(found));
  }
  const match = found.results.find((r) => r.lat !== null && googleNameMatches(input.name, r.name)) ?? null;
  return { query, browser: used, kind: found.kind, results: found.results, match };
}

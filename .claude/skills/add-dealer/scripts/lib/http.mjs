// Polite HTTP for the free OSM services: identifying User-Agent, one request per second per
// host (kept across script runs), and a disk cache so repeated runs cost nothing.
// Nominatim usage policy: https://operations.osmfoundation.org/policies/nominatim/
// Tile usage policy:      https://operations.osmfoundation.org/policies/tiles/
import fs from "node:fs";
import path from "node:path";
import { createHash } from "node:crypto";
import { WORK_DIR } from "./paths.mjs";

export const USER_AGENT = "StridonAddDealerSkill/1.0 (dealer map of dcksrbija.rs and sgtools.rs)";

const GAP_MS = {
  "nominatim.openstreetmap.org": 1100,
  "photon.komoot.io": 1100,
  "tile.openstreetmap.org": 200,
};
// Tiles: the tile policy asks clients to cache for at least 7 days. Search results: one
// day, so a shop someone has just mapped in OSM shows up on the next run.
const CACHE_DAYS = { tile: 7, search: 1 };

export const requestCount = {};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function waitForSlot(host) {
  const stamp = path.join(WORK_DIR, "cache", `last-${host}`);
  let last = 0;
  try {
    last = Number(fs.readFileSync(stamp, "utf8")) || 0;
  } catch {}
  const wait = last + (GAP_MS[host] ?? 1100) - Date.now();
  if (wait > 0) await sleep(wait);
  fs.writeFileSync(stamp, String(Date.now()));
}

async function request(url, { binary = false } = {}) {
  const u = new URL(url);
  const dir = path.join(WORK_DIR, "cache");
  fs.mkdirSync(dir, { recursive: true });
  const file = path.join(dir, createHash("sha1").update(url).digest("hex") + (binary ? ".bin" : ".json"));
  try {
    if (Date.now() - fs.statSync(file).mtimeMs < (binary ? CACHE_DAYS.tile : CACHE_DAYS.search) * 864e5) {
      return binary ? fs.readFileSync(file) : JSON.parse(fs.readFileSync(file, "utf8"));
    }
  } catch {}

  await waitForSlot(u.hostname);
  requestCount[u.hostname] = (requestCount[u.hostname] ?? 0) + 1;
  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, "Accept-Language": "sr-Latn,sr,en" },
    signal: AbortSignal.timeout(20000),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${u.hostname}${u.pathname}`);
  const body = binary ? Buffer.from(await res.arrayBuffer()) : await res.json();
  fs.writeFileSync(file, binary ? body : JSON.stringify(body));
  return body;
}

export const getJson = (url) => request(url);
export const getBinary = (url) => request(url, { binary: true });

export function query(base, params) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  return `${base}?${qs}`;
}

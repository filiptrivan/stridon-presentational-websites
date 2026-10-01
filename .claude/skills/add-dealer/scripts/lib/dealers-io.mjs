// Reads the dealer arrays exactly as the sites do (Node type stripping imports the .ts
// files) and writes new entries as text at a fixed anchor, keeping the file's line endings.
import fs from "node:fs";
import path from "node:path";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import { inSerbia, distanceM } from "./geo.mjs";

// Importing the apps' .ts files makes Node warn about type stripping and about app
// package.json files without "type": "module". Both are expected here; keep output clean.
const emitWarning = process.emitWarning;
process.emitWarning = (warning, ...rest) => {
  if (/type stripping|Module type of .* is not specified/is.test(String(warning?.message ?? warning))) return;
  return emitWarning.call(process, warning, ...rest);
};

let hooksRegistered = false;
function allowExtensionlessTsImports() {
  if (hooksRegistered) return;
  hooksRegistered = true;
  // dck/constants/dealers.ts imports "./service-centers" without an extension (bundler style).
  registerHooks({
    resolve(specifier, context, nextResolve) {
      try {
        return nextResolve(specifier, context);
      } catch (err) {
        if (/^\.\.?\//.test(specifier) && !path.extname(specifier)) return nextResolve(`${specifier}.ts`, context);
        throw err;
      }
    },
  });
}

export async function loadDealers(file) {
  allowExtensionlessTsImports();
  const url = `${pathToFileURL(path.resolve(file)).href}?v=${Date.now()}-${Math.random()}`;
  const mod = await import(url);
  if (!Array.isArray(mod.DEALERS)) throw new Error(`${file} has no exported DEALERS array`);
  return mod.DEALERS;
}

export function readText(file) {
  const text = fs.readFileSync(file, "utf8");
  return { text, eol: text.includes("\r\n") ? "\r\n" : "\n" };
}

// Same key order as every existing entry; empty fields are left out.
export const FIELD_ORDER = ["id", "name", "address", "city", "phone", "email", "website", "logoSrc", "category"];

export function renderEntry(entry, eol) {
  const lines = ["  {"];
  for (const comment of entry.comments ?? []) lines.push(`    // ${comment}`);
  for (const key of FIELD_ORDER) {
    if (entry[key] !== undefined && entry[key] !== null && entry[key] !== "") lines.push(`    ${key}: ${JSON.stringify(entry[key])},`);
  }
  lines.push(`    coordinates: { lat: ${entry.coordinates.lat}, lng: ${entry.coordinates.lng} },`);
  lines.push("  },");
  return lines.map((l) => l + eol).join("");
}

// position "dealers": end of the physical-shop block (before `...SERVICE_DEALERS` on dck,
// before the closing `];` otherwise). position "online": right after the last online entry.
export function insertEntry(text, eol, entry, position, dealers) {
  const lines = text.split(eol);
  const start = lines.findIndex((l) => /^export const DEALERS\b/.test(l));
  if (start < 0) throw new Error("export const DEALERS not found");
  const end = lines.findIndex((l, i) => i > start && l.trim() === "];");
  if (end < 0) throw new Error("end of the DEALERS array not found");

  let at;
  if (position === "online") {
    const lastOnline = [...dealers].reverse().find((d) => d.category === "online");
    if (!lastOnline) throw new Error("no online entry to insert after");
    const idLine = lines.findIndex((l, i) => i > start && i < end && l.trim() === `id: ${JSON.stringify(lastOnline.id)},`);
    const close = lines.findIndex((l, i) => i > idLine && l === "  },");
    if (idLine < 0 || close < 0 || close > end) throw new Error(`entry ${lastOnline.id} not found as text`);
    at = close + 1;
  } else {
    const spread = lines.findIndex((l, i) => i > start && i < end && /^\s*\.\.\.\w+,\s*$/.test(l));
    at = spread >= 0 ? spread : end;
  }
  const block = renderEntry(entry, eol).slice(0, -eol.length).split(eol);
  lines.splice(at, 0, ...block);
  return lines.join(eol);
}

const firstSix = (dealers) => dealers.filter((d) => d.category !== "service").slice(0, 6).map((d) => d.id);

export function simulateInsert(dealers, entry, position) {
  const next = [...dealers];
  if (position === "online") {
    const idx = next.map((d) => d.category).lastIndexOf("online");
    next.splice(idx + 1, 0, entry);
  } else {
    const firstService = next.findIndex((d) => d.category === "service");
    next.splice(firstService >= 0 ? firstService : next.length, 0, entry);
  }
  return { next, top6Before: firstSix(dealers), top6After: firstSix(next) };
}

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CATEGORIES = new Set(["online", "dealer", "service"]);
const PHONE_RE = /^0\d{1,2}\/\d{3,4}-\d{3,4}$/;

// Rules for a single entry. `strict` is used for the entry being added.
export function checkEntry(d, { strict = false } = {}) {
  const errors = [];
  const warnings = [];
  if (!ID_RE.test(d.id ?? "")) errors.push(`id "${d.id}" nije kebab-case ASCII`);
  if (!d.name) errors.push(`${d.id}: nema name`);
  if (!CATEGORIES.has(d.category)) errors.push(`${d.id}: kategorija "${d.category}" ne postoji`);
  const { lat, lng } = d.coordinates ?? {};
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) errors.push(`${d.id}: koordinate nisu brojevi`);
  else if (!inSerbia(lat, lng)) errors.push(`${d.id}: koordinate ${lat}, ${lng} su van Srbije (zamenjeni lat i lng?)`);
  for (const key of FIELD_ORDER) {
    if (typeof d[key] === "string" && /[<>\n]/.test(d[key])) errors.push(`${d.id}: ${key} sadrži <, > ili novi red`);
  }
  // Service centres come from service-centers.ts, which has its own address and phone style.
  if (d.category === "service") return { errors, warnings };
  const list = strict ? errors : warnings;
  if (d.address && /\b\d{5}\b/.test(d.address)) list.push(`${d.id}: address sadrži poštanski broj; on ne ide u adresu`);
  if (d.website && !/^https:\/\/[^/]+\/.*$/.test(d.website)) list.push(`${d.id}: website treba da počinje sa https:// i ima / posle domena`);
  if (d.phone && !PHONE_RE.test(d.phone)) warnings.push(`${d.id}: telefon "${d.phone}" nije u obliku 0XX/XXX-XXXX`);
  if (strict && d.category === "dealer" && !d.address) errors.push(`${d.id}: radnja mora imati adresu`);
  return { errors, warnings };
}

// Whole-site rules. `bySite` is { dck: Dealer[], "sg-tools": Dealer[] }.
export function checkSites(bySite) {
  const errors = [];
  const warnings = [];
  for (const [site, dealers] of Object.entries(bySite)) {
    const seen = new Set();
    for (const d of dealers) {
      // A duplicate id makes dealer-map.tsx skip the second marker without any error.
      if (seen.has(d.id)) errors.push(`${site}: id "${d.id}" se ponavlja`);
      seen.add(d.id);
      const r = checkEntry(d);
      errors.push(...r.errors.map((e) => `${site}: ${e}`));
      warnings.push(...r.warnings.map((w) => `${site}: ${w}`));
    }
  }
  // The same dealer must look the same on both sites; only logos differ (SG uses -neutral recolors).
  const [a, b] = Object.values(bySite);
  if (a && b) {
    const other = new Map(b.map((d) => [d.id, d]));
    for (const d of a) {
      const o = other.get(d.id);
      if (!o) continue;
      for (const key of FIELD_ORDER.filter((k) => k !== "logoSrc")) {
        if ((d[key] ?? "") !== (o[key] ?? "")) errors.push(`${d.id}: ${key} se razlikuje između sajtova ("${d[key] ?? ""}" / "${o[key] ?? ""}")`);
      }
      if (distanceM(d.coordinates, o.coordinates) > 0) errors.push(`${d.id}: koordinate se razlikuju između sajtova`);
    }
  }
  return { errors, warnings };
}

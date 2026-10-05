// The two dealer lists read as plain text (one reader for the skill and the dealer-change check),
// writing one entry at a fixed anchor with the file's own line endings, the data rules, and the
// "expected change" rule.
import { SITES } from "./common.mjs";
import { inSerbia } from "./geo.mjs";

// Same key order as every existing entry; empty fields are left out.
export const FIELD_ORDER = ["id", "name", "address", "city", "phone", "email", "website", "logoSrc", "category"];

// The DEALERS array read as plain text, without running anything. Only the shapes the files
// use are accepted (one `key: "string",` per line, the one-line coordinates, `// comments`,
// `...SPREAD,`); anything else is an error, so an unusual edit is never mistaken for a routine one.
// Returns { items, errors, text, eol }: items are entries ({ id, ..., comments }) and spreads ({ spread }).
export function parseDealers(text) {
  const eol = text.includes("\r\n") ? "\r\n" : "\n";
  const lines = text.split(/\r?\n/);
  const start = lines.findIndex((l) => /^export const DEALERS\b.*=\s*\[\s*$/.test(l));
  if (start < 0) return { items: [], errors: ["`export const DEALERS ... = [` nije nađen"], text, eol };
  const items = [];
  const errors = [];
  const bad = (i, t) => errors.push(`red ${i + 1}: neočekivan oblik „${t}“`);
  let cur = null;
  for (let i = start + 1; i < lines.length; i++) {
    const t = lines[i].trim();
    if (!cur) {
      if (t === "];") return { items, errors, text, eol };
      if (t === "{") cur = { comments: [] };
      else if (/^\.\.\.\w+,$/.test(t)) items.push({ spread: t.slice(3, -1) });
      else if (t && !t.startsWith("//")) bad(i, t);
      continue;
    }
    if (t === "},") {
      items.push(cur);
      cur = null;
      continue;
    }
    if (t.startsWith("//")) {
      cur.comments.push(t.replace(/^\/\/\s?/, ""));
      continue;
    }
    const field = t.match(/^(\w+): ("(?:[^"\\]|\\.)*"),$/);
    const coords = t.match(/^coordinates: \{ lat: (-?\d+(?:\.\d+)?), lng: (-?\d+(?:\.\d+)?) \},$/);
    let value;
    try {
      value = field ? JSON.parse(field[2]) : undefined; // JS-only escapes such as \' are rejected
    } catch {}
    if (field && value !== undefined && FIELD_ORDER.includes(field[1]) && !(field[1] in cur)) cur[field[1]] = value;
    else if (coords && !cur.coordinates) cur.coordinates = { lat: Number(coords[1]), lng: Number(coords[2]) };
    else bad(i, t);
  }
  errors.push("kraj niza DEALERS (`];`) nije nađen");
  return { items, errors, text, eol };
}

export const entriesOf = (parsed) => parsed.items.filter((d) => !d.spread);

function renderEntry(entry, eol) {
  const lines = ["  {"];
  for (const comment of entry.comments ?? []) lines.push(`    // ${comment}`);
  for (const key of FIELD_ORDER) {
    if (entry[key] !== undefined && entry[key] !== null && entry[key] !== "") lines.push(`    ${key}: ${JSON.stringify(entry[key])},`);
  }
  lines.push(`    coordinates: { lat: ${entry.coordinates.lat}, lng: ${entry.coordinates.lng} },`);
  lines.push("  },");
  return lines.map((l) => l + eol).join("");
}

function arrayBounds(lines) {
  const start = lines.findIndex((l) => /^export const DEALERS\b/.test(l));
  if (start < 0) throw new Error("export const DEALERS not found");
  const end = lines.findIndex((l, i) => i > start && l.trim() === "];");
  if (end < 0) throw new Error("end of the DEALERS array not found");
  return { start, end };
}

function blockOf(lines, id, start, end) {
  const idLine = lines.findIndex((l, i) => i > start && i < end && l.trim() === `id: ${JSON.stringify(id)},`);
  if (idLine < 0) throw new Error(`entry ${id} not found as text`);
  let open = idLine;
  while (open > start && lines[open] !== "  {") open--;
  const close = lines.findIndex((l, i) => i > idLine && l === "  },");
  if (open <= start || close < 0 || close > end) throw new Error(`entry ${id} is not a plain block`);
  return { open, close };
}

// Every new dealer, online or a shop, goes at the end of the list: before `...SERVICE_DEALERS`
// on dck, before the closing `];` otherwise.
export function insertEntry(text, eol, entry) {
  const lines = text.split(eol);
  const { start, end } = arrayBounds(lines);
  const spread = lines.findIndex((l, i) => i > start && i < end && /^\s*\.\.\.\w+,\s*$/.test(l));
  lines.splice(spread >= 0 ? spread : end, 0, ...renderEntry(entry, eol).slice(0, -eol.length).split(eol));
  return lines.join(eol);
}

// Rewrites one existing block in place (move mode); its comments travel in `entry.comments`.
export function replaceEntry(text, eol, entry) {
  const lines = text.split(eol);
  const { start, end } = arrayBounds(lines);
  const { open, close } = blockOf(lines, entry.id, start, end);
  lines.splice(open, close - open + 1, ...renderEntry(entry, eol).slice(0, -eol.length).split(eol));
  return lines.join(eol);
}

// Takes one existing block out (remove mode), comments inside it included.
export function removeEntry(text, eol, id) {
  const lines = text.split(eol);
  const { start, end } = arrayBounds(lines);
  const { open, close } = blockOf(lines, id, start, end);
  lines.splice(open, close - open + 1);
  return lines.join(eol);
}

const ID_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const CATEGORIES = new Set(["online", "dealer", "service"]);
const PHONE_RE = /^0\d{1,2}\/\d{3,4}-\d{3,4}$/;

// Rules for a single entry. Every entry in the files must pass the first block; the entry being
// added or moved (`strict`) also the format rules below it.
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
  if (!strict || d.category === "service") return { errors, warnings };
  if (d.address && /\b\d{5}\b/.test(d.address)) errors.push(`${d.id}: address sadrži poštanski broj; on ne ide u adresu`);
  if (d.website && !/^https:\/\/[^/]+\/.*$/.test(d.website)) errors.push(`${d.id}: website treba da počinje sa https:// i ima / posle domena`);
  if (d.category === "dealer" && !d.address) errors.push(`${d.id}: radnja mora imati adresu`);
  if (d.phone && !PHONE_RE.test(d.phone)) warnings.push(`${d.id}: telefon "${d.phone}" nije u obliku 0XX/XXX-XXXX`);
  return { errors, warnings };
}

// Whole-site rules. `bySite` is { dck: Dealer[], "sg-tools": Dealer[] }. `mismatches` (the same
// dealer differing between the sites) are kept apart: they are a decision for Filip, not a
// broken file.
function checkSites(bySite) {
  const errors = [];
  const mismatches = [];
  for (const [site, dealers] of Object.entries(bySite)) {
    const seen = new Set();
    for (const d of dealers) {
      // A duplicate id makes dealer-map.tsx skip the second marker without any error.
      if (seen.has(d.id)) errors.push(`${site}: id "${d.id}" se ponavlja`);
      seen.add(d.id);
      errors.push(...checkEntry(d).errors.map((e) => `${site}: ${e}`));
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
        if ((d[key] ?? "") !== (o[key] ?? "")) mismatches.push(`${d.id}: ${key} se razlikuje između sajtova ("${d[key] ?? ""}" / "${o[key] ?? ""}")`);
      }
      if (d.coordinates?.lat !== o.coordinates?.lat || d.coordinates?.lng !== o.coordinates?.lng) {
        mismatches.push(`${d.id}: koordinate se razlikuju između sajtova`);
      }
    }
  }
  return { errors, mismatches };
}

// Ids of the dck service centres (service-centers.ts): `...SERVICE_DEALERS` puts them into the
// same marker map, so a dealer may not reuse one (dealer-map.tsx keeps the first marker per id).
export const serviceIds = (text) => [...String(text ?? "").matchAll(/^\s*id:\s*"([^"]+)",\s*$/gm)].map((m) => m[1]);

const DATA_KEYS = [...FIELD_ORDER, "coordinates", "comments"];
const changedKeys = (a, b) =>
  DATA_KEYS.filter((k) => JSON.stringify(a[k] ?? (k === "comments" ? [] : null)) !== JSON.stringify(b[k] ?? (k === "comments" ? [] : null)));
const MOVABLE = new Set(["address", "city", "coordinates"]);

/**
 * The one place that says what an "expected" dealer change is, the kind that merges with no human
 * review (Filip's decisions on PR #20, reference.md); SKILL.md, reference.md, dealer-change.yml
 * and CODEOWNERS point here. Expected means all of:
 * - exactly one dealer added at the end of the list, one existing dealer's address, city and
 *   coordinates changed and nothing else of it, or one dealer removed;
 * - on one site, or the same on both; a dealer listed on both sites moves on both and is removed
 *   from both;
 * - category `dealer` or `online` (a service centre is Filip's), and an added or moved entry passes
 *   the format rules of `checkEntry` with `strict` (no postal code in the address, an https
 *   website, an address for a shop);
 * - every dealer listed on both sites the same on both, across the whole list;
 * - the first 6 dealers on product pages unchanged, and no logo or comment on a new entry;
 * - each file otherwise byte for byte the same.
 * Any other dealer change waits for @filiptrivan.
 *
 * `base` and `head` map site -> parseDealers() result (or null for a missing file);
 * `changedFiles` are all files the PR changes, repo-relative with forward slashes;
 * `reservedIds` maps site -> ids already used outside the list (dck service centres).
 * kind: none | mixed | expected | owner | invalid. `ok` says whether the check passes: `none`
 * and `mixed` pass (CODEOWNERS makes Filip review a mixed PR), `owner` passes after Filip
 * approves, `invalid` (a file that cannot be read, a duplicate id, a pin outside Serbia) only
 * with his bypass.
 */
export function classifyChange(base, head, changedFiles, reservedIds = {}) {
  const touched = Object.keys(SITES).filter((s) => changedFiles.includes(SITES[s]));
  if (!touched.length) return { kind: "none", ok: true, reasons: ["PR ne menja spisak dilera."] };

  const errors = [];
  for (const site of Object.keys(SITES)) {
    if (!head[site]) errors.push(`${site}: fajl dilera ne postoji`);
    else errors.push(...head[site].errors.map((e) => `${site}: ${e}`));
    if (touched.includes(site) && base[site]?.errors.length) errors.push(`${site} (pre izmene): ${base[site].errors.join("; ")}`);
  }
  if (errors.length) return { kind: "invalid", ok: false, errors };
  const whole = checkSites(Object.fromEntries(Object.keys(SITES).map((s) => [s, entriesOf(head[s])])));
  const taken = Object.entries(reservedIds).flatMap(([s, ids]) =>
    entriesOf(head[s]).filter((x) => ids.includes(x.id)).map((x) => `${s}: id "${x.id}" već koristi ovlašćeni servis`),
  );
  if (whole.errors.length || taken.length) return { kind: "invalid", ok: false, errors: [...whole.errors, ...taken] };

  if (changedFiles.some((f) => !Object.values(SITES).includes(f))) {
    return { kind: "mixed", ok: true, reasons: ["PR menja i druge fajlove osim dilera; njih pregleda @filiptrivan (CODEOWNERS).", ...whole.mismatches] };
  }

  const why = [...whole.mismatches];
  const deltas = {};
  for (const site of touched) {
    const before = new Map(entriesOf(base[site]).map((d) => [d.id, d]));
    const after = new Map(entriesOf(head[site]).map((d) => [d.id, d]));
    deltas[site] = {
      added: [...after.keys()].filter((id) => !before.has(id)),
      removed: [...before.keys()].filter((id) => !after.has(id)),
      changed: [...after.keys()].filter((id) => before.has(id)).map((id) => ({ id, keys: changedKeys(before.get(id), after.get(id)) })).filter((c) => c.keys.length),
      before,
      after,
    };
  }
  const d = Object.values(deltas);
  const isAdd = d.every((x) => x.added.length === 1 && !x.removed.length && !x.changed.length);
  const isMove = d.every((x) => !x.added.length && !x.removed.length && x.changed.length === 1);
  const isRemove = d.every((x) => !x.added.length && x.removed.length === 1 && !x.changed.length);
  const ids = new Set(d.map((x) => (isAdd ? x.added[0] : isRemove ? x.removed[0] : x.changed[0]?.id)));
  let entry = null;
  if (!isAdd && !isMove && !isRemove) why.push("nije tačno jedan dodat, pomeren ili uklonjen diler (dodato, obrisano ili menjano je više stavki)");
  else if (ids.size !== 1) why.push("na dva sajta su izmenjeni različiti dileri");
  else {
    const id = [...ids][0];
    const versions = d.map((x) => (isRemove ? x.before : x.after).get(id));
    entry = versions[0];
    if (entry.category === "service") why.push(`${id} je ovlašćeni servis; servise menja Filip`);
    if (isAdd) {
      if (versions.some((v) => v.logoSrc || v.comments.length)) why.push(`novi diler ${id} ima logo ili komentar`);
    } else if (isRemove) {
      // checkSites compares only dealers still on both sites, so a removal from one of two is caught here.
      const untouched = Object.keys(SITES).filter((s) => !touched.includes(s));
      if (untouched.some((s) => entriesOf(head[s]).some((x) => x.id === id))) why.push(`${id} ostaje na drugom sajtu; diler se uklanja sa svih sajtova na kojima je`);
    } else {
      const keys = new Set(d.flatMap((x) => x.changed[0].keys));
      const extra = [...keys].filter((k) => !MOVABLE.has(k));
      if (extra.length) why.push(`kod dilera ${id} menja se i ${extra.join(", ")}, a pomeranje sme da menja samo adresu, mesto i koordinate`);
      // A dealer listed on both sites but moved on one shows up above as a cross-site mismatch.
    }
    // The first 6 dealers on product pages never change through the skill (a new one goes at the
    // end), so this catches moving one of them or a reorder.
    for (const site of touched) {
      const six = (p) => JSON.stringify(entriesOf(p).filter((x) => x.category !== "service").slice(0, 6));
      if (six(base[site]) !== six(head[site])) why.push(`${site}: menja se neki od prvih 6 dilera na stranici proizvoda`);
    }
    // "Nothing else", byte for byte: the PR's file must equal the base file with exactly this one
    // block written by this skill's own writer (end of the list for an add, in place for a move,
    // taken out for a remove). Catches edits outside the array, reordering, comments, formatting
    // and line endings.
    if (!why.length) {
      for (const site of touched) {
        const { text, eol } = base[site];
        const own = d[touched.indexOf(site)].after.get(id);
        const want = isAdd ? insertEntry(text, eol, own) : isRemove ? removeEntry(text, eol, id) : replaceEntry(text, eol, own);
        if (want !== head[site].text) why.push(`${site}: osim jednog dilera menja se još nešto u fajlu (redosled, komentari, razmaci ili drugi kod)`);
      }
    }
    // An entry that is going away need not meet the format rules.
    if (!isRemove) why.push(...checkEntry(entry, { strict: true }).errors);
  }

  if (why.length) return { kind: "owner", ok: false, reasons: why };
  const where = isRemove
    ? (touched.length === 2 ? "sa oba sajta" : `sa sajta ${touched[0]}`)
    : (touched.length === 2 ? "na oba sajta, isto na oba" : `na sajtu ${touched[0]}`);
  return {
    kind: "expected",
    ok: true,
    reasons: [`${isAdd ? "Dodat" : isRemove ? "Uklonjen" : "Pomeren"} je jedan diler (${entry.id}) ${where}.`],
  };
}

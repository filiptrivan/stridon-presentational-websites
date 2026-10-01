// Serbian text helpers: script conversion, comparison keys, house numbers, ids.

const CYR_TO_LAT = {
  а: "a", б: "b", в: "v", г: "g", д: "d", ђ: "đ", е: "e", ж: "ž", з: "z", и: "i",
  ј: "j", к: "k", л: "l", љ: "lj", м: "m", н: "n", њ: "nj", о: "o", п: "p", р: "r",
  с: "s", т: "t", ћ: "ć", у: "u", ф: "f", х: "h", ц: "c", ч: "č", џ: "dž", ш: "š",
};

const LAT_TO_CYR = Object.fromEntries(Object.entries(CYR_TO_LAT).map(([c, l]) => [l, c]));

function withCase(source, target) {
  return source === source.toLowerCase() ? target : target[0].toUpperCase() + target.slice(1);
}

export function toLatin(s) {
  return [...String(s ?? "")]
    .map((ch) => {
      const lat = CYR_TO_LAT[ch.toLowerCase()];
      return lat ? withCase(ch, lat) : ch;
    })
    .join("");
}

// Photon matches Serbian street names far better in Cyrillic (OSM Serbia stores them that way).
export function toCyrillic(s) {
  const str = String(s ?? "");
  let out = "";
  for (let i = 0; i < str.length; i++) {
    const pair = str.slice(i, i + 2);
    const cyrPair = LAT_TO_CYR[pair.toLowerCase()];
    if (pair.length === 2 && cyrPair) {
      out += withCase(pair[0], cyrPair);
      i++;
      continue;
    }
    const cyr = LAT_TO_CYR[str[i].toLowerCase()];
    out += cyr ? withCase(str[i], cyr) : str[i];
  }
  return out;
}

// Comparison key: Latin, lowercase, no diacritics, letters and digits only.
// "Đ" becomes "dj" so "Đure" and "Djure" compare equal.
export function simple(s) {
  return toLatin(s)
    .toLowerCase()
    .replace(/đ/g, "dj")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function levenshtein(a, b) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0];
    prev[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j];
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1));
      diag = tmp;
    }
  }
  return prev[b.length];
}

const STREET_PREFIX = /^(ulica|ul\.?)\s+/i;

// 0..1. Tolerates spelling variants such as "Mihajla" / "Mihaila".
export function similarity(a, b) {
  const x = simple(String(a ?? "").replace(STREET_PREFIX, ""));
  const y = simple(String(b ?? "").replace(STREET_PREFIX, ""));
  if (!x || !y) return 0;
  if (x === y) return 1;
  return 1 - levenshtein(x, y) / Math.max(x.length, y.length);
}

// "10-A", "10 a", "10А" -> "10a"; "bb" or empty -> null (no house number).
export function normalizeHouseNumber(raw) {
  const s = toLatin(String(raw ?? ""))
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/^(br\.?|broj)/, "");
  if (!s || /^b\.?b\.?$/.test(s) || s === "bezbroja") return null;
  return s.replace(/^(\d+)[-.]?([a-zčćšžđ])$/, "$1$2");
}

// Same shape as existing ids: "Gvožđara 021 Plus" -> "gvozdara-021-plus", "Fish & Food" -> "fish-and-food".
export function slugify(name) {
  return toLatin(name)
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/đ/g, "d")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Generic words that say nothing about which company a map object belongs to.
const GENERIC_NAME_WORDS = new Set([
  "doo", "d", "o", "pr", "szr", "str", "stur", "alati", "alat", "oprema", "i", "gvozdjara", "gvozdara",
  "prodavnica", "servis", "centar", "group", "shop", "beograd", "trgovina", "radnja",
]);

export function nameMatches(dealerName, objectName) {
  const other = simple(objectName);
  if (!other) return false;
  const full = simple(dealerName);
  if (other.includes(full) || full.includes(other)) return true;
  return String(dealerName)
    .split(/[\s&.,\-"„“]+/)
    .map(simple)
    .filter((w) => w.length >= 3 && !GENERIC_NAME_WORDS.has(w))
    .some((w) => other.includes(w));
}

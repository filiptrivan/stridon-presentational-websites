// Distances, the Serbia bounding box, and reading a pin out of the link the requester sends.

// Serbia with a small margin: catches swapped lat/lng and hits in another country.
const SERBIA = { minLat: 42.2, maxLat: 46.2, minLng: 18.8, maxLng: 23.05 };

export function inSerbia(lat, lng) {
  return lat >= SERBIA.minLat && lat <= SERBIA.maxLat && lng >= SERBIA.minLng && lng <= SERBIA.maxLng;
}

export function distanceM(a, b) {
  const R = 6371008.8;
  const r = Math.PI / 180;
  const x =
    Math.sin(((b.lat - a.lat) * r) / 2) ** 2 +
    Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lng - a.lng) * r) / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(x)));
}

// Shortest distance from a point to a polyline of [lng, lat] pairs (GeoJSON order). A local flat
// projection is exact enough at street scale.
export function distanceToLineM(point, coords) {
  const k = Math.cos((point.lat * Math.PI) / 180);
  const toXY = ([lng, lat]) => [(lng - point.lng) * k * 111320, (lat - point.lat) * 111320];
  let best = Infinity;
  for (let i = 0; i + 1 < coords.length; i++) {
    const [ax, ay] = toXY(coords[i]);
    const [bx, by] = toXY(coords[i + 1]);
    const dx = bx - ax;
    const dy = by - ay;
    const t = dx || dy ? Math.max(0, Math.min(1, -(ax * dx + ay * dy) / (dx * dx + dy * dy))) : 0;
    best = Math.min(best, Math.hypot(ax + t * dx, ay + t * dy));
  }
  return Math.round(best);
}

// Nominatim returns 7 decimals (about 1 cm); existing entries use 6 to 7.
export function round7(n) {
  return Math.round(Number(n) * 1e7) / 1e7;
}

export function mapLinks({ lat, lng }) {
  return {
    osm: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=19/${lat}/${lng}`,
    google: `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
  };
}

// Coordinates written in a map URL. Google `!3d!4d` is the place itself; `@lat,lng` is only
// where the map was centred (65 km away from the pin in one tested link), so it never counts as a
// pin. OSM `mlat/mlon` is a marker. A directions link has several places and is refused.
function coordsFromUrl(raw) {
  let url = String(raw);
  try {
    url = decodeURIComponent(url);
  } catch {}
  if (/\/maps\/dir\//.test(url) || (url.match(/!3d-?\d/g) ?? []).length > 1) return { error: "directions" };
  const patterns = [
    /!3d(-?\d{1,2}\.\d+)!4d(-?\d{1,3}\.\d+)/,
    /[?&]mlat=(-?\d+\.\d+)&mlon=(-?\d+\.\d+)/,
    /\/maps\/search\/(-?\d{1,2}\.\d+),\s*\+?(-?\d{1,3}\.\d+)/,
    // `ll=` is the map centre, like `@lat,lng`, so only `q` and `query` count.
    /[?&](?:q|query)=(-?\d{1,2}\.\d+),\s*\+?(-?\d{1,3}\.\d+)/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return { lat: round7(m[1]), lng: round7(m[2]) };
  }
  return null;
}

// Hosts that only redirect to a full Google Maps URL. Only the Location header is read, never
// the page, so this is following a link, not scraping (owner's decision 2026-10-01: no Google
// scraping, no browser). Tested 2026-10-02 on 12 public maps.app.goo.gl links: every one answers
// 302 without a browser, but only links shared from a computer carry the place's `!3d!4d`; links
// shared from the phone app (`g_st=`, `entry=gps`) carry only a place id, so the requester is
// asked for the coordinates instead. `share.google` answers with an HTML page and is unusable.
const SHORT_HOSTS = /^(maps\.app\.goo\.gl|goo\.gl)$/i;

// The pin from what the requester pasted: "lat, lng", an OSM link, a Google Maps place link or a
// short Google link. Returns { lat, lng, resolved } or { error } with the reason.
export async function pinFromLink(raw) {
  const text = String(raw ?? "").trim();
  // Coordinates as Google Maps copies them: decimal degrees with a point, at least 5 decimals
  // (about 1 m; 4 decimals is about 11 m, another building).
  const plain = text.match(/^(-?\d{1,2}\.(\d+))\s*,\s*(-?\d{1,3}\.(\d+))$/);
  if (plain) {
    if (plain[2].length < 5 || plain[4].length < 5) return { error: "too_few_decimals", resolved: text };
    return { lat: round7(plain[1]), lng: round7(plain[3]), resolved: text };
  }
  if (/^-?\d{1,2},\d+[\s,;]+-?\d{1,3},\d+$/.test(text)) return { error: "decimal_comma", resolved: text };
  // Degrees typed out; a dropped-pin link has them in its path too, next to the real `!3d!4d`.
  if (!/^https?:\/\//i.test(text) && /\d\s*°/.test(text)) return { error: "degrees", resolved: text };

  let url = text;
  for (let hop = 0; hop < 5; hop++) {
    const found = coordsFromUrl(url);
    if (found) return { ...found, resolved: url };
    let parsed;
    try {
      parsed = new URL(url);
    } catch {
      return { error: "not_a_link" };
    }
    if (/^share\.google$/i.test(parsed.hostname)) return { error: "no_coordinates", resolved: url };
    // Outside the EU Google does not ask for consent, but a server elsewhere may get the consent
    // page; the real target is in its `continue` parameter.
    if (/^consent\.google\./i.test(parsed.hostname) && parsed.searchParams.get("continue")) {
      url = parsed.searchParams.get("continue");
      continue;
    }
    if (!SHORT_HOSTS.test(parsed.hostname)) break;
    const res = await fetch(url, { redirect: "manual", signal: AbortSignal.timeout(15000) });
    const next = res.headers.get("location");
    if (!next) return { error: res.status === 404 ? "link_not_found" : `no_redirect_${res.status}` };
    url = new URL(next, url).href;
  }
  // A Google link without `!3d!4d` points at a search or a map view, not at one place.
  return { error: /@-?\d+\.\d+,-?\d+\.\d+/.test(url) ? "map_view_not_place" : "no_coordinates", resolved: url };
}

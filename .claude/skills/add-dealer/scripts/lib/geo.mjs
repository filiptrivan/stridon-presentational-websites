// Distances, the Serbia bounding box, map links and slippy-map tile math.

// Serbia with a small margin: catches swapped lat/lng and hits in another country.
export const SERBIA = { minLat: 42.2, maxLat: 46.2, minLng: 18.8, maxLng: 23.05 };

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

// Fractional tile coordinates (Web Mercator) for a point at a zoom level.
export function tileXY(lat, lng, zoom) {
  const n = 2 ** zoom;
  const latRad = (lat * Math.PI) / 180;
  return {
    x: ((lng + 180) / 360) * n,
    y: ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n,
  };
}

// Coordinates from a pasted map link. Google `!3d!4d` is the place itself, `@lat,lng` only
// the viewport centre. OSM `mlat/mlon` is a marker, `#map=z/lat/lng` the viewport centre.
export function coordsFromLink(link) {
  const url = String(link ?? "").trim();
  const patterns = [
    [/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/, "place"],
    [/[?&]mlat=(-?\d+\.\d+)&mlon=(-?\d+\.\d+)/, "marker"],
    [/[?&](?:q|query|ll)=(-?\d+\.\d+),\s*(-?\d+\.\d+)/, "query"],
    [/@(-?\d+\.\d+),(-?\d+\.\d+)/, "viewport"],
    [/#map=\d+\/(-?\d+\.\d+)\/(-?\d+\.\d+)/, "viewport"],
  ];
  for (const [re, kind] of patterns) {
    const m = url.match(re);
    if (m) return { lat: Number(m[1]), lng: Number(m[2]), kind };
  }
  return null;
}

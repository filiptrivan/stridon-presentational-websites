// A 768x768 image of 3x3 OSM tiles at zoom 18 around a pin, with rings drawn on the pin
// and on comparison points. Claude looks at it to see whether the pin sits on the right
// building (house number printed on it, shop icon) or on a road or a field.
import fs from "node:fs";
import path from "node:path";
import { getBinary } from "./http.mjs";
import { decodePng, encodePng } from "./png.mjs";
import { tileXY } from "./geo.mjs";

export const COLORS = { red: [220, 0, 0], blue: [0, 90, 255], orange: [255, 140, 0] };
const ZOOM = 18;
const SIZE = 768;

function ring(img, cx, cy, radius, color) {
  const { rgb } = img;
  const put = (x, y) => {
    if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) return;
    const o = (y * SIZE + x) * 3;
    [rgb[o], rgb[o + 1], rgb[o + 2]] = color;
  };
  for (let y = Math.floor(cy - radius - 20); y <= cy + radius + 20; y++) {
    for (let x = Math.floor(cx - radius - 20); x <= cx + radius + 20; x++) {
      const d = Math.hypot(x - cx, y - cy);
      if (Math.abs(d - radius) <= 1.5) put(x, y);
    }
  }
  // Crosshair ticks outside the ring keep the exact point itself visible.
  for (let t = radius + 3; t <= radius + 9; t++) {
    for (const w of [-1, 0, 1]) {
      put(Math.round(cx - t), Math.round(cy + w));
      put(Math.round(cx + t), Math.round(cy + w));
      put(Math.round(cx + w), Math.round(cy - t));
      put(Math.round(cx + w), Math.round(cy + t));
    }
  }
}

// marks: [{ lat, lng, color: "red" | "blue" | "orange" }]; the first mark is the centre.
export async function renderPinImage(marks, outFile) {
  const center = tileXY(marks[0].lat, marks[0].lng, ZOOM);
  const tx = Math.floor(center.x);
  const ty = Math.floor(center.y);
  const img = { width: SIZE, height: SIZE, rgb: Buffer.alloc(SIZE * SIZE * 3, 255) };

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      const tile = decodePng(await getBinary(`https://tile.openstreetmap.org/${ZOOM}/${tx + dx}/${ty + dy}.png`));
      for (let y = 0; y < 256; y++) {
        tile.rgb.copy(img.rgb, (((dy + 1) * 256 + y) * SIZE + (dx + 1) * 256) * 3, y * 256 * 3, (y + 1) * 256 * 3);
      }
    }
  }

  const drawn = [];
  for (const mark of [...marks].reverse()) {
    const p = tileXY(mark.lat, mark.lng, ZOOM);
    const x = (p.x - (tx - 1)) * 256;
    const y = (p.y - (ty - 1)) * 256;
    const visible = x >= 0 && y >= 0 && x < SIZE && y < SIZE;
    if (visible) ring(img, x, y, mark.color === "red" ? 11 : 8, COLORS[mark.color]);
    drawn.unshift({ ...mark, visible });
  }

  fs.mkdirSync(path.dirname(outFile), { recursive: true });
  fs.writeFileSync(outFile, encodePng(img));
  return { file: outFile, marks: drawn, attribution: "© OpenStreetMap contributors" };
}

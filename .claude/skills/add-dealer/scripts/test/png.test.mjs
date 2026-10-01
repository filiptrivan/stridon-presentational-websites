import { test } from "node:test";
import assert from "node:assert/strict";
import zlib from "node:zlib";
import { decodePng, encodePng } from "../lib/png.mjs";

test("RGB round trip", () => {
  const width = 5;
  const height = 3;
  const rgb = Buffer.from(Array.from({ length: width * height * 3 }, (_, i) => (i * 37) % 256));
  const back = decodePng(encodePng({ width, height, rgb }));
  assert.equal(back.width, width);
  assert.equal(back.height, height);
  assert.deepEqual(back.rgb, rgb);
});

// A 2x2 palette PNG with 2-bit indices and a Paeth-filtered second row, the kind of
// file OSM tiles are.
test("palette PNG with low bit depth and filters", () => {
  const chunk = (type, data) => {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length);
    const body = Buffer.concat([Buffer.from(type, "latin1"), data]);
    const crc = Buffer.alloc(4);
    crc.writeUInt32BE(zlib.crc32(body) >>> 0);
    return Buffer.concat([len, body, crc]);
  };
  const ihdr = Buffer.from([0, 0, 0, 2, 0, 0, 0, 2, 2, 3, 0, 0, 0]);
  const plte = Buffer.from([255, 0, 0, 0, 255, 0, 0, 0, 255, 10, 20, 30]);
  // Row 0: filter 0, indices 0 and 1 -> 0b00_01_0000. Row 1: filter 4 (Paeth), target
  // indices 2 and 3 -> 0b10_11_0000 = 0xB0; Paeth predictor for the only byte is `up` (0x10).
  const raw = Buffer.from([0, 0x10, 4, 0xb0 - 0x10]);
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", ihdr),
    chunk("PLTE", plte),
    chunk("IDAT", zlib.deflateSync(raw)),
    chunk("IEND", Buffer.alloc(0)),
  ]);
  const { rgb } = decodePng(png);
  assert.deepEqual([...rgb], [255, 0, 0, 0, 255, 0, 0, 0, 255, 10, 20, 30]);
});

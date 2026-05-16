import sharp from "sharp";

// Fetches `url`, transcodes to PNG, returns a `data:image/png;base64,...` URL.
// Resolves `undefined` on fetch/decode failure so callers can conditionally render.
//
// Always PNG: the satori build bundled with Next.js 16 lacks WebP/AVIF cases in
// its data-URL dispatch switch (vt() in next/dist/compiled/@vercel/og/index.node.js)
// — a missing branch leaves the dimensions array undefined and `[e, ...u2]`
// throws "u2 is not iterable". Transcoding routes through satori's working PNG path.
export async function imageToPngDataUrl(
  url: string,
): Promise<string | undefined> {
  try {
    const res = await fetch(url);
    if (!res.ok) return undefined;
    const input = Buffer.from(await res.arrayBuffer());
    // PNG is an intermediate handed to satori, which re-encodes its own final
    // image — so we minimize CPU at the cost of larger in-memory bytes.
    const png = await sharp(input)
      .png({ compressionLevel: 0, adaptiveFiltering: false, effort: 1 })
      .toBuffer();
    return `data:image/png;base64,${png.toString("base64")}`;
  } catch {
    return undefined;
  }
}

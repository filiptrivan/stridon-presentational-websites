import { LOGO_ASPECT, LOGO_PNG_DATA_URI } from "./logo-data";

export function Logo({ width = 200 }: { width?: number }) {
  // The real lockup, not a type substitute. Satori renders without a browser,
  // so the artwork is inlined as a data URI in `logo-data.ts` - see the note
  // there for why a URL or the raw SVG is the worse trade.
  const height = Math.round(width / LOGO_ASPECT);

  return (
    // `next/image` means nothing to satori, which only understands `<img>`.
    // Same disable the dck and sg-tools OG templates carry for product images.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_PNG_DATA_URI}
      alt=""
      width={width}
      height={height}
      style={{ display: "flex" }}
    />
  );
}

import { colors, fontFamilies } from "./constants";

export function Logo({ width = 200 }: { width?: number }) {
  // Wordmark rather than the real logo: satori renders OG images without a
  // browser, so it would have to fetch and rasterise stridon-logo.svg on every
  // request. Kept as type on purpose - the OG card is 1200x630 and the lockup
  // would be unreadable at the size it would sit.
  const height = Math.round(width * 0.35);

  return (
    <span
      style={{
        fontSize: height,
        fontWeight: 600,
        fontFamily: fontFamilies.heading,
        color: colors.primary,
        display: "flex",
        letterSpacing: 2,
      }}
    >
      STRIDON
    </span>
  );
}

import { colors, fontFamilies } from "./constants";

export function Logo({ width = 200 }: { width?: number }) {
  // Wordmark rather than the raster logo: satori would have to fetch
  // stridon-logo.webp per render, and webp isn't among the formats it decodes.
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

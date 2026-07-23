import type { OgFontSpec } from "@brand/shared/lib/og/fonts";

// Hex equivalents of OKLCH color tokens (Satori doesn't support OKLCH)
export const colors = {
  background: "#ffffff",
  foreground: "#1a1a1a",
  primary: "#D6001C",
  muted: "#666666",
} as const;

// `colors.primary` as an "r,g,b" triplet for rgba() alpha variants in templates.
export const primaryRgb = "214,0,28";

// Single source for the family names the templates reference and the TTFs the
// route loads — satori falls back silently when a fontFamily doesn't resolve.
export const fontFamilies = {
  heading: "Barlow Condensed",
  body: "Barlow",
} as const;

export const fonts: OgFontSpec[] = [
  { file: "BarlowCondensed-SemiBold.ttf", name: fontFamilies.heading, weight: 600 },
  { file: "Barlow-Regular.ttf", name: fontFamilies.body, weight: 400 },
];

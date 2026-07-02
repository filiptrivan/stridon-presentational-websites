import type { OgFontSpec } from "@brand/shared/lib/og/fonts";

// Hex equivalents of OKLCH color tokens (Satori doesn't support OKLCH)
export const colors = {
  background: "#1a1a1a",
  foreground: "#fbfbfb",
  primary: "#8b2a1e",
  primaryBright: "#b42a37",
  muted: "#b0b0b0",
  card: "#2a2a2a",
  border: "rgba(255,255,255,0.10)",
} as const;

// Single source for the family names the templates reference and the TTFs the
// route loads — satori falls back silently when a fontFamily doesn't resolve.
export const fontFamilies = {
  heading: "Space Grotesk",
  body: "Inter",
} as const;

export const fonts: OgFontSpec[] = [
  { file: "SpaceGrotesk-SemiBold.ttf", name: fontFamilies.heading, weight: 600 },
  { file: "Inter-Regular.ttf", name: fontFamilies.body, weight: 400 },
];

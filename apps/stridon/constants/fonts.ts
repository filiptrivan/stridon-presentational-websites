import localFont from "next/font/local";

// Inter for body copy and Space Grotesk for headings, the two families sg-tools
// uses too. Self-hosted through next/font/local, the way dck loads its own, so
// the build never depends on reaching Google Fonts; next/font adds the preload
// and the hashed, immutable-cached file on its own.
//
// The files are Google's variable subsets, and neither one covers Serbian on
// its own: latin has no č ć š ž đ, latin-ext has no a-z. next/font/local cannot
// give each file its own unicode-range (`declarations` applies to every
// @font-face of a call), so both files of a family sit in one `src` with the
// same descriptors, latin LAST. The last rule defined is the first one checked,
// and a character it lacks falls through to the other file (CSS Fonts 4, §5).
// next/font also derives the fallback font's metrics from the last file, which
// needs latin's a-z to measure.
//
// `weight` is each file's real axis range, so no weight gets clamped.
export const base = localFont({
  src: [
    { path: "../fonts/inter-latinext.woff2", weight: "100 900", style: "normal" },
    { path: "../fonts/inter-latin.woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-base",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

export const heading = localFont({
  src: [
    {
      path: "../fonts/spacegrotesk-latinext.woff2",
      weight: "300 700",
      style: "normal",
    },
    {
      path: "../fonts/spacegrotesk-latin.woff2",
      weight: "300 700",
      style: "normal",
    },
  ],
  variable: "--font-heading",
  fallback: ["system-ui", "-apple-system", "Segoe UI", "sans-serif"],
});

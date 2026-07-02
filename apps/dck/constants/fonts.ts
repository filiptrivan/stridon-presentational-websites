import localFont from "next/font/local";

// Official DCK brand typeface (Barlow Condensed) for headings; Barlow (same
// family, normal width) for body copy - condensed faces strain at paragraph sizes.
// Self-hosted (latin + latin-ext subsets, woff2) instead of next/font/google
// because google fonts don't support the `declarations` option: body text needs
// `size-adjust` - Barlow's x-height is ~8% smaller than Inter's (0.506 vs 0.546
// em), so unadjusted it renders visibly smaller at the same CSS font-size.
// Headings need no adjustment: Barlow Condensed's cap-height matches Space
// Grotesk's exactly (0.700 em); the narrow look is the point of a condensed face.
export const heading = localFont({
  src: [
    { path: "../fonts/BarlowCondensed-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/BarlowCondensed-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/BarlowCondensed-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-heading",
});

export const base = localFont({
  src: [
    { path: "../fonts/Barlow-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/Barlow-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/Barlow-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/Barlow-Bold.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-base",
  declarations: [{ prop: "size-adjust", value: "108%" }],
});

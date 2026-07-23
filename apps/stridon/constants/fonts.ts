import { Inter, Space_Grotesk } from "next/font/google";

// Space Grotesk for headings (modern, lightly technical editorial voice),
// Inter for body. latin-ext subset included for Serbian diacritics (č ć ž š đ).
export const heading = Space_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-heading",
});

export const base = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-base",
});

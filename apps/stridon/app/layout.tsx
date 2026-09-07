import RootLayout from "@brand/shared/components/root-layout";
import {
  COMPANY_FOOTER_LINKS,
  LEGAL_LINKS,
  NAV_LINKS,
  PRODUCTS_FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/constants/links";
import type { ReactNode } from "react";
import "./globals.css";

export { metadata, viewport } from "@brand/shared/components/root-layout";

// Both subsets of both families, because Serbian copy mixes plain latin with
// č ć ž š đ on every page — the latin-ext file is never optional here. Without
// next/font nothing preloads these, so the browser would only discover them
// after it has parsed globals.css.
const FONT_FILES = [
  "/fonts/inter-latin.woff2",
  "/fonts/inter-latinext.woff2",
  "/fonts/spacegrotesk-latin.woff2",
  "/fonts/spacegrotesk-latinext.woff2",
];

export default function Layout({ children }: { children: ReactNode }) {
  // Fonts are self-hosted via @font-face in globals.css (no next/font), so no
  // font className is injected here.
  return (
    <RootLayout
      fontClassNames=""
      navLinks={NAV_LINKS}
      productLinks={PRODUCTS_FOOTER_LINKS}
      companyLinks={COMPANY_FOOTER_LINKS}
      legalLinks={LEGAL_LINKS}
      socialLinks={SOCIAL_LINKS}
      showCategoryMenu={false}
      showLanguageSwitch
    >
      {FONT_FILES.map((href) => (
        <link
          key={href}
          rel="preload"
          href={href}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      {children}
    </RootLayout>
  );
}

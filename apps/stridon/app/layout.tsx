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
    >
      {children}
    </RootLayout>
  );
}

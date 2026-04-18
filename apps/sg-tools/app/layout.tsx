import RootLayout from "@brand/shared/components/root-layout";
import { cn } from "@brand/shared/lib/utils";
import { base, heading } from "@/constants/fonts";
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
  return (
    <RootLayout
      fontClassNames={cn(base.variable, heading.variable)}
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

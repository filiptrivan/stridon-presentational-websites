import { getBrandConfig } from "@brand/config";
import Footer from "@brand/shared/components/footer";
import Navbar from "@brand/shared/components/navbar";
import NavbarWithCategories from "@brand/shared/components/navbar-with-categories";
import { Toaster } from "@brand/ui/sonner";
import {
  COMPANY_FOOTER_LINKS,
  LEGAL_LINKS,
  NAV_LINKS,
  PRODUCTS_FOOTER_LINKS,
  SOCIAL_LINKS,
} from "@/constants/links";
import { base, heading } from "@/constants/fonts";
import { createRootMetadata } from "@brand/shared/lib/metadata";
import { cn } from "@brand/shared/lib/utils";
import type { Viewport } from "next";
import { Suspense, type ReactNode } from "react";
import "./globals.css";

const brand = getBrandConfig();

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: brand.colorScheme,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="sr">
      <body
        className={cn(
          "min-h-screen text-foreground font-base antialiased",
          brand.bodyClassName,
          base.variable,
          heading.variable,
        )}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: brand.brandName,
              url: brand.siteUrl,
              logo: `${brand.siteUrl}${brand.logoSrc}`,
              parentOrganization: {
                "@type": "Organization",
                name: "Stridon Group DOO",
                url: "https://www.stridon.rs",
              },
            }),
          }}
        />
        <Suspense fallback={<Navbar categories={[]} navLinks={NAV_LINKS} />}>
          <NavbarWithCategories navLinks={NAV_LINKS} />
        </Suspense>
        <main className="pt-16">{children}</main>
        <Footer
          productLinks={PRODUCTS_FOOTER_LINKS}
          companyLinks={COMPANY_FOOTER_LINKS}
          legalLinks={LEGAL_LINKS}
          socialLinks={SOCIAL_LINKS}
        />
        <Toaster />
      </body>
    </html>
  );
}

import { getBrandConfig } from "@brand/config";
import Footer, {
  type FooterLabels,
  type FooterNavLink,
  type FooterSocialLink,
} from "@brand/shared/components/footer";
import Navbar, { type NavbarLabels } from "@brand/shared/components/navbar";
import NavbarWithCategories from "@brand/shared/components/navbar-with-categories";
import type { NewsletterFormLabels } from "@brand/shared/components/newsletter/newsletter-form";
import {
  type MobileMenuLabels,
  type NavbarLink,
} from "@brand/shared/components/mobile-menu";
import { Toaster } from "@brand/ui/sonner";
import { createRootMetadata } from "@brand/shared/lib/metadata";
import { cn } from "@brand/shared/lib/utils";
import type { Viewport } from "next";
import { Suspense, type ReactNode } from "react";

const brand = getBrandConfig();

export const metadata = createRootMetadata();

export const viewport: Viewport = {
  themeColor: brand.themeColor,
  colorScheme: brand.colorScheme,
};

type RootLayoutProps = {
  children: ReactNode;
  fontClassNames: string;
  navLinks: readonly NavbarLink[];
  productLinks: readonly FooterNavLink[];
  companyLinks: readonly FooterNavLink[];
  legalLinks: readonly FooterNavLink[];
  socialLinks: readonly FooterSocialLink[];
  /** When false, render the plain Navbar without fetching product categories
      (for brands like Stridon that don't expose a product category catalog). */
  showCategoryMenu?: boolean;
  /** Rendered in the navbar next to the header CTA. Only a translated site
      passes one, which keeps this package free of a routing library it would
      otherwise need just to build the other locale's URL. */
  languageSwitch?: ReactNode;
  navbarLabels?: NavbarLabels;
  mobileLabels?: MobileMenuLabels;
  footerLabels?: FooterLabels;
  newsletterLabels?: NewsletterFormLabels;
  /** Localized paths for the two links brand-config hardcodes. */
  headerCtaHref?: string;
  homeHref?: string;
  footerTagline?: string;
  /** BCP 47 tag for `<html lang>`. Only a translated site passes it. The
      default is what dck and sg-tools have always rendered, so their output is
      unchanged; Stridon passes `sr-Latn` or `en`. */
  lang?: string;
};

export default function RootLayout({
  children,
  fontClassNames,
  navLinks,
  productLinks,
  companyLinks,
  legalLinks,
  socialLinks,
  showCategoryMenu = true,
  languageSwitch,
  navbarLabels,
  mobileLabels,
  footerLabels,
  newsletterLabels,
  headerCtaHref,
  homeHref,
  footerTagline,
  lang = "sr",
}: RootLayoutProps) {
  return (
    <html lang={lang}>
      <body
        className={cn(
          "min-h-screen text-foreground font-base antialiased",
          brand.bodyClassName,
          fontClassNames,
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
        {showCategoryMenu ? (
          <Suspense
            fallback={
              <Navbar
                categories={[]}
                navLinks={navLinks}
                languageSwitch={languageSwitch}
                labels={navbarLabels}
                mobileLabels={mobileLabels}
                headerCtaHref={headerCtaHref}
                homeHref={homeHref}
              />
            }
          >
            <NavbarWithCategories
              navLinks={navLinks}
              languageSwitch={languageSwitch}
              labels={navbarLabels}
              mobileLabels={mobileLabels}
              headerCtaHref={headerCtaHref}
              homeHref={homeHref}
            />
          </Suspense>
        ) : (
          <Navbar
            categories={[]}
            navLinks={navLinks}
            languageSwitch={languageSwitch}
            labels={navbarLabels}
            mobileLabels={mobileLabels}
            headerCtaHref={headerCtaHref}
            homeHref={homeHref}
          />
        )}
        <main className="pt-16">{children}</main>
        <Footer
          productLinks={productLinks}
          companyLinks={companyLinks}
          legalLinks={legalLinks}
          socialLinks={socialLinks}
          labels={footerLabels}
          newsletterLabels={newsletterLabels}
          tagline={footerTagline}
        />
        <Toaster />
      </body>
    </html>
  );
}

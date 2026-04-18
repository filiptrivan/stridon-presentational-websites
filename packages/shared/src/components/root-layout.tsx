import { getBrandConfig } from "@brand/config";
import Footer, {
  type FooterNavLink,
  type FooterSocialLink,
} from "@brand/shared/components/footer";
import Navbar from "@brand/shared/components/navbar";
import NavbarWithCategories from "@brand/shared/components/navbar-with-categories";
import { type NavbarLink } from "@brand/shared/components/mobile-menu";
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
};

export default function RootLayout({
  children,
  fontClassNames,
  navLinks,
  productLinks,
  companyLinks,
  legalLinks,
  socialLinks,
}: RootLayoutProps) {
  return (
    <html lang="sr">
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
        <Suspense fallback={<Navbar categories={[]} navLinks={navLinks} />}>
          <NavbarWithCategories navLinks={navLinks} />
        </Suspense>
        <main className="pt-16">{children}</main>
        <Footer
          productLinks={productLinks}
          companyLinks={companyLinks}
          legalLinks={legalLinks}
          socialLinks={socialLinks}
        />
        <Toaster />
      </body>
    </html>
  );
}

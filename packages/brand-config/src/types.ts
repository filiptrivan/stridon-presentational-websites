export interface BrandConfig {
  // Identity
  brandName: string;
  brandSlug: string;
  siteName: string;
  siteUrl: string;

  // Theme
  colorScheme: "dark" | "light";
  themeColor: string;
  bodyClassName: string;

  // Branding
  logoSrc: string;
  logoAlt: string;
  /**
   * The logo file's own dimensions, used as the `next/image` width and height
   * so the browser reserves a box with the asset's real aspect ratio.
   *
   * Optional, and omitting it keeps the numbers the navbar and footer used
   * before it existed. Those are per-component constants that happen to fit
   * the brand whose logo they were written for: a brand whose logo has a
   * different ratio and is sized with `w-auto` ends up with one dimension
   * matching the attribute and the other not, which is exactly what Next's
   * "width or height modified, but not the other" warning reports, and it
   * means the pre-layout box has the wrong shape.
   */
  logoWidth?: number;
  logoHeight?: number;
  navbarLogoHeight: string;
  footerLogoClassName: string;

  // Metadata
  defaultTitle: string;
  siteDescription: string;
  productsPageDescription: string;
  productsPageHeroDescription: string;
  whereToBuyDescription: string;
  contactDescription: string;

  // Email (contact form)
  emailSender: { name: string; email: string };
  emailRecipient: { name: string; email: string };
  emailSubject: string;
  emailHeading: string;

  // Hero header
  heroGradient: string;

  // CTA
  ctaHeading: string;
  ctaGradientClasses: string;

  // Footer
  footerTagline: string;
  footerGradientEdge: string;

  // Header CTA button
  headerCta: { label: string; href: string; external: boolean };
}

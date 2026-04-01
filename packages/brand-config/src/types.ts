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
  navbarLogoHeight: string;
  shopUrl: string;

  // Metadata
  defaultTitle: string;
  siteDescription: string;
  productsPageDescription: string;

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

  // OG image colors (hex — Satori doesn't support OKLCH)
  ogColors: {
    background: string;
    foreground: string;
    primary: string;
    primaryBright: string;
    muted: string;
    card: string;
    border: string;
  };

  // OG footer domain text
  ogDomain: string;
}

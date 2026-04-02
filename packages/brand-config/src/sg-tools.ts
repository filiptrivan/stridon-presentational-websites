import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "SG Tools",
  brandSlug: "sg-tools",
  siteName: "SG Tools",
  siteUrl: "https://www.sgtools.rs",

  colorScheme: "dark",
  themeColor: "#0A0A0A",
  bodyClassName: "dark",

  logoSrc: "/sg-tools-logo.svg",
  logoAlt: "SG Tools Logo",
  navbarLogoHeight: "h-3",
  shopUrl: "https://www.prodavnicaalata.rs/proizvodjaci/sg-tools/",
  headerCta: {
    label: "Idi na prodavnicu",
    href: "https://www.prodavnicaalata.rs/proizvodjaci/sg-tools/",
    external: true,
  },

  defaultTitle:
    "SG Tools — Profesionalni alat nastao iz 30 godina iskustva",
  siteDescription:
    "SG Tools je profesionalni alat nastao iz 30 godina iskustva u prodaji i distribuciji alata.",
  productsPageDescription:
    "Pregledaj kompletnu ponudu SG Tools profesionalnog alata — bušilice, brusilice, testere i još mnogo toga.",

  emailSender: { name: "SG Tools", email: "noreply@sgtools.rs" },
  emailRecipient: { name: "SG Tools", email: "aleksatrivan@gmail.com" },
  emailSubject: "SG Tools — Contact Form",
  emailHeading: "Nova poruka sa sgtools.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(180,42,55,0.85)_0%,rgba(5,5,5,0)_80%)]",

  ctaHeading: "Pronađi pravi alat \n za svaki posao",
  ctaGradientClasses: "from-neutral-100 to-neutral-400",

  footerTagline: "Profesionalni alati nastali iz 30 godina iskustva.",
  footerGradientEdge: "#050505",

  ogColors: {
    background: "#1a1a1a",
    foreground: "#fbfbfb",
    primary: "#8b2a1e",
    primaryBright: "#b42a37",
    muted: "#b0b0b0",
    card: "#2a2a2a",
    border: "rgba(255,255,255,0.10)",
  },
  ogDomain: "sgtools.rs",
};

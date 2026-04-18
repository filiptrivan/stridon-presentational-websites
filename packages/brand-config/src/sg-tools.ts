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
  headerCta: {
    label: "Postani distributer",
    href: "/kontakt",
    external: false,
  },

  defaultTitle: "SG Tools - Građen znanjem",
  siteDescription:
    "SG Tools je rođen iz porodičnog biznisa sa alatima koji traje 30 godina.",
  productsPageDescription:
    "Pregledaj kompletnu ponudu SG Tools profesionalnog alata - bušilice, brusilice, testere i još mnogo toga.",
  productsPageHeroDescription:
    "Pregledaj kompletnu ponudu SG Tools profesionalnog alata.",
  whereToBuyDescription:
    "Pronađi ovlašćene prodavnice i servise SG Tools alata širom Srbije.",
  contactDescription:
    "Kontaktiraj SG Tools - pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",

  emailSender: { name: "SG Tools", email: "noreply@sgtools.rs" },
  emailRecipient: { name: "SG Tools", email: "aleksatrivan@gmail.com" },
  emailSubject: "SG Tools - Contact Form",
  emailHeading: "Nova poruka sa sgtools.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(180,42,55,0.85)_0%,rgba(5,5,5,0)_80%)]",

  ctaHeading: "Pouzdan alat \n za svaki posao",
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

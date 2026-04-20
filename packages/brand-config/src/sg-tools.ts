import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "SG TOOLS",
  brandSlug: "sg-tools",
  siteName: "SG TOOLS",
  siteUrl: "https://www.sgtools.rs",

  colorScheme: "dark",
  themeColor: "#0A0A0A",
  bodyClassName: "dark",

  logoSrc: "/sg-tools-logo.svg",
  logoAlt: "SG TOOLS Logo",
  navbarLogoHeight: "h-3",
  headerCta: {
    label: "Postani distributer",
    href: "/kontakt",
    external: false,
  },

  defaultTitle: "SG TOOLS - Građen znanjem",
  siteDescription:
    "SG TOOLS je rođen iz porodičnog biznisa sa alatima koji traje 30 godina.",
  productsPageDescription:
    "Pregledaj kompletnu ponudu SG TOOLS profesionalnog alata - bušilice, brusilice, testere i još mnogo toga.",
  productsPageHeroDescription:
    "Pregledaj kompletnu ponudu SG TOOLS profesionalnog alata.",
  whereToBuyDescription:
    "Pronađi ovlašćene prodavnice i servise SG TOOLS alata širom Srbije.",
  contactDescription:
    "Kontaktiraj SG TOOLS - pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",

  emailSender: { name: "SG TOOLS", email: "noreply@sgtools.rs" },
  emailRecipient: { name: "SG TOOLS", email: "aleksatrivan@gmail.com" },
  emailSubject: "SG TOOLS - Contact Form",
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

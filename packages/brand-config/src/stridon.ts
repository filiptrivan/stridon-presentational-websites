import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "Stridon Group",
  brandSlug: "stridon",
  siteName: "Stridon Group DOO",
  siteUrl: "https://www.stridon.rs",

  colorScheme: "light",
  themeColor: "#FFFFFF",
  bodyClassName: "",

  logoSrc: "/stridon-logo.svg",
  logoAlt: "Stridon Group Logo",
  navbarLogoHeight: "h-7",
  headerCta: {
    label: "Online prodavnica",
    href: "https://www.prodavnicaalata.rs",
    external: true,
  },

  defaultTitle: "Stridon Group - Uvoznik i distributer alata",
  siteDescription:
    "Stridon Group DOO — uvoznik i distributer vodećih svetskih brendova alata u Srbiji. DeWalt, Bosch, Stanley, Wiha, Knipex i još mnogo toga.",
  productsPageDescription: "",
  productsPageHeroDescription: "",
  whereToBuyDescription: "",
  contactDescription:
    "Kontaktirajte Stridon Group — veleprodaja, B2B saradnja i opšti upiti. Tu smo da pomognemo.",

  emailSender: { name: "Stridon Group", email: "noreply@stridon.rs" },
  emailRecipient: { name: "Stridon Group", email: "office@stridon.rs" },
  emailSubject: "Stridon Group - Kontakt forma",
  emailHeading: "Nova poruka sa stridon.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(30,58,138,0.25)_0%,rgba(255,255,255,0)_80%)]",

  ctaHeading: "Pouzdan partner \n za kvalitetan alat",
  ctaGradientClasses: "from-neutral-900 to-neutral-600",

  footerTagline: "Uvoznik i distributer vodećih svetskih brendova alata.",
  footerGradientEdge: "var(--background)",

  ogColors: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    primary: "#1e3a8a",
    primaryBright: "#2563eb",
    muted: "#666666",
    card: "#f5f5f5",
    border: "rgba(0,0,0,0.10)",
  },
  ogDomain: "stridon.rs",
};

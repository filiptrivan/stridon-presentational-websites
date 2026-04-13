import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "DCK",
  brandSlug: "dck",
  siteName: "DCK Srbija",
  siteUrl: "https://www.dcksrbija.rs",

  colorScheme: "light",
  themeColor: "#FFFFFF",
  bodyClassName: "",

  logoSrc: "/dck-logo.svg",
  logoAlt: "DCK Logo",
  navbarLogoHeight: "h-5",
  headerCta: {
    label: "Postani distributer",
    href: "/kontakt",
    external: false,
  },

  defaultTitle: "DCK - Posvećeni služenju globalnim profesionalcima",
  siteDescription:
    "DCK je profesionalni brend kompanije Dongcheng, osnovane 1995. godine, prisutan u 100+ zemalja sa zvaničnom distribucijom i podrškom u Srbiji.",
  productsPageDescription:
    "Pregledaj kompletnu ponudu DCK profesionalnog električnog alata - bušilice, brusilice, testere i još mnogo toga.",

  emailSender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
  emailRecipient: { name: "DCK Srbija", email: "aleksatrivan@gmail.com" },
  emailSubject: "DCK Srbija - Kontakt forma",
  emailHeading: "Nova poruka sa dcksrbija.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(227,30,36,0.4)_0%,rgba(255,255,255,0)_80%)]",

  ctaHeading: "Pridruži se \n DCK mreži distributera",
  ctaGradientClasses: "from-neutral-900 to-neutral-600",

  footerTagline: "Posvećeni služenju globalnim profesionalcima.",
  footerGradientEdge: "var(--background)",

  ogColors: {
    background: "#ffffff",
    foreground: "#1a1a1a",
    primary: "#E31E24",
    primaryBright: "#E31E24",
    muted: "#666666",
    card: "#f5f5f5",
    border: "rgba(0,0,0,0.10)",
  },
  ogDomain: "dcksrbija.rs",
};

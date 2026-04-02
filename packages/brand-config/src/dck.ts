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
  shopUrl: "https://www.prodavnicaalata.rs/proizvodjaci/dck/",
  headerCta: {
    label: "Registracija garancije",
    href: "/registracija-garancije",
    external: false,
  },

  defaultTitle: "DCK — Profesionalni električni alati",
  siteDescription:
    "DCK električni alati — pouzdani profesionalni alati za svaki posao. Zvanični distributer za Srbiju.",
  productsPageDescription:
    "Pregledaj kompletnu ponudu DCK profesionalnog električnog alata — bušilice, brusilice, testere i još mnogo toga.",

  emailSender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
  emailRecipient: { name: "DCK Srbija", email: "aleksatrivan@gmail.com" },
  emailSubject: "DCK Srbija — Kontakt forma",
  emailHeading: "Nova poruka sa dcksrbija.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(227,30,36,0.4)_0%,rgba(255,255,255,0)_80%)]",

  ctaHeading: "Pronađi pravi DCK alat \n za svaki posao",
  ctaGradientClasses: "from-neutral-900 to-neutral-600",

  footerTagline:
    "DCK profesionalni električni alati — zvanični distributer za Srbiju.",
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

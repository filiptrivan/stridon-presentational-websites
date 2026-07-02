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
  productsPageHeroDescription:
    "Pregledaj kompletnu ponudu DCK profesionalnog alata.",
  whereToBuyDescription:
    "Pronađi ovlašćene prodavnice i servise DCK alata širom Srbije.",
  contactDescription:
    "Kontaktiraj DCK Srbija - pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",

  emailSender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
  emailRecipient: { name: "DCK Srbija", email: "aleksa.trivan@stridon.rs" },
  emailSubject: "DCK Srbija - Kontakt forma",
  emailHeading: "Nova poruka sa dcksrbija.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(214,0,28,0.4)_0%,rgba(255,255,255,0)_80%)]",

  ctaHeading: "Pridruži se \n DCK mreži distributera",
  ctaGradientClasses: "from-neutral-900 to-neutral-600",

  footerTagline: "Posvećeni služenju globalnim profesionalcima.",
  footerGradientEdge: "var(--background)",
};

import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "Stridon",
  brandSlug: "stridon",
  siteName: "Stridon Group",
  siteUrl: "https://www.stridon.rs",

  colorScheme: "light",
  themeColor: "#FFFFFF",
  bodyClassName: "",

  logoSrc: "/stridon-logo.webp",
  logoAlt: "Stridon Group logo",
  navbarLogoHeight: "h-7 md:h-8",
  footerLogoClassName: "h-8 w-auto",
  headerCta: {
    label: "Postani distributer",
    href: "/kontakt",
    external: false,
  },

  defaultTitle: "Stridon Group - vodeći distributer alata u Srbiji",
  siteDescription:
    "Stridon Group je zvanični uvoznik i distributer profesionalnog alata u Srbiji. Preko 30 svetskih brendova, veleprodaja, tehnička podrška i brza isporuka.",
  productsPageDescription:
    "Pregledaj brendove koje Stridon Group zvanično uvozi i distribuira u Srbiji.",
  productsPageHeroDescription: "Brendovi koje zvanično zastupamo u Srbiji.",
  whereToBuyDescription:
    "Pronađi Stridon prodajna mesta i ovlašćene servise alata u Srbiji.",
  contactDescription:
    "Kontaktiraj Stridon tim za veleprodaju, tehničku podršku, servis ili saradnju. Tu smo da pomognemo.",

  emailSender: { name: "Stridon Group", email: "noreply@stridon.rs" },
  emailRecipient: { name: "Stridon Group", email: "office@stridon.rs" },
  emailSubject: "Stridon Group - kontakt forma",
  emailHeading: "Nova poruka sa stridon.rs",

  heroGradient:
    "bg-[radial-gradient(86.02%_172.05%_at_50%_-40%,rgba(229,1,19,0.28)_0%,rgba(255,255,255,0)_80%)]",

  ctaHeading: "Postani deo \n Stridon mreže distributera",
  ctaGradientClasses: "from-neutral-900 to-neutral-600",

  footerTagline: "Vodeći distributer profesionalnog alata u Srbiji.",
  footerGradientEdge: "var(--background)",
};

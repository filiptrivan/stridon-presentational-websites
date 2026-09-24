import type { BrandConfig } from "./types";

export const config: BrandConfig = {
  brandName: "Stridon",
  brandSlug: "stridon",
  siteName: "Stridon Group",
  siteUrl: "https://www.stridon.rs",

  colorScheme: "light",
  themeColor: "#FFFFFF",
  bodyClassName: "",

  logoSrc: "/stridon-logo.svg",
  logoAlt: "Stridon Group logo",
  // The wordmark's own viewBox, 456 x 185.71, rounded to the integers an
  // `<img>` width/height attribute takes. Roughly 2.46:1, against the 3:1 the
  // footer assumed and the 5:1 the navbar assumed.
  logoWidth: 456,
  logoHeight: 186,
  navbarLogoHeight: "h-7 md:h-8",
  footerLogoClassName: "h-8 w-auto",
  headerCta: {
    label: "B2B platforma",
    href: "/b2b",
    external: false,
  },

  // Carried over verbatim from the live stridon.rs so the redesign does not
  // hand Google a different title for a URL it already ranks. These two also
  // feed the OG card through `createRootMetadata`, which is why they have to
  // move together with `Site.defaultTitle` / `Site.description` in the
  // catalogs rather than only there.
  defaultTitle: "Najbolja prodavnica alata u Srbiji | Stridon Group",
  siteDescription:
    "Veleprodaja, maloprodaja i online prodaja opreme, alata i mašina najpoznatijih brendova po jeftinim cenama u Srbiji. Pogledajte naše cene, akcije i kataloge.",
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

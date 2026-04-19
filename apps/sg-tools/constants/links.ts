export const SITE_URL = "https://www.sgtools.rs";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Kategorije", href: "/proizvodi/kategorije" },
  { label: "O nama", href: "/o-nama" },
  { label: "Gde kupiti", href: "/gde-kupiti" },
  { label: "Kontakt", href: "/kontakt" },
];

export const PRODUCTS_FOOTER_LINKS: readonly NavLink[] = [
  { label: "Svi proizvodi", href: "/proizvodi" },
  { label: "Kategorije", href: "/proizvodi/kategorije" },
  { label: "Postani distributer", href: "/kontakt" },
  {
    label: "Katalog",
    href: "https://media.prodavnicaalata.rs/uploads//catalogues/58/files/SG%20TOOLS%20katalog.pdf",
    external: true,
  },
];

export const COMPANY_FOOTER_LINKS: readonly NavLink[] = [
  { label: "O nama", href: "/o-nama" },
  { label: "Gde kupiti", href: "/gde-kupiti" },
  { label: "Kontakt", href: "/kontakt" },
  {
    label: "Stridon Group",
    href: "https://www.stridon.rs",
    external: true,
  },
];

export const SOCIAL_LINKS = [
  {
    name: "Facebook",
    href: "https://www.facebook.com/prodavnicaalataa",
    icon: "facebook" as const,
  },
  {
    name: "Instagram",
    href: "https://www.instagram.com/prodavnicaalata/",
    icon: "instagram" as const,
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/@prodavnicaalata5203",
    icon: "youtube" as const,
  },
];

export const LEGAL_LINKS: readonly NavLink[] = [
  { label: "Politika privatnosti", href: "/politika-privatnosti" },
  { label: "Uslovi korišćenja", href: "/uslovi-koriscenja" },
];

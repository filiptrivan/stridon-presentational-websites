export const SITE_URL = "https://www.dcksrbija.rs";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Kategorije", href: "/proizvodi/kategorije" },
  { label: "O nama", href: "/o-nama" },
  { label: "Gde kupiti", href: "/gde-kupiti" },
  { label: "Registracija garancije", href: "/registracija-garancije" },
  { label: "Kontakt", href: "/kontakt" },
];

export const PRODUCTS_FOOTER_LINKS: readonly NavLink[] = [
  { label: "Svi proizvodi", href: "/proizvodi" },
  { label: "Kategorije", href: "/proizvodi/kategorije" },
  {
    label: "Online prodavnica",
    href: "https://www.prodavnicaalata.rs/proizvodjaci/dck/",
    external: true,
  },
];

export const COMPANY_FOOTER_LINKS: readonly NavLink[] = [
  { label: "O nama", href: "/o-nama" },
  { label: "Gde kupiti", href: "/gde-kupiti" },
  { label: "Registracija garancije", href: "/registracija-garancije" },
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

export const SITE_URL = "https://www.stridon.rs";

export interface NavLink {
  label: string;
  href: string;
  external?: boolean;
}

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Brendovi", href: "/brendovi" },
  { label: "Katalozi", href: "/katalozi" },
  { label: "Servis", href: "/servis" },
  { label: "O nama", href: "/o-nama" },
  { label: "Kontakt", href: "/kontakt" },
];

export const PRODUCTS_FOOTER_LINKS: readonly NavLink[] = [
  { label: "Svi brendovi", href: "/brendovi" },
  { label: "Katalozi", href: "/katalozi" },
  {
    label: "Online prodavnica",
    href: "https://www.prodavnicaalata.rs",
    external: true,
  },
  { label: "Postani partner", href: "/kontakt" },
];

export const COMPANY_FOOTER_LINKS: readonly NavLink[] = [
  { label: "O nama", href: "/o-nama" },
  { label: "Servis", href: "/servis" },
  { label: "Kontakt", href: "/kontakt" },
  {
    label: "Prodavnica alata",
    href: "https://www.prodavnicaalata.rs",
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

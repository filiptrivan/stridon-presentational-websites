import type { StaticPathname } from "@/i18n/routing";
import type { Messages } from "next-intl";

export const SITE_URL = "https://www.stridon.rs";

export const SHOP_URL = "https://www.prodavnicaalata.rs";

/** Wings B2B portal the old site linked to from /b2b. */
export const B2B_PORTAL_URL = "https://b2b.wings.rs/stridon";

/**
 * Link definitions carry the route and a message key, never the label.
 *
 * The label has to be resolved where a translator exists, and these are plain
 * module constants: they are evaluated once when the module loads, long before
 * any request has a locale. `lib/nav.ts` turns each of these into the
 * `{ label, href }` the shared navbar and footer expect, with the href already
 * spelled for the current locale. `K` is the message key union of the
 * namespace the label is read from, so a link without copy fails `tsc`.
 */
export interface NavLinkDef<K extends string = string> {
  /** Key under the `Nav` or `Footer.links` namespace. */
  key: K;
  /** Internal route, or an absolute URL when `external`. */
  href: StaticPathname | string;
  external?: boolean;
}

export type NavKey = keyof Messages["Nav"];
export type FooterLinkKey = keyof Messages["Footer"]["links"];

export const NAV_LINKS: readonly NavLinkDef<NavKey>[] = [
  { key: "brands", href: "/brendovi" },
  { key: "catalogs", href: "/katalozi" },
  { key: "service", href: "/servis" },
  { key: "about", href: "/o-nama" },
  { key: "b2b", href: "/b2b" },
  { key: "contact", href: "/kontakt" },
];

export const PRODUCTS_FOOTER_LINKS: readonly NavLinkDef<FooterLinkKey>[] = [
  { key: "allBrands", href: "/brendovi" },
  { key: "catalogs", href: "/katalozi" },
  { key: "onlineStore", href: SHOP_URL, external: true },
  { key: "becomePartner", href: "/kontakt" },
];

export const COMPANY_FOOTER_LINKS: readonly NavLinkDef<FooterLinkKey>[] = [
  { key: "about", href: "/o-nama" },
  { key: "service", href: "/servis" },
  { key: "contact", href: "/kontakt" },
  { key: "toolShop", href: SHOP_URL, external: true },
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

export const LEGAL_LINKS: readonly NavLinkDef<FooterLinkKey>[] = [
  { key: "privacy", href: "/politikaprivatnosti" },
  { key: "terms", href: "/uslovi-koriscenja" },
  { key: "identification", href: "/podacizaidentifikaciju" },
];

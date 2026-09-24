/**
 * Brand data that is not in the CMS. Which brands the site shows, and in what
 * order, is read from PACMS (`lib/brands.ts`); name, description, logo and the
 * catalog link come from there too.
 */

/**
 * Routes the live stridon.rs already has indexed under a different spelling than
 * the CMS uses. Redirected 308 in `next.config.ts`; the CMS slug is canonical
 * everywhere in the app, so this is a closed legacy set that never grows.
 */
export const LEGACY_BRAND_SLUGS: Record<string, string> = {
  hogert: "hogert-technik",
  kwb: "kwb-germany",
  "black-and-decker": "black-decker",
};

/** Manufacturer page on the webshop, which keys off the same slug PACMS does. */
export function shopUrlFor(slug: string): string {
  return `https://www.prodavnicaalata.rs/proizvodjaci/${slug}/`;
}

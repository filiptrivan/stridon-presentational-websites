/**
 * Brand data that is not in the CMS. Which brands the site shows, and in what
 * order, is read from PACMS (`lib/brands.ts`); name, description, logo and the
 * catalog link come from there too. Old brand URLs are in `legacy-urls.ts`.
 */

/** Manufacturer page on the webshop, which keys off the same slug PACMS does. */
export function shopUrlFor(slug: string): string {
  return `https://www.prodavnicaalata.rs/proizvodjaci/${slug}/`;
}

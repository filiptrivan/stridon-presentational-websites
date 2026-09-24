/**
 * URLs the live stridon.rs serves that this app spells differently. Each one
 * gets a permanent redirect in `next.config.ts`, which runs before the proxy,
 * so an indexed URL keeps its ranking signal instead of hitting a 404 or the
 * temporary 307 next-intl would answer with. Google treats only 301/308 as a
 * canonical signal (https://developers.google.com/search/docs/crawling-indexing/301-redirects).
 *
 * Closed sets: they describe the old site, so they never grow with new pages.
 * next.config.ts imports this file by relative path, since `@/` does not
 * resolve there.
 */

/** Brands the live site lists under a different slug than the CMS. */
export const LEGACY_BRAND_SLUGS: Record<string, string> = {
  hogert: "hogert-technik",
  kwb: "kwb-germany",
  "black-and-decker": "black-decker",
};

/**
 * The live English site keeps the Serbian slugs under `/en` (its navigation in
 * the web.archive.org captures of 2026-03 and 2026-04 links `/en/onama`,
 * `/en/brendovi`, `/en/katalozi`, `/en/kontakt` and `/en/servis`); this app
 * translates them. `/en/b2b` is spelled the same in both and needs nothing.
 */
export const LEGACY_EN_PATHS: Record<string, string> = {
  "/en/onama": "/en/about",
  "/en/brendovi": "/en/brands",
  "/en/katalozi": "/en/catalogs",
  "/en/kontakt": "/en/contact",
  "/en/servis": "/en/service",
};

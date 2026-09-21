/**
 * The manufacturers stridon.rs shows, by their PACMS slug, in the order
 * `/brendovi` and `/katalozi` render them.
 *
 * This list is the **only** hand-kept brand data left. Name, description, logo,
 * SEO metadata and the catalog link are all read from the CMS, so adding a brand
 * is one line here and writing it in PACMS - no page, no copy, no asset.
 *
 * It has to exist because PACMS has no per-site brand association. `Brands`
 * returns the whole webshop catalogue (234 manufacturers ordered for
 * prodavnicaalata.rs), so "fetch the first N" would put Makita, Villager, Metabo
 * and Gardena on a page about what Stridon imports, and no field distinguishes
 * them: `orderNumber` is set on 94 brands including those four, `htmlDescription`
 * on 171, and `hasProducts` means the shop stocks it, not that Stridon imports
 * it. The clean fix is the endpoint Shreyas asked for on PR #4 and that was
 * declined - `BrandsByBrand?brandSlug=stridon`. When it exists, this array is
 * what one `await` replaces, and nothing else on the site changes.
 */
export const BRAND_SLUGS = [
  "dewalt",
  "stanley",
  "bosch",
  "rems",
  "wiha",
  "gtv",
  "knipex",
  "hogert-technik",
  "senco",
  "wera",
  "rubi",
  "max",
  "black-decker",
  "mtx",
  "sparta",
  "sg-tools",
  "karcher",
  "wolfcraft",
  "kwb-germany",
  "dck",
  "einhell",
  "oli",
  "makita",
  "metabo",
] as const;

export type BrandSlug = (typeof BRAND_SLUGS)[number];

/** Shown in the homepage brand wall, a subset of the list above in the same order. */
export const FEATURED_BRAND_SLUGS: readonly string[] = [
  "dewalt",
  "stanley",
  "bosch",
  "rems",
  "wiha",
  "gtv",
  "knipex",
  "hogert-technik",
  "senco",
  "wera",
  "rubi",
];

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

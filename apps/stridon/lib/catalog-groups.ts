import { BRAND_SLUGS } from "@/constants/brands";
import type { Catalog, CatalogsResult } from "@brand/shared/types/catalogs";

export interface CatalogGroup {
  /** PACMS slug: the anchor, and the `/brendovi` route when we show the brand. */
  slug: string;
  name: string;
  /** CMS logo, or null for the one brand PACMS has no image for. */
  imageUrl: string | null;
  /** Our brand page, or null for a manufacturer stridon.rs does not list. */
  href: string | null;
  catalogs: Catalog[];
}

/**
 * Trailing group for catalogs PACMS has not tagged with a manufacturer.
 *
 * As of 2026-09-21 exactly one catalog lands here ("REMS akcija 2026."), and it
 * is a CMS tagging gap rather than a real category - REMS is a brand we show and
 * already has its own group. Tag it in the CMS and it moves up on the next
 * revalidate with no code change, which is the point of not hardcoding it.
 */
export const UNTAGGED_GROUP_SLUG = "ostali-katalozi";

/**
 * Catalogs grouped by manufacturer, in the order `/katalozi` renders them.
 *
 * Pure: it reads one `getAllCatalogs()` response the page already awaited, plus
 * the brand logos the page fetched once, so grouping costs no request and runs
 * at prerender.
 *
 * Order is deliberate. Brands we show come first in `BRAND_SLUGS` order, the one
 * the owner tuned and `/brendovi` uses. Everything else follows by name -
 * `orderNumber` looks like the obvious sort key and is not one, since PACMS hands
 * out duplicates (stanley, bosch and dewalt are all `3`), which would leave the
 * tail order up to however the backend returned the rows.
 */
export function groupCatalogsByBrand(
  result: CatalogsResult,
  logoBySlug: ReadonlyMap<string, string | null> = new Map(),
): CatalogGroup[] {
  const byBrandSlug = new Map<string, Catalog[]>();
  const untagged: Catalog[] = [];
  const nameBySlug = new Map(
    result.brands.map((brand) => [brand.slug, brand.name]),
  );

  for (const catalog of result.catalogs) {
    if (catalog.brands.length === 0) {
      untagged.push(catalog);
      continue;
    }
    // No catalog carries more than one brand today, but the DTO allows it, so a
    // shared catalog belongs under each of its brands rather than silently under
    // whichever one happened to be first.
    for (const brand of catalog.brands) {
      if (!nameBySlug.has(brand.slug)) nameBySlug.set(brand.slug, brand.name);
      const bucket = byBrandSlug.get(brand.slug);
      if (bucket) bucket.push(catalog);
      else byBrandSlug.set(brand.slug, [catalog]);
    }
  }

  const shown = new Set<string>(BRAND_SLUGS);
  const toGroup = (slug: string, catalogs: Catalog[]): CatalogGroup => ({
    slug,
    name: nameBySlug.get(slug) ?? slug,
    imageUrl: logoBySlug.get(slug) ?? null,
    href: shown.has(slug) ? `/brendovi/${slug}` : null,
    catalogs,
  });

  const groups: CatalogGroup[] = [];

  for (const slug of BRAND_SLUGS) {
    const catalogs = byBrandSlug.get(slug);
    if (catalogs) groups.push(toGroup(slug, catalogs));
  }

  groups.push(
    ...[...byBrandSlug.entries()]
      .filter(([slug]) => !shown.has(slug))
      .map(([slug, catalogs]) => toGroup(slug, catalogs))
      .sort((a, b) => a.name.localeCompare(b.name, "sr")),
  );

  if (untagged.length > 0) {
    groups.push({
      slug: UNTAGGED_GROUP_SLUG,
      name: "Ostali katalozi",
      imageUrl: null,
      href: null,
      catalogs: untagged,
    });
  }

  return groups;
}

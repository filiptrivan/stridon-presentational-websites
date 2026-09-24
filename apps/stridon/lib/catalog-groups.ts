import { byOrderNumber, isSiteBrand } from "@/lib/brand-order";
import type { Catalog, CatalogsResult } from "@brand/shared/types/catalogs";

type CatalogBrand = Catalog["brands"][number];

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
 * Groups follow the brands' `orderNumber`, then id, the order `/brendovi` uses
 * too (`lib/brand-order.ts`). Every catalog's brand stub carries both, so no
 * extra read is needed to sort them. A brand the site shows links to its page;
 * one it does not show still gets its group, unlinked, after the ordered ones.
 *
 * The two locale-dependent bits are passed in rather than decided here: the
 * label for the untagged group, and how a brand slug becomes a URL. Defaults
 * are the Serbian ones, which is what the tests assert.
 */
export interface GroupOptions {
  logoBySlug?: ReadonlyMap<string, string | null>;
  /** Heading for catalogs PACMS has not tagged with a manufacturer. */
  untaggedName?: string;
  /** Route for a brand we list. Localized, so it cannot be built from the slug here. */
  brandHref?: (slug: string) => string;
}

export function groupCatalogsByBrand(
  result: CatalogsResult,
  options: GroupOptions = {},
): CatalogGroup[] {
  const {
    logoBySlug = new Map<string, string | null>(),
    untaggedName = "Ostali katalozi",
    brandHref = (slug: string) => `/brendovi/${slug}`,
  } = options;
  // The response's own brand list first, the stub inside the catalog as the
  // fallback: both carry the name, id and orderNumber a group needs.
  const listed = new Map<string, CatalogBrand>(
    result.brands.map((brand) => [brand.slug, brand]),
  );
  const buckets = new Map<string, { brand: CatalogBrand; catalogs: Catalog[] }>();
  const untagged: Catalog[] = [];

  for (const catalog of result.catalogs) {
    if (catalog.brands.length === 0) {
      untagged.push(catalog);
      continue;
    }
    // No catalog carries more than one brand today, but the DTO allows it, so a
    // shared catalog belongs under each of its brands rather than silently under
    // whichever one happened to be first.
    for (const brand of catalog.brands) {
      const bucket = buckets.get(brand.slug);
      if (bucket) bucket.catalogs.push(catalog);
      else
        buckets.set(brand.slug, {
          brand: listed.get(brand.slug) ?? brand,
          catalogs: [catalog],
        });
    }
  }

  const groups: CatalogGroup[] = [...buckets.values()]
    .toSorted((a, b) => byOrderNumber(a.brand, b.brand))
    .map(({ brand, catalogs }) => ({
      slug: brand.slug,
      name: brand.name,
      imageUrl: logoBySlug.get(brand.slug) ?? null,
      href: isSiteBrand(brand) ? brandHref(brand.slug) : null,
      catalogs,
    }));

  if (untagged.length > 0) {
    groups.push({
      slug: UNTAGGED_GROUP_SLUG,
      name: untaggedName,
      imageUrl: null,
      href: null,
      catalogs: untagged,
    });
  }

  return groups;
}

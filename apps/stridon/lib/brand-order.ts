/**
 * Which PACMS brands stridon.rs shows, and in what order. Pure, so it can be
 * tested without the API module.
 *
 * The site lists the first `SITE_BRAND_COUNT` brands by `orderNumber`, and no
 * other (repo owner's rule). `orderNumber` is the webshop's sort key, and past
 * the head of the list it only pushes brands down (100, 1,000,000), so taking
 * every brand that has one listed 94. The brand route itself still renders any
 * slug PACMS knows, as it did before. `/katalozi` and `/servis` link a brand to
 * its page only when it is in this list.
 */
export interface OrderedBrand {
  id: number;
  orderNumber?: number | null;
}

/** How many brands the site lists, from the head of the `orderNumber` order. */
export const SITE_BRAND_COUNT = 25;

export function pickSiteBrands<T extends OrderedBrand>(brands: readonly T[]): T[] {
  return brands
    .filter((brand) => brand.orderNumber != null)
    .toSorted(byOrderNumber)
    .slice(0, SITE_BRAND_COUNT);
}

/**
 * `orderNumber` ascending, unset last, then `id`.
 *
 * PACMS breaks `orderNumber` ties by id in `/Brands`, but the brand stubs in
 * `/Catalogs` come back without that tiebreak (stanley 88 before bosch 13 and
 * dewalt 49, all `3`), so the rule is spelled out rather than inherited from
 * whichever endpoint the rows came from. A total order on a unique key is also
 * what makes the result independent of input order: the spec only guarantees
 * a stable sort for a consistent comparator (ECMA-262, SortIndexedProperties).
 */
export function byOrderNumber(a: OrderedBrand, b: OrderedBrand): number {
  const left = a.orderNumber ?? Number.POSITIVE_INFINITY;
  const right = b.orderNumber ?? Number.POSITIVE_INFINITY;
  if (left !== right) return left < right ? -1 : 1;
  return a.id - b.id;
}

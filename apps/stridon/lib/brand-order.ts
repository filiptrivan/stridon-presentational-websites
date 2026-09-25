/**
 * Which PACMS brands stridon.rs shows, and in what order. Pure, so the catalog
 * grouping can use it without importing the API module.
 *
 * The site lists every brand the CMS gives an `orderNumber`, and no other, in
 * that order (review on PR #14: "Take them by order number"). The brand route
 * itself still renders any slug PACMS knows, as it did before. The same rule
 * decides which catalog groups on /katalozi link to a brand page, so it is
 * written once, here.
 */
export interface OrderedBrand {
  id: number;
  orderNumber?: number | null;
}

export function isSiteBrand(brand: OrderedBrand): boolean {
  return brand.orderNumber != null;
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

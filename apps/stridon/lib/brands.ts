import { getBrands } from "@brand/shared/lib/api";
import type { Brand } from "@brand/shared/types/brands";
import { byOrderNumber, isSiteBrand } from "./brand-order";

/** The homepage brand wall shows the head of the site list. */
export const FEATURED_BRAND_COUNT = 11;

/**
 * The brands stridon.rs shows, in display order: every PACMS brand with an
 * `orderNumber` (see `brand-order.ts`).
 *
 * Read from `getBrands()` because it is the only brand list that carries
 * `orderNumber`; `BrandCards` does not. It is one cached entry for the whole
 * site: `/brendovi`, the homepage wall, the brand routes' static params, the
 * sitemap and `/servis` all filter the same read.
 */
export async function getSiteBrands(): Promise<Brand[]> {
  const brands = await getBrands();
  return brands.filter(isSiteBrand).toSorted(byOrderNumber);
}

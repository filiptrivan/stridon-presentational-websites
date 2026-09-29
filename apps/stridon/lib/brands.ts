import { getBrands } from "@brand/shared/lib/api";
import type { Brand } from "@brand/shared/types/brands";
import { pickSiteBrands } from "./brand-order";

/** The homepage brand wall shows the head of the site list. */
export const FEATURED_BRAND_COUNT = 11;

/**
 * The brands stridon.rs shows, in display order: the first 25 PACMS brands by
 * `orderNumber` (see `brand-order.ts`).
 *
 * Read from `getBrands()` because it is the only brand list that carries
 * `orderNumber`; `BrandCards` does not. It is one cached entry for the whole
 * site: `/brendovi`, the homepage wall, the brand routes' static params, the
 * sitemap, `/servis` and `/katalozi` all filter the same read.
 */
export async function getSiteBrands(): Promise<Brand[]> {
  const brands = await getBrands();
  return pickSiteBrands(brands);
}

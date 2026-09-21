import type { components } from "./api";

/** Aliased from the generated schema — see the header in `products.ts`. */
export type Brand = components["schemas"]["StorefrontBrandDTO"];

/** Lightweight listing shape: id, name, slug, imageUrl only. */
export type BrandCard = components["schemas"]["StorefrontBrandCardDTO"];

/** The manufacturer stub embedded in every catalog. */
export type CatalogBrand = components["schemas"]["StorefrontCatalogBrandDTO"];

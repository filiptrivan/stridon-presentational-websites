import type { components } from "./api";

/** Aliased from the generated schema — see the header in `products.ts`. */
export type Catalog = components["schemas"]["StorefrontCatalogDTO"];

/** The global `/Catalogs` payload: every catalog plus the brands they span. */
export type CatalogsResult =
  components["schemas"]["StorefrontCatalogsResultDTO"];

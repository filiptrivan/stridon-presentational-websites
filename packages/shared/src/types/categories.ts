import type { components } from "./api";

/**
 * Aliased from the generated schema — see the header in `products.ts` for why
 * these are never hand-written.
 *
 * Note for anyone looking for `ogImageUrl`: it was declared here until
 * 2026-08-03 and the backend has never sent it. Nothing read it, so it was a
 * silent fiction rather than a bug — which is exactly what a hand-maintained
 * interface is free to become.
 */
export type Category = components["schemas"]["StorefrontCategoryDTO"];

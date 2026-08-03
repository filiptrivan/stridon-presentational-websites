import type { components } from "./api";

/**
 * PACMS DTOs, ALIASED from the generated schema — never hand-written.
 *
 * These were transcribed by hand until 2026-08-03, and every transcription had
 * drifted from the backend: `Tag.imageUrl` was declared `string` against a
 * backend `string?` for its whole life, and `Category.ogImageUrl` was declared
 * against a field the API has never sent. A hand-written interface is a *claim*
 * about a payload rather than a derivation from one, so a wrong claim compiles
 * perfectly and hands `null` (or `undefined`) to code the types promised would
 * never see it. Aliasing makes that unrepresentable instead of detectable.
 *
 * Regenerate with `pnpm generate:types` against a running PACMS backend
 * (`http://localhost:5000`) — same doc, same tool, same version as
 * pa-storefront, which has consumed it this way from the start.
 *
 * Two consequences worth knowing before you fight the types:
 * - A field the backend does not mark `[Required]` generates as
 *   `field?: T | null`. Optional AND nullable is the honest shape; guard it.
 * - Generated DTOs carry fields these sites do not render. That is fine — the
 *   alternative is curating a subset by hand, which is the thing that broke.
 */

export type CategoryBreadcrumb = components["schemas"]["CategoryBreadcrumbDTO"];
export type ProductMedia = components["schemas"]["StorefrontProductMediaDTO"];

/** Lightweight DTO for product cards in lists, grids, and carousels. */
export type ProductCardData = components["schemas"]["StorefrontProductCardDTO"];

/** Full product DTO for product detail pages. */
export type Product = components["schemas"]["StorefrontProductDTO"];

export type ProductCardsResult = components["schemas"]["StorefrontProductsResultDTO"];

export type SitemapEntry = components["schemas"]["SitemapEntryDTO"];

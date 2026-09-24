# PACMS data

Everything this site shows about brands and catalogs comes from the PACMS API (`API_URL`, the prodavnicaalata.rs backend). The Storefront GET endpoints are public and anonymous; no key is needed for anything here.

## Brands

`lib/brands.ts` `getSiteBrands()` is the list the site shows: every brand from `getBrands()` that has an `orderNumber`, sorted by `byOrderNumber` from `lib/brand-order.ts` (orderNumber ascending, unset last, then id). It feeds `/brendovi`, the homepage wall (its first `FEATURED_BRAND_COUNT`), the brand routes' `generateStaticParams`, the sitemap and the links on `/servis`. This is the repo owner's rule from review: take the brands by order number.

- `getBrands()` is used because it is the only brand list that carries `orderNumber`; `getBrandCards()` (id, name, slug, logo) does not. It is one cached entry of about 850 KB shared by every consumer.
- The comparator is written out rather than inherited from API order: `/Brands` is sorted by orderNumber then id, but the brand stubs inside `/Catalogs` are not id-ordered within a tie.
- A brand page reads its brand with `getBrandBySlug()`, on the `critical` budget that `packages/shared/src/lib/request-budget.ts` reserves for the entity a route is about.
- The brand page body is the CMS `htmlDescription` through `@brand/ui` `Prose`. Many brands have none, and their page is the hero plus the shop link; the fix is CMS copy, not code.
- Logos are the CMS `imageUrl`. `BrandLogo` uses `object-contain` with padding (vendor logos are tight crops of any shape) and falls back to a wordmark cell when a brand has no image. Several CMS logos are JPEGs with a baked-in white ground, which is why logo plates stay white.
- Brand meta tags are one template with the name interpolated, not the CMS `metaTitle`/`metaDescription`; see `seo.md`.
- A brand slug outside the list still renders on demand if the CMS has it, since the route has no membership check. Nothing links to such a page.

## Catalogs

`/katalozi` reads `getAllCatalogs()` (the unscoped `/Catalogs`) and renders the shared `CatalogCardsGrid`, grouped by brand in `lib/catalog-groups.ts`, a pure function over that response plus the `getBrandCards()` logos. `__tests__/catalog-groups.test.ts` pins it.

- Groups follow the same comparator as `/brendovi`, over the brand stub each catalog carries (catalogs themselves have no orderNumber). A group links to its brand page when that brand has an orderNumber.
- A catalog with several brands is listed under each of them (none does today, but the DTO allows it).
- Catalogs with no brand go to a trailing "Ostali katalozi" group; tagging them in the CMS moves them with no code change.
- The group anchor is the CMS slug, the same one `/brendovi/[slug]` uses, so the brand page's "catalogs" button deep-links to `/katalozi#<slug>`. The button appears only when the live data has a catalog for that brand.
- Groups use `Section className="py-10 lg:py-12"` instead of the default spacing, or twenty groups make the page four times as tall.

## Service page

`constants/service-centers.ts` holds SG Servis and `SERVICED_BRAND_SLUGS`, the brands SG Servis repairs. That list is a fact about the service, not a display order, so it stays hand-kept. Names and logos come from `getBrandCards()`, and a card links to our brand page only when the site shows that brand. The shared `ContactLocations` closes the page with its default padding and divider; dck passes `sectionClassName="pt-0!"` and `showDivider={false}` only because its card sits right under the hero.

## B2B form

`lib/actions/b2b.ts` mails the request through Brevo to office@stridon.rs, because PACMS has no endpoint for dealer applications. `lib/schemas/b2b.ts` mirrors the old site's eight fields (PIB exactly 9 digits, registration number 8) and is a factory, because every message in it is shown to the visitor in their language. The action passes `THIRD_PARTY_BUDGET_MS` to its fetch, like the shared contact action.

## Caching

`packages/shared/src/lib/api.ts` is a file-level `"use cache"` module with `cacheLife("days")` (stale 5 min, revalidate 1 day, expire 1 week). Pages are statically prerendered and revalidate daily, so a CMS edit can take up to 24 hours to show. The `cacheTag` values are in place for a PACMS webhook calling `revalidateTag`, which does not exist yet. The same cached fetcher called from `generateMetadata` and from the page costs one read.

A build reads roughly one request per brand page plus a handful of lists. Without `PACMS_RATELIMIT_BYPASS_SECRET` those are anonymous; the root `CLAUDE.md` has the rate-limit history.

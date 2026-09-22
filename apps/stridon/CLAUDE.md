# CLAUDE.md - STRIDON

See root `../../CLAUDE.md` for shared principles, architecture patterns, and domain map.

## Project-Specific

- **Domain**: stridon.rs (parent company site - Stridon Group DOO)
- **Theme**: Light only, editorial. Primary red `#e50113` = `oklch(0.58 0.236 27.9)`; red is an accent (~10% of the page), never large surfaces.
- **Brand slug**: `stridon` (via `NEXT_PUBLIC_BRAND_SLUG` in `.env.production` / `.env.local`)
- **One rule style, everywhere.** Every horizontal separator on the site is the dashed hairline the shared `Section` draws at its top (`border-t border-dashed border-border/70`, inset `left-4 right-4 lg:left-8 lg:right-8`), which is what dck and sg-tools have always used. As of 2026-09-21 no app-local section closes with a solid `border-b border-border` any more - sections are `<Section>`, stacked bare like `apps/dck/app/page.tsx` stacks them, and each one draws its own rule above itself. The hero therefore has no bottom border, and the `<div className="border-b border-border">` that used to wrap `CompanyStats` on the homepage is gone: `Stats` is a `Section` and was always drawing its own. Two solid borders are deliberate and stay: the fixed navbar's `border-b` (shared chrome, identical on all three sites) and the hairline **inside** a card that separates a logo plate or a catalog preview from its label - card structure, not a page divider, and dashing it would read as a rendering bug.

- **Signature motif**: diagonal parallelogram from the Stridon logo (`-skew-x-[14deg]`). **The small red slabs are gone everywhere as of 2026-09-21** - the owner had them removed from section headings earlier, and then from the `/brendovi` row hover and the `BrandLogo` wordmark cell. Do not reintroduce one as a bullet, marker or accent. What survives is the **hero only**: two large skewed bands on the right edge (`w-36` primary and a `w-10` translucent companion, `lg:block`), which are a background graphic rather than a marker. Those are the last `skew` in the app; a grep for it should return `components/hero.tsx` and nothing else.
- **Radius**: `--radius: 0.25rem` (sharper than sg-tools/dck - technical editorial edge)
- **Fonts**: Inter (body) + Space Grotesk (headings), **self-hosted** variable woff2 in `public/fonts/` via `@font-face` in `globals.css` (latin + latin-ext for č ć ž š đ). No `next/font` - do not reintroduce it. Because nothing preloads them for us, `app/layout.tsx` renders a JSX `<link rel="preload">` for all four files (Serbian copy needs both subsets on every page) and `vercel.json` gives `/fonts/*` an immutable one-year cache; the reference apps get both for free from `next/font`. **`ReactDOM.preload()` does not work here** - under `cacheComponents` the call never reaches the emitted HTML.

## Differences vs sg-tools/dck

- **Not a single-brand product site**: Stridon is the distributor showcasing 30+ brands; purchases go to prodavnicaalata.rs. There is still no product catalog here - `/proizvodi/*` stays deleted, and the shop link on every brand page is what replaces it.
- **Every brand-scoped endpoint is empty for this app.** `BRAND_SLUG` is `stridon`, and stridon is not a manufacturer in the CMS - it is the importer. So `getCatalogs()` (`CatalogsByBrand?brandSlug=stridon`), `getCategories()` and `getTopProductsByBrand()` all structurally return nothing here, no matter how healthy the backend is. This app reads the **unscoped** fetchers instead: `getAllCatalogs()`, `getBrands()`, `getBrandCards()`, `getBrandBySlug()`.
- **Navbar without categories**: layout passes `showCategoryMenu={false}` to shared `RootLayout` (prop added for this app) so the navbar never fetches product categories.
- **No warranty flow** (that's dck-only; removed from this app).
- The only app-local sections left are the ones with no shared counterpart: `hero`, `brands` (the brand wall - no sibling site has a brand portfolio), `own-brand`, `brand-logo` and `b2b-form`. Everything else on this site renders a shared component, by owner's instruction on 2026-09-19: one implementation per section across all three apps, brand tokens doing the differentiating. Earlier app-local rewrites of Features/Stats/CTA/timeline/testimonials/companies/contact/404 were deleted, not parked.

## Homepage sections

Seven sections, in this order: `Hero` -> `Brands` -> `CompanyStats` -> `OwnBrand` (SG TOOLS) -> `OwnBrand` (DCK) -> `Features` -> `CTA`. Only the first two and the `OwnBrand` pair are app-local; the rest are `@brand/shared` and are wired exactly the way `apps/dck/app/page.tsx` wires them.

- **Hero** (app-local): full-bleed photo (`/about/sgtools-dck-tim.webp`) under a `bg-foreground/85` veil, centered type in white, and the red diagonal beam from the logo down the right edge. The outline button is restyled for the dark ground. The old `hero.svg` column grid and the `drill-electric.svg` are gone. This photo is a stand-in: it is a group portrait, so a wide crop cuts heads. A proper wide shot (storefront, warehouse, team under the STRIDON sign) should replace it.
- **Brands** (app-local): grid of 2:1 brand logo cards from `FEATURED_BRAND_SLUGS`, last cell links to `/brendovi`. There is no shared equivalent - the sibling sites each sell one brand. Redesigned 2026-09-21 from a full-bleed hairline grid to **separated `rounded-lg lg:rounded-xl` cards with a `hover:border-primary` hairline**, the same treatment `catalog-card` in `@brand/shared` uses, so this section and `/katalozi` stop being two visual systems stacked on one page. `/brendovi` and the serviced-brands wall on `/servis` carry the identical card; change one and change all three.
- **CompanyStats** takes `STATS` with `layout="four-up-no-three"` (four stats, same call dck makes) and counts up on scroll.
- **OwnBrand** (app-local) is one component rendering one brand from `OWN_BRANDS` (the section heading lives in the data, so the homepage and `/o-nama` cannot drift). Copy left, **photo** right (4:3, `object-cover`), matted since 2026-09-21 in the frame dck uses for its homepage hero: a soft grey outer plate with `p-2 md:p-3`, a hairline inner box, and the photo rounded inside it. Built from this app's tokens rather than dck's raw `neutral-*`, so it follows the palette instead of pinning the sibling site's. SG TOOLS shows the Altina storefront, DCK the trade-show booth.
- **Features** takes `FEATURES` with `title="Zašto Stridon?"`. It renders the shared `Feature` card, so the four claims now sit in pastel icon cards - the treatment an earlier pass had removed, restored deliberately when the site moved to shared components.
- **CTA** takes `CTA_TRUST_BADGES`; its heading and gradient come from `ctaHeading` / `ctaGradientClasses` in `packages/brand-config/src/stridon.ts`, and its button label and `/kontakt` target are hardcoded in the shared component. The badges are dealer-facing on purpose (B2B portal / Sopstveni brendovi / Katalozi / Servis u Beogradu). The ink band with the red diagonal beam that used to close the page is gone with `partner-cta.tsx`.

## Brands

Everything on a brand page is generated from PACMS as of 2026-09-21. `constants/brands.ts` holds **only** `BRAND_SLUGS`, a list of CMS slugs in display order, plus `FEATURED_BRAND_SLUGS` for the homepage wall, the local tile map, and two one-line helpers. Name, description, logo and SEO metadata all come from `getBrandBySlug()`, so adding a brand is one line here plus writing it in the CMS - no page, no copy, no asset, no types.

**The slug list has to exist, and it is the one thing to fix properly later.** PACMS has no per-site brand association: `Brands` returns the whole webshop catalogue (234 manufacturers ordered for prodavnicaalata.rs), and no field separates what Stridon imports from what the shop merely stocks - `orderNumber` is set on 94 brands including Makita, Villager, Metabo and Gardena, `htmlDescription` on 171, and `hasProducts` means the shop carries it. The clean fix is `BrandsByBrand?brandSlug=stridon`, the endpoint Shreyas asked for on PR #4 and that was declined; when it exists, `BRAND_SLUGS` is what a single `await` replaces and nothing else changes. **Array order is the display order everywhere** and the owner tuned it - DeWalt, Stanley, Bosch, REMS, Wiha, GTV, Knipex, Högert, Senco, Wera, Rubi, then the rest. Do not re-sort it, and do not replace it with a `count`.

**CMS slugs are canonical routes, and three legacy URLs are redirected.** The live stridon.rs has `/brendovi/hogert`, `/brendovi/kwb` and `/brendovi/black-and-decker` indexed while the CMS says `hogert-technik`, `kwb-germany` and `black-decker`. Carrying both spellings per brand was the old shape and it leaked into every consumer; now the CMS slug is the only one in the app and `LEGACY_BRAND_SLUGS` drives a 308 in `next.config.ts`. That map is a closed set that never grows - a brand added from here on has one spelling. Note the config imports it **relatively**, not through `@/`, which does not resolve in `next.config.ts`.

`/brendovi` reads `getBrandBySlug()` per slug rather than `getBrands()`, which would be the obvious call and is the wrong one: 828 KB of htmlDescription for 234 manufacturers to render cards that read two fields. The per-slug entries are the ones `/brendovi/[slug]` already fills, so the listing reuses them and costs no extra cache or build read. The card blurb is `metaDescription`, written for SEO, which is what a card wants; the body is `htmlDescription` through `@brand/ui` `Prose`, capped at `max-w-3xl` because the CMS ships one blob with no column to break it into. `generateStaticParams` comes from the constant, not the API - a build should not fan out 234 reads to discover 22 paths it knows.

**Two brands have no `htmlDescription` in PACMS (`max`, `black-decker`), so their pages are hero plus shop CTA and nothing else.** The old hand-written `fallbackSections` were dropped with the rest of the seeded copy; the fix is two CMS entries, not code.

**Logos are the CMS ones, everywhere, since 2026-09-21.** `public/brands/` and its 22 hand-drawn 2400x1200 tiles are deleted; `BrandLogo` takes `name` and the brand's PACMS `imageUrl`. The measurement that settled it: all 22 CMS logos together are 214 KB against 208 KB of local SVG, and `imageUrl` already rides along in `getBrandBySlug()` and `getBrandCards()`, so the switch costs **no extra request and no extra weight** while removing the one thing that still had to be drawn by hand per brand.

Two details in `BrandLogo` matter. It is `object-contain` with padding rather than `object-cover`: PACMS stores a tight-cropped vendor logo of whatever shape, so cropping it to 2:1 would cut letters off - the old tiles could use `cover` only because they were drawn with the padding baked in. And `unoptimized` is set **only** for `.svg` sources, because the optimizer rejects SVG unless `dangerouslyAllowSVG` is on and a few PACMS logos are SVG (dck today); everything else is resized and served as AVIF/WebP like any other remote image.

The wordmark cell (the name in letterspaced caps, no slab since 2026-09-21) is still there for a brand PACMS has no image for. One of 234 is in that state and none of ours, so it renders nowhere today - it exists so a brand added to `BRAND_SLUGS` can never break a grid.

**`BrandLogo` is for the grids only.** The brand page hero does not use it: `HeroHeader` takes a `ReactNode` title, so `app/brendovi/[slug]` passes a flex row of the CMS logo **beside** the brand name, with the back link as `pretitle` and the two CTAs as `children`. It started as a framed 2:1 plate under the name and the owner had both the frame and that position removed on 2026-09-21 - the plate read as an empty grey box, and the mark belongs next to the word it names. The row is `flex-wrap` deliberately: at phone width the longest name we carry ("HÖGERT Technik") does not fit beside a mark, and wrapping drops the logo onto its own line above instead of squeezing both.

## Catalogs

`constants/catalogs.ts` is **gone** (2026-09-19) along with its 29 Google Drive share links. `/katalozi` reads `getAllCatalogs()` and renders the shared `CatalogCardsGrid` - the same preview tiles dck and sg-tools get from the shared `catalogs-page`, which this app cannot export directly only because that component calls the brand-scoped `getCatalogs()`. 32 catalogs, real hosted PDFs on `media.prodavnicaalata.rs`, real preview images.

**Grouped by manufacturer since 2026-09-21**, by `lib/catalog-groups.ts`, with the CMS logo beside each heading. That is a pure function over the one `getAllCatalogs()` response the page already awaited plus the `getBrandCards()` map - the same cached entry the homepage brand wall fills, so the logos cost nothing extra. `__tests__/catalog-groups.test.ts` pins the ordering. dck and sg-tools stay flat on purpose: each sells one brand, so their whole page is one group.

Three rules live in that function, and all three have a reason:

- Listed brands come first in `BRAND_SLUGS` order; everything else follows **by name**. `orderNumber` looks like the obvious sort key and is not one - PACMS hands out duplicates (stanley, bosch and dewalt are all `3`), so sorting by it would leave the tail order up to however the backend returned the rows.
- A group's anchor is the CMS slug, the same one `/brendovi/[slug]` uses, so the deep link from a brand page and the section on this page can never drift apart.
- A catalog with several brands is listed under each of them. No catalog does that today, but `StorefrontCatalogDTO` allows it, and picking the first brand would silently drop a catalog from a page it belongs on.

The catalog button on a brand page is conditional on the live data (`catalogs.some(c => c.brands.some(b => b.slug === brand.slug))`) and deep-links to that brand's group. Sparta, Karcher and Wolfcraft have no catalog in the CMS, so their pages carry no button and promote the shop link to primary.

Group headings link to `/brendovi/<slug>` only for a brand in `BRAND_SLUGS`. A heading with no link means the CMS has catalogs for a manufacturer stridon.rs does not show - today nothing, since dck, einhell and oli were added to the list on 2026-09-21 for exactly that reason. The trailing "Ostali katalozi" group holds catalogs PACMS has not tagged with a manufacturer at all; one lands there ("REMS akcija 2026."), and tagging it in the CMS moves it up on the next revalidate with no code change.

Each group passes `className="py-10 lg:py-12"` to `Section` rather than taking its `py-16 lg:py-24`: that spacing is sized for a handful of sections on a page, and twenty of them made a 3,000px page 12,500px. An anchor-pill index above the first group was tried on 2026-09-21 and removed the same day at the owner's call - the deep link from the brand page is how people arrive here.

## About page

`/o-nama` is `HeroHeader` -> `CompanyValues` -> `OwnBrand` x2 -> `Testimonials` -> `Companies`. Only `OwnBrand` is app-local; the content all comes from `constants/about.ts`.

- `ABOUT_MILESTONES` is the company timeline lifted from `apps/sg-tools` (same family business, same story): 1996 buvljak -> 2009 Vojislava Ilica -> 2014 prodavnicaalata.rs -> 2015 Altina -> 2023 SG TOOLS. It carries sg-tools' `icon` / `color` / `bg` / `border` per step too, because the shared `Milestone` type requires them. Photos live in `public/about/`, re-encoded to webp at 1600px (they arrived as ~5 MB phone JPEGs).
- `PARTNER_QUOTES` (8) is typed as the shared `Testimonial`, which is `{ personName, quote }` - **there is no logo slot**, so the company logos that used to sit under each quote are gone. The same SVGs still feed `CLIENT_LOGOS`, which `Companies` shows as a marquee under "Ko su naši klijenti".
- Shared `Testimonials` grew an optional `title` prop on 2026-09-19 (it was the one section component in the package without one) so this page can keep its "Šta naši saradnici kažu o nama" heading. Omitting it renders no heading, so dck and sg-tools are byte-identical to before.
- `OWN_BRANDS` covers SG TOOLS and DCK, including the section heading and the photo each one shows. `/o-nama` renders the same `OwnBrand` component the homepage uses, so both pages always show the same headings and copy. The DCK blurb is written from `packages/brand-config/src/dck.ts`, not from anything the owner said - confirm before launch.
- SG TOOLS also has its own block on the homepage, so that copy appears twice.

## Service, contact and B2B pages

- **`/servis`**: `HeroHeader` -> serviced brands as logo tiles (same hairline wall as the homepage, and since 2026-09-21 the same CMS data: `SERVICED_BRAND_SLUGS` is a list of PACMS slugs, names and logos come from the `getBrandCards()` entry the homepage already fills, and a row links to our brand page only when the slug is also in `BRAND_SLUGS`, which since 2026-09-21 leaves Festool as the single serviced-but-unlisted card, rendered without the hover) -> the in-warranty / out-of-warranty split -> the SG Servis copy -> the shared `ContactLocations`, called bare. dck passes `sectionClassName="pt-0!"` and `showDivider={false}` there because on that site the card sits straight under the hero; here it closes a page of sections, so it keeps both its padding and its dashed rule. `constants/service-centers.ts` holds SG Servis (Vojislava Ilića 141b) as a shared `ContactLocation` and `SERVICED_BRAND_SLUGS`; opening hours live in the copy, not in the card. Old-site copy was in "Vi" form and was rewritten to "ti".
- **`/kontakt`**: the shared `ContactPage` - a centered `HeroHeader` with the form under it and the direct-mail line, the same four-line page dck and sg-tools have. Its metadata comes from `contactDescription` in brand-config.
- **`/b2b`**: `HeroHeader` "B2B platforma" -> "Već imaš B2B nalog?" with the button to `b2b.wings.rs/stridon` -> "Zatraži pristup B2B platformi" with the request form. `lib/schemas/b2b.ts` mirrors the old site's eight fields and limits (PIB exactly 9 digits, registration number 8). `app/b2b/actions.ts` mails the request through Brevo because **there is no PACMS endpoint for dealer applications**; when one exists, only that action changes.
- **The `tel:` link was fixed in `packages/shared` on 2026-09-22 (`f7b3284`)**, the way this file said it should be. It had been written down as known-broken since 2026-09-19: `ContactLocations` built its href with `phone.replace(/-/g, "")`, which strips hyphens and leaves the slash a Serbian number is written with, so `/servis` rendered `tel:065/3378812`. What the note missed is that `formatTelHref`, the helper that looked like the ready-made fix, had the **inverse** defect - it prepended `+381` unconditionally, and dck spells its service centres `+381-21-410000`, which reach `dealer-list` through `DEALERS`, so that page had been emitting `tel:+381+38121410000`. The helper now strips separators first and only adds the country code to a number without one, and `ContactLocations` calls it. Local numbers are unchanged, both broken cases are fixed. `/servis` renders `tel:+381653378812`.
- **`ContactLocations` takes an optional `labels`** since the same commit, for the one hardcoded Serbian string in it ("Otvori u Google Maps"), which `/en/service` used to render in Serbian. Serbian default, so dck and sg-tools are byte-identical; this app passes `Service.center.openInMaps`.
- **`constants/contact.ts`** holds the two store locations and opening hours off the old site, already shaped as `ContactLocation`. Nothing renders them right now - the shared contact page is the form only.
- **Map tiles show a CARTO "API KEY REQUIRED" watermark** - CARTO now gates `basemaps.cartocdn.com`. It hits `addBrandTileLayer` in `@brand/shared/lib/map.ts`, so dck and sg-tools have it too.
- **`app/[locale]/not-found.tsx`** is the shared `NotFoundPage`. Its second button used to link to `/proizvodi/kategorije`, a route this site does not have; `NotFoundPage` now takes `secondaryHref` and this app passes `/brendovi`, the closest thing Stridon has to a catalogue.
- **`app/[locale]/[...rest]/page.tsx` is what makes that 404 reachable at all**, added 2026-09-22 (`d510fb7`). Next routes an unmatched URL to the **root** `app/not-found.tsx`, and this app cannot have one, because the root layout lives under `[locale]` so that `locale` is a root param. A nested `not-found.tsx` only covers a `notFound()` thrown inside its own segment, so before this, only an unknown brand slug got the branded page and every other unknown URL - `/proizvodi`, `/gde-kupiti`, the ones the old site still has indexed - fell through to Next's own unstyled English 404. The catch-all is next-intl's prescribed shape for this layout and sits below every static route. **Do not delete it as "a page that does nothing".** Note that `notFound()` under `cacheComponents` answers with an empty `<body id="__next_error__">` and streams the UI in, so a 404 is blank without JavaScript; that is Next's behaviour, identical on `/brendovi/nepostojeci-brend`, which has worked this way since the CMS pass.

## Mobile

- Brand names on `/brendovi` sit flush with the blurb and the link below them. They used to be indented by a hover-only slab and to nudge right on `group-hover`; both went with the motif, so the card's only hover signal is its border turning primary, the same as the homepage wall.
- **The sharp `--radius: 0.25rem` in `globals.css` is still deliberate** ("technical, editorial edge", buttons excepted at `0.625rem`), but the brand cards use the fixed `rounded-lg` / `rounded-xl` utilities, so they read like the sibling sites regardless of the token. Raising the token for the whole app was the alternative and was not taken - it would soften every input and card on the site, which is a bigger call than this section.
- `/brendovi` shows two cards per row on mobile (`grid-cols-2 lg:grid-cols-3`). The blurb is now the CMS `metaDescription`, still `line-clamp-4` - open question whether to clamp harder or drop it there.
- Navbar: the logo is `w-auto` (was `w-max`, which let the intrinsic width win) with `navbarLogoHeight: "h-7 md:h-8"`; the Union Jack SVG was stretched (viewBox 60x30 inside a 30x20 box) and is now `h-3.5 w-7`; the right cluster uses `gap-x-2 md:gap-x-4` and the burger is nudged with `-mr-1.5`.
- The sheet close button uses `focus-visible:` instead of `focus:` (Radix focuses it programmatically on open, so the red ring showed on touch), and `a[data-slot="sheet-close"]` was added to the button radius rule in `globals.css` - nested `asChild` overwrites `data-slot="button"`, so the menu CTA was stuck at the sharp 2px radius instead of the dck 8px. That rule re-points `--radius` on those elements rather than hardcoding a `border-radius`, so `rounded-*` utilities still mean something on a Button.

## Status / TODO

- Done (design pass): homepage, `/brendovi`, `/brendovi/[slug]`, `/katalozi`, `/o-nama`, `/servis`, `/kontakt`, `/b2b`, 404.
- Done (shared-component pass, 2026-09-19): every section with a `@brand/shared` counterpart now renders that counterpart. Deleted: `page-header`, `about-timeline`, `partner-quotes`, `clients`, `location-cards`, `stats-band`, `why-stridon`, `partner-cta`. Two known regressions were accepted at the time rather than forked around, and **both have since been fixed in `packages/shared`, which is where those notes said the fix belonged** - see the `tel:` and 404 notes above. **Remaining app-local components: `hero`, `brands`, `own-brand`, `brand-logo`, `b2b-form`** - the owner wants these redesigned toward the shared look next, not re-forked.
- `/politika-privatnosti` and `/uslovi-koriscenja` were rewritten off the dck originals: stridon.rs, office@stridon.rs, distributor framing, and the privacy policy now lists the B2B form's company fields (PIB, matični broj) alongside the contact form's. They use the shared `HeroHeader`, which every other page now does too - the header treatment is consistent across the site as of 2026-09-19.
- Done (API pass, 2026-09-19, made fully dynamic 2026-09-21): `/brendovi`, `/brendovi/[slug]`, `/katalozi` and the homepage brand wall all read PACMS, and no brand copy is hand-written any more. Added to `packages/shared/src/lib/api.ts`: `getAllCatalogs`, `getBrands`, `getBrandCards`, `getBrandBySlug`, plus `TAGS.brands` and `src/types/brands.ts`. All four are covered by new cases in `apps/dck/__tests__/dto-shape.integration.test.ts` rather than parked in that suite's debt ledger - they are anonymous reads, so they need no key.
- **The backend moved, it is not gone**: `api.pacms.in.rs` no longer resolves, but the same backend answers on `https://api.prodavnicaalata.rs` (the fallback in `dto-shape.integration.test.ts` has said so since 2026-08-30). Set `API_URL` to it in `.env.local`; it is not in `.env.production`, which reads `API_URL` from Vercel. The `/proizvodi/*` pages, `/gde-kupiti` with `constants/dealers.ts` and `app/api/products/search` are still deleted, and now for a different reason: product and category reads are brand-scoped, so they would render empty for `brandSlug=stridon`. Restoring them needs a product story, not just an API. `app/sitemap.ts` is a static list of the real pages plus the 19 brands.
- Done (English, 2026-09-21): the site is bilingual, both locales prerendered, every Serbian URL unchanged. See **Internationalisation** below.
- Done (optimisation and security pass, 2026-09-22): see that section below for the thirteen commits and what each one found.
- **In progress: SEO.** The homepage is carried over; the remaining pages need the same treatment, page by page, from the live site's own tags. See the SEO section below.
- Pending: the production `NEXT_PUBLIC_SENTRY_DSN`, which is empty in `.env.production` so Sentry is silently off. Turnstile is not missing - Filip removed it from the whole monorepo in `bda05b5`, env kept for rollback, so no form here has bot protection by decision.
- Pending, raised and not acted on: no CSP header anywhere in the monorepo (a report-only draft sized for this app's actual sources is in the chat history), unescaped HTML in the shared `sendContactEmail`, `API_URL` in the Vercel env before deploy, and a PACMS webhook to `revalidateTag` so a CMS edit is not up to 24h behind.

## Seeded content

`ABOUT_MILESTONES`, and previously `constants/brands.ts` and `constants/catalogs.ts`, were scraped out of the old sites (`__NEXT_DATA__` i18n JSON on www.stridon.rs, plus `apps/sg-tools/constants/content.ts`). The scrape/generator scripts were throwaway - edit what is left by hand. **No brand or catalog copy is seeded content any more**: all of it lives in the CMS as of 2026-09-21, and what remains here is the About page, the service centres and the B2B form.

## Internationalisation

Serbian and English, `next-intl@^4.14.5` on Next 16.3.5, both locales statically prerendered (84 pages, was 40).

**The Next upgrade was a prerequisite, not a preference.** The locale is read with `next/root-params`, which is the only way to get it inside a `'use cache'` scope: `cookies()` and `headers()` both drop static prerendering under `cacheComponents`, and passing the locale by hand would mean threading it through every cached function in `@brand/shared`. That API is stable from 16.3.0, so 16.1.6 could not have it. All three apps moved together, and a `pnpm overrides` entry in the root `package.json` pins one version for every workspace package and every transitive peer - with only the apps bumped, `@brand/shared` resolved its `next` peer from the root install and the build type-checked against two different `NextRequest` types.

**Routing.** `localePrefix: "as-needed"` with a `pathnames` map in `i18n/routing.ts`. The key of each entry is the internal route - the folder under `app/[locale]/` - and the value only names the locales that spell it differently, so **no folder was renamed** and `/o-nama`, `/brendovi/dewalt` and the rest are byte-identical to what Google has indexed. English is an alias on top: `/en/about`, `/en/brands/dewalt`. `/sr/*` 307s to the bare path so the two spellings never both rank, and the three legacy brand slugs still 308 through `redirects()` in `next.config.ts` (those run before the proxy).

Locale detection and the locale cookie are both **off**. With detection on, `/` becomes a per-visitor redirect and stops being one cacheable document; with the cookie on, which URL a redirect lands on depends on invisible state (next-intl#1845). The prefix is the whole story.

`proxy.ts` (Next 16's name for `middleware.ts`; the export may be default or named `proxy`) does the rewrite. **Its matcher is a string literal and the escaped dot in it matters:** written with a single backslash the escape collapses, the pattern becomes `.*.*`, the negative lookahead then rejects every path of at least one character, and the proxy runs on `/` and nowhere else while every other URL 404s - with the build still reporting a proxy. Next only static-analyses a literal there, so it cannot be built from a variable, a RegExp or `String.raw`.

**What is translated.** Only copy written in this repo: `messages/{sr,en}.json`, ~250 strings in 16 namespaces. **Brand and catalog copy is not here** - it lives in PACMS, which returns the right language per request, so `/en/brands` shows whatever the CMS holds. A brand page's `<title>` is therefore still Serbian until the CMS has an English `metaTitle`; that is the CMS's job, not this repo's. The B2B email body also stays Serbian whichever language the form was filled in, because it goes to office@stridon.rs.

**`@brand/shared` has no i18n dependency and must not grow one.** dck and sg-tools have no i18n config, so a `useTranslations` call anywhere in the shared tree throws for them. Every shared component keeps its Serbian as `DEFAULT_LABELS` and takes an optional `labels` object plus, where it links, an optional href; pass nothing and the output is byte-identical to before. `app/[locale]/layout.tsx` is where this app fills them in.

**Paths into shared components go through `lib/nav.ts`.** Shared components link with plain `next/link`, which knows nothing about locales, so an unconverted `/brendovi` inside the English site sends the reader back to Serbian. `pathFor()` for a static route, `brandPath()` for `/brendovi/[slug]`.

**Metadata** is built by `lib/metadata.ts`, not the shared `createPageMetadata` directly: that one takes a single `canonicalUrl`, which would have the English page declare the Serbian URL as its canonical. Each page gets its own canonical plus an `alternates.languages` set; `sitemap.ts` lists both locales with the same alternates. hreflang uses **`sr-Latn`** (Serbian is digraphic and this site is Latin-only) even though the URL segment stays `sr`.

**The legal pages** are one HTML document per locale in the catalog, rendered through `Prose`, not forty ICU keys each - statutory prose that has to stay diffable against what a lawyer approved. Only the two internal links are tokens (`__PRIVACY__`, `__CONTACT__`), filled in by `lib/legal.ts`.

**Two places root params do not reach**, both permanent or long-term:

- **Server Actions.** An action is not tied to a route, so `sendB2bRequest` takes the locale as an argument and validates it against the locale list before using it. The B2B zod schema is a factory for the same reason - every message in it is shown to the visitor.
- **Route Handlers** ("planned" upstream). `app/api/og` sits outside `[locale]` and reads query params, so it is unaffected.

### Known: five failing prefetches per Serbian page, left in place deliberately

Load a Serbian page, scroll it, and the console shows a handful of 404s on
`?_rsc=` requests. Nothing is broken - every link navigates, and the pages
themselves are all 200 and prerendered. What fails is one of the two background
requests Next fires to warm a link up before it is clicked.

**What is actually requested vs what exists.** For `/o-nama` the router asks for
the segment

```
wants:   /$d$locale/__PAGE__
on disk: /$d$locale/o-nama/__PAGE__
```

`$d$locale` is our `[locale]` segment, and the router has consumed `o-nama` as
the locale's *value*. That key only exists for the homepage, hence the 404.

**Why it did not exist before, and does not exist on dck or sg-tools.** Those two
have no `[locale]` segment and no proxy, so `/o-nama` is one URL segment and one
route segment and the two always agree. Here `/o-nama` is internally
`/sr/o-nama`, two segments, while the URL still shows one, because the `sr`
prefix is deliberately hidden to keep every indexed URL byte-identical. The
proxy bridges that per request; the client router computes the segment key from
what is in the address bar, so it is short by exactly that segment.

**This is why the English side is clean**: `/en/about` carries the prefix, so URL
and tree have the same depth. Measured on a full scroll: Serbian homepage 37 ok
/ 5 failed, English homepage 42 ok / 0 failed. The five are `/o-nama`, `/b2b`,
`/servis` and the two legal pages.

**It is the price of `localePrefix: "as-needed"`**, and the alternative was worse:
`always` would turn every Serbian URL into `/sr/...` and send everything Google
has indexed through a redirect.

**Two fixes were measured and neither was taken.** Numbers are the same full-scroll
test on the Serbian homepage:

| | ok | failed | note |
|---|---|---|---|
| as shipped | 37 | 5 | the five routes linked only from the navbar and footer |
| `prefetch={false}` on navbar + footer | 28 | 3 | **worse**: the failures move to `/brendovi`, `/katalozi` and `/kontakt`, which had working prefetch, and those are the three most used links on the site |
| `prefetch={true}` on navbar + footer | 102-170 | 0 | forces full-route prefetch, which is the request that succeeds. Clean console, every chrome link instant, but roughly double the requests on a realistic load-and-scroll (35 -> 65) |

`prefetch={true}` is the one that works if the console matters more than the
bandwidth; it is a single optional prop threaded from `RootLayout` through
`Navbar`, `MobileMenu` and `Footer`, defaulting to today's behaviour so dck and
sg-tools are untouched. The owner chose to leave it as is on 2026-09-21.

**What is not understood**, and should not be guessed at in a future pass: why
five of the ten routes fail rather than all ten. It tracks with whether the link
is rendered in the layout or in the page body - the failing set moved when
prefetch was disabled on the chrome - but that is Next's internal key
computation and the behaviour above is all that was actually verified. Next's
own answer for links behind a proxy rewrite is to pass `as` and `href`
separately (see the "Prefetching links in Proxy" section of the `<Link>` docs),
which would mean changing how `@brand/shared` renders every link on all three
sites.

**Gotchas found doing this:**

- The **language switch lives in the navbar**, which `@brand/shared` renders outside the page's `NextIntlClientProvider`, and next-intl's `usePathname` needs a locale in context. It gets its own provider with an empty catalog (`messages={{}}`); its one string arrives as a prop. Without it, every English page fails to prerender.
- The switch uses `getPathname` with a plain `next/link`, **not** next-intl's `Link` with a `locale` prop: that prop always emits a prefix, so switching back to Serbian would link to `/sr/brendovi/dewalt` and rely on a redirect. The prefix exists to update a locale cookie, and this site sets none.
- `constants/*.ts` are module constants, evaluated at import with no request and no locale in scope. They keep the structure - route, icon, accent colour, photo, year, company name - and the page pairs each `key` with its translation.
- A **stale `next start` on port 3100 will happily answer while a new one fails with EADDRINUSE**, which reads exactly like a translation bug: correct `<html lang>`, Serbian text. Check the log before debugging the catalog.
- `dck/__tests__/api-contract-coverage.test.ts` reads files through `git ls-files`, so deleting a tracked file without staging the deletion fails `pnpm preflight` with an ENOENT on a path that is already gone.

## Optimisation and security pass, 2026-09-22

Thirteen commits on top of `7902b17`, tagged `stridon-pre-optimizacija` (before) and `stridon-optimizacija-2026-09-22` (after), pushed to `origin` only. **Nothing went to the upstream fork** - PR #14 still shows the older ten commits. Verified at the end: `tsc` clean on all three apps, `pnpm preflight` 7/7, production build 87 pages (was 84 - the catch-all adds three route entries), and the 404, OG route and logo checks below were run against a real server rather than reasoned about.

Three of these are in `packages/shared` and therefore cross-brand; each says so in its commit body, so they can be pulled out when this goes upstream: `545834e` (OG template key), `ded0314` (form `aria-describedby`), `f7b3284` (phone + maps label). `824c305` touches `packages/brand-config` and both shared chrome components, also behind fallbacks.

Things worth not rediscovering:

- **`NextIntlClientProvider` now receives an explicit `messages`, and that is load-bearing.** Rendered from a Server Component with no `messages` prop it inherits the **whole** catalog into the flight payload of every page - `/sr/servis` was carrying both legal documents, ~9.9 kB of prose it never renders. It now gets `Error` and `B2b`, the only two namespaces a client component under it reads, which took about 22 kB off every page (`/sr/servis` 106,886 -> 84,704 bytes). **Adding a client `useTranslations("X")` anywhere means adding `X` to that object in `app/[locale]/layout.tsx`, or it throws at runtime.** Kept at whole-namespace granularity deliberately: narrowing to `B2b.form` saves 611 more bytes and needs a second provider on the B2B page, which fragments that one rule.
- **Next replaces a parent's `openGraph` wholesale rather than merging it.** The layout sets `siteName` and `type`; `createPageMetadata` sets `openGraph` again with only title/description/images, so both were silently dropped on every page that defines its own metadata - which was all of them except the homepage, the one page with no `generateMetadata`. `lib/metadata.ts` restates them. Anything else added to the layout's `openGraph` has to be restated there too.
- **`robots.ts` must not disallow `/api/` or `/_next/`.** It did. `/api/og` is every page's `og:image`, and `/_next/` covers `/_next/image` (every optimized image) and `/_next/static` (the CSS and JS Googlebot renders with). Only `/monitoring`, the Sentry tunnel, is disallowed now. dck and sg-tools still carry the original rule.
- **`unoptimized` on `next/image` is only ever for `.svg`.** `/katalozi` had it set unconditionally on the group-heading logo, with a comment claiming it matched `BrandLogo` - it did not. That shipped 19 raw CMS logos, 173 kB, into 64x32 boxes, of which exactly one was an SVG.
- **`sizes` has to match the grid, not the intention.** `/brendovi` declared a three-column `sizes` for a `grid-cols-2 lg:grid-cols-3` grid, so a phone picked the `w=828` candidate for a ~173px slot on all 24 logos.
- **`priority` is deprecated in Next 16**, renamed `preload`. Same behaviour; the type carries the deprecation.
- **Logo dimensions come from brand-config.** `logoWidth` / `logoHeight` are optional on `BrandConfig`; navbar and footer fall back to the constants they were hardcoded to (100x20 and 96x32), so dck and sg-tools are unchanged. Stridon declares 456x186, the wordmark's viewBox. The footer was the one warning: Next's check is `(heightModified && !widthModified) || (!heightModified && widthModified)`, and `h-8 w-auto` on a 2.46:1 logo landed the height on exactly the declared 32 while the width came out 79 against 96. The navbar had the same wrong ratio and escaped only because `h-7` changes the height too. Rendered size is 79x32 before and after - what changed is that the reserved box now has the asset's ratio.
- **`favicon.ico` in `app/manifest.ts` declares its real frames, not `sizes: "any"`.** `any` declares a scalable resource and belongs to vector formats; the file holds 48/32/16, and Chrome logged "Resource size is not correct - typo in the Manifest?" on every page load. The two PNGs were never wrong.
- **`lib/actions/b2b.ts` passes `THIRD_PARTY_BUDGET_MS`.** `request-budget.ts` names the Brevo calls as covered and lists one deliberate exclusion (the dck warranty POST); this action was written after that policy and was the only unbounded `fetch` in the app.

### Console triage - what is ours and what is not

Re-run this classification before chasing anything in the dev console again.

| message | verdict |
|---|---|
| `icon from the Manifest (Resource size is not correct)` | **was ours**, fixed (`ec15ee0`) |
| `Image ... has either width or height modified` | **was ours**, fixed (`824c305`), and it was the **footer**, not the navbar |
| hydration mismatch on `cz-shortcut-listen="true"` | **not ours** - a ColorZilla browser extension attribute on `<body>`. Zero hydration errors in a headless browser with no extensions. Do not add `suppressHydrationWarning` to hide it |
| `preloaded using link preload but not used` on the four fonts | **not a bug** - dev only. All four `@font-face` report `status: "loaded"`, body computes to Inter and `h1` to Space Grotesk. A first headless load took 6,733 ms while Turbopack compiled and produced four warnings; a second, already compiled, produced zero. The warning measures the gap between `window.load` and first use |
| `Route /[locale] is rendering with server caches disabled` | dev only, Next's own `cache-bypass-in-dev` notice - `use cache` is bypassed in `next dev` by design |
| `[HMR] connected`, `[Fast Refresh]`, React DevTools tip | dev only |

## SEO

**The homepage `<title>` and description are the live stridon.rs ones, carried over verbatim** (`167bb6c`): `Najbolja prodavnica alata u Srbiji | Stridon Group` (50 chars) and the 157-character description. This URL is already ranked, and a title is a ranking input, so the rebuild does not get to reword it. The one edit is the missing diacritic in "Pogledajte nase cene", which is not a ranking factor and is what shows in the snippet.

**Those two strings live in two places and must move together.** `messages/{sr,en}.json` -> `Site.defaultTitle` / `Site.description` feed the rendered tags; `packages/brand-config/src/stridon.ts` -> `defaultTitle` / `siteDescription` feed the **OG card** through `createRootMetadata`, because the layout overrides title and description but keeps the parent's `openGraph.images`. Change one and the social card silently keeps the old text.

**Open, and a business call rather than a technical one:** that title and description promise a shop - "online prodaja", "jeftine cene", "Pogledajte naše cene, akcije". This site has no product, price or promotion; buying happens on prodavnicaalata.rs. Buy-intent traffic lands on a page that cannot serve it, and Google routinely rewrites a description that does not match the page. Flagged to the owner on 2026-09-22 and deliberately left as the live site has it.

Already done and needing nothing: every page has its own canonical plus `alternates.languages`, `sitemap.ts` lists both locales with the same pairs, and the proxy adds `Link: rel=alternate` headers. `<html lang>` is **`sr-Latn`**, not `sr-RS`: Serbian's default script is Cyrillic, so a bare `sr-RS` claims Cyrillic content. `sr-Latn-RS` is the form to use if the region is ever wanted.

Remaining: the OG card still draws a text wordmark rather than the logo, the favicons are not generated from the new SVG, and Search Console wants watching for two weeks after deploy.

## Commands

```bash
pnpm dev:stridon   # from repo root (or `pnpm dev` here) - localhost:3000
pnpm -C apps/stridon exec tsc --noEmit   # type-check (never npx tsc)
```

Only one `next dev` instance at a time (`.next/dev/lock` + port 3000). Do not set `turbopack.root` (breaks Tailwind resolve under pnpm); the "multiple lockfiles" warning is harmless.

The running dev server does **not** pick up a Tailwind class that appears for the first time in a **new file** - the utility is simply missing from the stylesheet until dev restarts. Either reuse a class the project already has or restart. To verify a production build without disturbing the owner's dev server, add a temporary `distDir: process.env.NEXT_DIST_DIR ?? ".next"` to `next.config.ts` and run `NEXT_DIST_DIR=.next-verify next build`.

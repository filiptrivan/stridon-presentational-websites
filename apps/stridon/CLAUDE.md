# CLAUDE.md - STRIDON

See root `../../CLAUDE.md` for shared principles, architecture patterns, and domain map.

## Project-Specific

- **Domain**: stridon.rs (parent company site - Stridon Group DOO)
- **Theme**: Light only, editorial. Primary red `#e50113` = `oklch(0.58 0.236 27.9)`; red is an accent (~10% of the page), never large surfaces.
- **Brand slug**: `stridon` (via `NEXT_PUBLIC_BRAND_SLUG` in `.env.production` / `.env.local`)
- **Signature motif**: diagonal parallelogram from the Stridon logo (`-skew-x-[14deg]` slabs). What is left of it after the shared-component pass: the red beam in the hero, the hover markers on `/katalozi` and `/brendovi` rows, and the `BrandLogo` wordmark fallback. **Not on section headings** - the owner had those little red slabs removed.
- **Radius**: `--radius: 0.25rem` (sharper than sg-tools/dck - technical editorial edge)
- **Fonts**: Inter (body) + Space Grotesk (headings), **self-hosted** variable woff2 in `public/fonts/` via `@font-face` in `globals.css` (latin + latin-ext for č ć ž š đ). No `next/font` - do not reintroduce it. Because nothing preloads them for us, `app/layout.tsx` renders a JSX `<link rel="preload">` for all four files (Serbian copy needs both subsets on every page) and `vercel.json` gives `/fonts/*` an immutable one-year cache; the reference apps get both for free from `next/font`. **`ReactDOM.preload()` does not work here** - under `cacheComponents` the call never reaches the emitted HTML.

## Differences vs sg-tools/dck

- **Not a single-brand product site**: Stridon is the distributor showcasing 30+ brands; purchases go to prodavnicaalata.rs. No product catalog wired yet - API/data wiring is deliberately postponed to the end of the redesign.
- **Navbar without categories**: layout passes `showCategoryMenu={false}` to shared `RootLayout` (prop added for this app) so the navbar never fetches product categories.
- **No warranty flow** (that's dck-only; removed from this app).
- The only app-local sections left are the ones with no shared counterpart: `hero`, `brands` (the brand wall - no sibling site has a brand portfolio), `own-brand`, `brand-logo` and `b2b-form`. Everything else on this site renders a shared component, by owner's instruction on 2026-09-19: one implementation per section across all three apps, brand tokens doing the differentiating. Earlier app-local rewrites of Features/Stats/CTA/timeline/testimonials/companies/contact/404 were deleted, not parked.

## Homepage sections

Seven sections, in this order: `Hero` -> `Brands` -> `CompanyStats` -> `OwnBrand` (SG TOOLS) -> `OwnBrand` (DCK) -> `Features` -> `CTA`. Only the first two and the `OwnBrand` pair are app-local; the rest are `@brand/shared` and are wired exactly the way `apps/dck/app/page.tsx` wires them.

- **Hero** (app-local): full-bleed photo (`/about/sgtools-dck-tim.webp`) under a `bg-foreground/85` veil, centered type in white, and the red diagonal beam from the logo down the right edge. The outline button is restyled for the dark ground. The old `hero.svg` column grid and the `drill-electric.svg` are gone. This photo is a stand-in: it is a group portrait, so a wide crop cuts heads. A proper wide shot (storefront, warehouse, team under the STRIDON sign) should replace it.
- **Brands** (app-local): hairline grid of 2:1 brand tiles from `FEATURED_BRANDS`, last cell links to `/brendovi`. There is no shared equivalent - the sibling sites each sell one brand.
- **CompanyStats** takes `STATS` with `layout="four-up-no-three"` (four stats, same call dck makes) and counts up on scroll.
- **OwnBrand** (app-local) is one component rendering one brand from `OWN_BRANDS` (the section heading lives in the data, so the homepage and `/o-nama` cannot drift). Copy left, **photo** right (4:3, `object-cover`, hairline border). SG TOOLS shows the Altina storefront, DCK the trade-show booth.
- **Features** takes `FEATURES` with `title="Zašto Stridon?"`. It renders the shared `Feature` card, so the four claims now sit in pastel icon cards - the treatment an earlier pass had removed, restored deliberately when the site moved to shared components.
- **CTA** takes `CTA_TRUST_BADGES`; its heading and gradient come from `ctaHeading` / `ctaGradientClasses` in `packages/brand-config/src/stridon.ts`, and its button label and `/kontakt` target are hardcoded in the shared component. The badges are dealer-facing on purpose (B2B portal / Sopstveni brendovi / Katalozi / Servis u Beogradu). The ink band with the red diagonal beam that used to close the page is gone with `partner-cta.tsx`.

## Brands

`constants/brands.ts` is the single source of truth for the 19 brands Stridon imports: slug, name, logo tile, tagline, blurb, `shopUrl` (the manufacturer page on prodavnicaalata.rs) and the long-form `sections` seeded verbatim from the old stridon.rs brand pages. `FEATURED_BRANDS` (11) feeds the homepage wall; `/brendovi` lists all of them; `/brendovi/[slug]` renders one. **Array order is the display order everywhere** and the owner tuned it by hand - DeWalt, Stanley, Bosch, REMS, Wiha, GTV, Knipex, Hogert, Senco, Wera, Rubi, then the rest. Do not re-sort it.

**There is no brands endpoint.** The shared API is scoped by `brandSlug=stridon` (our own brand), so nothing in `@brand/shared/lib/api` returns manufacturers - `getCatalogs()` returns Stridon's catalogs, not per-manufacturer ones. Replacing this constant with real data needs a new PACMS endpoint; the page components already read `Brand[]`, so only the source changes.

Both pages head with the shared `HeroHeader`, like every other inner page on all three sites. `app/brendovi/[slug]` feeds it the back link as `pretitle` and puts the logo tile and the two CTAs in `children`, because `HeroHeader` has no `aside` or `backLink` slot of its own. The app-local `page-header.tsx` that used to carry a left-aligned tinted band was deleted on 2026-09-19.

Logo tiles in `public/brands/` are all normalized to a 2400x1200 viewBox with a white background rect, so `object-cover` fills the 2:1 grid cell. All 19 have a tile now; `BrandLogo` still falls back to a wordmark cell for a `logo: null` brand, and takes any `{ name, logo }` so `/servis` can reuse it. Makita, Metabo and Festool have tiles but no brand page: they are only serviced, not distributed.

## Catalogs

`constants/catalogs.ts` holds the 29 PDF catalogs seeded from the old stridon.rs `/katalozi` page (name, description, `brandSlug`, `fileUrl`). The files are still **Google Drive share links** the old site used - not hosted PDFs. `getCatalogsByBrand()` groups them in BRANDS order and drops brands with none (Senco, Black+Decker, Sparta and SG Tools have no catalog; `hasCatalogs()` drops the "Pogledaj kataloge" button on those brand pages entirely and promotes the shop link to primary). `/katalozi` renders one section per brand with `id={brand.slug}`, which is what `/brendovi/[slug]` deep-links into. No jump index at the top - the page is meant to be scrolled.

`app/katalozi/page.tsx` is **the one page still built app-local on purpose**: the shared `catalogs-page` calls `getCatalogs()`, and `api.pacms.in.rs` no longer resolves, so switching to it would render an empty page. It does use the shared `HeroHeader` like everything else. When wiring the real API, note the shared `Catalog` type is `{ id, name, previewImageUrl, fileUrl }` - no description and no manufacturer, so grouping by brand needs either a new backend field or the local mapping kept.

## About page

`/o-nama` is `HeroHeader` -> `CompanyValues` -> `OwnBrand` x2 -> `Testimonials` -> `Companies`. Only `OwnBrand` is app-local; the content all comes from `constants/about.ts`.

- `ABOUT_MILESTONES` is the company timeline lifted from `apps/sg-tools` (same family business, same story): 1996 buvljak -> 2009 Vojislava Ilica -> 2014 prodavnicaalata.rs -> 2015 Altina -> 2023 SG TOOLS. It carries sg-tools' `icon` / `color` / `bg` / `border` per step too, because the shared `Milestone` type requires them. Photos live in `public/about/`, re-encoded to webp at 1600px (they arrived as ~5 MB phone JPEGs).
- `PARTNER_QUOTES` (8) is typed as the shared `Testimonial`, which is `{ personName, quote }` - **there is no logo slot**, so the company logos that used to sit under each quote are gone. The same SVGs still feed `CLIENT_LOGOS`, which `Companies` shows as a marquee under "Ko su naši klijenti".
- Shared `Testimonials` grew an optional `title` prop on 2026-09-19 (it was the one section component in the package without one) so this page can keep its "Šta naši saradnici kažu o nama" heading. Omitting it renders no heading, so dck and sg-tools are byte-identical to before.
- `OWN_BRANDS` covers SG TOOLS and DCK, including the section heading and the photo each one shows. `/o-nama` renders the same `OwnBrand` component the homepage uses, so both pages always show the same headings and copy. The DCK blurb is written from `packages/brand-config/src/dck.ts`, not from anything the owner said - confirm before launch.
- SG TOOLS also has its own block on the homepage, so that copy appears twice.

## Service, contact and B2B pages

- **`/servis`**: `HeroHeader` -> serviced brands as logo tiles (same hairline wall as the homepage; rows link to our brand page where one exists) -> the in-warranty / out-of-warranty split -> the SG Servis copy -> the shared `ContactLocations` with `sectionClassName="pt-0!"` and `showDivider={false}`, exactly the call `apps/dck/app/servis/page.tsx` makes. `constants/service-centers.ts` holds SG Servis (Vojislava Ilića 141b) as a shared `ContactLocation` and `SERVICED_BRANDS`; opening hours live in the copy, not in the card. Old-site copy was in "Vi" form and was rewritten to "ti".
- **`/kontakt`**: the shared `ContactPage` - a centered `HeroHeader` with the form under it and the direct-mail line, the same four-line page dck and sg-tools have. Its metadata comes from `contactDescription` in brand-config.
- **`/b2b`**: `HeroHeader` "B2B platforma" -> "Već imaš B2B nalog?" with the button to `b2b.wings.rs/stridon` -> "Zatraži pristup B2B platformi" with the request form. `lib/schemas/b2b.ts` mirrors the old site's eight fields and limits (PIB exactly 9 digits, registration number 8). `app/b2b/actions.ts` mails the request through Brevo because **there is no PACMS endpoint for dealer applications**; when one exists, only that action changes.
- **Known-broken by decision (2026-09-19):** the shared `ContactLocations` builds its `tel:` with `phone.replace(/-/g, "")`, which leaves the Serbian slash in - `/servis` renders `tel:065/3378812` and the number will not dial. The app-local `location-cards.tsx` existed to carry an E.164 `phoneHref`; the owner chose the shared component over the working link, so **fix this in `packages/shared` (it would help dck too), not by forking the card again**.
- **`constants/contact.ts`** holds the two store locations and opening hours off the old site, already shaped as `ContactLocation`. Nothing renders them right now - the shared contact page is the form only.
- **Map tiles show a CARTO "API KEY REQUIRED" watermark** - CARTO now gates `basemaps.cartocdn.com`. It hits `addBrandTileLayer` in `@brand/shared/lib/map.ts`, so dck and sg-tools have it too.
- **`app/not-found.tsx`** is the shared `NotFoundPage`. **Its second button links to `/proizvodi/kategorije`, a route this site does not have**, so the 404 page offers a link that 404s. Same decision as the `tel:` above: the shared component won, and the fix belongs in `packages/shared` (a prop for the secondary link).

## Mobile

- Hover markers (the red diagonal slabs on list rows) are `hidden sm:block` with `gap-0 sm:gap-3` on `/katalozi` and `/brendovi`: they only animate on hover, so on touch they just indented the titles by 32px. These are the last app-local hover treatment on the site.
- `/brendovi` shows two cards per row on mobile (`grid-cols-2 lg:grid-cols-3`). The blurb wraps to four short lines there - open question whether to clamp or drop it.
- Navbar: the logo is `w-auto` (was `w-max`, which let the intrinsic width win) with `navbarLogoHeight: "h-7 md:h-8"`; the Union Jack SVG was stretched (viewBox 60x30 inside a 30x20 box) and is now `h-3.5 w-7`; the right cluster uses `gap-x-2 md:gap-x-4` and the burger is nudged with `-mr-1.5`.
- The sheet close button uses `focus-visible:` instead of `focus:` (Radix focuses it programmatically on open, so the red ring showed on touch), and `a[data-slot="sheet-close"]` was added to the button radius rule in `globals.css` - nested `asChild` overwrites `data-slot="button"`, so the menu CTA was stuck at the sharp 2px radius instead of the dck 8px. That rule re-points `--radius` on those elements rather than hardcoding a `border-radius`, so `rounded-*` utilities still mean something on a Button.

## Status / TODO

- Done (design pass): homepage, `/brendovi`, `/brendovi/[slug]`, `/katalozi`, `/o-nama`, `/servis`, `/kontakt`, `/b2b`, 404.
- Done (shared-component pass, 2026-09-19): every section with a `@brand/shared` counterpart now renders that counterpart. Deleted: `page-header`, `about-timeline`, `partner-quotes`, `clients`, `location-cards`, `stats-band`, `why-stridon`, `partner-cta`. Two known regressions were accepted by the owner rather than forked around - see the `tel:` and 404 notes above. **Remaining app-local components: `hero`, `brands`, `own-brand`, `brand-logo`, `b2b-form`** - the owner wants these redesigned toward the shared look next, not re-forked.
- `/politika-privatnosti` and `/uslovi-koriscenja` were rewritten off the dck originals: stridon.rs, office@stridon.rs, distributor framing, and the privacy policy now lists the B2B form's company fields (PIB, matični broj) alongside the contact form's. They use the shared `HeroHeader`, which every other page now does too - the header treatment is consistent across the site as of 2026-09-19.
- **The backend is gone**: `api.pacms.in.rs` no longer resolves (NXDOMAIN). Everything that depended on it was deleted rather than parked - the `/proizvodi/*` pages and their boundaries, `/gde-kupiti` with `constants/dealers.ts`, and `app/api/products/search`. They were byte-identical dck copies, so restore them from `apps/dck` (or from git history) when there is an API. `app/sitemap.ts` is a static list of the real pages plus the 19 brands.
- Pending: the EN version (no i18n in the monorepo), and the production `NEXT_PUBLIC_SENTRY_DSN` + Turnstile keys, which are empty in `.env.production` so Sentry is silently off.

## Seeded content

`constants/brands.ts`, `constants/catalogs.ts` and `ABOUT_MILESTONES` were all scraped out of the old sites (`__NEXT_DATA__` i18n JSON on www.stridon.rs, plus `apps/sg-tools/constants/content.ts`). The scrape/generator scripts were throwaway - edit these constants by hand from here on.

## Commands

```bash
pnpm dev:stridon   # from repo root (or `pnpm dev` here) - localhost:3000
pnpm -C apps/stridon exec tsc --noEmit   # type-check (never npx tsc)
```

Only one `next dev` instance at a time (`.next/dev/lock` + port 3000). Do not set `turbopack.root` (breaks Tailwind resolve under pnpm); the "multiple lockfiles" warning is harmless.

The running dev server does **not** pick up a Tailwind class that appears for the first time in a **new file** - the utility is simply missing from the stylesheet until dev restarts. Either reuse a class the project already has or restart. To verify a production build without disturbing the owner's dev server, add a temporary `distDir: process.env.NEXT_DIST_DIR ?? ".next"` to `next.config.ts` and run `NEXT_DIST_DIR=.next-verify next build`.

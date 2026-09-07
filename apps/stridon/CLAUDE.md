# CLAUDE.md - STRIDON

See root `../../CLAUDE.md` for shared principles, architecture patterns, and domain map.

## Project-Specific

- **Domain**: stridon.rs (parent company site - Stridon Group DOO)
- **Theme**: Light only, editorial. Primary red `#e50113` = `oklch(0.58 0.236 27.9)`; red is an accent (~10% of the page), never large surfaces except the PartnerCta band.
- **Brand slug**: `stridon` (via `NEXT_PUBLIC_BRAND_SLUG` in `.env.production` / `.env.local`)
- **Signature motif**: diagonal parallelogram from the Stridon logo (`-skew-x-[14deg]` slabs). Used sparingly: hover markers on list rows and the red beam in PartnerCta. **Not on section headings** - the owner had those little red slabs removed.
- **Radius**: `--radius: 0.25rem` (sharper than sg-tools/dck - technical editorial edge)
- **Fonts**: Inter (body) + Space Grotesk (headings), **self-hosted** variable woff2 in `public/fonts/` via `@font-face` in `globals.css` (latin + latin-ext for č ć ž š đ). No `next/font` - do not reintroduce it. Because nothing preloads them for us, `app/layout.tsx` calls `ReactDOM.preload()` on all four files (Serbian copy needs both subsets on every page) and `vercel.json` gives `/fonts/*` an immutable one-year cache; the reference apps get both for free from `next/font`.

## Differences vs sg-tools/dck

- **Not a single-brand product site**: Stridon is the distributor showcasing 30+ brands; purchases go to prodavnicaalata.rs. No product catalog wired yet - API/data wiring is deliberately postponed to the end of the redesign.
- **Navbar without categories**: layout passes `showCategoryMenu={false}` to shared `RootLayout` (prop added for this app) so the navbar never fetches product categories.
- **No warranty flow** (that's dck-only; removed from this app).
- Homepage is composed of **custom app-local sections** (`components/`), not the shared Features/Stats/CTA - the shared ones read too templated for this brand.

## Homepage sections (all in `components/`)

Seven sections, in this order: Hero -> Brands -> StatsBand (counter) -> OwnBrand (SG TOOLS) -> OwnBrand (DCK) -> WhyStridon -> PartnerCta. Sections separate with hairline borders, not whitespace.

- **Hero**: full-bleed photo (`/about/sgtools-dck-tim.webp`) under a `bg-foreground/85` veil, centered type in white, and the red diagonal beam from the logo down the right edge - the same beam that closes the page in PartnerCta. The outline button is restyled for the dark ground. The old `hero.svg` column grid and the `drill-electric.svg` are gone. This photo is a stand-in: it is a group portrait, so a wide crop cuts heads. A proper wide shot (storefront, warehouse, team under the STRIDON sign) should replace it.
- **WhyStridon** ("Zasto Stridon?"): compact four-up, bare lucide icon in primary red, claim, one line of copy. No cards, no boxes - the owner rejected both the editorial rows and a 2x2 quadrant grid as too heavy.
- **OwnBrand** is one component rendering one brand from `OWN_BRANDS` (the section heading lives in the data, so the homepage and `/o-nama` cannot drift). Copy left, **photo** right (4:3, `object-cover`, hairline border) - the logo panel with the tagline is gone. SG TOOLS shows the Altina storefront, DCK the trade-show booth.
- **PartnerCta** trust badges are dealer-facing on purpose (B2B portal / Sopstveni brendovi / Katalozi / Servis u Beogradu); they used to repeat the WhyStridon claims.

## Brands

`constants/brands.ts` is the single source of truth for the 19 brands Stridon imports: slug, name, logo tile, tagline, blurb, `shopUrl` (the manufacturer page on prodavnicaalata.rs) and the long-form `sections` seeded verbatim from the old stridon.rs brand pages. `FEATURED_BRANDS` (11) feeds the homepage wall; `/brendovi` lists all of them; `/brendovi/[slug]` renders one. **Array order is the display order everywhere** and the owner tuned it by hand - DeWalt, Stanley, Bosch, REMS, Wiha, GTV, Knipex, Hogert, Senco, Wera, Rubi, then the rest. Do not re-sort it.

**There is no brands endpoint.** The shared API is scoped by `brandSlug=stridon` (our own brand), so nothing in `@brand/shared/lib/api` returns manufacturers - `getCatalogs()` returns Stridon's catalogs, not per-manufacturer ones. Replacing this constant with real data needs a new PACMS endpoint; the page components already read `Brand[]`, so only the source changes.

`/brendovi` and `/brendovi/[slug]` share `components/page-header.tsx`: a shallow tinted band (`bg-muted/30`), left aligned, asymmetric two-column grid - deliberately **not** the homepage hero (no `hero.svg` column backdrop, no centering, less vertical air). The listing puts its lede in the right column behind a vertical hairline; the brand page puts the logo tile there and carries a back link plus the two CTAs.

Logo tiles in `public/brands/` are all normalized to a 2400x1200 viewBox with a white background rect, so `object-cover` fills the 2:1 grid cell. All 19 have a tile now; `BrandLogo` still falls back to a wordmark cell for a `logo: null` brand, and takes any `{ name, logo }` so `/servis` can reuse it. Makita, Metabo and Festool have tiles but no brand page: they are only serviced, not distributed.

## Catalogs

`constants/catalogs.ts` holds the 29 PDF catalogs seeded from the old stridon.rs `/katalozi` page (name, description, `brandSlug`, `fileUrl`). The files are still **Google Drive share links** the old site used - not hosted PDFs. `getCatalogsByBrand()` groups them in BRANDS order and drops brands with none (Senco, Black+Decker, Sparta and SG Tools have no catalog; `hasCatalogs()` drops the "Pogledaj kataloge" button on those brand pages entirely and promotes the shop link to primary). `/katalozi` renders one section per brand with `id={brand.slug}`, which is what `/brendovi/[slug]` deep-links into. No jump index at the top - the page is meant to be scrolled.

`app/katalozi/page.tsx` used to re-export the shared `catalogs-page` (which calls `getCatalogs()` and breaks without an API). When wiring the real API, note the shared `Catalog` type is `{ id, name, previewImageUrl, fileUrl }` - no description and no manufacturer, so grouping by brand needs either a new backend field or the local mapping kept.

## About page

`/o-nama` is app-local: `PageHeader` -> `about-timeline` -> `own-brands` -> `partner-quotes` -> `clients`, all reading `constants/about.ts`.

- `ABOUT_MILESTONES` is the company timeline lifted from `apps/sg-tools` (same family business, same story): 1996 buvljak -> 2009 Vojislava Ilica -> 2014 prodavnicaalata.rs -> 2015 Altina -> 2023 SG TOOLS. Photos live in `public/about/`, re-encoded to webp at 1600px (they arrived as ~5 MB phone JPEGs).
- `about-timeline` uses the `@brand/ui/timeline` primitive but not the shared `CompanyValues`/`CompanyTimeline` pair - those wrap each step in a pastel icon card with rounded corners.
- `OWN_BRANDS` covers SG TOOLS and DCK, including the section heading and the photo each one shows. `/o-nama` renders the same `OwnBrand` component the homepage uses (the old `own-brands.tsx` with the logo panels is deleted), so both pages always show the same headings and copy. The DCK blurb is written from `packages/brand-config/src/dck.ts`, not from anything the owner said - confirm before launch.
- `PARTNER_QUOTES` (8) and the client roster are lifted verbatim from the old stridon.rs homepage; logos already sat in `public/companies/svgs/` from the dck copy.
- `partner-quotes` is an app-local **embla slider** (`@brand/ui/carousel`, arrows parked next to the heading). The shared `Testimonials`/`Companies` are still unused: the first paints a blur glow, the second is rounded cards.
- SG TOOLS also has its own block on the homepage (`components/own-brand.tsx`), so that copy now appears twice.

## Service, contact and B2B pages

- **`/servis`**: serviced brands as logo tiles (same hairline wall as the homepage; rows link to our brand page where one exists) -> the in-warranty / out-of-warranty split -> the SG Servis block with the copy and one map card. `constants/service-centers.ts` holds SG Servis (Vojislava Ilica 141b) and `SERVICED_BRANDS`; opening hours live in the copy, not in the card. Old-site copy was in "Vi" form and was rewritten to "ti".
- **`/kontakt`**: `PageHeader` -> "Javi nam se" with the shared `ContactForm` in a left-aligned `max-w-3xl` column, plus the direct-mail line under it. The shared `contact-page` (centered hero) is unused.
- **`/b2b`**: `PageHeader` "B2B platforma" -> "Vec imas B2B nalog?" with the button to `b2b.wings.rs/stridon` -> "Zatrazi pristup B2B platformi" with the request form. `lib/schemas/b2b.ts` mirrors the old site's eight fields and limits (PIB exactly 9 digits, registration number 8). `app/b2b/actions.ts` mails the request through Brevo because **there is no PACMS endpoint for dealer applications**; when one exists, only that action changes.
- **`components/location-cards.tsx`** is the dck location card (rounded tile, map on top, `IconBox` beside the details), kept app-local so `tel:` uses the E.164 number - the shared `ContactLocations` only strips dashes, which would leave `tel:011/2886509`.
- **`constants/contact.ts`** holds the two store locations and opening hours off the old site. Only the `StridonLocation` type is used right now; the data is kept for when the contact page grows.
- **Map tiles show a CARTO "API KEY REQUIRED" watermark** - CARTO now gates `basemaps.cartocdn.com`. It hits `addBrandTileLayer` in `@brand/shared/lib/map.ts`, so dck and sg-tools have it too.
- **`app/not-found.tsx`** is app-local: the shared 404 also links to `/proizvodi/kategorije`, which this site does not have.

## Mobile

- Hover markers (the red diagonal slabs on list rows) are `hidden sm:block` with `gap-0 sm:gap-3` on `/katalozi` and `/brendovi`: they only animate on hover, so on touch they just indented the titles by 32px.
- `/brendovi` shows two cards per row on mobile (`grid-cols-2 lg:grid-cols-3`). The blurb wraps to four short lines there - open question whether to clamp or drop it.
- Navbar: the logo is `w-auto` (was `w-max`, which let the intrinsic width win) with `navbarLogoHeight: "h-7 md:h-8"`; the Union Jack SVG was stretched (viewBox 60x30 inside a 30x20 box) and is now `h-3.5 w-7`; the right cluster uses `gap-x-2 md:gap-x-4` and the burger is nudged with `-mr-1.5`.
- The sheet close button uses `focus-visible:` instead of `focus:` (Radix focuses it programmatically on open, so the red ring showed on touch), and `a[data-slot="sheet-close"]` was added to the button radius rule in `globals.css` - nested `asChild` overwrites `data-slot="button"`, so the menu CTA was stuck at the sharp 2px radius instead of the dck 8px. That rule re-points `--radius` on those elements rather than hardcoding a `border-radius`, so `rounded-*` utilities still mean something on a Button.

## Status / TODO

- Done (design pass): homepage, `/brendovi`, `/brendovi/[slug]`, `/katalozi`, `/o-nama`, `/servis`, `/kontakt`, `/b2b`, 404.
- `/politika-privatnosti` and `/uslovi-koriscenja` were rewritten off the dck originals: stridon.rs, office@stridon.rs, distributor framing, and the privacy policy now lists the B2B form's company fields (PIB, matični broj) alongside the contact form's. They still use the shared `HeroHeader` rather than the app's `PageHeader` - the one place the site's header treatment is inconsistent.
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

## Critical principles

- **Push back on hacks.** If a request leads to a fragile workaround, say so and propose the clean solution. Never silently accept shortcuts.
- **Be critical of every decision** - naming, architecture, data flow, UX. Question whether the approach would hold up at the scale and quality bar of Shopify, Magento, IKEA, Temu, AliExpress, or Alibaba.
- **Consult official docs when unsure.** Frameworks change fast. When writing Next.js code, verify APIs and patterns against the [Next.js docs](https://nextjs.org/docs) using WebFetch - don't rely solely on training data, which may be outdated.
- **Only commit current-session changes.** When committing, only stage files changed during this session - do not commit pre-existing uncommitted changes from the working tree.

## Project Overview

**Company**: Stridon Group DOO (stridon.rs) - a tool company with an online shop at prodavnicaalata.rs.

**This repo**: Turborepo monorepo with two brand websites sharing components and utilities (Next.js 16, TypeScript, Tailwind CSS v4, Vercel):

| Project  | Directory        | Domain       | Theme      | Brand slug |
| -------- | ---------------- | ------------ | ---------- | ---------- |
| SG TOOLS | `apps/sg-tools/` | sgtools.rs   | Dark only  | `sg-tools` |
| DCK      | `apps/dck/`      | dcksrbija.rs | Light only | `dck`      |

**Purpose**: Display brand products (fetched server-side from the main platform's REST API), these sites are display-only - no cart or checkout, the core of the websites is to interest and enable dealers to sell our brands, not to push buying from prodavnicaalata.rs.

**Brand voice**: Friendly and approachable. Serbian copy uses informal "ti" form (not "Vi") - keep it casual and direct.

## Critical Rules

- **Serbian tone**: Always use informal "ti" form in Serbian copy - never formal "Vi". Keep it casual and friendly.
- **Serbian URLs**: All routes use Serbian path names (e.g., `/o-nama`, `/kontakt`, `/proizvodi/kategorije`).
- For minor straightforward changes, we don't need to build at all.
- **Type-check command**: `pnpm -C apps/dck exec tsc --noEmit` (or `apps/sg-tools`). Do NOT use `npx tsc` - it won't resolve workspace dependencies.

## Environment Variables

- Use `NEXT_PUBLIC_` prefix for client-accessible vars
- Use `.env.local` in each app directory for local development secrets (gitignored)
- `NEXT_PUBLIC_BRAND_SLUG` - Set in `next.config.ts` per app (`"sg-tools"` or `"dck"`)
- Key variables (same for both):
  - `API_URL` - Base URL for the PACMS backend REST API (server-only)
  - `BREVO_API_KEY` - Brevo email service API key (contact form)
  - `PACMS_RATELIMIT_BYPASS_SECRET` - Shared secret sent as the `X-Internal-Bypass` header on every `apiFetch` call; the Cloudflare edge fronting `api.pacms.in.rs` validates + strips it and injects the trusted rate-limit marker, so SSG build reads aren't throttled as anonymous. Optional (absent ⇒ anonymous). Set in each app's Vercel project; same value as the CMS `TF_VAR_storefront_ratelimit_bypass_secret`. See the PACMS repo `docs/trusted-first-party-caller.md`.

## Architecture

### Monorepo Structure

```
├── turbo.json                    # Turborepo task config
├── package.json                  # Root workspaces config
│
├── packages/
│   ├── brand-config/             # @brand/config - BrandConfig interface + per-brand values
│   ├── ui/                       # @brand/ui - shadcn/ui primitives (brand-agnostic)
│   └── shared/                   # @brand/shared - shared components, lib, types, styles
│
└── apps/
    ├── sg-tools/                 # Thin app shell (dark theme)
    └── dck/                      # Thin app shell (light theme)
```

### Package Responsibilities

**`@brand/config`** (`packages/brand-config/`): Brand configuration contract. Call `getBrandConfig()` to get brand-specific values (logo, URLs, colors, email config, etc.) resolved via `NEXT_PUBLIC_BRAND_SLUG`.

**`@brand/ui`** (`packages/ui/`): All shadcn/ui primitives (button, input, accordion, etc.). Self-contained with its own `cn()` utility. Brand-agnostic - uses CSS custom properties that resolve per-app theme.

**`@brand/shared`** (`packages/shared/`): All shared components (~50), utilities (`api.ts`, `utils.ts`, `categories.ts`, `geo.ts`, `metadata.ts`), types, hooks, schemas, OG image utilities, and base CSS.

### App Shell Contents (what stays per-app)

Each app (`apps/sg-tools/`, `apps/dck/`) contains only:

- `app/globals.css` - Theme OKLCH tokens (dark vs light)
- `app/layout.tsx` - Viewport, structured data, body class
- `app/page.tsx` - Homepage composition
- `app/**/page.tsx` - Route pages (thin, compose shared components)
- `app/api/og/route.tsx` - Brand-specific on-demand OG image route (query-param driven; wired via `buildOgImageUrl` in shared `metadata.ts`)
- `app/kontakt/actions.ts` - Email sender config (uses `getBrandConfig()`)
- `components/hero.tsx` - Brand-specific hero (SG has decorations/badges, DCK has dashboard)
- `constants/` - Brand-specific content strings, links, dealers
- `lib/og/` - Brand-specific OG templates, logo SVG, color constants
- `public/` - Brand-specific assets (logos, images)

DCK additionally has: `app/produzetak-garancije/`, `components/warranty/`, `lib/schemas/warranty.ts`

### Brand Config Injection

Three patterns for consuming brand-specific values in shared code:

| Pattern               | When                                     | Example                                            |
| --------------------- | ---------------------------------------- | -------------------------------------------------- |
| `getBrandConfig()`    | Server components needing brand identity | `footer.tsx` reads logo, `api.ts` reads brandSlug  |
| Props from app pages  | Content arrays that vary per brand       | `<Stats stats={STATS} />` from app's `constants/`  |
| CSS custom properties | Theming (colors)                         | `bg-primary` resolves via each app's `globals.css` |

### Import Aliases

| Alias             | Resolves to                                               |
| ----------------- | --------------------------------------------------------- |
| `@/*`             | App root (e.g., `@/constants/links`, `@/components/hero`) |
| `@brand/config`   | `packages/brand-config/src/`                              |
| `@brand/ui/*`     | `packages/ui/src/*`                                       |
| `@brand/shared/*` | `packages/shared/src/*`                                   |

### Route Structure (both apps)

| Route                              | URL                            |
| ---------------------------------- | ------------------------------ |
| `app/page.tsx`                     | `/`                            |
| `app/o-nama/`                      | `/o-nama`                      |
| `app/kontakt/`                     | `/kontakt`                     |
| `app/gde-kupiti/`                  | `/gde-kupiti`                  |
| `app/proizvodi/kategorije/`        | `/proizvodi/kategorije`        |
| `app/proizvodi/kategorije/[slug]/` | `/proizvodi/kategorije/[slug]` |
| `app/proizvodi/[slug]/`            | `/proizvodi/[slug]`            |

DCK also has: `app/produzetak-garancije/` → `/produzetak-garancije` (with 308 redirect from the old `/registracija-garancije` URL)

### Key Patterns

**Server vs Client components**: Most section components are plain server components. Client components (`"use client"`) are used only where interactivity is needed: Navbar, MobileMenu, Container (Framer Motion animations), WhereToBuyContent, DealerList, WarrantyForm.

**Dynamic IO under `cacheComponents: true`** (set in both `apps/*/next.config.ts`): zero-arg dynamic APIs — `new Date()`, `Date.now()`, `Math.random()`, `cookies()`, `headers()` — fail static prerender if called during render, including inside `"use client"` components. Acceptable patterns:

- **Client components**: defer the call to an event handler (e.g., `Popover.onOpenChange` in `apps/dck/components/warranty/warranty-form.tsx`) or to `useSyncExternalStore`. Do NOT use `useEffect` + `setState` — React 19 flags it as cascading renders. Lazy `useState(() => new Date())` also fails because the initializer runs during the first render.
- **Server components**: wrap dynamic subtrees in `<Suspense>` or use `"use cache"`.

**OpenGraph images**: served on demand from a single per-app route handler (`app/api/og/route.tsx`) that reads title/type/image from query params — not the per-route `opengraph-image.tsx` file convention (removed; it prerendered one image per entity at build, fanning out backend fetches until they timed out). Pages declare their OG URL via the metadata helpers (`buildOgImageUrl` in `metadata.ts`). Product images are passed as raw URLs from trusted hosts (R2 + the legacy `media.prodavnicaalata.rs`, enforced by `isTrustedImageUrl`); satori fetches them at request time and the result is CDN-cached for a year.

**Layout wrapper components** (in `@brand/shared`):

- `Wrapper` - Max-width container (`lg:max-w-7xl`) with responsive padding
- `Container` - Framer Motion animation wrapper with preset animations

**Serbian content**:

- All Serbian strings are hardcoded directly - no i18n framework
- Structured data arrays live in per-app `constants/content.ts`
- Navigation labels in per-app `constants/links.ts`

## PACMS Backend Dependency

This repo depends on the **PACMS** platform (`c:\Users\user\Documents\Projects\PACMS`) for several backend services:

**Product data**: `API_URL` points to the PACMS backend (`/api/Storefront/*` endpoints). All product, category, and sitemap data is fetched from there via `packages/shared/src/lib/api.ts`.

**Error reporting**: Errors are captured by `@sentry/nextjs` and sent to Sentry (email alerts configured per-project). Implementation:

- `apps/*/instrumentation.ts` - `onRequestError` via `Sentry.captureRequestError`
- `packages/shared/src/lib/report-error.ts` - `reportError()` via `Sentry.captureException` for explicitly-caught errors

**Warranty extension** (DCK only, user-facing name "Produžetak garancije"): `apps/dck/app/produzetak-garancije/actions.ts` submits warranty forms to `/api/Storefront/SubmitWarrantyRegistration` (authenticated via `PACMS_API_KEY` / `X-Api-Key` header). Backend endpoint name remains `SubmitWarrantyRegistration` — internal identifiers (`submitWarrantyRegistration`, `WarrantyForm`, `warrantySchema`) were intentionally not renamed.

**Shared patterns with PACMS storefront** (`c:\Users\user\Documents\Projects\PACMS\pa-storefront`): Both repos use the same Sentry instrumentation pattern, the same `report-error.ts` utility structure, and the same Turnstile verification flow. When adding cross-cutting features (error handling, auth, caching), check the PACMS storefront for existing patterns to replicate.

**Vercel deployment**: All projects (dck, sg-tools, pa-storefront-ba, pa-storefront-rs) are managed under one Vercel team. Credentials and project IDs are in the PACMS repo at `.claude/skills/prod-vercel/skill.md`.

## Domain Map

- `sgtools.rs` - SG TOOLS brand site (`apps/sg-tools/`)
- `dcksrbija.rs` - DCK brand site (`apps/dck/`)
- `stridon.rs` - Parent company (Stridon Group DOO)
- `prodavnicaalata.rs` - Online shop (where users buy products)

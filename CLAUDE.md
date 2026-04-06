# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical principles

- **Push back on hacks.** If a request leads to a fragile workaround, say so and propose the clean solution. Never silently accept shortcuts.
- **Be critical of every decision** — naming, architecture, data flow, UX. Question whether the approach would hold up at the scale and quality bar of Shopify, Magento, IKEA, Temu, AliExpress, or Alibaba.
- **Consult official docs when unsure.** Frameworks change fast. When writing Next.js code, verify APIs and patterns against the [Next.js docs](https://nextjs.org/docs) using WebFetch — don't rely solely on training data, which may be outdated.
- **Only commit current-session changes.** When committing, only stage files changed during this session — do not commit pre-existing uncommitted changes from the working tree.

## Project Overview

**Company**: Stridon Group DOO (stridon.rs) — a tool company with an online shop at prodavnicaalata.rs.

**This repo**: Turborepo monorepo with two brand websites sharing components and utilities (Next.js 16, TypeScript, Tailwind CSS v4, Vercel):

| Project | Directory | Domain | Theme | Brand slug |
|---------|-----------|--------|-------|------------|
| SG Tools | `apps/sg-tools/` | sgtools.rs | Dark only | `sg-tools` |
| DCK | `apps/dck/` | dcksrbija.rs | Light only | `dck` |

**Purpose**: Display brand products (fetched server-side from the main platform's REST API) with buy links pointing to prodavnicaalata.rs. These sites are display-only — no cart or checkout.

**Brand voice**: Friendly and approachable. Serbian copy uses informal "ti" form (not "Vi") — keep it casual and direct.

## Critical Rules

- **Serbian tone**: Always use informal "ti" form in Serbian copy — never formal "Vi". Keep it casual and friendly.
- **SG Tools = dark mode only**. Do not add light mode styles or toggles.
- **DCK = light mode only**. Do not add dark mode styles or toggles.
- **Product links**: Product pages link to prodavnicaalata.rs for purchasing. Products are display-only on these sites.
- **Serbian URLs**: All routes use Serbian path names (e.g., `/o-nama`, `/kontakt`, `/proizvodi/kategorije`).

## Commands

Use Turborepo from the repo root:

```bash
pnpm dev:sg                 # SG Tools dev server
pnpm dev:dck                # DCK dev server
pnpm build                  # Build both apps
pnpm lint                   # Lint both apps
```

Or run per-app from `apps/sg-tools/` or `apps/dck/`:

```bash
pnpm dev                    # Dev server
pnpm build                  # Production build
pnpm lint                   # Run ESLint
```

## Environment Variables

- Use `NEXT_PUBLIC_` prefix for client-accessible vars
- Use `.env.local` in each app directory for local development secrets (gitignored)
- `NEXT_PUBLIC_BRAND_SLUG` — Set in `next.config.ts` per app (`"sg-tools"` or `"dck"`)
- Key variables (same for both):
  - `API_URL` — Base URL for the PACMS backend REST API (server-only)
  - `BREVO_API_KEY` — Brevo email service API key (contact form)
  - `PACMS_INTERNAL_KEY` — Authentication key for PACMS backend internal endpoints (error reporting)

## Architecture

### Monorepo Structure

```
├── turbo.json                    # Turborepo task config
├── package.json                  # Root workspaces config
│
├── packages/
│   ├── brand-config/             # @brand/config — BrandConfig interface + per-brand values
│   ├── ui/                       # @brand/ui — shadcn/ui primitives (brand-agnostic)
│   └── shared/                   # @brand/shared — shared components, lib, types, styles
│
└── apps/
    ├── sg-tools/                 # Thin app shell (dark theme)
    └── dck/                      # Thin app shell (light theme)
```

### Package Responsibilities

**`@brand/config`** (`packages/brand-config/`): Brand configuration contract. Call `getBrandConfig()` to get brand-specific values (logo, URLs, colors, email config, etc.) resolved via `NEXT_PUBLIC_BRAND_SLUG`.

**`@brand/ui`** (`packages/ui/`): All shadcn/ui primitives (button, input, accordion, etc.). Self-contained with its own `cn()` utility. Brand-agnostic — uses CSS custom properties that resolve per-app theme.

**`@brand/shared`** (`packages/shared/`): All shared components (~50), utilities (`api.ts`, `utils.ts`, `categories.ts`, `geo.ts`, `metadata.ts`), types, hooks, schemas, OG image utilities, and base CSS.

### App Shell Contents (what stays per-app)

Each app (`apps/sg-tools/`, `apps/dck/`) contains only:
- `app/globals.css` — Theme OKLCH tokens (dark vs light)
- `app/layout.tsx` — Viewport, structured data, body class
- `app/page.tsx` — Homepage composition
- `app/**/page.tsx` — Route pages (thin, compose shared components)
- `app/**/opengraph-image.tsx` — Brand-specific OG images
- `app/kontakt/actions.ts` — Email sender config (uses `getBrandConfig()`)
- `components/hero.tsx` — Brand-specific hero (SG has decorations/badges, DCK has dashboard)
- `constants/` — Brand-specific content strings, links, dealers
- `lib/og/` — Brand-specific OG templates, logo SVG, color constants
- `public/` — Brand-specific assets (logos, images)

DCK additionally has: `app/registracija-garancije/`, `components/warranty/`, `lib/schemas/warranty.ts`

### Brand Config Injection

Three patterns for consuming brand-specific values in shared code:

| Pattern | When | Example |
|---------|------|---------|
| `getBrandConfig()` | Server components needing brand identity | `footer.tsx` reads logo, `api.ts` reads brandSlug |
| Props from app pages | Content arrays that vary per brand | `<Stats stats={STATS} />` from app's `constants/` |
| CSS custom properties | Theming (colors) | `bg-primary` resolves via each app's `globals.css` |

### Import Aliases

| Alias | Resolves to |
|-------|-------------|
| `@/*` | App root (e.g., `@/constants/links`, `@/components/hero`) |
| `@brand/config` | `packages/brand-config/src/` |
| `@brand/ui/*` | `packages/ui/src/*` |
| `@brand/shared/*` | `packages/shared/src/*` |

### Route Structure (both apps)

| Route | URL |
|-------|-----|
| `app/page.tsx` | `/` |
| `app/o-nama/` | `/o-nama` |
| `app/kontakt/` | `/kontakt` |
| `app/gde-kupiti/` | `/gde-kupiti` |
| `app/proizvodi/kategorije/` | `/proizvodi/kategorije` |
| `app/proizvodi/kategorije/[slug]/` | `/proizvodi/kategorije/[slug]` |
| `app/proizvodi/[slug]/` | `/proizvodi/[slug]` |

DCK also has: `app/registracija-garancije/` → `/registracija-garancije`

### Key Patterns

**Server vs Client components**: Most section components are plain server components. Client components (`"use client"`) are used only where interactivity is needed: Navbar, MobileMenu, Container (Framer Motion animations), WhereToBuyContent, DealerList, WarrantyForm.

**Layout wrapper components** (in `@brand/shared`):
- `Wrapper` — Max-width container (`lg:max-w-7xl`) with responsive padding
- `Container` — Framer Motion animation wrapper with preset animations

**Serbian content**:
- All Serbian strings are hardcoded directly — no i18n framework
- Structured data arrays live in per-app `constants/content.ts`
- Navigation labels in per-app `constants/links.ts`

**Product data fetching** (in `@brand/shared/lib/api.ts`):
- Uses `getBrandConfig().brandSlug` to filter products per brand
- `"use cache"` directive with time-based cache profiles (hours for categories, minutes for products)

**Styling**: Tailwind CSS v4 with OKLCH color tokens in `globals.css`. Shared base styles in `@brand/shared/styles/base.css`. Component variants use class-variance-authority (CVA). Always use `cn()` for merging classes.

**UI components**: shadcn/ui with `new-york` style. Add new components to `packages/ui/src/`. Config in per-app `components.json`.

**Fonts**: Space Grotesk (headings) and Inter (body) loaded via `next/font/google` in per-app `constants/fonts.ts`.

**Icons**: lucide-react — import individual icons as React components.

### Adding a New Page

1. Create `apps/<brand>/app/<serbian-page-name>/page.tsx`
2. Import shared components from `@brand/shared/components/`
3. Pass brand-specific content from `@/constants/`
4. Add navigation link to `constants/links.ts`

### Adding a New Brand

1. Create `packages/brand-config/src/new-brand.ts` with `BrandConfig` values
2. Register it in `packages/brand-config/src/index.ts`
3. Copy `apps/sg-tools/` → `apps/new-brand/`
4. Customize: `globals.css` (theme), `constants/` (content), `public/` (assets), `next.config.ts` (`NEXT_PUBLIC_BRAND_SLUG`)
5. All shared components work automatically

## PACMS Backend Dependency

This repo depends on the **PACMS** platform (`c:\Users\user\Documents\Projects\PACMS`) for several backend services:

**Product data**: `API_URL` points to the PACMS backend (`/api/Storefront/*` endpoints). All product, category, and sitemap data is fetched from there via `packages/shared/src/lib/api.ts`.

**Error reporting**: Server-side errors are reported to the PACMS backend's `/api/Storefront/ReportError` endpoint (authenticated via `PACMS_INTERNAL_KEY` / `X-Internal-Key` header). The backend dispatches these to Telegram via Hangfire background jobs with rate limiting. This is implemented in:
- `apps/*/instrumentation.ts` — `onRequestError` catches all unhandled server errors
- `packages/shared/src/lib/report-error.ts` — `reportError()` for explicitly-caught errors (API failures, server action errors, missing env vars)

**Warranty registration** (DCK only): `apps/dck/app/registracija-garancije/actions.ts` submits warranty forms to `/api/Storefront/SubmitWarrantyRegistration` (authenticated via `PACMS_API_KEY` / `X-Api-Key` header).

**Shared patterns with PACMS storefront** (`c:\Users\user\Documents\Projects\PACMS\pa-storefront`): Both repos use the same `instrumentation.ts` → `ReportError` pattern, the same `report-error.ts` utility structure, and the same Turnstile verification flow. When adding cross-cutting features (error handling, auth, caching), check the PACMS storefront for existing patterns to replicate.

**Vercel deployment**: All projects (dck, sg-tools, pa-storefront-ba, pa-storefront-rs) are managed under one Vercel team. Credentials and project IDs are in the PACMS repo at `.claude/skills/prod-vercel/skill.md`.

## Domain Map

- `sgtools.rs` — SG Tools brand site (`apps/sg-tools/`)
- `dcksrbija.rs` — DCK brand site (`apps/dck/`)
- `stridon.rs` — Parent company (Stridon Group DOO)
- `prodavnicaalata.rs` — Online shop (where users buy products)

# CLAUDE.md - STRIDON

See root `../../CLAUDE.md` for shared principles, architecture patterns, and domain map.

## Project-Specific

- **Domain**: stridon.rs (parent company site - Stridon Group DOO)
- **Theme**: Light only, editorial. Primary red `#e50113` = `oklch(0.58 0.236 27.9)`; red is an accent (~10% of the page), never large surfaces except the PartnerCta band.
- **Brand slug**: `stridon` (via `NEXT_PUBLIC_BRAND_SLUG` in `.env.production` / `.env.local`)
- **Signature motif**: diagonal parallelogram from the Stridon logo (`-skew-x-[14deg]` slabs) - H1 highlight, eyebrow chips, hover markers, section ornaments, red beam in PartnerCta.
- **Radius**: `--radius: 0.25rem` (sharper than sg-tools/dck - technical editorial edge)
- **Fonts**: Inter (body) + Space Grotesk (headings), **self-hosted** variable woff2 in `public/fonts/` via `@font-face` in `globals.css` (latin + latin-ext for č ć ž š đ). No `next/font` - do not reintroduce it.

## Differences vs sg-tools/dck

- **Not a single-brand product site**: Stridon is the distributor showcasing 30+ brands; purchases go to prodavnicaalata.rs. No product catalog wired yet - API/data wiring is deliberately postponed to the end of the redesign.
- **Navbar without categories**: layout passes `showCategoryMenu={false}` to shared `RootLayout` (prop added for this app) so the navbar never fetches product categories.
- **No warranty flow** (that's dck-only; removed from this app).
- Homepage is composed of **custom app-local sections** (`components/`), not the shared Features/Stats/CTA - the shared ones read too templated for this brand.

## Homepage sections (all in `components/`)

Hero (H1 "Najbolja prodavnica alata u Srbiji", red skewed slab, brand marquee via `stridon-marquee` keyframes in globals.css) → Brands (typographic hairline grid) → WhyStridon (editorial rows, sticky intro) → StatsBand (count-up via shared `useCounter`) → PartnerCta (ink band, red diagonal). Sections separate with hairline borders, not whitespace.

## Status / TODO

- Homepage: done (design pass). Other routes are still **unedited dck copies and break in dev** (missing API/assets) - rebuild them before wiring.
- Hero may switch to a full-bleed photo once a real photo is provided.
- Pending at the end: PACMS data wiring, OG templates (`lib/og/` still dck's), Sentry DSN + Turnstile keys in `.env.production`, remaining pages (o-nama, kontakt, brendovi, servis, katalozi, legal).

## Commands

```bash
pnpm dev:stridon   # from repo root (or `pnpm dev` here) - localhost:3000
pnpm -C apps/stridon exec tsc --noEmit   # type-check (never npx tsc)
```

Only one `next dev` instance at a time (`.next/dev/lock` + port 3000). Do not set `turbopack.root` (breaks Tailwind resolve under pnpm); the "multiple lockfiles" warning is harmless.

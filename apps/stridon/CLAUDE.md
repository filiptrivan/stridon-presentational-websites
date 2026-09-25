# CLAUDE.md - stridon

Root `../../CLAUDE.md` applies. This file holds only what is specific to `apps/stridon`, the site of Stridon Group DOO (stridon.rs). Longer topics live in `docs/`, listed at the end with when to read each one.

## What this app is

- The parent company site. Stridon has no products of its own: SG TOOLS is its brand, DCK is a brand it is the only verified supplier of in Serbia, and prodavnicaalata.rs is its shop. Never present DCK as Stridon's own brand.
- Light theme only. Primary red `#e50113` = `oklch(0.58 0.236 27.9)`, an accent, never a large surface. `--radius: 0.25rem`; buttons get dck's 8px through the `[data-slot="button"]` rule in `app/globals.css`.
- Serbian at the bare URL, English under `/en` (next-intl, `localePrefix: "as-needed"`). Brand slug `stridon`, set in `.env.production`.
- Fonts: Inter (body) and Space Grotesk (headings) through `next/font/local` in `constants/fonts.ts`.

## Rules

- Stridon is not a brand in PACMS, so every brand-scoped fetcher (`getCatalogs`, `getCategories`, `getTopProductsByBrand`) is empty here. Use the unscoped ones: `getAllCatalogs`, `getBrands`, `getBrandCards`, `getBrandBySlug`.
- The site shows every PACMS brand that has an `orderNumber`, sorted by orderNumber then id (`lib/brand-order.ts`, `lib/brands.ts`). There is no hand-kept brand list; do not add one.
- `@brand/shared` never imports next-intl: dck and sg-tools have no i18n config and would throw. Shared components take text as optional `labels` with Serbian defaults, and `app/[locale]/layout.tsx` fills them in.
- Every path handed to a shared component goes through `lib/nav.ts` (`pathFor`, `brandPath`). Shared components link with plain `next/link`, so an unconverted `/brendovi` sends English readers to Serbian.
- A new client-side `useTranslations("X")` means adding `X` to `clientMessages` in `app/[locale]/layout.tsx`, or it throws at runtime.
- Messages are typed against `messages/sr.json` (`global.ts`). A key built at runtime needs a literal-union type, not `string`. `__tests__/messages-parity.test.ts` holds `en.json` to the same keys.
- Root params (`next/root-params`, read by `packages/i18n`) never work in a Server Action, so actions take `locale` as an argument and validate it. On Next 16.1 they also throw inside `"use cache"`: code there must pass `{ locale }` to next-intl explicitly.
- `*.meta.*` copy carried over from the live site keeps its wording verbatim, even where it uses formal "Vi". Everything written here, meta included, uses "ti" (`docs/seo.md` lists which is which). No em-dash in Serbian copy.
- The homepage title and description exist twice: `Site.*` in `messages/*.json` and `defaultTitle`/`siteDescription` in `packages/brand-config/src/stridon.ts` (the OG card reads the latter). Change both.
- A Serbian route keeps the live site's URL (`/onama`, `/politikaprivatnosti`, `/podacizaidentifikaciju`). An old live URL this app spells differently gets a 308 from `constants/legacy-urls.ts`.
- `next/image` gets `unoptimized` only for `.svg` sources, and `sizes` must match the grid the image sits in.
- `app/robots.ts` must not disallow `/api/` or `/_next/`: that hides every OG image, every optimized image and the CSS/JS Googlebot renders with.
- One divider style: the dashed hairline the shared `Section` draws. No skewed shapes or red slabs anywhere.
- Do not delete `app/[locale]/[...rest]/page.tsx`. It is what sends an unknown URL to the localized 404, since the root layout lives under `[locale]`. On Next 16.1 it must keep reading its `params` and its placeholder `generateStaticParams`, or production shows global-error instead of the 404 (the file says why).

## Gotchas

- `proxy.ts` has a string-literal matcher whose escaped dot has to stay `\\.`. With a bare `.` the proxy runs on `/` only and every other URL 404s, while the build still reports a proxy.
- Routing and 404 behaviour differ between `next dev` and a production build (a URL with a dot once answered 500 only in production). Check locale or routing changes with `next start` and a dotted path.
- A stale `next start` on another port keeps answering while the new one fails with EADDRINUSE, which looks like a translation bug. Read the log first.
- Renaming a route touches its folder, its own `href` in `generateMetadata`, `i18n/routing.ts`, `constants/links.ts`, `app/sitemap.ts`, `lib/legal.ts` for a legal page, and `constants/legacy-urls.ts` if the old URL was live. Then delete `.next`: `.next/types/validator.ts` keeps type-checking the old folder.
- The dev server misses a Tailwind class used for the first time in a new file until it restarts.
- `apps/dck/__tests__/api-contract-coverage.test.ts` reads `git ls-files`, so an unstaged delete fails `pnpm preflight` with ENOENT.
- A new `packages/shared` fetcher adds its endpoint to that ledger: cover it in `apps/dck/__tests__/dto-shape.integration.test.ts` or list it as debt there.
- Never set `turbopack.root`; the "multiple lockfiles" warning is harmless.

## Commands

```bash
pnpm dev:stridon                          # from the repo root, localhost:3000; one dev server at a time
pnpm -C apps/stridon exec tsc --noEmit    # type-check; never npx tsc
pnpm -C apps/stridon test                 # unit tests
pnpm --filter stridon-storefront build    # production build; needs API_URL in .env.local
```

## Where to look

- `docs/i18n.md`: read before touching routing, locales, messages, per-locale metadata or the language switch.
- `docs/pacms-data.md`: read before touching brands, catalogs, the service page, the B2B form or caching.
- `docs/seo.md`: read before changing a title, description, URL, the OG card, favicons or JSON-LD.
- `docs/troubleshooting.md`: read before chasing a console message, a prefetch 404 or a blank page.

# SEO

## Titles and descriptions

Every Serbian `<title>` and description the live stridon.rs has is carried over verbatim: those URLs are ranked, and a title is a ranking input. English is a faithful translation. Lengths below are the rendered title (message plus the ` | Stridon Group` template) and the description.

| Route | Rendered Serbian `<title>` | Title | Desc |
| --- | --- | --- | --- |
| `/` | `Najbolja prodavnica alata u Srbiji \| Stridon Group` | 50 | 157 |
| `/brendovi` | `Uvoznik i distributer najboljih brendova \| Stridon Group` | 56 | 149 |
| `/katalozi` | `Pregledajte naše akcijske kataloge \| Stridon Group` | 50 | 150 |
| `/servis` | `Servis mašina i alata van garantnog roka \| Stridon Group` | 56 | 153 |
| `/onama` | `O nama \| 30 godina distribucije alata \| Stridon Group` | 53† | 155† |
| `/kontakt` | `Kontakt \| Sve potrebne informacije \| Stridon Group` | 50* | 151 |
| `/b2b` | `Postanite naš B2B partner \| Saradnja \| Stridon Group` | 52 | 151 |
| `/politikaprivatnosti` | `Politika privatnosti korisnika \| Stridon Group` | 46* | 151 |
| `/uslovi-koriscenja` | `Uslovi korišćenja internet sajta \| Stridon Group` | 48† | 142† |
| `/podacizaidentifikaciju` | `Podaci za identifikaciju firme \| Stridon Group` | 46* | 154 |

The live pairs were supplied by hand by the owner; `https://www.stridon.rs/` fails TLS from this machine.

† Written here, not carried over: no live pair was supplied for these. `/uslovi-koriscenja` is a new page. `/onama` does exist on the live site (its navigation links it in web.archive.org captures), so its live tags are worth comparing in Search Console. Both follow the live site's pattern, a descriptive phrase and a description that names what is on the page, but in the "ti" form the root CLAUDE.md asks for.

\* ` DOO` dropped from the live title, by the owner's call: the suffix comes from the layout's `title.template`, and the site keeps one brand suffix everywhere.

Rules that are not visible from the code:

- **Formal "Vi" survives only in meta carried over from the live site.** Those strings keep the live wording even when it is formal; every string written here, meta included (the † rows and `Brand.meta`), uses "ti".
- **The homepage pair lives in two places**: `Site.*` in `messages/*.json` for the tags, `defaultTitle`/`siteDescription` in `packages/brand-config/src/stridon.ts` for the OG card. Change both.
- **`Brands.meta.*` and `Brands.hero.*` are byte-identical**, because the live title and description were the page's own heading and lead. Reword the hero and the meta silently stops matching the live site.
- **The `/servis` description names seven brands** (DeWalt, Bosch, Makita, Metabo, Festool, Rubi, Senco); true while `SERVICED_BRAND_SLUGS` keeps them.
- **The homepage title promises a shop** ("online prodaja", "cene, akcije") on a site with no products. The owner kept the live wording knowingly.

## Brand pages

One template at `Brand.meta` with the name interpolated, not the CMS `metaTitle`/`metaDescription`. Measured on the CMS copy: it sells ("Online prodaja Srbija") on a site that sells nothing, it is word for word what prodavnicaalata.rs serves on `/proizvodjaci/<slug>/` (two domains, one owner, one snippet), and about a third of it runs past 160 characters or is malformed. The template wording is neutral ("u ponudi Stridon Group") because the list includes brands with their own importers in Serbia. The body `htmlDescription` is still the CMS's.

## URLs of the live site

Kept byte-identical: `/brendovi/*`, `/katalozi`, `/servis`, `/kontakt`, `/b2b`, `/onama`, `/politikaprivatnosti`, `/podacizaidentifikaciju`. `/uslovi-koriscenja` is new.

Redirected 308 from `constants/legacy-urls.ts` (run in `next.config.ts`, before the proxy):

- `/brendovi/hogert`, `/brendovi/kwb`, `/brendovi/black-and-decker` to their CMS slugs.
- The live English site keeps Serbian slugs under `/en`: `/en/onama`, `/en/brendovi`, `/en/brendovi/<slug>`, `/en/katalozi`, `/en/kontakt`, `/en/servis` go to the English routes, a legacy brand slug in one hop.

Google treats only 301/308 as a canonical signal; next-intl's own redirect for these would be a temporary 307. The list comes from archived captures of the live navigation, so it is not exhaustive: the Search Console export (Pages report, Performance by page) is the source of truth for every other known URL. There is no evidence that `/proizvodi` or `/gde-kupiti` ever existed on stridon.rs; those were dck routes in the scaffold this app was copied from.

## Canonical, hreflang, sitemap

Every page has its own canonical plus `alternates.languages`, `app/sitemap.ts` lists both locales with the same pairs, and the proxy adds `Link: rel=alternate` headers. `<html lang>` is `sr-Latn`, not `sr-RS` (a bare `sr` claims Cyrillic). The sitemap has no `changeFrequency`/`priority` (ignored by Google and Bing) and no `lastModified`: `new Date()` is dynamic IO under `cacheComponents`, and every entry carrying "now" is exactly what Google says it ignores.

Next replaces a parent's `openGraph` wholesale instead of merging it, so `lib/metadata.ts` restates `siteName`, `type` and `og:url` for every page.

## OG card

Generated per page at `/api/og` (1200x630, shared route, `DefaultTemplate` only) and it draws the real logo, inlined as a base64 PNG in `lib/og/logo-data.ts`: satori renders without a browser, so a URL would cost a fetch per cold render. `<img>` there carries `eslint-disable-next-line @next/next/no-img-element`, as the dck and sg-tools templates do. The homepage card drops ` | Stridon Group` from its headline (the logo is right above it), and descriptions are cut at 160 characters. The satori fonts are the TTFs in `public/fonts` (satori cannot read WOFF2).

The `og:image` URL is absolute on the production host in every environment, so a preview tool pointed at localhost follows it to the old live site until this app serves stridon.rs. A development-only branch was tried and backed out on the owner's call.

## Favicons

Made from the owner's `stridon-logo-favicon.svg` (the grey nut from the wordmark, transparent). It is not square, so every icon centres it on a square canvas.

- `apple-touch-icon.png` is opaque white on purpose: iOS composites a transparent icon onto black.
- `favicon.ico` holds 16, 32 and 48, each rendered from the SVG at its own size, not downsampled from one image; `app/manifest.ts` declares those real sizes, not `sizes: "any"` (that is for vector formats and made Chrome warn).
- To regenerate, render the SVG at 4x each target and resize down; sharp reads SVG but does not write ICO.

## Organization JSON-LD

The shared `root-layout.tsx` gives every site `parentOrganization: Stridon Group DOO` with stridon.rs's URL, so on this site Stridon is its own parent. It is a shared-package change, and the owner declined it twice. Leave it.

## Heading structure

Every page has exactly one `h1`, starts at `h1` and skips no level. Most headings come from shared components, so check a sweep of the rendered HTML rather than the page's JSX.

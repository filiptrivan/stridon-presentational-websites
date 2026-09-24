# Troubleshooting

## Console messages: ours or not

| message | verdict |
|---|---|
| 404 on `?_rsc=` prefetch requests on Serbian pages | known, not a bug; see "Known: five failing prefetches" in `i18n.md` |
| hydration mismatch on `cz-shortcut-listen="true"` | the ColorZilla browser extension writing to `<body>`. None in a headless browser. Do not add `suppressHydrationWarning` for it |
| `Route /[locale] is rendering with server caches disabled` | dev only, Next's notice that `use cache` is bypassed in `next dev` |
| "preloaded but not used" for a font or the hero image | dev compile time, or a page loaded twice in a row by a test script. Check one clean load of a production build before chasing it |
| `Image ... has either width or height modified` | real when it happens: the declared width/height ratio does not match the rendered one. Logo dimensions come from `logoWidth`/`logoHeight` in brand-config |
| `icon from the Manifest (Resource size is not correct)` | real when it happens: a size in `app/manifest.ts` does not match the file |

## A URL with a dot answered 500 in production and 404 in dev

The proxy matcher skips any path containing a dot, so a legacy asset URL such as `/favicon-96x96.png` reaches `app/[locale]/` with the filename where the locale belongs. `packages/i18n/src/request.ts` once validated the locale on one branch only and passed the other straight into a dynamic `import()` of the catalog, which threw `MODULE_NOT_FOUND`: a 500 to a crawler, a Sentry event and a function call per request. `next dev` answered 404, so it was invisible locally. Both branches go through `hasLocale` now. Any change to how the locale is resolved needs checking with `next start` and a dotted path.

## The dev server shows a blank page on a phone

`next dev` refuses `/_next/*` to an origin that is not in `allowedDevOrigins`, which is unset in all three apps, so from the LAN the HTML loads and every JS and CSS chunk answers 403. Production has no such check. The page is blank rather than unstyled because of the `Container` note below. The owner has not taken `allowedDevOrigins`.

## The shared `Container` renders at `opacity: 0`

`packages/shared/src/components/container.tsx` gives `motion.div` `initial={{ opacity: 0, y: 20 }}`, which framer-motion writes into the server HTML, and it wraps nearly every section on all three sites. With `whileInView` and `once: true`, a section outside the first viewport stays invisible until scrolled to, and with no JavaScript nothing ever shows. The text is in the HTML either way. A fix (hidden state behind a `js` class set by an inline script, `initial={false}`) touches every section of all three sites; the owner chose research only. Before a visual check or a screenshot, scroll the whole page once so every section has animated in.

## Building without touching the owner's dev server

To be sure a build cannot disturb a running dev server, give it its own output folder: add a temporary `distDir: process.env.NEXT_DIST_DIR ?? ".next"` to `next.config.ts`, run `NEXT_DIST_DIR=.next-verify next build`, and remove it afterwards.

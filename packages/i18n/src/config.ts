/**
 * The locale settings every app in this monorepo shares. Only the `pathnames`
 * map is per-app, because it names that app's own routes - see `createNavigation`
 * in each app's `i18n/` folder.
 *
 * Kept `as const` so `defineRouting`'s const generics still see the literal
 * locale strings after the object is spread into it; widen them to `string[]`
 * and every localized-pathname autocomplete in the app goes away.
 */
export const localeSettings = {
  locales: ["sr", "en"],
  defaultLocale: "sr",
  // Serbian keeps the bare URL it is already indexed under (/onama), English
  // gets a prefix (/en/about). The alternative, prefixing both, would mean a
  // redirect on every existing URL on the site.
  localePrefix: "as-needed",
  // No Accept-Language sniffing. With detection on, the proxy turns "/" into a
  // per-visitor redirect and the homepage stops being one cacheable document;
  // a visitor who wants English has the switch in the navbar.
  localeDetection: false,
  // Nothing reads a locale cookie once detection is off, so setting one would
  // only make the URL for a given page depend on invisible state - the exact
  // shape of next-intl#1845, where a redirect lands on a previously visited
  // locale. The prefix is the whole story.
  localeCookie: false,
} as const;

export const locales = localeSettings.locales;

export type Locale = (typeof locales)[number];

/**
 * What goes in `hreflang`, which is not always the URL segment. Serbian is
 * digraphic and this site is Latin-only, so `sr-Latn` is the honest tag even
 * though the path stays `/sr`.
 */
export const HREFLANG: Record<Locale, string> = {
  sr: "sr-Latn",
  en: "en",
};

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

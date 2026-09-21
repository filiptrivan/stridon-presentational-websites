import { localeSettings } from "@brand/i18n/config";
import { defineRouting } from "next-intl/routing";

/**
 * The key of each entry is the **internal** route - the folder that exists under
 * `app/[locale]/` - and the value only names the locales that spell it
 * differently. Serbian is the default and is not listed anywhere, so every
 * Serbian URL on the live site stays byte-identical and no folder had to be
 * renamed: `/o-nama` is still `app/[locale]/o-nama/page.tsx`, and English is an
 * alias on top of it.
 *
 * Listing a route here is also what makes `Link href` type-checked: an href
 * that is not a key below is a build error rather than a 404 found later.
 */
export const routing = defineRouting({
  ...localeSettings,
  pathnames: {
    "/": "/",
    "/o-nama": { en: "/about" },
    "/brendovi": { en: "/brands" },
    "/brendovi/[slug]": { en: "/brands/[slug]" },
    "/katalozi": { en: "/catalogs" },
    "/servis": { en: "/service" },
    "/kontakt": { en: "/contact" },
    "/b2b": { en: "/b2b" },
    "/politika-privatnosti": { en: "/privacy-policy" },
    "/uslovi-koriscenja": { en: "/terms-of-use" },
  },
});

export type AppPathname = keyof typeof routing.pathnames;

/**
 * The routes that are a complete URL on their own.
 *
 * `/brendovi/[slug]` is not one: next-intl will only accept it as
 * `{ pathname, params }`, so letting it through as a bare string would turn a
 * missing slug into a literal "[slug]" in a URL rather than a type error.
 */
export type StaticPathname = Exclude<AppPathname, `${string}[${string}`>;

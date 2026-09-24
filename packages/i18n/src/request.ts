import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { locales, type Locale } from "./config";

/**
 * Builds the per-request config every app re-exports from its own
 * `i18n/request.ts`.
 *
 * The locale comes from `next/root-params` rather than `cookies()` or
 * `headers()`: under `cacheComponents` either of those turns the whole subtree
 * dynamic, so a translated page could not be prerendered at all. Root params
 * are part of the route, so they are known at build time and every page stays
 * static. `cacheComponents` switches them on by itself in both bundlers.
 *
 * On Next 16.1 root params throw inside a `"use cache"` scope (support landed
 * in 16.3), and `locale()` is untyped. So a cached function must never reach
 * this config without a locale: pass `{ locale }` to `getTranslations` there.
 * The `hasLocale` guard below narrows the untyped value.
 *
 * There is deliberately no catalog of its own in here. `@brand/shared` takes
 * its text as props from whichever app renders it, because dck and sg-tools
 * have no i18n config and a `useTranslations` call in the shared tree would
 * throw for them. So each app owns all of its strings, and this package owns
 * the locale rules they will all share.
 */
export function createBrandRequestConfig(
  loadMessages: (locale: Locale) => Promise<AbstractIntlMessages>,
) {
  return getRequestConfig(async ({ locale: requestedLocale }) => {
    // `requestedLocale` is set when a caller asks for a specific locale, which
    // is how Server Actions have to do it - root params are unavailable inside
    // an action, permanently, since an action is not tied to a route.
    const locale = requestedLocale ?? (await rootParams.locale());

    // Both branches need the guard, not just the root-param one. The proxy
    // matcher skips any path containing a dot, so a legacy asset URL such as
    // `/favicon-96x96.png` reaches the `[locale]` segment with the filename
    // sitting where the locale belongs. Unvalidated it went straight into the
    // dynamic `import()` below and threw MODULE_NOT_FOUND, which a production
    // server answers with 500 where a 404 belongs: a 5xx to a crawler, a
    // Sentry event and a function invocation, all on an unauthenticated GET.
    // `next dev` returns 404 for the same URLs, so it was invisible locally.
    if (!hasLocale(locales, locale)) notFound();

    return { locale, messages: await loadMessages(locale) };
  });
}

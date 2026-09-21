import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { locales, type Locale } from "./config";
import { deepMerge } from "./deep-merge";

/**
 * Builds the per-request config every app re-exports from its own
 * `i18n/request.ts`.
 *
 * The locale comes from `next/root-params`, which is the reason this work
 * needed Next 16.3: under `cacheComponents` a `cookies()` or `headers()` read
 * turns the whole subtree dynamic, so a translated page could not be
 * prerendered at all. Root params are part of the route, so they are known at
 * build time and every page stays static.
 *
 * Two catalogs are merged per request: the shared one in this package, which
 * covers `@brand/shared` components, and the app's own. The app wins, so a
 * brand can override a single shared string without copying the section.
 */
export function createBrandRequestConfig(
  loadAppMessages: (locale: Locale) => Promise<AbstractIntlMessages>,
) {
  return getRequestConfig(async ({ locale: requestedLocale }) => {
    // `requestedLocale` is set when a caller asks for a specific locale, which
    // is how Server Actions and Route Handlers have to do it - root params are
    // unavailable in both (permanently in actions, "planned" in handlers).
    let locale = requestedLocale;

    if (!locale) {
      const fromRoute = await rootParams.locale();
      if (!hasLocale(locales, fromRoute)) notFound();
      locale = fromRoute;
    }

    const [shared, app] = await Promise.all([
      loadSharedMessages(locale as Locale),
      loadAppMessages(locale as Locale),
    ]);

    return { locale, messages: deepMerge(shared, app) };
  });
}

async function loadSharedMessages(locale: Locale): Promise<AbstractIntlMessages> {
  return (await import(`../messages/${locale}.json`)).default;
}

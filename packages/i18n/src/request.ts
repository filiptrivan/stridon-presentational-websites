import { hasLocale, type AbstractIntlMessages } from "next-intl";
import { getRequestConfig } from "next-intl/server";
import * as rootParams from "next/root-params";
import { notFound } from "next/navigation";
import { locales, type Locale } from "./config";

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
    let locale = requestedLocale;

    if (!locale) {
      const fromRoute = await rootParams.locale();
      if (!hasLocale(locales, fromRoute)) notFound();
      locale = fromRoute;
    }

    return { locale, messages: await loadMessages(locale as Locale) };
  });
}

import { createBrandRequestConfig } from "@brand/i18n/request";

/**
 * next-intl resolves this file through the plugin in `next.config.ts`. The
 * shared half of the catalog lives in `@brand/i18n`; this app's half is merged
 * over it.
 */
export default createBrandRequestConfig(
  async (locale) => (await import(`../messages/${locale}.json`)).default,
);

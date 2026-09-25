import { createBrandRequestConfig } from "@brand/i18n/request";

/**
 * next-intl resolves this file through the plugin in `next.config.ts`. The
 * locale rules live in `@brand/i18n`; the whole catalog is this app's own.
 */
export default createBrandRequestConfig(
  async (locale) => (await import(`../messages/${locale}.json`)).default,
);

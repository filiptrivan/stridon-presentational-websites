import { LEGACY_BRAND_SLUGS, LEGACY_EN_PATHS } from "./constants/legacy-urls";
import { baseNextConfig } from "@brand/config/next-config";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  ...baseNextConfig,
  transpilePackages: [...baseNextConfig.transpilePackages, "@brand/i18n"],
  experimental: {
    ...baseNextConfig.experimental,
    // `next/root-params` (packages/i18n/src/request.ts). Cache Components used to
    // switch it on implicitly; on Next < 16.3 nothing else does. 16.3 enables it
    // by default, after which this line can go.
    rootParams: true,
  },
  // Live stridon.rs URLs this app spells differently (constants/legacy-urls.ts).
  // Permanent, so an indexed URL keeps working instead of trading its ranking
  // for a tidier route. Order matters: Next takes the first match, so a legacy
  // brand slug under /en is mapped in one hop before the generic slug rule.
  async redirects() {
    const brands = Object.entries(LEGACY_BRAND_SLUGS);
    return [
      ...brands.map(([from, to]) => ({
        source: `/brendovi/${from}`,
        destination: `/brendovi/${to}`,
        permanent: true,
      })),
      ...brands.map(([from, to]) => ({
        source: `/en/brendovi/${from}`,
        destination: `/en/brands/${to}`,
        permanent: true,
      })),
      {
        source: "/en/brendovi/:slug",
        destination: "/en/brands/:slug",
        permanent: true,
      },
      ...Object.entries(LEGACY_EN_PATHS).map(([from, to]) => ({
        source: from,
        destination: to,
        permanent: true,
      })),
    ];
  },
};

// Sentry has to wrap the outermost config, not the inner one: next-intl's
// plugin resolves `./i18n/request.ts` relative to the config it is given, and
// composing these the other way round produces "Couldn't find next-intl config
// file" at build time.
export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});

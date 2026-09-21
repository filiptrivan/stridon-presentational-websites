import { LEGACY_BRAND_SLUGS } from "./constants/brands";
import { TRUSTED_IMAGE_HOSTS } from "@brand/config/public-assets";
import { withSentryConfig } from "@sentry/nextjs";
import createNextIntlPlugin from "next-intl/plugin";
import type { NextConfig } from "next";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@brand/config", "@brand/ui", "@brand/shared", "@brand/i18n"],
  cacheComponents: true,
  experimental: {
    // Retry a transient page-prerender failure (e.g. a backend blip) instead of
    // aborting the whole build on the first ETIMEDOUT.
    staticGenerationRetryCount: 2,
  },
  // The OG route reads font files at runtime; ensure they're bundled into its
  // lambda (public/ assets aren't traced into functions by default).
  outputFileTracingIncludes: {
    "/api/og": ["./public/fonts/**"],
  },
  env: {
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  // Three brands are spelled differently on the live stridon.rs than in the CMS,
  // and the CMS slug is canonical in the app. A permanent redirect keeps those
  // indexed URLs working instead of trading their ranking for a tidier route.
  async redirects() {
    return Object.entries(LEGACY_BRAND_SLUGS).map(([from, to]) => ({
      source: `/brendovi/${from}`,
      destination: `/brendovi/${to}`,
      permanent: true,
    }));
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: TRUSTED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
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

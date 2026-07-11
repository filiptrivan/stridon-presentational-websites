import { TRUSTED_IMAGE_HOSTS } from "@brand/config/public-assets";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  transpilePackages: ["@brand/config", "@brand/ui", "@brand/shared"],
  cacheComponents: true,
  experimental: {
    staticGenerationRetryCount: 2,
  },
  env: {
    NEXT_PUBLIC_BRAND_SLUG: "stridon",
    BUILD_YEAR: String(new Date().getFullYear()),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: TRUSTED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default withSentryConfig(withNextIntl(nextConfig), {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});

import { TRUSTED_IMAGE_HOSTS } from "@brand/config/public-assets";
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@brand/config", "@brand/ui", "@brand/shared"],
  // Without Cache Components every route is either fully static (ISR) or fully
  // dynamic, and nothing is streamed behind a Suspense boundary. On a dynamic
  // route (the paginated listings) Next still streams metadata into <body> for
  // any user agent outside its html-limited bot list, and on 16.1 that list has
  // no Googlebot, GPTBot or ClaudeBot. Google reads rel=canonical only from
  // <head>, so every agent gets the blocking render. No effect on static routes.
  htmlLimitedBots: /.*/,
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
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: TRUSTED_IMAGE_HOSTS.map((hostname) => ({
      protocol: "https" as const,
      hostname,
    })),
  },
};

export default withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
});

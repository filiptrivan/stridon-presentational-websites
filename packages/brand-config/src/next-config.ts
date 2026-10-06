import type { NextConfig } from "next";

import { TRUSTED_IMAGE_HOSTS } from "./public-assets";

// What the three apps' next.config.ts share; each spreads it and adds its own.
// Imports only its siblings: Next compiles next.config.ts and whatever it imports
// with the app's tsconfig `paths`, rewriting an `@brand/*` import relative to the
// app folder, which points the wrong way from a file in packages/.
export const baseNextConfig = {
  transpilePackages: ["@brand/config", "@brand/ui", "@brand/shared"],
  // Without Cache Components every route is either fully static (ISR) or fully
  // dynamic, and nothing is streamed behind a Suspense boundary. On a dynamic
  // route Next still streams metadata into <body> for any user agent outside
  // its html-limited bot list, and on 16.1 that list has no Googlebot, GPTBot or
  // ClaudeBot. Google reads rel=canonical only from <head>, so every agent gets
  // the blocking render. No effect on static routes.
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
} satisfies NextConfig;

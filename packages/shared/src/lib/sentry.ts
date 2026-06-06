import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

// Re-exported by each app's instrumentation.ts. The opengraph-image workaround
// for vercel/next.js#88043 is gone — OG images now render via the on-demand
// /api/og route handler, which isn't subject to the cache-components dynamic
// fallback that produced the false-positive DYNAMIC_SERVER_USAGE noise.
export const onRequestError = Sentry.captureRequestError;

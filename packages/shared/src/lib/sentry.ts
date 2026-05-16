import * as Sentry from "@sentry/nextjs";

export function initSentry() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
  });
}

// TODO: drop the wrapper once vercel/next.js#88043 ships a fix.
// Cache Components misattributes calls to "use cache"-annotated functions in
// packages/shared/src/lib/api.ts as uncached IO when awaited from opengraph-image
// routes during dynamic fallback (slugs not in generateStaticParams). The image
// still renders correctly; only the false-positive DYNAMIC_SERVER_USAGE noise
// reaches Sentry. Filter narrowly so real OG errors still surface.
export const onRequestError: typeof Sentry.captureRequestError = (
  err,
  request,
  errorContext,
) => {
  const digest = (err as Error & { digest?: string })?.digest;
  if (
    digest === "DYNAMIC_SERVER_USAGE" &&
    errorContext.routePath.endsWith("/opengraph-image")
  ) {
    return;
  }
  return Sentry.captureRequestError(err, request, errorContext);
};

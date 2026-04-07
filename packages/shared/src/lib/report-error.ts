import * as Sentry from "@sentry/nextjs";

interface ErrorContext {
  source: string;
  details?: string;
}

export function reportError(error: unknown, context: ErrorContext): void {
  Sentry.captureException(error, {
    tags: { source: context.source },
    extra: { details: context.details },
  });
}

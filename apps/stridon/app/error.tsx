"use client";

import * as Sentry from "@sentry/nextjs";
import ErrorPage from "@brand/shared/components/error-page";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return <ErrorPage reset={reset} />;
}

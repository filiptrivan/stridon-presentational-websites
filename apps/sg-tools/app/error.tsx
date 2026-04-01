"use client";

import ErrorPage from "@brand/shared/components/error-page";

export default function RootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ErrorPage reset={reset} />;
}

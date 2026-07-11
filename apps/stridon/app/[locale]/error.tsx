"use client";

import ErrorPage from "@brand/shared/components/error-page";

export default function Error({ reset }: { reset: () => void }) {
  return <ErrorPage reset={reset} />;
}

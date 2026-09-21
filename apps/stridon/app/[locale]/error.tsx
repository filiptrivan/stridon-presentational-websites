"use client";

import ErrorPage from "@brand/shared/components/error-page";
import * as Sentry from "@sentry/nextjs";
import { useTranslations } from "next-intl";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");

  useEffect(() => {
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <ErrorPage
      reset={reset}
      labels={{
        title: t("title"),
        description: t("description"),
        retry: t("retry"),
        home: t("home"),
      }}
    />
  );
}

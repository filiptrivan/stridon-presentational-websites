"use client";

import { pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import ErrorPage from "@brand/shared/components/error-page";
import * as Sentry from "@sentry/nextjs";
import { useLocale, useTranslations } from "next-intl";
import { useEffect } from "react";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("Error");
  const locale = useLocale() as Locale;

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
      homeHref={pathFor("/", locale)}
    />
  );
}

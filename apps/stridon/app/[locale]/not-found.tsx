import { pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import NotFoundPage from "@brand/shared/components/not-found-page";
import { getLocale, getTranslations } from "next-intl/server";
import type { Metadata } from "next";

// `notFound()` renders this without params, so the locale comes from the
// request config rather than from a prop.
export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("NotFound");
  return {
    title: t("title"),
    description: t("description"),
    robots: { index: false, follow: true },
  };
}

export default async function NotFound() {
  const locale = (await getLocale()) as Locale;
  const t = await getTranslations("NotFound");

  return (
    <NotFoundPage
      labels={{
        title: t("title"),
        description: t("description"),
        home: t("home"),
        secondary: t("brands"),
      }}
      homeHref={pathFor("/", locale)}
      // The shared default is /proizvodi/kategorije, a route this site does not
      // have - a link from a 404 to another 404. Brands is the closest thing
      // Stridon has to a catalogue.
      secondaryHref={pathFor("/brendovi", locale)}
    />
  );
}

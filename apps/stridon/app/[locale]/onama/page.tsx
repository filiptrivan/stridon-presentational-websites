import OwnBrand from "@/components/own-brand";
import {
  ABOUT_MILESTONES,
  CLIENT_LOGOS,
  OWN_BRANDS,
  PARTNER_QUOTES,
} from "@/constants/about";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@brand/i18n/config";
import Companies from "@brand/shared/components/companies";
import CompanyValues from "@brand/shared/components/company-values";
import HeroHeader from "@brand/shared/components/hero-header";
import Testimonials from "@brand/shared/components/testimonials";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/onama",
    title: t("title"),
    description: t("description"),
  });
}

const ONamaPage = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      <CompanyValues
        milestones={ABOUT_MILESTONES.map(({ key, image, ...rest }) => ({
          ...rest,
          title: t(`milestones.${key}.title`),
          description: t(`milestones.${key}.description`),
          image: { ...image, alt: t(`milestones.${key}.imageAlt`) },
        }))}
        title={t("timelineTitle")}
      />
      <OwnBrand brand={OWN_BRANDS[0]} locale={locale as Locale} />
      <OwnBrand brand={OWN_BRANDS[1]} locale={locale as Locale} />
      <Testimonials
        items={PARTNER_QUOTES.map(({ key, personName }) => ({
          personName,
          quote: t(`quotes.${key}`),
        }))}
        title={t("testimonialsTitle")}
      />
      <Companies companies={CLIENT_LOGOS} title={t("clientsTitle")} />
    </div>
  );
};

export default ONamaPage;

import Brands from "@/components/brands";
import Hero from "@/components/hero";
import OwnBrand from "@/components/own-brand";
import { OWN_BRANDS } from "@/constants/about";
import { CTA_TRUST_BADGES, FEATURES, STAT_KEYS } from "@/constants/content";
import { pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import CompanyStats from "@brand/shared/components/company-stats";
import SharedCTA from "@brand/shared/components/cta";
import Features from "@brand/shared/components/features";
import { getTranslations } from "next-intl/server";

const [SG_TOOLS, DCK] = OWN_BRANDS;

// Order: what we carry -> numbers -> what is ours -> why us -> the ask.
//
// Only Hero, Brands and the OwnBrand pair are app-local; the rest are
// @brand/shared and take their copy as props, which is how that package stays
// free of an i18n dependency dck and sg-tools do not have.
const HomePage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <div>
      <Hero locale={locale as Locale} />
      <Brands locale={locale as Locale} />
      <CompanyStats
        stats={STAT_KEYS.map((key) => ({
          value: t(`stats.${key}.value`),
          label: t(`stats.${key}.label`),
        }))}
        layout="four-up-no-three"
        // The figures are written per language ("10.630+" / "10,630+"), so the
        // count-up has to read them back with the same separator.
        locale={locale}
      />
      <OwnBrand brand={SG_TOOLS} locale={locale as Locale} />
      <OwnBrand brand={DCK} locale={locale as Locale} />
      <Features
        items={FEATURES.map(({ key, icon }) => ({
          icon,
          title: t(`features.${key}.title`),
          desc: t(`features.${key}.description`),
        }))}
        title={t("featuresTitle")}
      />
      <SharedCTA
        trustBadges={CTA_TRUST_BADGES.map(({ key, icon }) => ({
          icon,
          text: t(`cta.badges.${key}`),
        }))}
        heading={t("cta.heading")}
        labels={{ action: t("cta.action") }}
        actionHref={pathFor("/kontakt", locale as Locale)}
      />
    </div>
  );
};

export default HomePage;

import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "PrivacyPolicy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const COMPANY_ITEM_KEYS = [
  "companyItem0",
  "companyItem1",
  "companyItem2",
  "companyItem3",
  "companyItem4",
  "companyItem5",
  "companyItem6",
  "companyItem7",
] as const;

const SECTIONS = [
  { heading: "section0Heading", contents: ["section0Content0", "section0Content1", "section0Content2"] },
  { heading: "section1Heading", contents: ["section1Content0"] },
  { heading: "section2Heading", contents: ["section2Content0"] },
  { heading: "section3Heading", contents: ["section3Content0"] },
  { heading: "section4Heading", contents: ["section4Content0"] },
  { heading: "section5Heading", contents: ["section5Content0"] },
  { heading: "section6Heading", contents: ["section6Content0"] },
] as const;

export default async function PolitikaPrivatnostiPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("PrivacyPolicy");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("heroDescription")} />

      <Wrapper className="pb-20 max-w-3xl">
        <Container animation="fadeUp" delay={0.1}>
          <div className="rounded-xl border border-border/60 bg-card p-6 mb-8">
            <h2 className="text-base font-semibold mb-4">{t("companyDataTitle")}</h2>
            <ul className="space-y-1.5 text-sm text-muted-foreground">
              {COMPANY_ITEM_KEYS.map((key) => (
                <li key={key}>{t(key)}</li>
              ))}
            </ul>
          </div>
        </Container>

        <div className="space-y-10">
          {SECTIONS.map((section, index) => (
            <Container key={section.heading} animation="fadeUp" delay={0.05 * index}>
              <div>
                <h2 className="text-lg font-semibold mb-3">{t(section.heading)}</h2>
                <div className="space-y-3">
                  {section.contents.map((key) => (
                    <p key={key} className="text-sm text-muted-foreground leading-relaxed">
                      {t(key)}
                    </p>
                  ))}
                </div>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}

import { COMPANY_DETAILS } from "@/constants/company";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { formatTelHref } from "@brand/shared/lib/utils";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import type { ReactNode } from "react";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "Legal.identification.meta",
  });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/podacizaidentifikaciju",
    title: t("title"),
    description: t("description"),
  });
}

const Page = async ({ params }: Props) => {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Legal.identification" });

  // Unlike its two siblings this page is not a document, so it does not go
  // through `Prose` and a `body` string: every value is a register field that
  // reads the same in both languages, so the label comes from the catalog and
  // the value from `constants/company.ts`. A row is a pairing, not a sentence.
  const rows: { label: string; value: ReactNode }[] = [
    { label: t("fields.legalName"), value: COMPANY_DETAILS.legalName },
    { label: t("fields.address"), value: COMPANY_DETAILS.address },
    {
      label: t("fields.activity"),
      value: `${COMPANY_DETAILS.activityCode} - ${t("activity")}`,
    },
    {
      label: t("fields.registrationNumber"),
      value: COMPANY_DETAILS.registrationNumber,
    },
    { label: t("fields.taxNumber"), value: COMPANY_DETAILS.taxNumber },
    {
      label: t("fields.website"),
      value: (
        <a
          href={COMPANY_DETAILS.website}
          className="underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {COMPANY_DETAILS.website}
        </a>
      ),
    },
    {
      label: t("fields.phone"),
      value: (
        <a
          href={formatTelHref(COMPANY_DETAILS.phone)}
          className="underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {COMPANY_DETAILS.phone}
        </a>
      ),
    },
    {
      label: t("fields.email"),
      value: (
        <a
          href={`mailto:${COMPANY_DETAILS.email}`}
          className="underline-offset-4 transition-colors hover:text-primary hover:underline"
        >
          {COMPANY_DETAILS.email}
        </a>
      ),
    },
  ];

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      <Section>
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("companyTitle")}
            </h2>

            {/* Dashed rules, the same ones /servis uses for its two-column
                warranty block, so the page introduces no new line style. */}
            <dl className="mt-10 max-w-3xl border-t border-dashed border-border/70">
              {rows.map((row) => (
                <div
                  key={row.label}
                  className="grid gap-1 border-b border-dashed border-border/70 py-5 sm:grid-cols-[minmax(0,17rem)_1fr] sm:gap-6"
                >
                  <dt className="text-[15px] font-medium">{row.label}</dt>
                  <dd className="text-[15px] leading-relaxed text-muted-foreground">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default Page;

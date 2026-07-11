import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "IdentificationData" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
  };
}

const IDENTIFICATION_DATA = [
  { labelKey: "label0", value: "STRIDON GROUP DOO" },
  { labelKey: "label1", value: "Vojislava Ilića 141g, Beograd" },
  { labelKey: "label2", value: "4615" },
  { labelKey: "label3", value: "20588012" },
  { labelKey: "label4", value: "106376570" },
  { labelKey: "label5", value: "https://www.stridon.rs/" },
  { labelKey: "label6", value: "+381-69-8058-374" },
  { labelKey: "label7", value: "office@stridon.rs" },
] as const;

export default async function PodaciZaIdentifikacijuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("IdentificationData");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("heroDescription")} />

      <Wrapper className="pb-20 max-w-3xl">
        <Container animation="fadeUp" delay={0.1}>
          <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
            <div className="p-5 border-b border-border/60 bg-muted/30">
              <h2 className="text-base font-semibold">{t("companyDataTitle")}</h2>
            </div>
            <ul className="divide-y divide-border/60">
              {IDENTIFICATION_DATA.map((item) => (
                <li key={item.labelKey} className="flex flex-col sm:flex-row sm:items-start gap-1 px-5 py-3.5 text-sm">
                  <span className="font-medium text-foreground shrink-0 sm:w-56">{t(item.labelKey)}</span>
                  <span className="text-muted-foreground">{item.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </Wrapper>
    </div>
  );
}

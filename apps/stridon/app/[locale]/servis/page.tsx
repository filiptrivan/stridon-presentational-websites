import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { SERVICE_BRANDS } from "@/constants/content";
import { ClockIcon, WrenchIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Servis alata | Stridon Group",
  description: "Servisiramo i održavamo električne, akumulatorske i ručne alate — za profesionalnu i hobi upotrebu.",
};

export default async function ServisPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Service");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("description")} />

      <Wrapper className="pb-20">
        {/* Brands we service */}
        <Container animation="fadeUp" delay={0.1}>
          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">{t("brandsTitle")}</h2>
            <div className="flex flex-wrap gap-3">
              {SERVICE_BRANDS.map((brand) => (
                <span
                  key={brand}
                  className="px-4 py-2 rounded-full border border-border bg-muted text-sm font-medium"
                >
                  {brand}
                </span>
              ))}
            </div>
          </div>
        </Container>

        {/* SG Servis partner */}
        <Container animation="fadeUp" delay={0.2}>
          <div className="rounded-xl border border-border bg-card p-8 max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <WrenchIcon className="size-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">{t("partnerTitle")}</h2>
                <p className="text-muted-foreground leading-relaxed">{t("partnerDescription")}</p>

                <div className="mt-5 flex items-center gap-2 text-sm">
                  <ClockIcon className="size-4 text-muted-foreground" />
                  <span className="font-medium">{t("workingHours")}:</span>
                  <span className="text-muted-foreground">{t("workingHoursValue")}</span>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Wrapper>
    </div>
  );
}

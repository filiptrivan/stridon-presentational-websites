import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import B2BForm from "@/components/b2b-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuildingIcon, HandshakeIcon, TruckIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "B2B" });
  return {
    title: `${t("title")} | Stridon Group`,
    description: t("description"),
  };
}

export default async function B2BPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("B2B");

  const B2B_BENEFITS = [
    { icon: TruckIcon, title: t("benefit0Title"), description: t("benefit0Description") },
    { icon: BuildingIcon, title: t("benefit1Title"), description: t("benefit1Description") },
    { icon: HandshakeIcon, title: t("benefit2Title"), description: t("benefit2Description") },
  ];

  return (
    <div>
      <HeroHeader title={t("title")} description={t("description")} />

      <Wrapper className="pb-20">
        {/* Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {B2B_BENEFITS.map((benefit, index) => (
            <Container key={benefit.title} animation="fadeUp" delay={0.1 * index}>
              <div className="p-6 rounded-xl border border-border bg-card">
                <benefit.icon className="size-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </Container>
          ))}
        </div>

        {/* B2B form */}
        <Container animation="fadeUp" delay={0.3}>
          <div className="rounded-xl border border-border/60 bg-card p-6 max-w-xl">
            <h2 className="font-semibold mb-1">Pošalji upit</h2>
            <p className="text-sm text-muted-foreground mb-6">Popuni formu i javićemo ti se u roku od 24h.</p>
            <B2BForm />
          </div>
        </Container>
      </Wrapper>
    </div>
  );
}

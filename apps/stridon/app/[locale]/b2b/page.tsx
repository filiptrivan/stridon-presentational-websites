import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BuildingIcon, HandshakeIcon, TruckIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "B2B saradnja | Stridon Group",
  description: "Zainteresovani ste za veleprodaju ili distribuciju? Kontaktirajte nas za B2B uslove saradnje.",
};

const B2B_BENEFITS = [
  {
    icon: TruckIcon,
    title: "Brza isporuka",
    description: "Isporuka 1–5 radnih dana za sve veleprodajne narudžbine.",
  },
  {
    icon: BuildingIcon,
    title: "Povoljni uslovi",
    description: "Posebni cenovnici i popusti za registrovane B2B partnere.",
  },
  {
    icon: HandshakeIcon,
    title: "Podrška",
    description: "Lični account manager i tehnička podrška za sve brendove.",
  },
];

export default async function B2BPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("B2B");

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

        {/* Contact CTA */}
        <Container animation="fadeUp" delay={0.3}>
          <div className="rounded-xl border border-border bg-card p-6 max-w-xl">
            <p className="text-muted-foreground text-sm">
              Za B2B upite i uslove saradnje, kontaktirajte nas direktno na{" "}
              <a href="mailto:office@stridon.rs" className="text-primary hover:underline">
                office@stridon.rs
              </a>{" "}
              ili pozovite naš tim. B2B forma je u pripremi.
            </p>
          </div>
        </Container>
      </Wrapper>
    </div>
  );
}

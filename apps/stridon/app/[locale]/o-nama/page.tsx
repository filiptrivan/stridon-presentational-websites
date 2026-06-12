import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ABOUT_SECTIONS, STATS } from "@/constants/content";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "About" });
  return {
    title: `${t("title")} | Stridon Group`,
    description: t("description"),
  };
}

export default async function ONamaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("About");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("description")} />

      {/* Stats */}
      <div className="border-y border-border bg-muted/30">
        <Wrapper className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <Container key={stat.label.sr} animation="fadeUp" delay={0.1 * index}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label[locale as "sr" | "en"]}</p>
                </div>
              </Container>
            ))}
          </div>
        </Wrapper>
      </div>

      {/* Story sections */}
      <Wrapper className="py-16">
        <div className="max-w-3xl mx-auto space-y-12">
          {ABOUT_SECTIONS.map((section, index) => {
            const loc = locale as "sr" | "en";
            return (
              <Container key={section.title.sr} animation="fadeUp" delay={0.1 * index}>
                <div className="flex gap-6">
                  <div className="shrink-0 pt-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs text-center leading-tight px-1">
                      {section.year[loc]}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold mb-3">{section.title[loc]}</h2>
                    <p className="text-muted-foreground leading-relaxed">{section.body[loc]}</p>
                  </div>
                </div>
              </Container>
            );
          })}
        </div>
      </Wrapper>
    </div>
  );
}

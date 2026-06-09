import HeroHeader from "@brand/shared/components/hero-header";
import SectionHeader from "@brand/shared/components/section-header";
import SectionDivider from "@brand/shared/components/section-divider";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { Button } from "@brand/ui/button";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/constants/brands";
import { STATS, TESTIMONIALS } from "@/constants/content";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon, QuoteIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Stridon Group | Uvoznik i distributer alata",
  description:
    "Stridon Group DOO — uvoznik i distributer vodećih svetskih brendova alata u Srbiji. Veleprodaja, maloprodaja i online prodaja.",
};

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");

  return (
    <div>
      {/* Hero */}
      <HeroHeader
        title={t("heroTitle")}
        description={t("heroDescription")}
        showSvgGrid
      >
        <Container delay={0.3}>
          <div className="mt-8 flex items-center gap-4">
            <Button asChild size="lg">
              <a
                href="https://www.prodavnicaalata.rs"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("heroCta")}
                <ExternalLinkIcon className="size-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/brendovi">
                {t("allBrands")}
                <ArrowRightIcon className="size-4" />
              </Link>
            </Button>
          </div>
        </Container>
      </HeroHeader>

      <SectionDivider />

      {/* Stats */}
      <div className="border-y border-border bg-muted/30">
        <Wrapper className="py-12">
          <Container animation="fadeUp" delay={0.1}>
            <h2 className="text-center text-2xl font-semibold mb-8">{t("statsTitle")}</h2>
          </Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {STATS.map((stat, index) => (
              <Container key={stat.label} animation="fadeUp" delay={0.1 * index}>
                <div className="text-center">
                  <p className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </Container>
            ))}
          </div>
        </Wrapper>
      </div>

      <SectionDivider />

      {/* Brands */}
      <Wrapper className="py-16">
        <SectionHeader
          title={t("brandsTitle")}
          description={t("brandsDescription")}
          action={{ label: t("allBrands"), href: "/brendovi" }}
          align="center"
          descriptionClassName="max-w-2xl"
        />
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {BRANDS.map((brand, index) => (
            <Container key={brand.slug} animation="fadeUp" delay={0.04 * (index % 12)}>
              <Link
                href={`/brendovi/${brand.slug}`}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-lg border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200 aspect-square"
              >
                <div className="relative h-8 w-full">
                  <Image
                    src={brand.logoSrc}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-center text-muted-foreground">
                  {brand.name}
                </span>
              </Link>
            </Container>
          ))}
        </div>
      </Wrapper>

      <SectionDivider />

      {/* Testimonials */}
      <div className="bg-muted/30 border-y border-border">
        <Wrapper className="py-16">
          <SectionHeader
            title={t("testimonialsTitle")}
            description={t("testimonialsDescription")}
            align="center"
            descriptionClassName="max-w-2xl"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {TESTIMONIALS.map((item, index) => (
              <Container key={item.company} animation="fadeUp" delay={0.06 * (index % 6)}>
                <div className="flex flex-col gap-4 p-6 rounded-xl border border-border bg-card h-full">
                  <QuoteIcon className="size-5 text-primary/60" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-2 border-t border-border/60">
                    <div className="relative size-9 rounded-full overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.image}
                        alt={item.company}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium leading-none">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-1">{item.company}</p>
                    </div>
                  </div>
                </div>
              </Container>
            ))}
          </div>
        </Wrapper>
      </div>
    </div>
  );
}

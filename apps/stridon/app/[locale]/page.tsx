import HeroHeader from "@brand/shared/components/hero-header";
import SectionHeader from "@brand/shared/components/section-header";
import SectionDivider from "@brand/shared/components/section-divider";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { Button } from "@brand/ui/button";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/constants/brands";
import { STATS, TESTIMONIALS } from "@/constants/content";
import Image, { getImageProps } from "next/image";
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

  const {
    props: { srcSet: heroSrcSet, ...heroRest },
  } = getImageProps({
    src: "/hero-image-landing.jpg",
    alt: "Stridon Group — alati u akciji",
    width: 1280,
    height: 720,
    sizes: "(min-width: 1280px) 1280px, 100vw",
  });

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

        <Container className="w-full z-30" delay={0.4}>
          <div className="relative mx-auto max-w-5xl rounded-2xl border border-neutral-200/60 bg-neutral-100 p-1.5 mt-10 md:mt-14">
            <div className="rounded-xl overflow-hidden">
              <picture>
                <source srcSet={heroSrcSet} />
                <img
                  {...heroRest}
                  style={{ width: "100%", height: "auto", aspectRatio: "16/9", objectFit: "cover" }}
                  className="rounded-xl"
                  fetchPriority="high"
                  loading="eager"
                />
              </picture>
            </div>
          </div>
        </Container>
      </HeroHeader>

      <SectionDivider />

      {/* Stats */}
      <Wrapper className="py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
          {STATS.map((stat, index) => (
            <Container key={stat.label} animation="fadeUp" delay={0.08 * index}>
              <div className="flex flex-col items-center justify-center px-6 py-4 text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-snug">{stat.label}</p>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>

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
        <div className="mt-10 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {BRANDS.map((brand, index) => (
            <Container key={brand.slug} animation="fadeUp" delay={0.04 * (index % 12)}>
              <Link
                href={`/brendovi/${brand.slug}`}
                className="flex flex-col items-center justify-center gap-2.5 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/25 hover:bg-muted/40 transition-all duration-200 aspect-square"
              >
                <div className="relative h-9 w-full">
                  <Image
                    src={brand.logoSrc}
                    alt={brand.name}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-[11px] font-medium text-center text-muted-foreground leading-tight">
                  {brand.name}
                </span>
              </Link>
            </Container>
          ))}
        </div>
      </Wrapper>

      <SectionDivider />

      {/* Testimonials */}
      <div className="bg-muted/20 border-y border-border/60">
        <Wrapper className="py-16">
          <SectionHeader
            title={t("testimonialsTitle")}
            description={t("testimonialsDescription")}
            align="center"
            descriptionClassName="max-w-2xl"
          />
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((item, index) => (
              <Container key={item.company} animation="fadeUp" delay={0.06 * (index % 6)}>
                <div className="flex flex-col gap-4 p-6 rounded-xl border border-border/60 bg-card h-full">
                  <QuoteIcon className="size-4 text-primary/40" />
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {item.quote}
                  </p>
                  <div className="flex items-center gap-3 pt-3 border-t border-border/40">
                    <div className="relative size-8 rounded-full overflow-hidden bg-muted shrink-0">
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

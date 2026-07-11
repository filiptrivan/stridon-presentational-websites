import HeroHeader from "@brand/shared/components/hero-header";
import SectionHeader from "@brand/shared/components/section-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import { Button } from "@brand/ui/button";
import { Marquee } from "@brand/ui/marquee";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS } from "@/constants/brands";
import { STATS, TESTIMONIALS } from "@/constants/content";
import Image, { getImageProps } from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ExternalLinkIcon, QuoteIcon, TruckIcon, ZapIcon, ShieldCheckIcon, HeadphonesIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Home" });
  return {
    title: `Stridon Group | ${t("metaTitle")}`,
    description: t("metaDescription"),
  };
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Home");
  const loc = locale as "sr" | "en";

  const {
    props: { srcSet: heroSrcSet, ...heroRest },
  } = getImageProps({
    src: "/hero-image-landing.jpg",
    alt: "Stridon Group — alati u akciji",
    width: 1280,
    height: 720,
    sizes: "(min-width: 1280px) 1280px, 100vw",
  });

  const TRUST_BADGES = [
    { icon: TruckIcon, title: t("trustShippingTitle"), desc: t("trustShippingDesc") },
    { icon: ZapIcon, title: t("trustDeliveryTitle"), desc: t("trustDeliveryDesc") },
    { icon: ShieldCheckIcon, title: t("trustSecureTitle"), desc: t("trustSecureDesc") },
    { icon: HeadphonesIcon, title: t("trustPersonalTitle"), desc: t("trustPersonalDesc") },
  ];

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
              <a href="https://www.prodavnicaalata.rs" target="_blank" rel="noopener noreferrer">
                {t("heroCta")}
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

      {/* Trust badges — muted bg */}
      <div className="bg-muted/40">
      <Wrapper className="py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TRUST_BADGES.map((badge, index) => (
            <Container key={badge.title} animation="fadeUp" delay={0.05 * index}>
              <div className="flex items-center gap-3">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <badge.icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold leading-none">{badge.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{badge.desc}</p>
                </div>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
      </div>

      {/* Stats */}
      <Wrapper className="py-14">
        <Container animation="fadeUp" delay={0.05}>
          <SectionHeader
            title={t("statsTitle")}
            description=""
            align="center"
          />
        </Container>
        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => (
            <Container key={stat.label.sr} animation="fadeUp" delay={0.08 * index}>
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">{stat.value}</p>
                <p className="text-sm text-muted-foreground mt-2 leading-snug">{stat.label[loc]}</p>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>

      {/* Brands marquee — muted bg */}
      <div className="bg-muted/40">
      <Wrapper className="py-16">
        <SectionHeader
          title={t("brandsTitle")}
          description={t("brandsDescription")}
          action={{ label: t("allBrands"), href: "/brendovi" }}
          align="center"
          descriptionClassName="max-w-2xl"
        />
        <div className="relative mt-10 overflow-hidden">
          <Marquee pauseOnHover repeat={2} className="[--duration:40s] [--gap:0.75rem]">
            {BRANDS.map((brand) => (
              <Link
                key={brand.slug}
                href={`/brendovi/${brand.slug}`}
                className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl border border-border/60 bg-card hover:border-primary/25 hover:bg-muted/30 transition-all duration-200 w-36 h-28 shrink-0"
              >
                <div className="relative h-10 w-full">
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
            ))}
          </Marquee>
          <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-muted/40 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-muted/40 to-transparent" />
        </div>
      </Wrapper>
      </div>

      {/* Our clients */}
      <Wrapper className="py-16">
        <SectionHeader
          title={t("clientsTitle")}
          description=""
          align="center"
        />
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {TESTIMONIALS.map((client, index) => (
            <Container key={client.company} animation="fadeUp" delay={0.04 * (index % 8)}>
              <div className="flex flex-col items-center gap-3">
                <div className="relative h-16 w-32">
                  <Image
                    src={client.image}
                    alt={client.company}
                    fill
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-medium text-muted-foreground text-center">
                  {client.company}
                </span>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>

      {/* Testimonials — muted bg */}
      <div className="bg-muted/40">
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

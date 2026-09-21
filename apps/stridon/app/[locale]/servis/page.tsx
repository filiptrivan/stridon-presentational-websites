import BrandLogo from "@/components/brand-logo";
import { BRAND_SLUGS } from "@/constants/brands";
import {
  SERVICE_CENTERS,
  SERVICED_BRAND_SLUGS,
} from "@/constants/service-centers";
import { createLocalizedMetadata } from "@/lib/metadata";
import { brandPath } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getBrandCards } from "@brand/shared/lib/api";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Service.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/servis",
    title: t("title"),
    description: t("description"),
  });
}

const ServisPage = async ({ params }: Props) => {
  const { locale } = await params;

  // Same cached entry the homepage brand wall and /katalozi read, so the names
  // and logos here cost no extra request. Only the brands we also distribute
  // get a link - Festool is serviced without being listed.
  const [cards, t] = await Promise.all([
    getBrandCards(),
    getTranslations({ locale, namespace: "Service" }),
  ]);
  const bySlug = new Map(cards.map((card) => [card.slug, card]));
  const servicedBrands = SERVICED_BRAND_SLUGS.map((slug) => bySlug.get(slug))
    .filter((card) => card !== undefined)
    .map((card) => ({
      ...card,
      href: BRAND_SLUGS.includes(card.slug as (typeof BRAND_SLUGS)[number])
        ? brandPath(card.slug, locale as Locale)
        : null,
    }));

  const partnerParagraphs = t.raw("partner.paragraphs") as string[];

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("brandsTitle")}
            </h2>
          </Container>

          <Container delay={0.5}>
            {/* Same card as the homepage brand wall and /brendovi: separated,
                rounded, hairline border. The serviced-only brands get the
                identical card without the hover, since they link nowhere. */}
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
              {servicedBrands.map((brand) =>
                brand.href ? (
                  <Link
                    key={brand.slug}
                    href={brand.href}
                    className="overflow-hidden rounded-lg border border-border/60 bg-background transition-colors duration-300 hover:border-primary lg:rounded-xl"
                  >
                    <BrandLogo name={brand.name} logo={brand.imageUrl ?? null} />
                  </Link>
                ) : (
                  <div
                    key={brand.slug}
                    className="overflow-hidden rounded-lg border border-border/60 bg-background lg:rounded-xl"
                  >
                    <BrandLogo name={brand.name} logo={brand.imageUrl ?? null} />
                  </div>
                ),
              )}
            </div>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("warrantyTitle")}
            </h2>
          </Container>

          <Container delay={0.5}>
            {/* Dashed like every other rule on the site, including the vertical
                one, so the block does not introduce a second line style. */}
            <div className="mt-10 grid border-t border-dashed border-border/70 md:grid-cols-2">
              <div className="border-b border-dashed border-border/70 py-8 md:border-r md:pr-10">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {t("inWarranty.title")}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  {t("inWarranty.description")}
                </p>
              </div>

              <div className="border-b border-dashed border-border/70 py-8 md:pl-10">
                <h3 className="font-heading text-xl font-semibold tracking-tight">
                  {t("outOfWarranty.title")}
                </h3>
                <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                  {t("outOfWarranty.description")}
                </p>
              </div>
            </div>
          </Container>
        </Wrapper>
      </Section>

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              {t("partner.title")}
            </h2>

            <div className="mt-5 max-w-3xl space-y-4 text-[15px] leading-relaxed text-muted-foreground">
              {partnerParagraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 48)}>{paragraph}</p>
              ))}
            </div>
          </Container>
        </Wrapper>
      </Section>

      {/* Divider on, unlike dck, which passes `showDivider={false}` because
          there the card sits straight under the hero. Here it closes a page of
          sections and needs the same dashed rule as every other one. No
          `pt-0!` either - Section keeps its own padding so the map does not
          hug the line above it. */}
      <ContactLocations
        locations={SERVICE_CENTERS.map((center) => ({
          ...center,
          badge: t("center.badge"),
        }))}
      />
    </div>
  );
};

export default ServisPage;

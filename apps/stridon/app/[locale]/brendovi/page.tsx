import BrandLogo from "@/components/brand-logo";
import { BRAND_SLUGS } from "@/constants/brands";
import { createLocalizedMetadata } from "@/lib/metadata";
import { brandPath } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getBrandBySlug } from "@brand/shared/lib/api";
import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Brands.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/brendovi",
    title: t("title"),
    description: t("description"),
  });
}

const BrendoviPage = async ({ params }: Props) => {
  const { locale } = await params;

  // Per slug rather than `getBrands()`, which would be the obvious call and is
  // the wrong one: it returns all 234 manufacturers with their full
  // htmlDescription (828 KB) to render cards that read two fields. These are the
  // same entries `/brendovi/[slug]` fills, so reusing them costs no extra cache
  // and no extra build read.
  const [brands, t] = await Promise.all([
    Promise.all(BRAND_SLUGS.map((slug) => getBrandBySlug(slug))).then((all) =>
      all.filter((brand) => brand !== null),
    ),
    getTranslations({ locale, namespace: "Brands" }),
  ]);

  return (
    <div>
      <HeroHeader title={t("hero.title")} description={t("hero.description")} />

      <Section className="py-14 lg:py-20">
        <Wrapper>
          <Container>
            {/* Same card treatment as the homepage brand wall and the shared
                `catalog-card`: separated, rounded, hairline border that turns
                primary on hover. */}
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
              {brands.map((brand) => (
                <Link
                  key={brand.slug}
                  href={brandPath(brand.slug, locale as Locale)}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border/60 bg-background transition-colors duration-300 hover:border-primary lg:rounded-xl"
                >
                  <BrandLogo
                    name={brand.name}
                    logo={brand.imageUrl ?? null}
                    className="border-b border-border/60"
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  />

                  <div className="flex flex-1 flex-col p-6 lg:p-7">
                    <h2 className="font-heading text-lg font-semibold tracking-tight">
                      {brand.name}
                    </h2>

                    {/* Brand copy is translated in PACMS, not here: the CMS
                        returns the right language for the request, so none of
                        it belongs in messages/. */}
                    {brand.metaDescription ? (
                      <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-muted-foreground">
                        {brand.metaDescription}
                      </p>
                    ) : null}

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary">
                      {t("goToBrand")}
                      <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default BrendoviPage;

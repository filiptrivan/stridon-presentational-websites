import BrandLogo from "@/components/brand-logo";
import { FEATURED_BRAND_COUNT, getSiteBrands } from "@/lib/brands";
import { brandPath, pathFor } from "@/lib/nav";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

// Brand wall: separated 2:1 logo cards. Same card treatment as `catalog-card`
// in `@brand/shared` (rounded-lg lg:rounded-xl, hairline border that firms up on
// hover), so the homepage and /katalozi read as one language instead of two.
// The last cell is the "all brands" link so the grid stays complete.
const Brands = async ({ locale }: { locale: Locale }) => {
  // The head of the same list /brendovi renders, so the wall and the listing
  // can never disagree on order.
  const [brands, t] = await Promise.all([
    getSiteBrands(),
    getTranslations({ locale, namespace: "Home.brands" }),
  ]);
  const featured = brands.slice(0, FEATURED_BRAND_COUNT);

  return (
    <Section className="py-20 lg:py-28">
      <Wrapper>
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                {t("title")}
              </h2>
            </div>
            <p className="max-w-sm text-muted-foreground">{t("description")}</p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-4">
            {featured.map((card) => (
              <Link
                key={card.slug}
                href={brandPath(card.slug, locale)}
                className="overflow-hidden rounded-lg border border-border/60 bg-background transition-colors duration-300 hover:border-primary lg:rounded-xl"
              >
                <BrandLogo name={card.name} logo={card.imageUrl ?? null} />
              </Link>
            ))}
            <Link
              href={pathFor("/brendovi", locale)}
              className="group flex aspect-[2/1] items-center justify-between rounded-lg border border-border/60 bg-foreground/[0.03] px-5 transition-colors duration-300 hover:border-primary hover:bg-primary lg:rounded-xl lg:px-6"
            >
              <span className="font-heading text-lg font-semibold tracking-tight text-primary transition-colors duration-300 group-hover:text-primary-foreground lg:text-xl">
                {t("all")}
              </span>
              <ArrowRight className="size-5 text-primary transition-all duration-300 group-hover:translate-x-1 group-hover:text-primary-foreground" />
            </Link>
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
};

export default Brands;

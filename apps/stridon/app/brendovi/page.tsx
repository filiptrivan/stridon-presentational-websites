import BrandLogo from "@/components/brand-logo";
import { BRAND_SLUGS } from "@/constants/brands";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getBrandBySlug } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = createPageMetadata({
  title: "Brendovi",
  description:
    "Brendovi mašina, pribora, električnog, ručnog i akumulatorskog alata za koje je Stridon Group zvanični uvoznik i distributer u Srbiji.",
  canonicalUrl: "/brendovi",
});

const BrendoviPage = async () => {
  // Per slug rather than `getBrands()`, which would be the obvious call and is
  // the wrong one: it returns all 234 manufacturers with their full
  // htmlDescription (828 KB) to render cards that read two fields. These are the
  // same entries `/brendovi/[slug]` fills, so reusing them costs no extra cache
  // and no extra build read.
  const brands = (
    await Promise.all(BRAND_SLUGS.map((slug) => getBrandBySlug(slug)))
  ).filter((brand) => brand !== null);

  return (
    <div>
      <HeroHeader
        title="Uvoznik i distributer najboljih brendova"
        description="Brendovi mašina, pribora, električnog, ručnog i akumulatorskog alata koje uvozimo i za koje je naša firma uvoznik i distributer na teritoriji Srbije."
      />

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
                  href={`/brendovi/${brand.slug}`}
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

                    {brand.metaDescription ? (
                      <p className="mt-3 line-clamp-4 text-[15px] leading-relaxed text-muted-foreground">
                        {brand.metaDescription}
                      </p>
                    ) : null}

                    <span className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-medium text-primary">
                      Idi na brend
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

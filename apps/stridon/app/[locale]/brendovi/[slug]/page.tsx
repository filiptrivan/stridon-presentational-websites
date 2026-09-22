import { BRAND_SLUGS, shopUrlFor } from "@/constants/brands";
import { createLocalizedMetadata } from "@/lib/metadata";
import { pathFor } from "@/lib/nav";
import { routing } from "@/i18n/routing";
import type { Locale } from "@brand/i18n/config";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getAllCatalogs, getBrandBySlug } from "@brand/shared/lib/api";
import { Button } from "@brand/ui/button";
import { Prose } from "@brand/ui/prose";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

// From the curated list, not from the API: these routes are fixed by what
// Stridon shows, so a build should not fan out 234 brand reads to discover the
// paths it already knows. Both locales, since each is its own prerendered page.
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BRAND_SLUGS.map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) {
    const t = await getTranslations({ locale, namespace: "Brand" });
    return { title: t("notFound") };
  }

  const meta = await getTranslations({ locale, namespace: "Brand.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: { pathname: "/brendovi/[slug]", params: { slug: brand.slug } },
    // One template with the name interpolated, **not** `brand.metaTitle` /
    // `brand.metaDescription`. Those are written for prodavnicaalata.rs and
    // measured wrong for this site three ways (2026-09-22): they sell ("Online
    // prodaja Srbija", "Prodaja X alata online") on a site whose own terms page
    // says no purchase is possible here; they are byte-identical to what the
    // webshop already serves on /proizvodjaci/<slug>/, so two domains with one
    // owner would compete on the same snippet and the shop would win; and 8 of
    // the 24 run past 160 chars, with sg-tools cut mid-word and dck carrying a
    // 76-char title that has an "I" where a "|" belongs.
    //
    // `htmlDescription` is still the CMS's, below - that one really is per-brand
    // copy and belongs on the page.
    title: meta("title", { brand: brand.name }),
    description: meta("description", { brand: brand.name }),
  });
}

const BrandPage = async ({ params }: Props) => {
  const { locale, slug } = await params;
  // Everything on this page is generated: a brand added to BRAND_SLUGS and
  // written in the CMS renders here with no further code.
  const [brand, { catalogs }, t] = await Promise.all([
    getBrandBySlug(slug),
    getAllCatalogs(),
    getTranslations({ locale, namespace: "Brand" }),
  ]);
  if (!brand) notFound();

  const brandHasCatalogs = catalogs.some((catalog) =>
    catalog.brands.some((catalogBrand) => catalogBrand.slug === brand.slug),
  );
  const catalogsPath = pathFor("/katalozi", locale as Locale);

  return (
    <div>
      <HeroHeader
        pretitle={
          <Container>
            <Link
              href={pathFor("/brendovi", locale as Locale)}
              className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              {t("back")}
            </Link>
          </Container>
        }
        title={
          // Logo beside the name rather than a framed plate under it. It wraps
          // on purpose: at phone width a long name like "HÖGERT Technik" next to
          // a mark does not fit, and wrapping drops the logo onto its own line
          // above instead of squeezing both.
          <span className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 sm:gap-x-7">
            {brand.imageUrl ? (
              <span className="relative h-12 w-28 shrink-0 sm:h-16 sm:w-40">
                <Image
                  src={brand.imageUrl}
                  alt=""
                  fill
                  sizes="160px"
                  // The optimizer rejects SVG unless dangerouslyAllowSVG is on,
                  // and a few PACMS logos are SVG.
                  unoptimized={brand.imageUrl.toLowerCase().endsWith(".svg")}
                  className="object-contain"
                />
              </span>
            ) : null}
            {brand.name}
          </span>
        }
        description={brand.metaDescription}
      >
        <Container delay={0.3}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {brandHasCatalogs ? (
              <Button asChild size="lg">
                {/* Straight to this brand's group on /katalozi. */}
                <Link href={`${catalogsPath}#${brand.slug}`}>
                  {t("viewCatalogs")}
                </Link>
              </Button>
            ) : null}
            {/* Without a catalog button the shop link carries the header on its own. */}
            <Button
              asChild
              size="lg"
              variant={brandHasCatalogs ? "outline" : "default"}
            >
              <a
                href={shopUrlFor(brand.slug)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {t("allProducts", { brand: brand.name })}
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </Container>
      </HeroHeader>

      {/* Section's own py-16 lg:py-24, unlike the shop-lead section below,
          which is deliberately tighter. */}
      {brand.htmlDescription ? (
        <Section>
          <Wrapper>
            <Container>
              {/* The CMS ships one blob, so there is no column to break it into -
                  cap the measure instead, or body copy runs the full 1280px. */}
              <Prose
                className="max-w-3xl"
                dangerouslySetInnerHTML={{ __html: brand.htmlDescription }}
              />
            </Container>
          </Wrapper>
        </Section>
      ) : null}

      <Section className="py-14 lg:py-16">
        <Wrapper>
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl text-lg">
                {t("shopLead", { brand: brand.name })}
              </p>
              <Button asChild size="lg" className="w-fit">
                <a
                  href={shopUrlFor(brand.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {t("openShop")}
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </Container>
        </Wrapper>
      </Section>
    </div>
  );
};

export default BrandPage;

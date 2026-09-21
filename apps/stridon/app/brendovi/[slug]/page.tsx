import { BRAND_SLUGS, shopUrlFor } from "@/constants/brands";
import Container from "@brand/shared/components/container";
import HeroHeader from "@brand/shared/components/hero-header";
import Section from "@brand/shared/components/section";
import Wrapper from "@brand/shared/components/wrapper";
import { getAllCatalogs, getBrandBySlug } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Button } from "@brand/ui/button";
import { Prose } from "@brand/ui/prose";
import { ArrowLeft, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

// From the curated list, not from the API: these routes are fixed by what
// Stridon shows, so a build should not fan out 234 brand reads to discover the
// paths it already knows.
export function generateStaticParams() {
  return BRAND_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = await getBrandBySlug(slug);
  if (!brand) return { title: "Brend nije pronađen" };

  return createPageMetadata({
    // The CMS writes these for the webshop, where the same brand ranks on the
    // same queries, so they are the tested copy rather than a guess.
    title: brand.metaTitle,
    description: brand.metaDescription,
    canonicalUrl: `/brendovi/${brand.slug}`,
  });
}

const BrandPage = async ({ params }: Props) => {
  const { slug } = await params;
  // Everything on this page is generated: a brand added to BRAND_SLUGS and
  // written in the CMS renders here with no further code.
  const [brand, { catalogs }] = await Promise.all([
    getBrandBySlug(slug),
    getAllCatalogs(),
  ]);
  if (!brand) notFound();

  const brandHasCatalogs = catalogs.some((catalog) =>
    catalog.brands.some((catalogBrand) => catalogBrand.slug === brand.slug),
  );

  return (
    <div>
      <HeroHeader
        pretitle={
          <Container>
            <Link
              href="/brendovi"
              className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
            >
              <ArrowLeft className="size-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Brendovi
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
                <Link href={`/katalozi#${brand.slug}`}>Pogledaj kataloge</Link>
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
                Svi {brand.name} proizvodi
                <ExternalLink className="size-4" />
              </a>
            </Button>
          </div>
        </Container>
      </HeroHeader>

      {brand.htmlDescription ? (
        <Section className="py-16 lg:py-24">
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
                Kompletan asortiman i dostupnost proizvoda brenda {brand.name}{" "}
                pogledaj u našoj zvaničnoj internet prodavnici.
              </p>
              <Button asChild size="lg" className="w-fit">
                <a
                  href={shopUrlFor(brand.slug)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Otvori prodavnicu
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

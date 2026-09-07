import BrandLogo from "@/components/brand-logo";
import PageHeader from "@/components/page-header";
import { BRANDS, getBrandBySlug } from "@/constants/brands";
import { hasCatalogs } from "@/constants/catalogs";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Button } from "@brand/ui/button";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return BRANDS.map((brand) => ({ slug: brand.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return { title: "Brend nije pronađen" };

  return createPageMetadata({
    title: `${brand.name} alati`,
    description: `Sve o brendu ${brand.name}: istorijat, tehnologije i asortiman proizvoda. Stridon Group je zvanični uvoznik i distributer za Srbiju.`,
    canonicalUrl: `/brendovi/${brand.slug}`,
  });
}

const BrandPage = async ({ params }: Props) => {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandHasCatalogs = hasCatalogs(brand.slug);

  return (
    <div>
      <PageHeader
        title={brand.name}
        lede={brand.tagline}
        backLink={{ href: "/brendovi", label: "Brendovi" }}
        aside={
          <BrandLogo
            brand={brand}
            className="w-full border border-border bg-background lg:w-80"
            sizes="(min-width: 1024px) 320px, 100vw"
          />
        }
      >
        {brandHasCatalogs ? (
          <Button asChild size="lg">
            <Link href={`/katalozi#${brand.slug}`}>Pogledaj kataloge</Link>
          </Button>
        ) : null}
        {/* Without a catalog button the shop link carries the header on its own. */}
        <Button
          asChild
          size="lg"
          variant={brandHasCatalogs ? "outline" : "default"}
        >
          <a href={brand.shopUrl} target="_blank" rel="noopener noreferrer">
            Svi {brand.name} proizvodi
            <ExternalLink className="size-4" />
          </a>
        </Button>
      </PageHeader>

      <section className="border-b border-border">
        <Wrapper className="py-16 lg:py-24">
          {brand.sections.map((section, index) => (
            <Container key={section.title} delay={index === 0 ? 0 : 0.2}>
              <div className="grid gap-6 border-t border-border py-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16 lg:py-14">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight lg:sticky lg:top-24 lg:text-3xl">
                    {section.title}
                  </h2>
                </div>

                <div className="space-y-4">
                  {section.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 48)}
                      className="text-[15px] leading-relaxed text-muted-foreground lg:text-base"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </Container>
          ))}
        </Wrapper>
      </section>

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-16">
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <p className="max-w-2xl text-lg">
                Kompletan asortiman i dostupnost proizvoda brenda {brand.name}{" "}
                pogledaj u našoj zvaničnoj internet prodavnici.
              </p>
              <Button asChild size="lg" className="w-fit">
                <a href={brand.shopUrl} target="_blank" rel="noopener noreferrer">
                  Otvori prodavnicu
                  <ExternalLink className="size-4" />
                </a>
              </Button>
            </div>
          </Container>
        </Wrapper>
      </section>
    </div>
  );
};

export default BrandPage;

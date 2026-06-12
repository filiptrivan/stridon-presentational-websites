import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import SectionHeader from "@brand/shared/components/section-header";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { BRANDS, getBrandBySlug } from "@/constants/brands";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeftIcon, ExternalLinkIcon, FileTextIcon } from "lucide-react";
import { Button } from "@brand/ui/button";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string; locale: string }>;
};

export async function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    BRANDS.map((brand) => ({ locale, slug: brand.slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) return {};
  return {
    title: `${brand.name} | Stridon Group`,
    description: brand.heroDescription[locale as "sr" | "en"],
  };
}

export default async function BrandPage({ params }: Props) {
  const { slug, locale } = await params;
  setRequestLocale(locale);

  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const t = await getTranslations("Brand");
  const loc = locale as "sr" | "en";

  const heroDesc =
    typeof brand.heroDescription === "string"
      ? brand.heroDescription
      : brand.heroDescription[loc];

  return (
    <div>
      {/* Hero */}
      <div className="relative pt-24 pb-12 border-b border-border">
        <Wrapper>
          <Container animation="fadeUp" delay={0.05}>
            <Link
              href="/brendovi"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
            >
              <ArrowLeftIcon className="size-4" />
              {t("backToBrands")}
            </Link>
          </Container>
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <Container animation="fadeLeft" delay={0.1}>
              <div className="relative h-16 w-48 shrink-0">
                <Image
                  src={brand.logoSrc}
                  alt={brand.name}
                  fill
                  className="object-contain object-left"
                />
              </div>
            </Container>
            <Container animation="fadeRight" delay={0.15}>
              <div>
                <h1 className="text-3xl md:text-4xl font-semibold">{brand.name}</h1>
                <p className="text-muted-foreground mt-2 text-lg">{heroDesc}</p>
                <div className="mt-4 flex items-center gap-3">
                  <Button asChild size="sm" variant="outline">
                    <a href={brand.storeUrl} target="_blank" rel="noopener noreferrer">
                      {t("storeLink")}
                      <ExternalLinkIcon className="size-3.5" />
                    </a>
                  </Button>
                </div>
              </div>
            </Container>
          </div>
        </Wrapper>
      </div>

      {/* Paragraphs */}
      <Wrapper className="py-16">
        <div className="grid gap-12 max-w-3xl">
          {brand.paragraphs.map((para, index) => (
            <Container key={index} animation="fadeUp" delay={0.05 * index}>
              <div>
                <h2 className="text-xl font-semibold mb-3">{para.title[loc]}</h2>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {para.body[loc]}
                </p>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>

      {/* Catalogs */}
      {brand.catalogs.length > 0 && (
        <div className="border-t border-border bg-muted/30">
          <Wrapper className="py-12">
            <Container animation="fadeUp" delay={0.1}>
              <SectionHeader
                title={t("viewCatalogs")}
                description=""
                align="left"
              />
            </Container>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {brand.catalogs.map((catalog, index) => (
                <Container key={index} animation="fadeUp" delay={0.05 * index}>
                  <a
                    href={catalog.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-4 rounded-lg border border-border/60 bg-card hover:border-primary/25 hover:bg-muted/30 transition-all duration-200 group"
                  >
                    <FileTextIcon className="size-5 text-muted-foreground shrink-0" />
                    <span className="font-medium text-sm flex-1">{catalog.name}</span>
                    <ExternalLinkIcon className="size-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
                  </a>
                </Container>
              ))}
            </div>
          </Wrapper>
        </div>
      )}
    </div>
  );
}

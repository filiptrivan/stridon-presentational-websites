import HeroHeader from "@brand/shared/components/hero-header";
import { ListingPagination } from "@brand/shared/components/products/listing-pagination";
import PageBreadcrumbs from "@brand/shared/components/products/page-breadcrumbs";
import ProductGrid from "@brand/shared/components/products/product-grid";
import ProductGridSkeleton from "@brand/shared/components/products/product-grid-skeleton";
import SectionDivider from "@brand/shared/components/section-divider";
import { SectionErrorBoundary } from "@brand/ui/section-error-boundary";
import { Prose } from "@brand/ui/prose";
import Wrapper from "@brand/shared/components/wrapper";
import { PRODUCTS_PER_PAGE } from "@brand/shared/lib/cache-tags";
import {
  getFilteredProductsByTag,
  getPrerenderedTagSlugs,
  getTagBySlug,
} from "@brand/shared/lib/api";
import {
  TAG_BASE_BREADCRUMBS,
  buildTagBreadcrumbJsonLd,
} from "@brand/shared/lib/categories";
import { createTagMetadata } from "@brand/shared/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ strana?: string }>;
};

export async function generateStaticParams() {
  const slugs = await getPrerenderedTagSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { strana } = await searchParams;
  const currentPage = Math.max(1, parseInt(strana ?? "1", 10) || 1);

  const tag = await getTagBySlug(slug);
  if (!tag) return { title: "Tag nije pronađen" };

  return createTagMetadata({
    title: tag.metaTitle,
    description: tag.metaDescription,
    slug,
    currentPage,
  });
}

async function TagProducts({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<{ strana?: string }>;
}) {
  const { strana } = await searchParams;
  const currentPage = Math.max(1, parseInt(strana ?? "1", 10) || 1);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = await getFilteredProductsByTag(
    slug,
    offset,
    PRODUCTS_PER_PAGE,
  );

  const totalPages = Math.ceil(products.totalRecords / PRODUCTS_PER_PAGE);
  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/proizvodi/tagovi/${slug}`);
  }

  return (
    <>
      <ProductGrid
        products={products.data}
        totalRecords={products.totalRecords}
      />
      <Suspense>
        <ListingPagination
          currentPage={currentPage}
          totalRecords={products.totalRecords}
          pageSize={PRODUCTS_PER_PAGE}
        />
      </Suspense>
    </>
  );
}

export default async function TagPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const tag = await getTagBySlug(slug);
  if (!tag) notFound();

  const breadcrumbJsonLd = buildTagBreadcrumbJsonLd(tag.name, slug);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HeroHeader
        title={tag.name}
        description={tag.metaDescription}
      />

      {tag.bannerMediaUrl && (
        <div className="w-full max-w-7xl mx-auto px-4 lg:px-10 -mt-4 mb-8">
          {/* Image-only since 2026-08-12 — the five DCK .mp4 banners were replaced with
              the stills ReadyCMS already held, and pa-cms no longer accepts video here. */}
          {tag.bannerImageWidth && tag.bannerImageHeight ? (
            <Image
              src={tag.bannerMediaUrl}
              alt={tag.name}
              width={tag.bannerImageWidth}
              height={tag.bannerImageHeight}
              className="w-full h-auto rounded-lg lg:rounded-xl"
              priority
            />
          ) : (
            <div className="relative aspect-video overflow-hidden rounded-lg bg-muted lg:rounded-xl">
              <Image
                src={tag.bannerMediaUrl}
                alt={tag.name}
                fill
                sizes="(max-width: 1280px) 100vw, 1280px"
                className="object-contain"
                priority
              />
            </div>
          )}
        </div>
      )}

      <Wrapper className="pb-16">
        <PageBreadcrumbs
          items={[{ label: tag.name, href: `/proizvodi/tagovi/${slug}` }]}
          baseBreadcrumbs={TAG_BASE_BREADCRUMBS}
        />

        <SectionErrorBoundary>
          <Suspense fallback={<ProductGridSkeleton />}>
            <TagProducts slug={slug} searchParams={searchParams} />
          </Suspense>
        </SectionErrorBoundary>

        {tag.htmlDescription && (
          <>
            <SectionDivider />
            <section>
              <h2 className="text-xl font-semibold mb-4">Opis</h2>
              <Prose
                variant="category"
                dangerouslySetInnerHTML={{ __html: tag.htmlDescription }}
              />
            </section>
          </>
        )}
      </Wrapper>
    </div>
  );
}

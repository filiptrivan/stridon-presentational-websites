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
          <Image
            src={tag.bannerMediaUrl}
            alt={tag.name}
            width={tag.bannerImageWidth ?? 1200}
            height={tag.bannerImageHeight ?? 400}
            className="w-full h-auto rounded-lg lg:rounded-xl"
            priority
          />
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

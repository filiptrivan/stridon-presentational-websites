import HeroHeader from "@brand/shared/components/hero-header";
import { ListingPagination } from "@brand/shared/components/products/listing-pagination";
import PageBreadcrumbs from "@brand/shared/components/products/page-breadcrumbs";
import ProductGrid from "@brand/shared/components/products/product-grid";
import ProductGridSkeleton from "@brand/shared/components/products/product-grid-skeleton";
import SubcategoriesGrid from "@brand/shared/components/products/subcategories-grid";
import { SectionErrorBoundary } from "@brand/ui/section-error-boundary";
import { Prose } from "@brand/ui/prose";
import Wrapper from "@brand/shared/components/wrapper";
import { PRODUCTS_PER_PAGE } from "@brand/shared/lib/cache-tags";
import {
  getAllCategoriesFlat,
  getCategoryBySlug,
  getFilteredProductsByCategory,
} from "@brand/shared/lib/api";
import {
  buildBreadcrumbJsonLd,
  mapCategoryBreadcrumbs,
} from "@brand/shared/lib/categories";
import { createCategoryMetadata } from "@brand/shared/lib/metadata";
import { parsePageParam } from "@brand/shared/lib/utils";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ strana?: string }>;
};

export async function generateStaticParams() {
  const categories = await getAllCategoriesFlat();
  return categories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { strana } = await searchParams;
  const currentPage = parsePageParam(strana);

  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategorija nije pronađena" };

  return createCategoryMetadata({
    title: category.metaTitle,
    description: category.metaDescription,
    slug,
    currentPage,
  });
}

async function CategoryProducts({
  slug,
  searchParams,
  withTopDivider,
}: {
  slug: string;
  searchParams: Promise<{ strana?: string }>;
  withTopDivider: boolean;
}) {
  const { strana } = await searchParams;
  const currentPage = parsePageParam(strana);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = await getFilteredProductsByCategory(
    slug,
    offset,
    PRODUCTS_PER_PAGE,
  );

  const totalPages = Math.ceil(products.totalRecords / PRODUCTS_PER_PAGE);
  if (totalPages > 0 && currentPage > totalPages) {
    redirect(`/proizvodi/kategorije/${slug}`);
  }

  return (
    <>
      <ProductGrid
        products={products.data}
        totalRecords={products.totalRecords}
        variant="section"
        withTopDivider={withTopDivider}
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

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const breadcrumbSegments = mapCategoryBreadcrumbs(
    category.categoryBreadcrumbs,
  );
  const breadcrumbJsonLd = buildBreadcrumbJsonLd(breadcrumbSegments);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <HeroHeader
        title={category.name}
        description={category.metaDescription}
      />

      <Wrapper className="pb-16">
        <PageBreadcrumbs items={breadcrumbSegments} />

        <SubcategoriesGrid categories={category.subCategories} />

        <SectionErrorBoundary>
          <Suspense
            fallback={
              <ProductGridSkeleton
                variant="section"
                withTopDivider={category.subCategories.length > 0}
              />
            }
          >
            <CategoryProducts
              slug={slug}
              searchParams={searchParams}
              withTopDivider={category.subCategories.length > 0}
            />
          </Suspense>
        </SectionErrorBoundary>

        {category.description && (
          <section className="mt-16 border-t border-border pt-10">
            <h2 className="text-xl font-semibold mb-4">Opis kategorije</h2>
            <Prose
              variant="category"
              dangerouslySetInnerHTML={{ __html: category.description }}
            />
          </section>
        )}
      </Wrapper>
    </div>
  );
}

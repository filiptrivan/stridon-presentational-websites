import HeroHeader from "@brand/shared/components/hero-header";
import { ListingPagination } from "@brand/shared/components/products/listing-pagination";
import PageBreadcrumbs from "@brand/shared/components/products/page-breadcrumbs";
import ProductGrid from "@brand/shared/components/products/product-grid";
import SubcategoriesGrid from "@brand/shared/components/products/subcategories-grid";
import SectionDivider from "@brand/shared/components/section-divider";
import { Prose } from "@brand/ui/prose";
import Wrapper from "@brand/shared/components/wrapper";
import { PRODUCTS_PER_PAGE } from "@brand/shared/lib/cache-tags";
import {
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

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ strana?: string }>;
};

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const { strana } = await searchParams;
  const currentPage = parsePageParam(strana);

  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Kategorija nije pronađena" };

  // PACMS nulls these deliberately on brand-filtered reads — null means "compose
  // it yourself", not "no title". Until the generated types landed we passed the
  // null straight through and rendered `undefined` into <title>.
  return createCategoryMetadata({
    title: category.metaTitle || category.name,
    description: category.metaDescription || category.name,
    slug,
    currentPage,
  });
}

async function CategoryProducts({
  slug,
  searchParams,
}: {
  slug: string;
  searchParams: Promise<{ strana?: string }>;
}) {
  const { strana } = await searchParams;
  const currentPage = parsePageParam(strana);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const products = await getFilteredProductsByCategory(
    slug,
    offset,
    PRODUCTS_PER_PAGE,
    "critical",
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
      />
      <ListingPagination
        currentPage={currentPage}
        totalRecords={products.totalRecords}
        pageSize={PRODUCTS_PER_PAGE}
        basePath={`/proizvodi/kategorije/${slug}`}
      />
    </>
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  // Dynamic (it reads `?strana=`), so this renders per request from the Data
  // Cache, and the whole page arrives in one piece: no Suspense, which would
  // hide the grid from anything that does not run JS. Category and products
  // are fetched sequentially so an unknown slug reaches notFound() without a
  // product read. Revisit if telemetry shows a category-page bottleneck.
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

        {category.subCategories.length > 0 && <SectionDivider />}

        <CategoryProducts slug={slug} searchParams={searchParams} />

        {category.htmlDescription && (
          <>
            <SectionDivider />
            <section>
              <h2 className="text-xl font-semibold mb-4">Opis kategorije</h2>
              <Prose
                variant="category"
                dangerouslySetInnerHTML={{ __html: category.htmlDescription }}
              />
            </section>
          </>
        )}
      </Wrapper>
    </div>
  );
}

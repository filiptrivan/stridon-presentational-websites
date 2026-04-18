import { getBrandConfig } from "@brand/config";
import HeroHeader from "@brand/shared/components/hero-header";
import { ListingPagination } from "@brand/shared/components/products/listing-pagination";
import ProductGrid from "@brand/shared/components/products/product-grid";
import ProductGridSkeleton from "@brand/shared/components/products/product-grid-skeleton";
import Wrapper from "@brand/shared/components/wrapper";
import { PRODUCTS_PER_PAGE } from "@brand/shared/lib/cache-tags";
import { getFilteredProducts } from "@brand/shared/lib/api";
import { createProductsPageMetadata } from "@brand/shared/lib/metadata";
import { parsePageParam } from "@brand/shared/lib/utils";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const brand = getBrandConfig();

type Props = {
  searchParams: Promise<{ strana?: string }>;
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { strana } = await searchParams;
  return createProductsPageMetadata({ currentPage: parsePageParam(strana) });
}

async function ProductsList({
  searchParams,
}: {
  searchParams: Promise<{ strana?: string }>;
}) {
  const { strana } = await searchParams;
  const currentPage = parsePageParam(strana);
  const offset = (currentPage - 1) * PRODUCTS_PER_PAGE;

  const products = await getFilteredProducts(offset, PRODUCTS_PER_PAGE);

  const totalPages = Math.ceil(products.totalRecords / PRODUCTS_PER_PAGE);
  if (totalPages > 0 && currentPage > totalPages) {
    redirect("/proizvodi");
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

export default function ProductsPage({ searchParams }: Props) {
  return (
    <div>
      <HeroHeader
        title="Svi proizvodi"
        description={brand.productsPageHeroDescription}
      />

      <Wrapper className="pb-16">
        <Suspense fallback={<ProductGridSkeleton />}>
          <ProductsList searchParams={searchParams} />
        </Suspense>
      </Wrapper>
    </div>
  );
}

import { DEALERS } from "@/constants/dealers";
import ProductDetail from "@brand/shared/components/products/product-detail";
import RelatedProducts from "@brand/shared/components/products/related-products";
import RelatedProductsSkeleton from "@brand/shared/components/products/related-products-skeleton";
import SimilarProducts from "@brand/shared/components/products/similar-products";
import { SectionErrorBoundary } from "@brand/ui/section-error-boundary";
import { getProductBySlug, getSitemapProducts } from "@brand/shared/lib/api";
import type { BreadcrumbSegment } from "@brand/shared/lib/categories";
import { createProductMetadata } from "@brand/shared/lib/metadata";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const products = await getSitemapProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return { title: "Proizvod nije pronađen" };
  }

  return createProductMetadata({
    title: product.metaTitle,
    description: product.metaDescription,
    slug,
  });
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const categoryBreadcrumbs: BreadcrumbSegment[] = product.categorySlug
    ? [{ label: product.categoryName, href: `/proizvodi/kategorije/${product.categorySlug}` }]
    : [];

  const relatedProducts = product.relatedProducts;
  const relatedProductIds = relatedProducts.map((p) => p.id);

  return (
    <div>
      <ProductDetail
        product={product}
        categoryBreadcrumbs={categoryBreadcrumbs}
        dealers={DEALERS.filter((d) => d.logoSrc && d.category !== "service" && d.category !== "outOfWarranty")}
      />
      {relatedProducts.length > 0 && (
        <RelatedProducts products={relatedProducts} />
      )}
      {product.categorySlug && (
        <SectionErrorBoundary>
          <Suspense fallback={<RelatedProductsSkeleton />}>
            <SimilarProducts
              categorySlug={product.categorySlug}
              excludeProductIds={[product.id, ...relatedProductIds]}
            />
          </Suspense>
        </SectionErrorBoundary>
      )}
    </div>
  );
}

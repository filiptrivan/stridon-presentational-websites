import SectionHeader from "../section-header";
import Wrapper from "../wrapper";
import { getFilteredProductsByCategory } from "@brand/shared/lib/api";
import type { ProductCardData } from "@brand/shared/types/products";
import ProductCard from "./product-card";

interface SimilarProductsProps {
  categorySlug: string;
  excludeProductIds: number[];
}

const SimilarProducts = async ({
  categorySlug,
  excludeProductIds,
}: SimilarProductsProps) => {
  // On the server only a Suspense boundary catches a thrown render, and this
  // section has none any more, so a failed read drops it instead of the page.
  let candidates: ProductCardData[] = [];
  try {
    const result = await getFilteredProductsByCategory(categorySlug, 0, 4 + excludeProductIds.length, "auxiliary");
    candidates = result.data;
  } catch {
    return null;
  }
  const products = candidates.filter((p) => !excludeProductIds.includes(p.id)).slice(0, 4);

  if (products.length === 0) return null;

  return (
    <Wrapper className="pb-8 lg:pb-12">
      <div className="mt-12 lg:mt-16">
        <SectionHeader title="Slični proizvodi" size="sub" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default SimilarProducts;

import Wrapper from "../wrapper";
import type { ProductCardData } from "@brand/shared/types/products";
import ProductCard from "./product-card";

interface RelatedProductsProps {
  products: ProductCardData[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (products.length === 0) return null;

  return (
    <Wrapper className="pb-8 lg:pb-12">
      <div className="mt-12 lg:mt-16">
        <h2 className="text-xl font-bold mb-6">Povezani proizvodi</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default RelatedProducts;

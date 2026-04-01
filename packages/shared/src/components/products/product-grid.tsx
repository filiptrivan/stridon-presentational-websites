import StatusMessage from "../status-message";
import type { ProductCardData } from "@brand/shared/types/products";
import { Package } from "lucide-react";
import ProductCard from "./product-card";

interface ProductGridProps {
  products: ProductCardData[];
  totalRecords?: number;
}

const ProductGrid = ({
  products: productList,
  totalRecords,
}: ProductGridProps) => {
  const displayCount = totalRecords ?? productList.length;
  const productsFoundText =
    displayCount === 0
      ? "Nema proizvoda"
      : displayCount === 1
        ? "1 proizvod"
        : `${displayCount} proizvoda`;

  return (
    <div className="w-full">
      {productList.length === 0 ? (
        <StatusMessage
          icon={Package}
          title="Još nema proizvoda u ovoj kategoriji."
          description="Proveri ponovo uskoro ili pogledaj druge kategorije."
        />
      ) : (
        <>
          <div className="flex items-center mb-6">
            <span className="text-sm text-muted-foreground">
              {productsFoundText}
            </span>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {productList.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductGrid;

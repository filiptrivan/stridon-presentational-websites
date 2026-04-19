import StatusMessage from "../status-message";
import type { ProductCardData } from "@brand/shared/types/products";
import { Package } from "lucide-react";
import ProductCard from "./product-card";

interface ProductGridProps {
  products: ProductCardData[];
  totalRecords?: number;
  variant?: "count" | "section";
}

const ProductGrid = ({
  products: productList,
  totalRecords,
  variant = "count",
}: ProductGridProps) => {
  if (productList.length === 0) {
    return (
      <div className="w-full">
        <StatusMessage
          icon={Package}
          title="Još nema proizvoda u ovoj kategoriji."
          description="Proveri ponovo uskoro ili pogledaj druge kategorije."
        />
      </div>
    );
  }

  const displayCount = totalRecords ?? productList.length;

  return (
    <section>
      {variant === "section" ? (
        <h2 className="text-xl font-semibold mb-4">
          Proizvodi{" "}
          <span className="text-muted-foreground font-normal">
            ({displayCount})
          </span>
        </h2>
      ) : (
        <div className="flex items-center mb-6">
          <span className="text-sm text-muted-foreground">
            {displayCount === 1 ? "1 proizvod" : `${displayCount} proizvoda`}
          </span>
        </div>
      )}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {productList.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

export default ProductGrid;

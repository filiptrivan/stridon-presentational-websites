import { Skeleton } from "@brand/ui/skeleton";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductGridSkeletonProps {
  count?: number;
}

const ProductGridSkeleton = ({ count = 12 }: ProductGridSkeletonProps) => {
  return (
    <div aria-hidden="true" className="w-full">
      <div className="flex items-center mb-6">
        <Skeleton className="h-4 w-24" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default ProductGridSkeleton;

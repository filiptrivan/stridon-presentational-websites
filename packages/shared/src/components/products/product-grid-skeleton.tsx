import { Skeleton } from "@brand/ui/skeleton";
import ProductCardSkeleton from "./product-card-skeleton";

interface ProductGridSkeletonProps {
  count?: number;
  variant?: "count" | "section";
  withTopDivider?: boolean;
}

const ProductGridSkeleton = ({
  count = 12,
  variant = "count",
  withTopDivider = false,
}: ProductGridSkeletonProps) => {
  return (
    <section
      aria-hidden="true"
      className={
        withTopDivider ? "border-t border-border pt-10 mt-8" : undefined
      }
    >
      {variant === "section" ? (
        <Skeleton className="h-6 w-40 mb-4" />
      ) : (
        <div className="flex items-center mb-6">
          <Skeleton className="h-4 w-24" />
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
        {Array.from({ length: count }, (_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
};

export default ProductGridSkeleton;

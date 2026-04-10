import { Skeleton } from "@brand/ui/skeleton";

/** @see ./product-card.tsx — update this skeleton when the card layout changes */
const ProductCardSkeleton = () => {
  return (
    <div className="relative flex flex-col bg-foreground/5 border border-border/20 rounded-lg lg:rounded-xl overflow-hidden h-full">
      <div className="relative aspect-square w-full bg-card" />

      <div className="p-3 sm:p-4 space-y-2">
        <Skeleton className="h-4 sm:h-5 w-full" />
        <Skeleton className="h-4 sm:h-5 w-3/5" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

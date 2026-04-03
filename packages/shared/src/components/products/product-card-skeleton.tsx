import { Skeleton } from "@brand/ui/skeleton";

const ProductCardSkeleton = () => {
  return (
    <div className="relative flex flex-col bg-foreground/5 border border-border/20 rounded-lg lg:rounded-xl overflow-hidden h-full">
      <div className="relative aspect-square w-full bg-card" />

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 sm:h-5 w-full" />
          <Skeleton className="h-4 sm:h-5 w-3/5" />
        </div>

        <div className="flex items-center gap-1.5 mt-auto pt-3">
          <Skeleton className="size-3.5 rounded-full" />
          <Skeleton className="h-3 w-16" />
        </div>

        <div className="pt-2">
          <Skeleton className="h-5 sm:h-6 w-28" />
        </div>

        <Skeleton className="h-8 sm:h-9 w-full rounded-md mt-3" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;

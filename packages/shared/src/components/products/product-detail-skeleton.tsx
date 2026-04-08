import { Skeleton } from "@brand/ui/skeleton";
import Wrapper from "../wrapper";

const ProductDetailSkeleton = () => {
  return (
    <Wrapper className="py-8 lg:py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 mb-6">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4 rounded-full" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <Skeleton className="aspect-square w-full rounded-lg" />

        {/* Right: Product info */}
        <div className="flex flex-col">
          {/* Title */}
          <div className="space-y-2">
            <Skeleton className="h-8 sm:h-9 lg:h-10 w-full" />
            <Skeleton className="h-8 sm:h-9 lg:h-10 w-3/5" />
          </div>

          {/* Description */}
          <div className="mt-3 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
          </div>

          {/* Buy button */}
          <Skeleton className="h-12 w-48 rounded-lg mt-6" />

          {/* Metadata */}
          <div className="mt-8 pt-6 border-t border-border/20 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 lg:mt-16">
        <div className="flex gap-4 border-b border-border/20 mb-6">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </Wrapper>
  );
};

export default ProductDetailSkeleton;

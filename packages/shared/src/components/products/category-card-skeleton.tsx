import { Skeleton } from "@brand/ui/skeleton";

const CategoryCardSkeleton = () => {
  return (
    <div className="bg-foreground/5 border border-border/20 rounded-lg lg:rounded-xl overflow-hidden">
      <div className="aspect-square" />
      <div className="border-t border-border/50 px-1 py-1 sm:px-2 sm:py-2">
        <Skeleton className="h-3.5 sm:h-4 w-4/5" />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;

import { Skeleton } from "@brand/ui/skeleton";

/** @see ./category-card.tsx — update this skeleton when the card layout changes */
const CategoryCardSkeleton = () => {
  return (
    <div className="flex flex-col bg-foreground/5 border border-border/20 rounded-lg lg:rounded-xl overflow-hidden h-full">
      <div className="aspect-square shrink-0" />
      <div className="border-t border-border/50 px-1 py-1 sm:px-2 sm:py-2 flex-1 flex items-center">
        <Skeleton className="h-3.5 sm:h-4 w-4/5" />
      </div>
    </div>
  );
};

export default CategoryCardSkeleton;

import { Skeleton } from "@brand/ui/skeleton";

/** @see ./tag-card.tsx — update this skeleton when the card layout changes */
const TagCardSkeleton = () => {
  return (
    <div className="flex aspect-[3/4] overflow-hidden rounded-lg lg:rounded-xl border border-border/20">
      <Skeleton className="w-full h-full" />
    </div>
  );
};

export default TagCardSkeleton;

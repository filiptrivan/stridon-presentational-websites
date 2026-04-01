import { Skeleton } from "@brand/ui/skeleton";
import Wrapper from "../wrapper";
import ProductCardSkeleton from "./product-card-skeleton";

const RelatedProductsSkeleton = () => {
  return (
    <div aria-hidden="true">
      <Wrapper className="pb-8 lg:pb-12">
        <div className="mt-12 lg:mt-16">
          <Skeleton className="h-7 w-44 mb-6" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
};

export default RelatedProductsSkeleton;

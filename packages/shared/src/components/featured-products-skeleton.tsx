import { Skeleton } from "@brand/ui/skeleton";
import ProductCardSkeleton from "./products/product-card-skeleton";
import Section from "./section";
import Wrapper from "./wrapper";

/** @see ./featured-products.tsx — update this skeleton when the featured products layout changes */
const FeaturedProductsSkeleton = () => {
  return (
    <div aria-hidden="true">
      <Section>
        <Wrapper>
          <div className="flex flex-col items-start justify-start lg:items-center lg:justify-center">
            <Skeleton className="h-9 lg:h-10 w-64 lg:w-80" />
            <Skeleton className="h-5 w-72 lg:w-96 mt-2" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-10">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </Wrapper>
      </Section>
    </div>
  );
};

export default FeaturedProductsSkeleton;

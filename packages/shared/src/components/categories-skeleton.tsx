import { Skeleton } from "@brand/ui/skeleton";
import CategoryCardSkeleton from "./products/category-card-skeleton";
import Section from "./section";
import Wrapper from "./wrapper";

const CategoriesSkeleton = () => {
  return (
    <div aria-hidden="true">
      <Section className="relative">
        <Wrapper>
          <div className="flex flex-col items-start justify-start lg:items-center lg:justify-center">
            <Skeleton className="h-9 lg:h-10 w-44 lg:w-52" />
            <Skeleton className="h-5 lg:h-6 w-72 lg:w-96 mt-2" />
          </div>

          <div className="w-full mt-10">
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
              {Array.from({ length: 12 }, (_, i) => (
                <CategoryCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  );
};

export default CategoriesSkeleton;

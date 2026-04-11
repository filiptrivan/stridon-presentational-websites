import { Skeleton } from "@brand/ui/skeleton";
import TagCardSkeleton from "./products/tag-card-skeleton";
import Section from "./section";
import Wrapper from "./wrapper";

/** @see ./tags.tsx — update this skeleton when the tags layout changes */
const TagsSkeleton = () => {
  return (
    <div aria-hidden="true">
      <Section className="relative">
        <Wrapper>
          <div className="flex flex-col items-start justify-start lg:items-center lg:justify-center">
            <Skeleton className="h-9 lg:h-10 w-44 lg:w-52" />
            <Skeleton className="h-5 lg:h-6 w-72 lg:w-96 mt-2" />
          </div>

          <div className="w-full mt-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
              {Array.from({ length: 4 }, (_, i) => (
                <TagCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </Wrapper>
      </Section>
    </div>
  );
};

export default TagsSkeleton;

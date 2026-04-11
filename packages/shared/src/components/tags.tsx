import TagCard from "./products/tag-card";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";
import { getTagsByBrand } from "@brand/shared/lib/api";
import type { Tag } from "@brand/shared/types/tags";

/** @see ./tags-skeleton.tsx — update the skeleton when this layout changes */
const Tags = async () => {
  let tags: Tag[] = [];
  try {
    tags = await getTagsByBrand(4);
  } catch {
    return null;
  }

  if (tags.length === 0) return null;

  return (
    <Section className="relative">
      <Wrapper>
        <SectionHeader
          title="Asortiman"
          description="Pogledaj aktuelne ponude i promocije iz našeg asortimana."
          action={{ label: "Pogledaj sve", href: "/proizvodi/tagovi" }}
        />

        <div className="w-full mt-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {tags.map((tag) => (
              <TagCard key={tag.slug} tag={tag} />
            ))}
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default Tags;

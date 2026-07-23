import HeroHeader from "@brand/shared/components/hero-header";
import TagCard from "@brand/shared/components/products/tag-card";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getTagsByBrand } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Tag } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Linije proizvoda",
  description:
    "Pregledaj linije proizvoda DCK profesionalnog alata.",
  canonicalUrl: "/proizvodi/tagovi/",
});

const TagsPage = async () => {
  const tags = await getTagsByBrand();

  return (
    <div>
      <HeroHeader
        title="Linije proizvoda"
        description="Pregledaj linije proizvoda DCK profesionalnog alata."
      />

      <Wrapper className="pb-16">
        {tags.length === 0 ? (
          <StatusMessage
            icon={Tag}
            title="Trenutno nema dostupnih linija proizvoda."
            description="Proveri ponovo uskoro."
          />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {tags.map((tag) => (
              <TagCard key={tag.slug} tag={tag} />
            ))}
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default TagsPage;

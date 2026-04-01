import HeroHeader from "@brand/shared/components/hero-header";
import CategoryCard from "@brand/shared/components/products/category-card";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getLeafCategories } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Package } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Kategorije proizvoda",
  description:
    "Pregledaj kompletnu ponudu profesionalnog alata po kategorijama.",
  canonicalUrl: "https://www.prodavnicaalata.rs/proizvodi/kategorije/",
});

const CategoriesPage = async () => {
  const categories = await getLeafCategories();

  return (
    <div>
      <HeroHeader
        title="Kategorije proizvoda"
        description="Pregledaj kompletnu ponudu profesionalnog alata po kategorijama."
      />

      <Wrapper className="pb-16">
        {categories.length === 0 ? (
          <StatusMessage
            icon={Package}
            title="Trenutno nema dostupnih kategorija."
            description="Proveri ponovo uskoro."
          />
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.slug}
                category={category}
              />
            ))}
          </div>
        )}
      </Wrapper>
    </div>
  );
};

export default CategoriesPage;

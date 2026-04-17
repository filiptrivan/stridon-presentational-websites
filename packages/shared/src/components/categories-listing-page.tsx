import HeroHeader from "@brand/shared/components/hero-header";
import CategoryCardsGrid from "@brand/shared/components/products/category-cards-grid";
import StatusMessage from "@brand/shared/components/status-message";
import Wrapper from "@brand/shared/components/wrapper";
import { getCategories } from "@brand/shared/lib/api";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { Package } from "lucide-react";

export const metadata = createPageMetadata({
  title: "Kategorije proizvoda",
  description:
    "Pregledaj kompletnu ponudu profesionalnog alata po kategorijama.",
  canonicalUrl: "/proizvodi/kategorije/",
});

const CategoriesListingPage = async () => {
  const categories = await getCategories();

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
          <CategoryCardsGrid categories={categories} />
        )}
      </Wrapper>
    </div>
  );
};

export default CategoriesListingPage;

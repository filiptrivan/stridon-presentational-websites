import CategoryCard from "./products/category-card";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";
import { getLeafCategories } from "@brand/shared/lib/api";
import type { Category } from "@brand/shared/types/categories";

const Categories = async () => {
  let categories: Category[] = [];
  try {
    categories = await getLeafCategories();
  } catch (error) {
    console.error("Failed to fetch categories", error);
    return null;
  }

  if (!categories || categories.length === 0) return null;

  return (
    <Section className="relative">
      <Wrapper>
        <SectionHeader
          title="Kategorije"
          description="Najpopularnije kategorije iz našeg asortimana."
          action={{ label: "Pogledaj sve", href: "/proizvodi/kategorije" }}
        />

        <div className="w-full mt-10">
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.slug} category={category} />
            ))}
          </div>
        </div>
      </Wrapper>
    </Section>
  );
};

export default Categories;

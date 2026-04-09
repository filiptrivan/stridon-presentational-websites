import type { Category } from "@brand/shared/types/categories";
import CategoryCard from "./category-card";

interface SubcategoriesGridProps {
  categories: Category[];
}

const SubcategoriesGrid = ({ categories }: SubcategoriesGridProps) => {
  if (categories.length === 0) return null;

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Podkategorije</h2>
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
    </section>
  );
};

export default SubcategoriesGrid;

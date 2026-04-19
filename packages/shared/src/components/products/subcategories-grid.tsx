import type { Category } from "@brand/shared/types/categories";
import CategoryCardsGrid from "./category-cards-grid";

interface SubcategoriesGridProps {
  categories: Category[];
}

const SubcategoriesGrid = ({ categories }: SubcategoriesGridProps) => {
  if (categories.length === 0) return null;

  return (
    <section>
      <h2 className="text-xl font-semibold mb-4">Podkategorije</h2>
      <CategoryCardsGrid categories={categories} />
    </section>
  );
};

export default SubcategoriesGrid;

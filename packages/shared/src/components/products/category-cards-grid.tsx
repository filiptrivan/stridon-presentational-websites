import type { Category } from "@brand/shared/types/categories";
import CategoryCard from "./category-card";

interface CategoryCardsGridProps {
  categories: Category[];
}

const CategoryCardsGrid = ({ categories }: CategoryCardsGridProps) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-1.5 sm:gap-3 lg:gap-4">
    {categories.map((category) => (
      <CategoryCard key={category.slug} category={category} />
    ))}
  </div>
);

export default CategoryCardsGrid;

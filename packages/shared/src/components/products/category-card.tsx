import type { Category } from "@brand/shared/types/categories";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link
      href={`/proizvodi/kategorije/${category.slug}`}
      className="flex flex-col bg-foreground/5 border border-border/20 hover:border-border transition-colors rounded-lg lg:rounded-xl overflow-hidden h-full"
    >
      <div className="aspect-square shrink-0 relative">
        <Image
          src={category.imageUrl}
          alt={category.name}
          fill
          sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 220px"
          className="object-contain p-1 sm:p-2"
        />
      </div>
      <div className="border-t border-border/50 px-1 py-1 sm:px-2 sm:py-2 flex-1 flex items-center">
        <span className="text-xs sm:text-sm font-medium line-clamp-2">
          {category.name}
        </span>
      </div>
    </Link>
  );
};

export default CategoryCard;

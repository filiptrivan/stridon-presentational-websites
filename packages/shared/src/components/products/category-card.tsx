import type { Category } from "@brand/shared/types/categories";
import Image from "next/image";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
  return (
    <Link href={`/proizvodi/kategorije/${category.slug}`}>
      <div className="bg-foreground/5 border border-border/20 hover:border-border transition-all cursor-pointer rounded-lg lg:rounded-xl overflow-hidden">
        <Image
          src={category.imageUrl}
          alt={category.name}
          width={500}
          height={500}
          className="object-contain w-full p-1 sm:p-2"
        />
        <div className="border-t border-border/50 px-1 py-1 sm:px-2 sm:py-2">
          <span className="text-xs sm:text-sm font-medium line-clamp-2">
            {category.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

import type { Tag } from "@brand/shared/types/tags";
import Image from "next/image";
import Link from "next/link";

interface TagCardProps {
  tag: Tag;
}

/** @see ./tag-card-skeleton.tsx — update the skeleton when this card layout changes */
const TagCard = ({ tag }: TagCardProps) => {
  return (
    <Link
      href={`/proizvodi/tagovi/${tag.slug}`}
      className="group relative flex aspect-[3/4] overflow-hidden rounded-lg lg:rounded-xl border border-border/20 hover:border-border transition-colors"
    >
      {tag.imageUrl ? (
        <Image
          src={tag.imageUrl}
          alt={tag.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0" style={{ backgroundColor: tag.color }} />
      )}

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3 sm:p-4">
        <span className="text-sm sm:text-base font-semibold text-white line-clamp-2">
          {tag.name}
        </span>
      </div>

      {tag.discountPercentage != null && tag.discountPercentage > 0 && (
        <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-md">
          -{tag.discountPercentage}%
        </div>
      )}
    </Link>
  );
};

export default TagCard;

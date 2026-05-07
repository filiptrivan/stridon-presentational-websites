import type { Catalog } from "@brand/shared/types/catalogs";
import Image from "next/image";

interface CatalogCardProps {
  catalog: Catalog;
}

const CatalogCard = ({ catalog }: CatalogCardProps) => {
  return (
    <a
      href={catalog.fileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex flex-col bg-foreground/5 border border-border/20 hover:border-border transition-colors rounded-lg lg:rounded-xl overflow-hidden h-full"
    >
      <div className="aspect-[3/4] shrink-0 relative">
        <Image
          src={catalog.previewImageUrl}
          alt={catalog.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 200px"
          className="object-contain p-1 sm:p-2"
        />
      </div>
      <div className="border-t border-border/50 px-1 py-1 sm:px-2 sm:py-2 flex-1 flex items-center">
        <span className="text-xs sm:text-sm font-medium line-clamp-2">
          {catalog.name}
        </span>
      </div>
    </a>
  );
};

export default CatalogCard;

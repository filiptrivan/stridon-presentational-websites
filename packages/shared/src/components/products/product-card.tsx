import type { ProductCardData } from "@brand/shared/types/products";
import { Badge } from "@brand/ui/badge";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import PriceDisplay from "./price-display";

interface ProductCardProps {
  product: ProductCardData;
}

const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <div className="relative flex flex-col bg-foreground/5 border border-border/20 hover:border-border transition-all rounded-lg lg:rounded-xl overflow-hidden h-full">
      <Link
        href={`/proizvodi/${product.slug}`}
        className="absolute inset-0 z-10"
      >
        <span className="sr-only">{product.title}</span>
      </Link>
      {/* `fill` is required — explicit width/height on <Image> overrides the
          container's aspect-ratio in a flex column, making it impossible
          to control the image container height via CSS. */}
      <div className="relative aspect-square w-full bg-card">
        {product.imageUrl && (
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            className="object-contain p-2 sm:p-3"
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        )}

        {product.hasDiscount && (
          <Badge
            variant="solid"
            className="absolute top-2 left-2 rounded-md font-semibold"
          >
            {`-${product.discountPercentage}%`}
          </Badge>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
          {product.title}
        </h3>

        <PriceDisplay
          displayPrice={product.displayPrice}
          originalPrice={product.originalPrice}
          className="mt-auto pt-3"
        />

        <a
          href={`https://www.prodavnicaalata.rs/proizvodi/${product.slug}/`}
          target="_blank"
          rel="noopener noreferrer"
          className="relative z-20 mt-3 inline-flex items-center justify-center gap-1.5 rounded-md text-xs sm:text-sm font-medium h-8 px-2 sm:h-9 sm:px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          Idi na prodavnicu
          <ExternalLink className="size-3.5" />
        </a>
      </div>
    </div>
  );
};

export default ProductCard;

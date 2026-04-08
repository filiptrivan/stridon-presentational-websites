import type { ProductCardData } from "@brand/shared/types/products";
import Image from "next/image";
import Link from "next/link";

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
      </div>

      <div className="p-3 sm:p-4">
        <h3 className="text-sm sm:text-base font-semibold line-clamp-2">
          {product.title}
        </h3>
      </div>
    </div>
  );
};

export default ProductCard;

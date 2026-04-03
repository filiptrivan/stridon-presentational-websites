"use client";

import { cn } from "@brand/shared/lib/utils";
import type { ProductMedia } from "@brand/shared/types/products";
import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: ProductMedia[];
  fallbackUrl?: string;
  title: string;
}

const ProductGallery = ({
  images,
  fallbackUrl,
  title,
}: ProductGalleryProps) => {
  const allImages: ProductMedia[] =
    images.length > 0
      ? images
      : fallbackUrl
        ? [{ url: fallbackUrl, mediaType: 0, width: 800, height: 800, thumbnailUrl: null, durationSeconds: null }]
        : [];
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (allImages.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-foreground/5 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full rounded-lg bg-foreground/5 overflow-hidden border border-border/20">
        {allImages.map((image, index) => (
          <Image
            key={image.url}
            src={image.url}
            alt={index === 0 ? title : `${title} - slika ${index + 1}`}
            fill
            className={cn(
              "object-contain p-4 transition-opacity duration-200",
              index === selectedIndex ? "opacity-100 z-10" : "opacity-0 z-0",
            )}
            sizes="(max-width: 768px) 100vw, 50vw"
            priority={index === 0}
          />
        ))}
      </div>

      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {allImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={cn(
                "relative size-16 sm:size-20 shrink-0 rounded-md overflow-hidden border-2 transition-colors",
                index === selectedIndex
                  ? "border-primary"
                  : "border-border/20 hover:border-border/50",
              )}
            >
              <Image
                src={image.url}
                alt={`${title} ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;

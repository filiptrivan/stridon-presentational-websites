"use client";

import { cn } from "@brand/shared/lib/utils";
import { isVideoMedia } from "@brand/shared/lib/media";
import type { ProductMedia } from "@brand/shared/types/products";
import useEmblaCarousel from "embla-carousel-react";
import { Play } from "lucide-react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { startTransition, useEffect, useRef, useState } from "react";

function PlayIconOverlay() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      <div className="bg-black/50 rounded-full p-1.5">
        <Play className="size-4 text-white fill-white" />
      </div>
    </div>
  );
}

const MediaLightbox = dynamic(
  () => import("./media-lightbox").then((mod) => ({ default: mod.MediaLightbox })),
  { ssr: false },
);

interface ProductGalleryProps {
  media: ProductMedia[];
  fallbackUrl?: string;
  title: string;
}

const ProductGallery = ({
  media,
  fallbackUrl,
  title,
}: ProductGalleryProps) => {
  const allMedia: ProductMedia[] =
    media.length > 0
      ? media
      : fallbackUrl
        ? [{ url: fallbackUrl, mediaType: 0, width: 800, height: 800, thumbnailUrl: null, durationSeconds: null }]
        : [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  //#region Mobile carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const isSyncingRef = useRef(false);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      if (isSyncingRef.current) {
        isSyncingRef.current = false;
        return;
      }
      startTransition(() => setSelectedIndex(emblaApi.selectedScrollSnap()));
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (emblaApi && emblaApi.selectedScrollSnap() !== selectedIndex) {
      isSyncingRef.current = true;
      emblaApi.scrollTo(selectedIndex, true);
    }
  }, [emblaApi, selectedIndex]);
  //#endregion

  if (allMedia.length === 0) {
    return (
      <div className="aspect-square w-full rounded-lg bg-foreground/5 flex items-center justify-center">
        <span className="text-muted-foreground text-sm">No image</span>
      </div>
    );
  }

  return (
    <>
      {/* Desktop: vertical thumbnails on left + main media on right */}
      <div className={cn(
        "hidden lg:grid lg:gap-3 lg:self-start",
        allMedia.length > 1 && "lg:grid-cols-[6rem_1fr]",
      )}>
        {allMedia.length > 1 && (
          <div className="relative">
            <div className="absolute inset-0 flex flex-col gap-2 overflow-y-auto">
              {allMedia.map((item, i) => (
                <button
                  key={item.url}
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "relative shrink-0 size-20 rounded-md border-2 overflow-hidden transition-colors",
                    i === selectedIndex
                      ? "border-primary"
                      : "border-border/20 hover:border-border/50",
                  )}
                >
                  <Image
                    src={isVideoMedia(item) ? (item.thumbnailUrl ?? item.url) : item.url}
                    alt={`${title} - ${isVideoMedia(item) ? "video" : "slika"} ${i + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain"
                  />
                  {isVideoMedia(item) && <PlayIconOverlay />}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main media display — aspect-square drives the grid row height */}
        <div
          className="relative aspect-square rounded-lg overflow-hidden cursor-pointer border border-border/20"
          onClick={() => setLightboxOpen(true)}
        >
          {allMedia.map((item, i) => {
            const isSelected = i === selectedIndex;
            const isVideo = isVideoMedia(item);

            if (isVideo) {
              return (
                <div
                  key={item.url}
                  className={cn(
                    "absolute inset-0 transition-opacity duration-200",
                    isSelected ? "opacity-100 z-10" : "opacity-0 z-0",
                  )}
                >
                  {isSelected ? (
                    <video
                      controls
                      preload="metadata"
                      poster={item.thumbnailUrl ?? undefined}
                      className="object-contain p-4 w-full h-full"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <source src={item.url} type="video/mp4" />
                    </video>
                  ) : item.thumbnailUrl ? (
                    <Image
                      src={item.thumbnailUrl}
                      alt={`${title} - video ${i + 1}`}
                      fill
                      sizes="50vw"
                      className="object-contain p-4"
                    />
                  ) : null}
                </div>
              );
            }

            return (
              <Image
                key={item.url}
                src={item.url}
                alt={i === 0 ? title : `${title} - slika ${i + 1}`}
                fill
                sizes="50vw"
                className={cn(
                  "object-contain p-4 transition-opacity duration-200",
                  isSelected ? "opacity-100 z-10" : "opacity-0 z-0",
                )}
                priority={i === 0}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile: Embla carousel */}
      <div className="lg:hidden">
        {allMedia.length === 1 ? (
          <div
            className="relative aspect-square rounded-lg overflow-hidden border border-border/20"
            onClick={() => !isVideoMedia(allMedia[0]) && setLightboxOpen(true)}
          >
            {isVideoMedia(allMedia[0]) ? (
              <video
                controls
                preload="metadata"
                poster={allMedia[0].thumbnailUrl ?? undefined}
                className="object-contain p-4 w-full h-full"
              >
                <source src={allMedia[0].url} type="video/mp4" />
              </video>
            ) : (
              <Image
                src={allMedia[0].url}
                alt={title}
                fill
                sizes="100vw"
                className="object-contain p-4"
                priority
              />
            )}
          </div>
        ) : (
          <>
            <div
              ref={emblaRef}
              className="overflow-hidden rounded-lg"
              onClick={() => !isVideoMedia(allMedia[selectedIndex]) && setLightboxOpen(true)}
            >
              <div className="flex">
                {allMedia.map((item, i) => (
                  <div
                    key={item.url}
                    className="flex-[0_0_100%] min-w-0 relative aspect-square border border-border/20"
                  >
                    {isVideoMedia(item) ? (
                      <video
                        controls
                        preload="metadata"
                        poster={item.thumbnailUrl ?? undefined}
                        className="object-contain p-4 w-full h-full"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <source src={item.url} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={item.url}
                        alt={`${title} - slika ${i + 1}`}
                        fill
                        sizes="100vw"
                        className="object-contain p-4"
                        priority={i === 0}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-1.5 mt-2">
              {allMedia.map((_, i) => (
                <button
                  key={allMedia[i].url}
                  className={cn(
                    "size-2 rounded-full transition-colors",
                    i === selectedIndex ? "bg-primary" : "bg-muted-foreground/30",
                  )}
                  onClick={() => emblaApi?.scrollTo(i)}
                  aria-label={`Medij ${i + 1}`}
                  aria-current={i === selectedIndex ? "true" : undefined}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {lightboxOpen && (
        <MediaLightbox
          media={allMedia}
          initialIndex={selectedIndex}
          alt={title}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </>
  );
};

export default ProductGallery;

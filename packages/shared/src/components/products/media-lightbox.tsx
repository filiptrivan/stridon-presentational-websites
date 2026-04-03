"use client";

import { isVideoMedia } from "@brand/shared/lib/media";
import type { ProductMedia } from "@brand/shared/types/products";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { startTransition, useCallback, useEffect, useRef, useState } from "react";

type MediaLightboxProps = {
  media: ProductMedia[];
  initialIndex: number;
  alt: string;
  onClose: () => void;
};

export function MediaLightbox({
  media,
  initialIndex,
  alt,
  onClose,
}: MediaLightboxProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    startIndex: initialIndex,
    loop: true,
  });
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const containerRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const newIndex = emblaApi.selectedScrollSnap();
      startTransition(() => setCurrentIndex(newIndex));
      containerRef.current?.querySelectorAll("video").forEach((v) => v.pause());

      // Auto-play the newly selected video slide
      const slides = containerRef.current?.querySelectorAll("[data-slide]");
      const activeSlide = slides?.[newIndex];
      const video = activeSlide?.querySelector("video");
      video?.play();
    };
    emblaApi.on("select", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, scrollPrev, scrollNext]);

  useEffect(() => {
    dialogRef.current?.focus();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div
      ref={dialogRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      aria-label="Galerija medija"
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center outline-none"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white/80 hover:text-white transition-colors"
        aria-label="Zatvori"
      >
        <X className="size-8" />
      </button>

      <span className="absolute top-4 left-4 text-white/70 text-sm">
        {currentIndex + 1} / {media.length}
      </span>

      {media.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollPrev();
            }}
            className="absolute left-2 lg:left-4 z-10 text-white/70 hover:text-white transition-colors"
            aria-label="Prethodni medij"
          >
            <ChevronLeft className="size-10" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              scrollNext();
            }}
            className="absolute right-2 lg:right-4 z-10 text-white/70 hover:text-white transition-colors"
            aria-label="Sledeći medij"
          >
            <ChevronRight className="size-10" />
          </button>
        </>
      )}

      <div
        ref={(node) => {
          emblaRef(node);
          (containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
        }}
        className="overflow-hidden w-full h-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex h-full">
          {media.map((item, i) => (
            <div
              key={item.url}
              data-slide
              className="flex-[0_0_100%] min-w-0 relative flex items-center justify-center p-8 lg:p-16"
            >
              {isVideoMedia(item) ? (
                <video
                  controls
                  autoPlay={i === initialIndex}
                  preload="metadata"
                  poster={item.thumbnailUrl ?? undefined}
                  className="max-w-full max-h-full"
                >
                  <source src={item.url} type="video/mp4" />
                </video>
              ) : (
                <Image
                  src={item.url}
                  alt={`${alt} - slika ${i + 1}`}
                  fill
                  sizes="100vw"
                  className="object-contain"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

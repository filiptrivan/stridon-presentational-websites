import { ImageIcon } from "lucide-react";

import { cn } from "./lib/utils";

interface ImagePlaceholderProps {
  /** Mirrors next/image's `fill` — absolutely fills a positioned parent. */
  fill?: boolean;
  className?: string;
}

/**
 * What a card renders in place of a PACMS image the catalogue does not have.
 *
 * PACMS stopped fabricating images in August 2026: a product with no photo now
 * gets zero `ProductMedia` rows and a category with no image gets `null`, where
 * both used to carry a stored grey `default.jpg`. These sites read those fields
 * straight, so the guards that were added for the null left empty boxes behind.
 *
 * Inline SVG, never a file — absence must have no URL to crawl, index, or hand
 * to a feed. `aria-hidden` with no alt for the same reason the backend dropped
 * the sentinel: it carried the product title, so one grey card claimed to be a
 * specific tool on every surface that republished it. Every site rendering this
 * already names the thing in adjacent link text, so a screen reader gets that
 * name once rather than twice. Full rationale: pa-cms `Backend/CLAUDE.md` →
 * "Image absence is null, never a placeholder row".
 *
 * Deliberately neutral rather than brand-stamped: a grid of store logos reads as
 * a broken page, not as missing photography.
 *
 * `fill` + `className` only, on purpose. pa-storefront's twin also takes
 * `width`/`height` because a shared `Image` wrapper feeds it fixed-size call
 * sites; nothing here does, and without `fill` the caller sizes this through
 * `className` like any other element. Add the props when something needs them.
 */
export function ImagePlaceholder({ fill, className }: ImagePlaceholderProps) {
  return (
    <span
      aria-hidden
      data-slot="image-placeholder"
      className={cn(
        "flex items-center justify-center bg-muted/40 text-muted-foreground/40",
        fill && "absolute inset-0 size-full",
        className,
      )}
    >
      {/* Scales with the tile but stays legible at both ends, which a fixed icon
          size cannot do. */}
      <ImageIcon
        className="size-1/3 max-h-16 max-w-16 min-h-4 min-w-4"
        strokeWidth={1.5}
      />
    </span>
  );
}

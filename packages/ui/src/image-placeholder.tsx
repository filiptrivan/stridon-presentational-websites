import { ImageIcon } from "lucide-react";

import { cn } from "./lib/utils";

interface ImagePlaceholderProps {
  /** Mirrors next/image's `fill` — absolutely fills a positioned parent. */
  fill?: boolean;
  className?: string;
}

/**
 * What a card renders in place of a PACMS image the catalogue does not have.
 * Which surfaces use it, and which two deliberately don't: repo CLAUDE.md →
 * "A missing PACMS image is `null`".
 *
 * Three properties are load-bearing and invisible from the call sites:
 * - **Inline SVG, never a file** — absence must have no URL to crawl, index or
 *   hand to a feed.
 * - **Accepts no prop that could carry a label.** The stored `default.jpg` this
 *   replaces carried the product title, so one grey card claimed to be a
 *   specific tool everywhere it was republished; a `...props` spread would let
 *   that back in through `aria-label`/`title`. Callers already name the thing in
 *   adjacent link text. Rationale: pa-cms `Backend/CLAUDE.md` → "Image absence
 *   is null, never a placeholder row".
 * - **Neutral, not brand-stamped** — a grid of store logos reads as a broken
 *   page, not as missing photography.
 *
 * Sizing is either `fill` (absolute, for a positioned parent) or `className`
 * (for fixed-size callers like the warranty autocomplete). pa-storefront's twin
 * carries `width`/`height` props instead, because its shared `Image` wrapper
 * passes numbers through; nothing here needs them.
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

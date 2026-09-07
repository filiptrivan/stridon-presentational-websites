import type { Brand } from "@/constants/brands";
import { cn } from "@brand/shared/lib/utils";
import Image from "next/image";

interface BrandLogoProps {
  // Anything with a name and a tile - a full Brand, or a serviced brand.
  brand: Pick<Brand, "name" | "logo">;
  className?: string;
  sizes?: string;
}

// 2:1 logo tile. Brands we have no artwork for fall back to a wordmark cell
// carrying the diagonal motif, so the grid keeps its rhythm.
const BrandLogo = ({ brand, className, sizes }: BrandLogoProps) => {
  if (!brand.logo) {
    return (
      <div
        className={cn(
          "flex aspect-[2/1] items-center justify-center bg-muted/40",
          className,
        )}
      >
        <span className="flex items-center gap-3">
          <span
            aria-hidden
            className="h-5 w-2.5 -skew-x-[14deg] bg-primary"
          />
          <span className="font-heading text-xl font-semibold uppercase tracking-[0.18em]">
            {brand.name}
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className={cn("relative aspect-[2/1] overflow-hidden", className)}>
      <Image
        src={brand.logo}
        alt={`${brand.name} logo`}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
        // The image optimizer rejects SVG unless dangerouslyAllowSVG is on.
        unoptimized
        className="object-cover"
      />
    </div>
  );
};

export default BrandLogo;

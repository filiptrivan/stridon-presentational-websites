import { cn } from "@brand/shared/lib/utils";
import Image from "next/image";

interface BrandLogoProps {
  name: string;
  /** `imageUrl` straight off the PACMS brand; null renders the wordmark cell. */
  logo: string | null;
  className?: string;
  sizes?: string;
}

// 2:1 logo cell for the hairline grids on the homepage, /brendovi and /servis.
//
// The artwork is the CMS one, so a brand the site starts showing has its real
// logo with nothing drawn by hand. It is `object-contain` with padding, not
// `object-cover`: PACMS stores a tight-cropped vendor logo of whatever shape and
// format, so cropping it to 2:1 would cut letters off. A brand PACMS has no
// image for falls back to a plain wordmark cell, so the grid keeps its rhythm
// either way.
const BrandLogo = ({ name, logo, className, sizes }: BrandLogoProps) => {
  if (!logo) {
    return (
      <div
        className={cn(
          "flex aspect-[2/1] items-center justify-center bg-muted/40",
          className,
        )}
      >
        <span className="font-heading text-xl font-semibold uppercase tracking-[0.18em]">
          {name}
        </span>
      </div>
    );
  }

  return (
    <div
      className={cn(
        // White, not the grey the catalog cards use: eight of the PACMS logos
        // are JPG with a baked white background and would sit on grey as a
        // visible white box.
        "relative aspect-[2/1] overflow-hidden bg-background",
        className,
      )}
    >
      <Image
        src={logo}
        alt={`${name} logo`}
        fill
        sizes={sizes ?? "(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"}
        // The optimizer rejects SVG unless dangerouslyAllowSVG is on, and a few
        // PACMS logos are SVG. Only those bypass it; the rest are resized and
        // served as AVIF/WebP like any other remote image.
        unoptimized={logo.toLowerCase().endsWith(".svg")}
        className="object-contain p-4 lg:p-6"
      />
    </div>
  );
};

export default BrandLogo;

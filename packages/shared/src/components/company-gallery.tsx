import Image from "next/image";
import { cn } from "../lib/utils";

export type CompanyGalleryItem = {
  src: string;
  alt: string;
  className?: string;
};

interface CompanyGalleryProps {
  images: CompanyGalleryItem[];
}

function CompanyGallery({ images }: CompanyGalleryProps) {
  return (
    <div className={cn("grid gap-4 grid-cols-2 grid-rows-6 h-full min-h-110")}>
      {images.map((image) => (
        <div
          key={image.src + image.alt}
          className={`relative overflow-hidden rounded-xl min-h-56 ${
            image.className ?? "lg:col-span-2"
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}

export default CompanyGallery;

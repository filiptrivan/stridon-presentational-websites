"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@brand/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Image from "next/image";
import type { CompanyLogo } from "./companies";

interface CompaniesCarouselProps {
  companies: CompanyLogo[];
}

const CompaniesCarousel = ({ companies }: CompaniesCarouselProps) => {
  return (
    <div className="mt-4 md:mt-8">
      <Carousel plugins={[WheelGesturesPlugin()]}>
        <CarouselContent>
          {companies.map((company) => (
            <CarouselItem
              key={company.src}
              className="basis-1/2 md:basis-1/5 lg:basis-1/6"
            >
              <div className="flex items-center justify-center p-2">
                <Image
                  src={company.src}
                  alt={company.alt}
                  width={1024}
                  height={1024}
                  className="w-40 h-20 object-contain"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 md:-left-3" />
        <CarouselNext className="right-0 md:-right-3" />
      </Carousel>
    </div>
  );
};

export default CompaniesCarousel;

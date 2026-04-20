"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@brand/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Quote } from "lucide-react";
import Container from "./container";
import type { Testimonial } from "./testimonials";

interface TestimonialsCarouselProps {
  items: Testimonial[];
}

const TestimonialsCarousel = ({ items }: TestimonialsCarouselProps) => {
  return (
    <Carousel plugins={[WheelGesturesPlugin()]}>
      <CarouselContent>
        {items.map((item) => (
          <CarouselItem
            key={item.personName}
            className="basis-full md:basis-1/2 lg:basis-1/3"
          >
            <TestimonialItem item={item} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-2" />
      <CarouselNext className="-right-2" />
    </Carousel>
  );
};

function TestimonialItem({ item }: { item: Testimonial }) {
  return (
    <Container>
      <div className="flex flex-col justify-between bg-muted/50 border border-border/50 rounded-lg lg:rounded-xl p-4 lg:p-6 w-full h-full">
        <div>
          <Quote className="size-5 text-primary/60 mb-3" strokeWidth={1.5} />
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.quote}
          </p>
        </div>
        <div className="mt-5 pt-4 border-t border-border/30">
          <p className="text-sm font-medium">{item.personName}</p>
        </div>
      </div>
    </Container>
  );
}

export default TestimonialsCarousel;

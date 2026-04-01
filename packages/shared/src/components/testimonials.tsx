"use client";

import Container from "./container";
import Section from "./section";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@brand/ui/carousel";
import Wrapper from "./wrapper";
import { TESTIMONIALS } from "@/constants";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import { Quote } from "lucide-react";
import Image from "next/image";

type Testimonial = {
  companyName: string;
  personName: string;
  quote: string;
  logoSrc: string;
};

const Testimonials = () => {
  return (
    <Section className="relative">
      <Wrapper>
        <Carousel plugins={[WheelGesturesPlugin()]}>
          <CarouselContent>
            {TESTIMONIALS.map((item) => (
              <CarouselItem
                key={item.companyName}
                className="basis-full md:basis-1/2 lg:basis-1/3"
              >
                <Item item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-2" />
          <CarouselNext className="-right-2" />
        </Carousel>
      </Wrapper>
      <div className="absolute hidden lg:block top-1/4 left-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
      <div className="absolute hidden lg:block top-1/4 right-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
    </Section>
  );
};

const Item = ({ item }: { item: Testimonial }) => (
  <Container>
    <div className="flex flex-col justify-between bg-muted/50 border border-border/50 rounded-lg lg:rounded-xl p-4 lg:p-6 w-full h-full">
      <div>
        <Quote className="size-5 text-primary/60 mb-3" strokeWidth={1.5} />
        <p className="text-sm text-muted-foreground leading-relaxed">
          {item.quote}
        </p>
      </div>
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/30">
        <Image
          src={item.logoSrc}
          alt={item.companyName}
          width={90}
          height={90}
          className="object-contain shrink-0"
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold truncate">{item.companyName}</p>
          <p className="text-xs text-muted-foreground truncate">
            {item.personName}
          </p>
        </div>
      </div>
    </div>
  </Container>
);

export default Testimonials;

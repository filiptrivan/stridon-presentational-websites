"use client";

import { PARTNER_QUOTES } from "@/constants/about";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@brand/ui/carousel";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";
import Image from "next/image";

// Slider rather than a wall of blocks: the hairline grid stays reserved for
// brand tiles and client logos. Arrows sit next to the heading, not over the
// slides.
const PartnerQuotes = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-14 lg:py-20">
        <Carousel opts={{ align: "start" }} plugins={[WheelGesturesPlugin()]}>
          <Container>
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="max-w-xl text-2xl font-semibold tracking-tight lg:text-3xl">
                  Šta naši saradnici kažu o nama
                </h2>
                <p className="mt-4 max-w-lg text-muted-foreground">
                  Naša snaga leži u poverenju koje gradimo sa partnerima.
                  Njihovo zadovoljstvo je naša najbolja preporuka.
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <CarouselPrevious className="static size-10 translate-y-0 rounded-none" />
                <CarouselNext className="static size-10 translate-y-0 rounded-none" />
              </div>
            </div>
          </Container>

          <Container delay={0.5}>
            <CarouselContent className="mt-10">
              {PARTNER_QUOTES.map((item) => (
                <CarouselItem
                  key={item.company}
                  className="basis-full md:basis-1/2 lg:basis-1/3"
                >
                  <figure className="flex h-full flex-col justify-between gap-6 border border-border p-6 lg:p-8">
                    <blockquote className="text-[15px] leading-relaxed text-muted-foreground">
                      {item.quote}
                    </blockquote>
                    {/* Fixed-height box: the logos run from 1.7:1 to 6.7:1, so
                        capping height and width keeps them optically even. */}
                    <figcaption className="border-t border-border pt-5">
                      <span className="flex h-12 items-center">
                        <Image
                          src={item.logo}
                          alt={item.company}
                          width={200}
                          height={80}
                          // The image optimizer rejects SVG unless dangerouslyAllowSVG is on.
                          unoptimized
                          className="max-h-full w-auto max-w-[10.5rem] object-contain object-left"
                        />
                      </span>
                    </figcaption>
                  </figure>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Container>
        </Carousel>
      </Wrapper>
    </section>
  );
};

export default PartnerQuotes;

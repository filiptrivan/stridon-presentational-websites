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
import Container from "./container";
import SectionHeader from "./section-header";
import Wrapper from "./wrapper";

const companies = [
  { src: "/companies/svgs/enterijerjankovic.svg", alt: "Enterijer Jankovic" },
  { src: "/companies/svgs/galens.svg", alt: "Galens" },
  { src: "/companies/svgs/termotim.svg", alt: "Termotim" },
  { src: "/companies/svgs/vitorog.svg", alt: "Vitorog" },
  { src: "/companies/svgs/nobili.svg", alt: "Nobili" },
  { src: "/companies/svgs/mbmrad.svg", alt: "MBM Rad" },
  { src: "/companies/svgs/hidroina.svg", alt: "Hidroina" },
  { src: "/companies/svgs/ingradnja.svg", alt: "Ingradnja" },
  { src: "/companies/svgs/silmaxlogo.svg", alt: "Silmax" },
  { src: "/companies/svgs/coligoars.svg", alt: "Coligoars" },
  { src: "/companies/svgs/kokreator.svg", alt: "Kokreator" },
  { src: "/companies/svgs/lokring.svg", alt: "Lokring" },
  { src: "/companies/svgs/mimiz.svg", alt: "Mimiz" },
];

const Companies = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center py-8 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-4 right-4 border-t border-dashed border-border/70 lg:left-8 lg:right-8"
      />
      <Wrapper>
        <Container>
          <SectionHeader
            title="Partneri i firme sa kojima godinama sarađujemo"
            size="sm"
            align="center"
          />
        </Container>

        <Container delay={0.1}>
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
        </Container>
      </Wrapper>
    </div>
  );
};

export default Companies;

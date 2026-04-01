import { getBrandConfig } from "@brand/config";
import Image from "next/image";
import { ReactNode } from "react";
import Container from "./container";
import Wrapper from "./wrapper";
import { cn } from "../lib/utils";

interface HeroHeaderProps {
  pretitle?: ReactNode;
  title: ReactNode;
  description: ReactNode;
  showSvgGrid?: boolean;
  children?: ReactNode;
  as?: "h1" | "h2";
}

const HeroHeader = ({
  pretitle,
  title,
  description,
  showSvgGrid = false,
  children,
  as: Heading = "h1",
}: HeroHeaderProps) => {
  const { heroGradient } = getBrandConfig();

  return (
    <div className="relative z-0 w-full h-full">
      <div
        className={cn(
          "absolute -top-16 inset-x-0 -z-10 mx-auto w-3/4 h-32 lg:h-40 rounded-full blur-[5rem]",
          heroGradient,
        )}
      />

      {showSvgGrid && (
        <Image
          src="/hero.svg"
          alt=""
          width={1024}
          height={1024}
          className="absolute inset-x-0 -top-16 w-full -z-1 min-w-full"
        />
      )}

      <Wrapper className="py-16 sm:py-24">
        <div className="flex flex-col items-center justify-center w-full z-10">
          {pretitle}

          <Container delay={0.1}>
            <Heading className="text-balance leading-tight! text-center text-4xl md:text-6xl font-semibold tracking-tight w-full">
              {title}
            </Heading>
          </Container>

          <Container delay={0.2}>
            <p className="text-base md:text-lg font-normal text-center text-balance text-muted-foreground max-w-4xl mx-auto mt-4">
              {description}
            </p>
          </Container>

          {children}
        </div>
      </Wrapper>
    </div>
  );
};

export default HeroHeader;

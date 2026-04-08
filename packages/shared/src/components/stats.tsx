"use client";

import { useCounter } from "@brand/shared/lib/hooks/useCounter";
import { cn } from "@brand/shared/lib/utils";
import { RefObject, useRef } from "react";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

type StatsLayout = "four-up-no-three" | "three-up-from-sm";

export interface StatsProps {
  stats: Array<{ label: string; value: string | number }>;
  layout: StatsLayout;
}

const Stats = ({ stats, layout }: StatsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Section>
      <Wrapper>
        <div
          ref={ref}
          className={cn(
            "grid sm:gap-8 gap-12 w-full",
            layout === "four-up-no-three"
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-3",
          )}
        >
          {stats.map((stat, index) => (
            <Container key={index} delay={index}>
              <div className="flex flex-col items-center justify-center text-center">
                <h4 className="text-4xl lg:text-5xl font-bold font-heading">
                  <AnimatedStatValue value={stat.value} statRef={ref} />
                </h4>
                <p className="text-muted-foreground mt-2">{stat.label}</p>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
    </Section>
  );
};

export default Stats;

function AnimatedStatValue({
  value,
  statRef,
}: {
  value: string | number;
  statRef: RefObject<HTMLDivElement | null>;
}) {
  const stringValue = String(value);
  const match = stringValue.match(/^([\d.]+)(.*)$/);
  const numericPart = match?.[1] ?? "0";
  const suffix = match?.[2] ?? "";
  const target = Number(numericPart.replace(/\./g, "")) || 0;
  const animatedValue = useCounter(statRef, target, 2);

  if (!match) {
    return stringValue;
  }

  const shouldFormatThousands = numericPart.includes(".");

  const displayValue = shouldFormatThousands
    ? animatedValue.toLocaleString("sr-RS")
    : animatedValue.toString();

  return `${displayValue}${suffix}`;
}

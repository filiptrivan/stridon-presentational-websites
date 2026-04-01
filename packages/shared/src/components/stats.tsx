"use client";

import { useCounter } from "@brand/shared/lib/hooks/useCounter";
import { RefObject, useRef } from "react";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

export interface StatsProps {
  stats: Array<{ label: string; value: string | number }>;
}

const Stats = ({ stats }: StatsProps) => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <Section>
      <Wrapper>
        <div
          ref={ref}
          className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] sm:gap-8 gap-12 w-full"
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

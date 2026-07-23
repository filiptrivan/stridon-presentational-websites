"use client";

import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { useCounter } from "@brand/shared/lib/hooks/useCounter";
import { STATS } from "@/constants/content";
import { type RefObject, useRef } from "react";

// Data-sheet stat band: left-aligned numerals behind hairline column rules,
// counting up on scroll into view.
const StatsBand = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section className="border-b border-border">
      <Wrapper className="py-16 lg:py-20">
        <div ref={ref} className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {STATS.map((stat, index) => (
            <Container key={stat.label} delay={index * 0.5}>
              <div className="border-l border-border pl-5 lg:pl-6">
                <p className="font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
                  <AnimatedValue value={stat.value} statRef={ref} />
                </p>
                <p className="mt-2 text-[13px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
    </section>
  );
};

export default StatsBand;

function AnimatedValue({
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

  const displayValue = numericPart.includes(".")
    ? animatedValue.toLocaleString("sr-RS")
    : animatedValue.toString();

  return (
    <>
      {displayValue}
      {suffix && <span className="text-primary">{suffix}</span>}
    </>
  );
}

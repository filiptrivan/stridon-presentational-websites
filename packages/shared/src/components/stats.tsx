"use client";

import { useCounter } from "@brand/shared/lib/hooks/useCounter";
import {
  groupSeparatorFor,
  parseStatValue,
} from "@brand/shared/lib/stat-value";
import { cn } from "@brand/shared/lib/utils";
import { RefObject, useRef } from "react";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

type StatsLayout = "four-up-no-three" | "three-up-from-sm";

export interface StatsProps {
  stats: Array<{ label: string; value: string | number }>;
  layout: StatsLayout;
  /**
   * How the figures are written, and therefore how the count-up reads them back
   * and reformats them. Defaults to what this component has always assumed, so
   * the Serbian-only sites are unaffected. See `lib/stat-value.ts`.
   */
  locale?: string;
}

const Stats = ({ stats, layout, locale = "sr-RS" }: StatsProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const groupSeparator = groupSeparatorFor(locale);

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
                  <AnimatedStatValue
                    value={stat.value}
                    statRef={ref}
                    locale={locale}
                    groupSeparator={groupSeparator}
                  />
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
  locale,
  groupSeparator,
}: {
  value: string | number;
  statRef: RefObject<HTMLDivElement | null>;
  locale: string;
  groupSeparator: string;
}) {
  const stringValue = String(value);
  const parsed = parseStatValue(stringValue, groupSeparator);
  const animatedValue = useCounter(statRef, parsed?.target ?? 0, 2);

  if (!parsed) {
    return stringValue;
  }

  const displayValue = parsed.grouped
    ? animatedValue.toLocaleString(locale)
    : animatedValue.toString();

  return `${displayValue}${parsed.suffix}`;
}

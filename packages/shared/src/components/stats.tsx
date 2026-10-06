import { cn } from "@brand/shared/lib/utils";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

type StatsLayout = "four-up-no-three" | "three-up-from-sm";

export interface StatsProps {
  stats: Array<{ label: string; value: string | number }>;
  layout: StatsLayout;
}

const Stats = ({ stats, layout }: StatsProps) => {
  return (
    <Section>
      <Wrapper>
        <div
          className={cn(
            "grid sm:gap-8 gap-12 w-full",
            layout === "four-up-no-three"
              ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-3",
          )}
        >
          {stats.map((stat, index) => (
            <Container key={index}>
              <div className="flex flex-col items-center justify-center text-center">
                {/* A figure, not a section heading: an `h4` here would skip a
                    level under the surrounding `h2` and add four entries to
                    every page outline. `p` renders identically: Tailwind's
                    preflight strips heading font-size, weight and margin, and
                    all three are set by the classes here. */}
                <p className="text-4xl lg:text-5xl font-bold font-heading">
                  {stat.value}
                </p>
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

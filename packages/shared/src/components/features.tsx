import type { LucideIcon } from "lucide-react";
import { BadgePercent, History, ShieldCheck, Users } from "lucide-react";
import Container from "./container";
import { Feature } from "./feature";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

export type FeatureItem = {
  title: string;
  desc: string;
  icon?: LucideIcon;
};

const BENEFIT_STYLES = [
  {
    icon: History,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  {
    icon: Users,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
  {
    icon: ShieldCheck,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
  {
    icon: BadgePercent,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
  },
];

interface FeaturesProps {
  items: FeatureItem[];
  title?: string;
}

const Features = ({
  items,
  title = "Zašto SG Tools?",
}: FeaturesProps) => {
  return (
    <Section>
      <Wrapper>
        <Container>
          <SectionHeader title={title} />
        </Container>

        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mt-10">
            {items.map((item, index) => {
              const style = BENEFIT_STYLES[index % BENEFIT_STYLES.length];

              return (
                <Feature
                  key={index}
                  title={item.title}
                  desc={item.desc}
                  icon={item.icon ?? style.icon}
                  color={style.color}
                  bg={style.bg}
                  border={style.border}
                />
              );
            })}
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
};

export default Features;

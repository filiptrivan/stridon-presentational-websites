import { DollarSign, Hand, ToolCase, Users } from "lucide-react";
import { COMPANY_BENEFITS } from "@/constants/content";
import Container from "./container";
import { Feature } from "./feature";
import Section from "./section";
import Wrapper from "./wrapper";

const FEATURE_STYLES = [
  {
    icon: ToolCase,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  {
    icon: Hand,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
  {
    icon: Users,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
  {
    icon: DollarSign,
    color: "text-violet-400",
    bg: "bg-violet-500/15",
    border: "border-violet-500/30",
  },
];

function CompanyBenefits() {
  return (
    <Section>
      <Wrapper>
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
            {COMPANY_BENEFITS.map((item, index) => (
              <Feature
                key={index}
                title={item.title}
                desc={item.description}
                icon={FEATURE_STYLES[index].icon}
                color={FEATURE_STYLES[index].color}
                bg={FEATURE_STYLES[index].bg}
                border={FEATURE_STYLES[index].border}
              />
            ))}
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
}

export default CompanyBenefits;

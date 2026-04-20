import CompanyTimeline, { type Milestone } from "./company-timeline";
import Section from "./section";
import SectionHeader from "./section-header";
import Wrapper from "./wrapper";

interface CompanyValuesProps {
  milestones: Milestone[];
  title?: string;
}

function CompanyValues({
  milestones,
  title = "Kako je nastao SG TOOLS",
}: CompanyValuesProps) {
  return (
    <Section>
      <Wrapper>
        <SectionHeader title={title} align="left" className="mb-10 max-w-3xl" />
        <CompanyTimeline milestones={milestones} />
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

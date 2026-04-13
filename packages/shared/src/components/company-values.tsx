import CompanyTimeline, { type Milestone } from "./company-timeline";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

interface CompanyValuesProps {
  milestones: Milestone[];
  title?: string;
}

function CompanyValues({
  milestones,
  title = "Kako je nastao SG Tools",
}: CompanyValuesProps) {
  return (
    <Section>
      <Wrapper>
        <SectionHeader
          title={title}
          align="left"
          className="mb-10 max-w-3xl"
        />
        <CompanyTimeline milestones={milestones} />
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

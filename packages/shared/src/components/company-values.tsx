import CompanyGallery from "./company-gallery";
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <CompanyTimeline milestones={milestones} />
          <CompanyGallery />
        </div>
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

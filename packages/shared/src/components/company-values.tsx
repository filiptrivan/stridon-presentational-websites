import CompanyGallery from "./company-gallery";
import CompanyTimeline from "./company-timeline";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

function CompanyValues() {
  return (
    <Section>
      <Wrapper>
        <SectionHeader
          title="Kako je nastao SG Tools"
          align="left"
          className="mb-10 max-w-3xl"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <CompanyTimeline />
          <CompanyGallery />
        </div>
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

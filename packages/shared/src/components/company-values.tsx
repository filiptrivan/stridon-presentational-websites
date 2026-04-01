import CompanyGallery from "./company-gallery";
import CompanyTimeline from "./company-timeline";
import Section from "./section";
import Wrapper from "./wrapper";

function CompanyValues() {
  return (
    <Section>
      <Wrapper>
        <div className="mb-10 max-w-3xl">
          <h2 className="text-3xl lg:text-4xl font-semibold tracking-tight">
            Kako je nastao SG Tools
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
          <CompanyTimeline />
          <CompanyGallery />
        </div>
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

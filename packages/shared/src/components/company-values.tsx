import CompanyGallery, { type CompanyGalleryItem } from "./company-gallery";
import CompanyTimeline, { type Milestone } from "./company-timeline";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

interface CompanyValuesProps {
  milestones: Milestone[];
  galleryImages: CompanyGalleryItem[];
  title?: string;
}

function CompanyValues({
  milestones,
  title = "Kako je nastao SG Tools",
  galleryImages,
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
          <CompanyGallery images={galleryImages} />
        </div>
      </Wrapper>
    </Section>
  );
}

export default CompanyValues;

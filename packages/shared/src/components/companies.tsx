import Container from "./container";
import SectionHeader from "./section-header";
import Wrapper from "./wrapper";
import CompaniesCarousel from "./companies-carousel";

export type CompanyLogo = {
  src: string;
  alt: string;
};

interface CompaniesProps {
  companies: CompanyLogo[];
  title?: string;
}

const Companies = ({
  companies,
  title = "Partneri i firme sa kojima godinama sarađujemo",
}: CompaniesProps) => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center py-8 lg:py-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-4 right-4 border-t border-dashed border-border/70 lg:left-8 lg:right-8"
      />
      <Wrapper>
        <Container>
          <SectionHeader
            title={title}
            size="sm"
            align="center"
          />
        </Container>

        <Container delay={0.1}>
          <CompaniesCarousel companies={companies} />
        </Container>
      </Wrapper>
    </div>
  );
};

export default Companies;

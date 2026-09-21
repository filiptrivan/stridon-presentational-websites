import Container from "./container";
import Section from "./section";
import SectionHeader from "./section-header";
import Wrapper from "./wrapper";
import TestimonialsCarousel from "./testimonials-carousel";

export type Testimonial = {
  personName: string;
  quote: string;
};

interface TestimonialsProps {
  items: Testimonial[];
  /** Section heading above the carousel. Omitted means no heading, which is what dck and sg-tools pass. */
  title?: string;
}

const Testimonials = ({ items, title }: TestimonialsProps) => {
  return (
    <Section className="relative">
      <Wrapper>
        {title && (
          <Container>
            {/* Same treatment Companies gives its heading, so the two
                logo-and-quote sections read as a pair. */}
            <SectionHeader
              title={title}
              size="sm"
              align="center"
              className="mb-8"
            />
          </Container>
        )}
        <TestimonialsCarousel items={items} />
      </Wrapper>
      <div className="absolute hidden lg:block top-1/4 left-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
      <div className="absolute hidden lg:block top-1/4 right-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
    </Section>
  );
};

export default Testimonials;

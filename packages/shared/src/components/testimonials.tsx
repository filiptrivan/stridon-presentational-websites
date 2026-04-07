import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";
import TestimonialsCarousel from "./testimonials-carousel";

export type Testimonial = {
  companyName: string;
  personName: string;
  quote: string;
  logoSrc: string;
};

interface TestimonialsProps {
  items: Testimonial[];
}

const Testimonials = ({ items }: TestimonialsProps) => {
  return (
    <Section className="relative">
      <Wrapper>
        <TestimonialsCarousel items={items} />
      </Wrapper>
      <div className="absolute hidden lg:block top-1/4 left-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
      <div className="absolute hidden lg:block top-1/4 right-1/4 w-1/8 h-16 rounded-full bg-primary/80 -z-10 blur-[6rem]"></div>
    </Section>
  );
};

export default Testimonials;

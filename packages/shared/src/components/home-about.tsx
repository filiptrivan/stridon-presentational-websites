import { HOME_ABOUT_PARAGRAPH } from "@/constants/content";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

function HomeAbout() {
  return (
    <Section>
      <Wrapper>
        <Container>
          <div className="space-y-4">
            <h2 className="text-3xl lg:text-4xl text-left lg:text-center font-semibold tracking-tight">
              O SG Tools
            </h2>
            <p className="text-base md:text-lg text-left lg:text-center leading-relaxed text-muted-foreground max-w-4xl mx-auto">
              {HOME_ABOUT_PARAGRAPH}
            </p>
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
}

export default HomeAbout;

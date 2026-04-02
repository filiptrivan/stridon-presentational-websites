import { HOME_ABOUT_PARAGRAPH } from "@/constants/content";
import Container from "./container";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

function HomeAbout() {
  return (
    <Section>
      <Wrapper>
        <Container>
          <SectionHeader
            title="O SG Tools"
            description={HOME_ABOUT_PARAGRAPH}
            descriptionClassName="max-w-4xl mx-auto leading-relaxed"
          />
        </Container>
      </Wrapper>
    </Section>
  );
}

export default HomeAbout;

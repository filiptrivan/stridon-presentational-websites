import Container from "./container";
import Section from "./section";
import SectionHeader from "./section-header";
import Wrapper from "./wrapper";

interface HomeAboutProps {
  description: string;
  title?: string;
}

function HomeAbout({ description, title = "O SG TOOLS" }: HomeAboutProps) {
  return (
    <Section>
      <Wrapper>
        <Container>
          <SectionHeader
            title={title}
            description={description}
            descriptionClassName="max-w-4xl mx-auto leading-relaxed"
          />
        </Container>
      </Wrapper>
    </Section>
  );
}

export default HomeAbout;

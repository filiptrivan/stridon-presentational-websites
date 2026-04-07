import Container from "./container";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

interface HomeAboutProps {
  description: string;
  title?: string;
}

function HomeAbout({
  description,
  title = "O SG Tools",
}: HomeAboutProps) {
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

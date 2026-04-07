import Container from "./container";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

interface AboutStoryProps {
  paragraphs: string[];
  title?: string;
}

function AboutStory({
  paragraphs,
  title = "Naša priča",
}: AboutStoryProps) {
  return (
    <Section>
      <Wrapper>
        <Container>
          <SectionHeader
            title={title}
            description={
              <div className="space-y-4">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            }
            descriptionClassName="max-w-4xl mx-auto leading-relaxed"
          />
        </Container>
      </Wrapper>
    </Section>
  );
}

export default AboutStory;

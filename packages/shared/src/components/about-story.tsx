import { ABOUT_PARAGRAPHS } from "@/constants/content";
import Container from "./container";
import SectionHeader from "./section-header";
import Section from "./section";
import Wrapper from "./wrapper";

function AboutStory() {
  return (
    <Section>
      <Wrapper>
        <Container>
          <SectionHeader
            title="Naša priča"
            description={
              <div className="space-y-4">
                {ABOUT_PARAGRAPHS.map((paragraph) => (
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

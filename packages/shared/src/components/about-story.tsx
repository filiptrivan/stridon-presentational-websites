import { ABOUT_PARAGRAPHS } from "@/constants/content";
import Container from "./container";
import Section from "./section";
import Wrapper from "./wrapper";

function AboutStory() {
  return (
    <Section>
      <Wrapper>
        <Container>
          <div className="space-y-6">
            <h2 className="text-3xl lg:text-4xl text-left lg:text-center font-semibold tracking-tight">
              Naša priča
            </h2>
            <div className="space-y-4">
              {ABOUT_PARAGRAPHS.map((paragraph) => (
                <p
                  key={paragraph}
                  className="text-base md:text-lg text-left lg:text-center leading-relaxed text-muted-foreground max-w-4xl mx-auto"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </Container>
      </Wrapper>
    </Section>
  );
}

export default AboutStory;

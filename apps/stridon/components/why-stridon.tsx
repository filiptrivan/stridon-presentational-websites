import { FEATURES } from "@/constants/content";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";

// Compact four-up: bare icon, claim, one line of copy. No cards, no boxes -
// the section is a breather between the brand wall and the own-brand blocks.
const WhyStridon = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-14 lg:py-16">
        <Container>
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Zašto Stridon?
            </h2>
            <p className="max-w-sm text-sm text-muted-foreground lg:text-right">
              Uvoz, distribuciju i servis vodimo u sopstvenoj režiji i
              odgovaramo za svaki korak.
            </p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
            {FEATURES.map(({ title, desc, icon: Icon }) => (
              <div key={title}>
                <Icon className="size-6 text-primary" strokeWidth={1.5} />
                <h3 className="mt-4 font-heading text-base font-semibold tracking-tight">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};

export default WhyStridon;

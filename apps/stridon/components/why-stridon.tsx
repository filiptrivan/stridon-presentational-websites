import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { FEATURES } from "@/constants/content";

// Editorial index rows instead of an icon-card grid: hairline dividers,
// a diagonal red marker that slides in on hover.
const WhyStridon = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-20 lg:py-28">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <Container>
            <div className="lg:sticky lg:top-24">
              <p className="inline-flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                <span
                  aria-hidden
                  className="inline-block h-3.5 w-6 -skew-x-[14deg] bg-primary"
                />
                Zašto Stridon
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight lg:text-4xl">
                Partner, ne samo dobavljač
              </h2>
              <p className="mt-4 max-w-sm text-muted-foreground">
                Od uvoza do servisa, ceo lanac držimo u svojim rukama. Zato
                znamo tačno šta prodajemo i stojimo iza toga.
              </p>
            </div>
          </Container>

          <Container delay={0.5}>
            <div className="border-b border-border">
              {FEATURES.map((item) => (
                <div
                  key={item.title}
                  className="group grid gap-2 border-t border-border py-6 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-8 lg:py-7"
                >
                  <div className="flex items-center gap-3 self-start">
                    <span
                      aria-hidden
                      className="h-2.5 w-5 shrink-0 origin-left -skew-x-[14deg] scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                    />
                    <h3 className="font-heading text-lg font-semibold tracking-tight transition-transform duration-300 group-hover:translate-x-1">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-[15px] leading-relaxed text-muted-foreground">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </Container>
        </div>
      </Wrapper>
    </section>
  );
};

export default WhyStridon;

import { ABOUT_MILESTONES } from "@/constants/about";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@brand/ui/timeline";
import Image from "next/image";

// The sg-tools about timeline, rebuilt on this theme: same milestones and
// photos, but no pastel icon cards and no rounded corners.
const AboutTimeline = () => {
  return (
    <section className="border-b border-border">
      <Wrapper className="py-14 lg:py-20">
        <Container>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <h2 className="max-w-xl text-2xl font-semibold tracking-tight lg:text-3xl">
              Kako je nastao Stridon Group
            </h2>
            <p className="max-w-md text-muted-foreground">
              Od jedne tezge na buvljaku do uvoza i distribucije za preko
              trideset svetskih brendova.
            </p>
          </div>
        </Container>

        <Container delay={0.5}>
          <div className="mt-12">
            <Timeline defaultValue={ABOUT_MILESTONES.length}>
              {ABOUT_MILESTONES.map((milestone, index) => (
                <TimelineItem key={milestone.date} step={index + 1}>
                  <TimelineHeader>
                    <TimelineSeparator className="bg-border" />
                    <TimelineDate className="font-heading text-base font-semibold text-primary">
                      {milestone.date}
                    </TimelineDate>
                    <TimelineIndicator className="border-primary bg-primary" />
                  </TimelineHeader>

                  <TimelineContent className="pt-2 pb-4">
                    <div className="grid gap-6 md:grid-cols-[1fr_22rem] md:items-start md:gap-10">
                      <div>
                        <h3 className="font-heading text-lg font-semibold tracking-tight text-foreground lg:text-xl">
                          {milestone.title}
                        </h3>
                        <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
                          {milestone.description}
                        </p>
                      </div>

                      <div className="relative aspect-[4/3] w-full overflow-hidden border border-border bg-muted/40">
                        <Image
                          src={milestone.image.src}
                          alt={milestone.image.alt}
                          fill
                          sizes="(min-width: 768px) 22rem, 100vw"
                          className={
                            milestone.image.contain
                              ? "object-contain p-8"
                              : "object-cover"
                          }
                          unoptimized={milestone.image.src.endsWith(".svg")}
                        />
                      </div>
                    </div>
                  </TimelineContent>
                </TimelineItem>
              ))}
            </Timeline>
          </div>
        </Container>
      </Wrapper>
    </section>
  );
};

export default AboutTimeline;

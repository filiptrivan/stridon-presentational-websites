import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@brand/ui/timeline";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import { Feature } from "./feature";

export type Milestone = {
  title: string;
  description: string;
  date?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  image?: {
    src: string;
    alt: string;
    contain?: boolean;
  };
};

interface CompanyTimelineProps {
  milestones: Milestone[];
}

export default function CompanyTimeline({
  milestones,
}: CompanyTimelineProps) {
  return (
    <Timeline defaultValue={milestones.length + 1}>
      {milestones.map((item, index) => (
        <TimelineItem
          key={index}
          step={index + 1}
          className={index === milestones.length - 1 ? "pb-0!" : undefined}
        >
          <TimelineHeader>
            <TimelineSeparator />
            {item.date && <TimelineDate>{item.date}</TimelineDate>}
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent className="h-full">
            <div className="grid gap-6 md:grid-cols-[1fr_24rem] md:items-center">
              <Feature
                className="px-0! border-0!"
                bg={item.bg}
                border={item.border}
                color={item.color}
                desc={item.description}
                icon={item.icon}
                title={item.title}
              />
              {item.image && (
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-muted">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    className={
                      item.image.contain
                        ? "object-contain p-6"
                        : "object-cover"
                    }
                    sizes="(min-width: 768px) 24rem, 100vw"
                    unoptimized={item.image.src.endsWith(".svg")}
                  />
                </div>
              )}
            </div>
          </TimelineContent>
        </TimelineItem>
      ))}

      <TimelineItem key="tail" step={milestones.length + 1}>
        <TimelineHeader>
          <TimelineIndicator />
        </TimelineHeader>
      </TimelineItem>
    </Timeline>
  );
}

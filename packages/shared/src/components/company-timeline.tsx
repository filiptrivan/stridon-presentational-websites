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
import { Feature } from "./feature";

export type Milestone = {
  title: string;
  description: string;
  date?: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
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
        <TimelineItem key={item.date ?? item.title} step={index + 1}>
          <TimelineHeader>
            <TimelineSeparator />
            {item.date && <TimelineDate>{item.date}</TimelineDate>}
            <TimelineIndicator />
          </TimelineHeader>
          <TimelineContent className="h-full">
            <Feature
              className="px-0! border-0!"
              bg={item.bg}
              border={item.border}
              color={item.color}
              desc={item.description}
              icon={item.icon}
              title={item.title}
            />
          </TimelineContent>
        </TimelineItem>
      ))}

      {/* These two items extends line further downward */}
      <TimelineItem key="tail-1" step={milestones.length + 1}>
        <TimelineHeader>
          <TimelineSeparator />
        </TimelineHeader>
      </TimelineItem>
      <TimelineItem key="tail-2" step={milestones.length + 2}>
        <TimelineHeader>
          <TimelineSeparator />
        </TimelineHeader>
      </TimelineItem>
    </Timeline>
  );
}

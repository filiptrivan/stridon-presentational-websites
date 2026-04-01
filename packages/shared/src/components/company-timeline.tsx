import { ABOUT_MILESTONES } from "@/constants/content";
import {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
} from "@brand/ui/timeline";
import { Rocket, Speech, Wrench } from "lucide-react";
import { Feature } from "./feature";

type Milestone = { title: string; description: string; date?: string };

const items = [
  {
    icon: Wrench,
    color: "text-amber-400",
    bg: "bg-amber-500/15",
    border: "border-amber-500/30",
  },
  {
    icon: Speech,
    color: "text-blue-400",
    bg: "bg-blue-500/15",
    border: "border-blue-500/30",
  },
  {
    icon: Rocket,
    color: "text-emerald-400",
    bg: "bg-emerald-500/15",
    border: "border-emerald-500/30",
  },
];

export default function CompanyTimeline() {
  return (
    <Timeline defaultValue={ABOUT_MILESTONES.length + 1}>
      {(ABOUT_MILESTONES as Milestone[]).map((item, index) => {
        const style = items[index % items.length];
        const step = index + 1;

        return (
          <TimelineItem key={item.date ?? item.title} step={step}>
            <TimelineHeader>
              <TimelineSeparator />
              {item.date && <TimelineDate>{item.date}</TimelineDate>}
              <TimelineIndicator />
            </TimelineHeader>
            <TimelineContent className="h-full">
              <Feature
                className="px-0! border-0!"
                bg={style.bg}
                border={style.border}
                color={style.color}
                desc={item.description}
                icon={style.icon}
                title={item.title}
              />
            </TimelineContent>
          </TimelineItem>
        );
      })}

      {/* These two items extends line further downward */}
      <TimelineItem key="tail-1" step={ABOUT_MILESTONES.length + 1}>
        <TimelineHeader>
          <TimelineSeparator />
        </TimelineHeader>
      </TimelineItem>
      <TimelineItem key="tail-2" step={ABOUT_MILESTONES.length + 2}>
        <TimelineHeader>
          <TimelineSeparator />
        </TimelineHeader>
      </TimelineItem>
    </Timeline>
  );
}

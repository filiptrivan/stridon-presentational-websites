import { cn } from "@brand/shared/lib/utils";
import { LucideIcon } from "lucide-react";

export const Feature = ({
  title,
  desc,
  icon: Icon,
  color,
  bg,
  border,
  className,
}: {
  title: string;
  desc: string;
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        className,
        "flex flex-col justify-between p-3 lg:p-6 border border-border/60 rounded-lg lg:rounded-xl",
      )}
    >
      <div
        className={`flex items-center justify-center size-9 lg:size-11 rounded-xl ${bg} ${border} border`}
      >
        <Icon className={`size-5 lg:size-6 ${color}`} strokeWidth={1.5} />
      </div>
      <div>
        <h3 className="text-base sm:text-lg font-semibold mt-4 text-foreground">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
};

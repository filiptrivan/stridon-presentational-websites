import { cn } from "@brand/shared/lib/utils";
import type { LucideIcon } from "lucide-react";
import IconBox from "./icon-box";

export const Feature = ({
  title,
  desc,
  icon,
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
      <IconBox icon={icon} color={color} bg={bg} border={border} />
      <div>
        <h3 className="text-base sm:text-lg font-semibold mt-4 text-foreground">
          {title}
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{desc}</p>
      </div>
    </div>
  );
};

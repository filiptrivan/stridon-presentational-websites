import { cn } from "@brand/shared/lib/utils";
import type { LucideIcon } from "lucide-react";

interface IconBoxProps {
  icon: LucideIcon;
  color: string;
  bg: string;
  border: string;
  size?: "sm" | "default";
  className?: string;
}

function IconBox({
  icon: Icon,
  color,
  bg,
  border,
  size = "default",
  className,
}: IconBoxProps) {
  const isDefault = size === "default";

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-xl border",
        isDefault ? "size-9 lg:size-11" : "size-10",
        bg,
        border,
        className,
      )}
    >
      <Icon
        className={cn(
          isDefault ? "size-5 lg:size-6" : "size-5",
          color,
        )}
        strokeWidth={1.5}
      />
    </div>
  );
}

export default IconBox;

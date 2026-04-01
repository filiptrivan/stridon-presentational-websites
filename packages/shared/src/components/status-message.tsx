import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

interface StatusMessageProps {
  icon: LucideIcon;
  title: string;
  description: string;
  variant?: "primary" | "destructive";
  children?: ReactNode;
}

const StatusMessage = ({
  icon: Icon,
  title,
  description,
  variant = "primary",
  children,
}: StatusMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className={`flex items-center justify-center size-12 rounded-xl mb-4 ${
          variant === "destructive"
            ? "bg-destructive/15 border border-destructive/30"
            : "bg-primary/15 border border-primary/30"
        }`}
      >
        <Icon
          className={`size-6 ${variant === "destructive" ? "text-destructive" : "text-primary"}`}
          strokeWidth={1.5}
        />
      </div>
      <p className="text-lg font-medium">{title}</p>
      <p className="text-sm text-muted-foreground mt-2 max-w-sm">
        {description}
      </p>
      {children}
    </div>
  );
};

export default StatusMessage;

import { cn } from "@brand/shared/lib/utils";
import { Button } from "@brand/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  action?: { label: string; href: string };
  /** "responsive" = left mobile, center lg (default). "center" = always center. "left" = always left */
  align?: "responsive" | "center" | "left";
  /** "default" = 3xl/4xl section headings. "sm" = xl/2xl (companies). "sub" = xl font-bold mb-6 (product subsections) */
  size?: "default" | "sm" | "sub";
  /** Override description wrapper classes (merged via cn, so max-w-4xl overrides default max-w-md) */
  descriptionClassName?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}

const alignClasses = {
  responsive: "items-start justify-start lg:items-center lg:justify-center",
  center: "items-center justify-center",
  left: "items-start justify-start",
} as const;

const textAlignClasses = {
  responsive: "text-left lg:text-center",
  center: "text-center",
  left: "text-left",
} as const;

const headingSizeClasses = {
  default: "text-3xl lg:text-4xl font-semibold tracking-tight",
  sm: "text-xl lg:text-2xl font-semibold tracking-tight",
} as const;

function SectionHeader({
  title,
  description,
  action,
  align = "responsive",
  size = "default",
  descriptionClassName,
  as: Heading = "h2",
  className,
}: SectionHeaderProps) {
  if (size === "sub") {
    return (
      <Heading className={cn("text-xl font-bold mb-6", className)}>
        {title}
      </Heading>
    );
  }

  return (
    <div className={cn("flex flex-col", alignClasses[align], className)}>
      <Heading
        className={cn(headingSizeClasses[size], textAlignClasses[align])}
      >
        {title}
      </Heading>
      {description && (
        <div
          className={cn(
            "text-base lg:text-lg text-muted-foreground mt-2 max-w-md",
            textAlignClasses[align],
            descriptionClassName,
          )}
        >
          {description}
        </div>
      )}
      {action && (
        <Button variant="link" asChild className="mt-2 p-0!">
          <Link href={action.href}>
            {action.label}
            <ArrowRight />
          </Link>
        </Button>
      )}
    </div>
  );
}

export default SectionHeader;

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { cn } from "../lib/utils";

interface HeroBadgeProps {
  href: string;
  label: string;
  className?: string;
}

function HeroBadge({ href, label, className }: HeroBadgeProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "flex items-center justify-center gap-x-1 rounded-full px-2 py-1.5 text-xs lg:text-sm transition-opacity hover:opacity-80",
        className,
      )}
    >
      {label}
      <ChevronRight className="size-3.5 lg:size-4" />
    </Link>
  );
}

export default HeroBadge;

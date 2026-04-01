import { ChevronRight } from "lucide-react";
import Link from "next/link";

interface HeroSupportBadgeProps {
  href: string;
  label: string;
}

function HeroSupportBadge({ href, label }: HeroSupportBadgeProps) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-x-1 rounded-full px-2 py-1.5 text-xs lg:text-sm text-white transition-opacity hover:opacity-80 relative before:absolute before:inset-0 before:-z-10 before:rounded-3xl before:bg-gradient-to-b before:from-neutral-700 before:to-neutral-900 before:p-[1px] before:content-[''] after:absolute after:inset-[1px] after:-z-10 after:rounded-[22px] after:bg-[#181818]/60"
    >
      <span>{label}</span>
      <ChevronRight className="size-3.5 lg:size-4" />
    </Link>
  );
}

export default HeroSupportBadge;

import { cn } from "@brand/shared/lib/utils";

interface Props {
  className?: string;
}

const SectionDivider = ({ className }: Props) => (
  <hr
    aria-hidden="true"
    className={cn(
      "w-full border-0 border-t border-dashed border-border/70 my-8 lg:my-10",
      className,
    )}
  />
);

export default SectionDivider;

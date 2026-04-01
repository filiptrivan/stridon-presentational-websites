import { cn } from "@brand/shared/lib/utils";

interface Props {
  className?: string;
  children: React.ReactNode;
  showDivider?: boolean;
}

const Section = ({ className, children, showDivider = true }: Props) => {
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center py-16 lg:py-24",
        className,
      )}
    >
      {showDivider ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-0 left-4 right-4 border-t border-dashed border-border/70 lg:left-8 lg:right-8"
        />
      ) : null}
      {children}
    </div>
  );
};

export default Section;

import { cn } from "@brand/shared/lib/utils";

const Glow = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "absolute top-0 inset-x-0 mx-auto bg-primary/50 lg:bg-primary/70 rounded-full w-1/3 h-1/16 blur-[4rem]",
        className,
      )}
    />
  );
};

export default Glow;

import { cn } from "@brand/shared/lib/utils";
import React from "react";

interface Props {
  className?: string;
  children: React.ReactNode;
}

const Wrapper = ({ className, children }: Props) => {
  return (
    <section
      className={cn(
        "h-full mx-auto w-full lg:max-w-7xl px-4 lg:px-10",
        className,
      )}
    >
      {children}
    </section>
  );
};

export default Wrapper;

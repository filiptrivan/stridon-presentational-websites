import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./lib/utils";

const proseVariants = cva("prose max-w-full dark:prose-invert", {
  variants: {
    variant: {
      default:
        "prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground prose-headings:font-heading marker:text-primary",
      category:
        "whitespace-pre-line prose-p:text-muted-foreground prose-p:leading-relaxed",
      product:
        "prose-sm prose-a:text-primary prose-a:hover:opacity-80",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

function Prose({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof proseVariants>) {
  return (
    <div
      data-slot="prose"
      className={cn(proseVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Prose, proseVariants };

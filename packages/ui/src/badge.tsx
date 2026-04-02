import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "./lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary/20 text-primary",
        solid: "bg-primary text-primary-foreground",
        outline: "border-border text-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        muted: "bg-muted/50 text-muted-foreground",
        destructive: "bg-destructive/20 text-destructive",
      },
      size: {
        default: "px-2.5 py-0.5 text-xs",
        sm: "px-2 py-0.5 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

function Badge({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return (
    <span
      data-slot="badge"
      className={cn(badgeVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

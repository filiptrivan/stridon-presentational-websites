import { cn } from "@brand/shared/lib/utils";
import { Package } from "lucide-react";

interface StockStatusProps {
  inStock: boolean;
  size?: "sm" | "default";
  className?: string;
}

function StockStatus({ inStock, size = "sm", className }: StockStatusProps) {
  const isDefault = size === "default";

  return (
    <div
      className={cn(
        "flex items-center",
        isDefault ? "gap-2" : "gap-1.5",
        className,
      )}
    >
      <Package className={isDefault ? "size-4" : "size-3.5"} />
      <span
        className={cn(
          isDefault ? "text-sm" : "text-xs",
          inStock ? "text-green-500" : "text-muted-foreground",
        )}
      >
        {inStock ? "Na stanju" : "Nema na stanju"}
      </span>
    </div>
  );
}

export default StockStatus;

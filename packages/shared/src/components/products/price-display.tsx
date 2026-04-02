import { cn } from "@brand/shared/lib/utils";
import { Badge } from "@brand/ui/badge";

interface PriceDisplayProps {
  displayPrice: number;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  size?: "sm" | "lg";
  className?: string;
}

function PriceDisplay({
  displayPrice,
  originalPrice,
  discountPercentage,
  size = "sm",
  className,
}: PriceDisplayProps) {
  const isLarge = size === "lg";
  const hasDiscount = !!originalPrice && originalPrice > displayPrice;
  const formattedPrice = displayPrice.toLocaleString("sr-RS");
  const formattedOriginal = originalPrice?.toLocaleString("sr-RS");

  return (
    <div
      className={cn(
        "flex",
        isLarge
          ? "items-baseline gap-3"
          : "flex-col sm:flex-row sm:items-baseline sm:gap-2",
        className,
      )}
    >
      <span
        className={cn(
          "font-bold",
          isLarge ? "text-2xl sm:text-3xl" : "text-base sm:text-lg",
        )}
      >
        {formattedPrice} RSD
      </span>
      {hasDiscount && (
        <>
          <span
            className={cn(
              "text-muted-foreground line-through",
              isLarge ? "text-lg" : "text-xs sm:text-sm",
            )}
          >
            {formattedOriginal} RSD
          </span>
          {isLarge && discountPercentage && (
            <Badge variant="solid" className="rounded-md">
              {`-${discountPercentage}%`}
            </Badge>
          )}
        </>
      )}
    </div>
  );
}

export default PriceDisplay;

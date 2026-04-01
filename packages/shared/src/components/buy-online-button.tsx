import { getBrandConfig } from "@brand/config";
import type { VariantProps } from "class-variance-authority";
import { ExternalLinkIcon } from "lucide-react";
import { Button, type buttonVariants } from "@brand/ui/button";

const { shopUrl } = getBrandConfig();

const BuyOnlineButton = ({
  size,
  variant,
  className,
}: {
  size?: VariantProps<typeof buttonVariants>["size"];
  variant?: VariantProps<typeof buttonVariants>["variant"];
  className?: string;
}) => {

  return (
    <Button asChild size={size} variant={variant} className={className}>
      <a
        href={shopUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        Idi na prodavnicu
        <ExternalLinkIcon />
      </a>
    </Button>
  );
};

export default BuyOnlineButton;

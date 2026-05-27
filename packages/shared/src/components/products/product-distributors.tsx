import { getBrandConfig } from "@brand/config";
import type { Dealer } from "@brand/shared/types/dealers";
import { cn } from "@brand/shared/lib/utils";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductDistributorsProps {
  dealers: Dealer[];
}

const CARD_CLASS =
  "flex items-center justify-center p-3 h-16 rounded-lg border border-border/30 bg-muted/20 transition-colors";

const ProductDistributors = ({ dealers }: ProductDistributorsProps) => {
  const { brandName } = getBrandConfig();

  if (dealers.length === 0) return null;

  return (
    <div className="mt-8 pt-6 border-t border-border/20">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
        {brandName} prodavci
      </h2>
      <div className="grid grid-cols-3 gap-2 mt-3">
        {dealers.map((d) => {
          const content = d.logoSrc ? (
            <Image
              src={d.logoSrc}
              alt={d.name}
              width={120}
              height={40}
              className="h-8 w-full object-contain"
            />
          ) : (
            <span className="text-sm font-medium text-center text-foreground line-clamp-2">
              {d.name}
            </span>
          );

          return d.website ? (
            <a
              key={d.id}
              href={d.website}
              target="_blank"
              rel="noopener noreferrer"
              title={d.name}
              className={cn(CARD_CLASS, "hover:border-primary/50 hover:bg-muted/40")}
            >
              {content}
            </a>
          ) : (
            <div key={d.id} title={d.name} className={CARD_CLASS}>
              {content}
            </div>
          );
        })}
      </div>
      <Link
        href="/gde-kupiti"
        className="inline-flex items-center gap-1 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        Pogledaj sve prodavce
        <ArrowRight className="size-3" />
      </Link>
    </div>
  );
};

export default ProductDistributors;

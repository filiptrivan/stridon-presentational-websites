"use client";

import { cn, formatTelHref } from "@brand/shared/lib/utils";
import type { Dealer, DealerCategory } from "@brand/shared/types/dealers";
import { ExternalLink, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { useEffect, useRef } from "react";

interface DealerListProps {
  dealers: Dealer[];
  selectedDealerId: string | null;
  onSelectDealer: (id: string | null) => void;
  distances?: Map<string, number> | null;
  nearestDealerId?: string | null;
}

const categoryColors: Record<DealerCategory, string> = {
  online: "bg-blue-500/20 text-blue-400",
  dealer: "bg-purple-500/20 text-purple-400",
  service: "bg-green-500/20 text-green-400",
  outOfWarranty: "bg-amber-500/20 text-amber-400",
};

const categoryLabels: Record<DealerCategory, string> = {
  online: "Online prodavnice",
  dealer: "Ovlašćene prodavnice",
  service: "Ovlašćeni servis",
  outOfWarranty: "Servis van garantnog roka",
};

function CategoryBadge({ category }: { category: DealerCategory }) {
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        categoryColors[category],
      )}
    >
      {categoryLabels[category]}
    </span>
  );
}

export default function DealerList({
  dealers,
  selectedDealerId,
  onSelectDealer,
  distances,
  nearestDealerId,
}: DealerListProps) {
  const listRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    if (selectedDealerId && window.matchMedia("(min-width: 1024px)").matches) {
      const card = cardRefs.current.get(selectedDealerId);
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [selectedDealerId]);

  if (dealers.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground py-12">
        <p>Nema rezultata za izabrane filtere.</p>
      </div>
    );
  }

  return (
    <div ref={listRef} className="flex flex-col gap-3">
      {dealers.map((dealer) => {
        const isSelected = dealer.id === selectedDealerId;
        const isNearest = dealer.id === nearestDealerId;
        const distance = distances?.get(dealer.id);

        return (
          <div
            key={dealer.id}
            ref={(el) => {
              if (el) cardRefs.current.set(dealer.id, el);
            }}
            onClick={() => onSelectDealer(isSelected ? null : dealer.id)}
            className={cn(
              "cursor-pointer rounded-lg border p-4 transition-colors",
              isNearest && "border-l-2 border-l-primary",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-muted-foreground/30",
            )}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h3 className="font-semibold text-sm text-foreground leading-tight">
                {dealer.name}
              </h3>
              <div className="flex items-center gap-1.5 shrink-0">
                {isNearest && (
                  <span className="inline-block rounded-full px-2 py-0.5 text-xs font-medium bg-primary/20 text-primary">
                    Najbliži
                  </span>
                )}
                {distance != null && !isNearest && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-muted/50 text-muted-foreground text-xs px-2 py-0.5 font-mono">
                    <Navigation className="size-3" />
                    {`${distance} km`}
                  </span>
                )}
                <CategoryBadge category={dealer.category} />
              </div>
            </div>

            {(dealer.address || dealer.city) && (
              <div className="flex items-start gap-2 text-sm text-muted-foreground mb-1.5">
                <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                <span>
                  {dealer.address}
                  {dealer.address && dealer.city ? ", " : ""}
                  {dealer.city}
                </span>
              </div>
            )}

            {dealer.phone && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={formatTelHref(dealer.phone)}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-foreground transition-colors"
                >
                  {dealer.phone}
                </a>
              </div>
            )}

            {dealer.email && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
                <Mail className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={`mailto:${dealer.email}`}
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-foreground transition-colors"
                >
                  {dealer.email}
                </a>
              </div>
            )}

            {dealer.website && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <ExternalLink className="h-3.5 w-3.5 shrink-0" />
                <a
                  href={dealer.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:text-foreground transition-colors truncate"
                >
                  {dealer.website}
                </a>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

"use client";

import type { StridonLocation } from "@/constants/contact";
import Container from "@brand/shared/components/container";
import IconBox from "@brand/shared/components/icon-box";
import { cn } from "@brand/shared/lib/utils";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";

// Leaflet touches `window` on import, so the map can only load in the browser.
const LocationMap = dynamic(
  () => import("@brand/shared/components/contact/location-map"),
  { ssr: false },
);

interface LocationCardsProps {
  locations: StridonLocation[];
  className?: string;
}

// Same card as the dck site (shared `ContactLocations`): rounded tile, map on
// top, icon box next to the details. Kept app-local so the tel: links can use
// the E.164 number instead of the printed one.
const LocationCards = ({ locations, className }: LocationCardsProps) => {
  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-6",
        locations.length > 1 && "md:grid-cols-2",
        className,
      )}
    >
      {locations.map((location, index) => (
        <Container key={location.id} delay={index * 0.5}>
          <div className="relative overflow-hidden rounded-2xl border border-border/50">
            {/* `isolate` keeps the leaflet panes from painting over the header. */}
            <div className="isolate aspect-[16/10] w-full">
              <LocationMap
                lat={location.coords.lat}
                lng={location.coords.lng}
                name={location.name}
              />
            </div>

            <span className="absolute right-3 top-3 z-10 inline-block rounded-full bg-primary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground shadow-md">
              {location.role}
            </span>

            <div className="relative flex items-start gap-4 p-3 sm:p-5">
              <IconBox
                icon={MapPin}
                color="text-primary"
                bg="bg-primary/10"
                border="border-primary/20"
                size="sm"
                className="shrink-0"
              />

              <div className="min-w-0 flex-1">
                <h3 className="font-semibold">{location.name}</h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {location.address}, {location.city}
                </p>

                <a
                  href={`tel:${location.phoneHref}`}
                  className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Phone className="size-3.5 shrink-0" />
                  {location.phone}
                </a>

                <a
                  href={`mailto:${location.email}`}
                  className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-primary"
                >
                  <Mail className="size-3.5 shrink-0" />
                  {location.email}
                </a>

                <a
                  href={`https://maps.google.com/?q=${location.coords.lat},${location.coords.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-primary"
                >
                  <ExternalLink className="size-3 shrink-0" />
                  Otvori u Google Maps
                </a>
              </div>
            </div>
          </div>
        </Container>
      ))}
    </div>
  );
};

export default LocationCards;

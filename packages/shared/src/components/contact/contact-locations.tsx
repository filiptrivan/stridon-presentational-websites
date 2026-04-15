"use client";

import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import dynamic from "next/dynamic";
import Container from "../container";
import IconBox from "../icon-box";
import SectionHeader from "../section-header";
import Section from "../section";
import Wrapper from "../wrapper";
import type { ContactLocation } from "@brand/shared/types/contact";

const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

interface ContactLocationsProps {
  title?: string;
  description?: string;
  locations: ContactLocation[];
  sectionClassName?: string;
  showDivider?: boolean;
}

function ContactLocations({
  title,
  description,
  locations,
  sectionClassName,
  showDivider,
}: ContactLocationsProps) {
  return (
    <Section className={sectionClassName} showDivider={showDivider}>
      <Wrapper>
        {title && (
          <Container delay={0.1}>
            <SectionHeader
              title={title}
              description={description}
              align="center"
              descriptionClassName="max-w-lg"
              className="mb-10"
            />
          </Container>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {locations.map((location, index) => (
            <Container key={location.name} delay={0.2 + index * 0.1}>
              <div className="relative rounded-2xl border border-border/50 overflow-hidden">
                <div className="aspect-[16/10] w-full isolate">
                  <LocationMap
                    lat={location.coords.lat}
                    lng={location.coords.lng}
                    name={location.name}
                  />
                </div>
                {location.badge && (
                  <span className="absolute top-3 right-3 z-10 inline-block text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full bg-primary text-primary-foreground shadow-md">
                    {location.badge}
                  </span>
                )}

                <div className="relative p-3 sm:p-5 flex items-center gap-4">
                  <IconBox
                    icon={MapPin}
                    color="text-primary"
                    bg="bg-primary/10"
                    border="border-primary/20"
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold">{location.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {location.address}
                    </p>
                    {location.phone && (
                      <a
                        href={`tel:${location.phone.replace(/-/g, "")}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors mt-1 flex items-center gap-1.5"
                      >
                        <Phone className="size-3.5 shrink-0" />
                        {location.phone}
                      </a>
                    )}
                    {location.email && (
                      <a
                        href={`mailto:${location.email}`}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors mt-1 flex items-center gap-1.5"
                      >
                        <Mail className="size-3.5 shrink-0" />
                        {location.email}
                      </a>
                    )}
                    <a
                      href={`https://maps.google.com/?q=${location.coords.lat},${location.coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 mt-1"
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
      </Wrapper>
    </Section>
  );
}

export default ContactLocations;

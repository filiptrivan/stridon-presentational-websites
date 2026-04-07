"use client";

import { ExternalLink, MapPin } from "lucide-react";
import dynamic from "next/dynamic";
import Container from "../container";
import IconBox from "../icon-box";
import SectionHeader from "../section-header";
import Section from "../section";
import Wrapper from "../wrapper";
import type { ContactLocation } from "./contact-hero";

const LocationMap = dynamic(() => import("./location-map"), { ssr: false });

interface ContactLocationsProps {
  locations: ContactLocation[];
}

function ContactLocations({ locations }: ContactLocationsProps) {
  return (
    <Section className="pt-0!">
      <Wrapper>
        <Container delay={0.1}>
          <SectionHeader
            title="Naše prodavnice"
            description="Poseti nas na jednoj od dve lokacije u Beogradu"
            align="center"
            descriptionClassName="max-w-lg"
            className="mb-10"
          />
        </Container>

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
                    <a
                      href={`https://maps.google.com/?q=${location.coords.lat},${location.coords.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1 mt-1"
                    >
                      Otvori u Google Maps
                      <ExternalLink className="size-3" />
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

import { formatTelHref } from "@brand/shared/lib/utils";
import { type ContactFormData } from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";
import { type LucideIcon, Clock, Mail, Phone } from "lucide-react";
import { type ReactNode } from "react";
import Container from "../container";
import HeroHeader from "../hero-header";
import ContactForm from "./contact-form";

export interface ContactPhone {
  label: string;
  number: string;
}

export interface ContactHour {
  days: string;
  time: string;
}

export interface ContactLocation {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
}

export interface ContactInfo {
  email: string;
  phones: ContactPhone[];
  hours: ContactHour[];
  locations: ContactLocation[];
}

interface ContactHeroProps {
  contactInfo: ContactInfo;
  submitContact: (
    data: ContactFormData,
    turnstileToken: string,
  ) => Promise<ActionResult>;
}

function ContactCard({
  icon: Icon,
  title,
  children,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center p-5 rounded-2xl border border-border/50 relative overflow-hidden">
      <Icon className="size-50 text-primary absolute -right-11 -top-11 opacity-10 -z-10" />
      <h3 className="text-lg font-semibold">{title}</h3>
      {children}
    </div>
  );
}

function ContactHero({ contactInfo, submitContact }: ContactHeroProps) {
  return (
    <HeroHeader
      title="Javi nam se"
      description="Imaš pitanje o našim alatima, treba ti pomoć da nađeš pravi proizvod, ili želiš da postaneš diler? Rado ćemo ti pomoći."
    >
      <Container
        delay={0.3}
        className="flex flex-col sm:flex-row gap-16 sm:gap-5 w-full mt-12"
      >
        <ContactForm submitContact={submitContact} />
        <div className="flex flex-col gap-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <ContactCard icon={Phone} title="Telefoni">
              <ul className="mt-2 space-y-1 text-center">
                {contactInfo.phones.map((phone) => (
                  <li key={phone.number}>
                    <span className="text-xs">{phone.label}</span>
                    <br />
                    <a
                      href={formatTelHref(phone.number)}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {phone.number}
                    </a>
                  </li>
                ))}
              </ul>
            </ContactCard>

            <ContactCard icon={Clock} title="Radno vreme">
              <ul className="mt-2 space-y-1 text-center">
                {contactInfo.hours.map((slot) => (
                  <li key={slot.days}>
                    <span className="text-xs">{slot.days}</span>
                    <br />
                    <span className="text-sm text-muted-foreground">
                      {slot.time}
                    </span>
                  </li>
                ))}
              </ul>
            </ContactCard>
          </div>

          <ContactCard icon={Mail} title="E-mail">
            <a
              href={`mailto:${contactInfo.email}`}
              className="text-sm text-muted-foreground mt-1 hover:text-primary transition-colors"
            >
              {contactInfo.email}
            </a>
          </ContactCard>
        </div>
      </Container>
    </HeroHeader>
  );
}

export default ContactHero;

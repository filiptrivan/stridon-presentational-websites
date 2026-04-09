import { type ContactFormData } from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";
import { Mail } from "lucide-react";
import Container from "../container";
import HeroHeader from "../hero-header";
import ContactForm from "./contact-form";

interface ContactHeroProps {
  email: string;
  submitContact: (
    data: ContactFormData,
    turnstileToken: string,
  ) => Promise<ActionResult>;
}

function ContactHero({ email, submitContact }: ContactHeroProps) {
  return (
    <HeroHeader
      title="Javi nam se"
      description="Imaš pitanje o našim alatima, treba ti pomoć da nađeš pravi proizvod, ili želiš da postaneš diler? Rado ćemo ti pomoći."
    >
      <div className="w-full mt-12 max-w-3xl mx-auto">
        <Container delay={0.3}>
          <ContactForm submitContact={submitContact} />
        </Container>
        <Container delay={0.4} className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Ili nam piši direktno na{" "}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              <Mail className="size-3.5" />
              {email}
            </a>
          </p>
        </Container>
      </div>
    </HeroHeader>
  );
}

export default ContactHero;

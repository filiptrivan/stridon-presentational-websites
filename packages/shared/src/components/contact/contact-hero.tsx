import {
  type ContactFormData,
  type ContactErrorMessages,
} from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";
import Container from "../container";
import HeroHeader from "../hero-header";
import ContactForm, { type ContactFormLabels } from "./contact-form";

const DEFAULT_LABELS = {
  title: "Javi nam se",
  description:
    "Imaš pitanje o našim alatima, treba ti pomoć da nađeš pravi proizvod, ili želiš da postaneš diler? Rado ćemo ti pomoći.",
  directMail: "Ili nam piši direktno na",
};

export type ContactHeroLabels = Partial<typeof DEFAULT_LABELS>;

interface ContactHeroProps {
  email: string;
  submitContact: (data: ContactFormData) => Promise<ActionResult>;
  labels?: ContactHeroLabels;
  formLabels?: ContactFormLabels;
  formErrors?: ContactErrorMessages;
}

function ContactHero({
  email,
  submitContact,
  labels,
  formLabels,
  formErrors,
}: ContactHeroProps) {
  const t = { ...DEFAULT_LABELS, ...labels };

  return (
    <HeroHeader title={t.title} description={t.description}>
      <div className="w-full mt-12 max-w-3xl mx-auto">
        <Container delay={0.3}>
          <ContactForm
            submitContact={submitContact}
            labels={formLabels}
            errorMessages={formErrors}
          />
        </Container>
        <Container delay={0.4} className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {t.directMail}{" "}
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-1 text-foreground hover:text-primary transition-colors"
            >
              {email}
            </a>
          </p>
        </Container>
      </div>
    </HeroHeader>
  );
}

export default ContactHero;

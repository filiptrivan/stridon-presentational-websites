import { getBrandConfig } from "@brand/config";
import ContactHero, {
  type ContactHeroLabels,
} from "@brand/shared/components/contact/contact-hero";
import type { ContactFormLabels } from "@brand/shared/components/contact/contact-form";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import type {
  ContactFormData,
  ContactErrorMessages,
} from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";

const brand = getBrandConfig();

export const metadata = createPageMetadata({
  title: "Kontakt",
  description: brand.contactDescription,
  canonicalUrl: "/kontakt",
});

type ContactPageProps = {
  email: string;
  submitContact: (data: ContactFormData) => Promise<ActionResult>;
  labels?: ContactHeroLabels;
  formLabels?: ContactFormLabels;
  formErrors?: ContactErrorMessages;
};

const ContactPage = ({
  email,
  submitContact,
  labels,
  formLabels,
  formErrors,
}: ContactPageProps) => {
  return (
    <div>
      <ContactHero
        email={email}
        submitContact={submitContact}
        labels={labels}
        formLabels={formLabels}
        formErrors={formErrors}
      />
    </div>
  );
};

export default ContactPage;

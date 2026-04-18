import { getBrandConfig } from "@brand/config";
import ContactHero from "@brand/shared/components/contact/contact-hero";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import type { ContactFormData } from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";

const brand = getBrandConfig();

export const metadata = createPageMetadata({
  title: "Kontakt",
  description: brand.contactDescription,
  canonicalUrl: "/kontakt",
});

type ContactPageProps = {
  email: string;
  submitContact: (
    data: ContactFormData,
    turnstileToken: string,
  ) => Promise<ActionResult>;
};

const ContactPage = ({ email, submitContact }: ContactPageProps) => {
  return (
    <div>
      <ContactHero email={email} submitContact={submitContact} />
    </div>
  );
};

export default ContactPage;

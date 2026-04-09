import { CONTACT_INFO } from "@/constants";
import CTA from "@/components/cta";
import ContactHero from "@brand/shared/components/contact/contact-hero";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { sendContactEmail } from "./actions";

export const metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktiraj DCK Srbija — pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",
  canonicalUrl: "/kontakt",
});

const ContactPage = () => {
  return (
    <div>
      <ContactHero
        contactInfo={CONTACT_INFO}
        submitContact={sendContactEmail}
      />
      <CTA />
    </div>
  );
};

export default ContactPage;

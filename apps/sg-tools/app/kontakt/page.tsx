import { CONTACT_EMAIL } from "@/constants";
import ContactHero from "@brand/shared/components/contact/contact-hero";
import { createPageMetadata } from "@brand/shared/lib/metadata";
import { sendContactEmail } from "./actions";

export const metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktiraj SG Tools - pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",
  canonicalUrl: "/kontakt",
});

const ContactPage = () => {
  return (
    <div>
      <ContactHero email={CONTACT_EMAIL} submitContact={sendContactEmail} />
    </div>
  );
};

export default ContactPage;

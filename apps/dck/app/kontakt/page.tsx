import ContactHero from "@brand/shared/components/contact/contact-hero";
import ContactLocations from "@brand/shared/components/contact/contact-locations";
import CTA from "@brand/shared/components/cta";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktiraj DCK Srbija — pitanja o alatima, pomoć pri izboru proizvoda ili saradnja. Tu smo da pomognemo.",
  canonicalUrl: "/kontakt",
});

const ContactPage = () => {
  return (
    <div>
      <ContactHero />
      <ContactLocations />
      <CTA />
    </div>
  );
};

export default ContactPage;

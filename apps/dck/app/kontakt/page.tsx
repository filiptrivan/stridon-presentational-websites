import ContactPage from "@brand/shared/components/contact-page";
import { sendContactEmail } from "@brand/shared/lib/actions/contact";
import { CONTACT_EMAIL } from "@/constants";

export { metadata } from "@brand/shared/components/contact-page";

export default function Page() {
  return <ContactPage email={CONTACT_EMAIL} submitContact={sendContactEmail} />;
}

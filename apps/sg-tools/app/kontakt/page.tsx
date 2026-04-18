import ContactPage from "@brand/shared/components/contact-page";
import { CONTACT_EMAIL } from "@/constants";
import { sendContactEmail } from "./actions";

export { metadata } from "@brand/shared/components/contact-page";

export default function Page() {
  return <ContactPage email={CONTACT_EMAIL} submitContact={sendContactEmail} />;
}

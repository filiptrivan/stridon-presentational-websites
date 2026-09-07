import PageHeader from "@/components/page-header";
import { CONTACT_EMAIL } from "@/constants";
import ContactForm from "@brand/shared/components/contact/contact-form";
import Container from "@brand/shared/components/container";
import Wrapper from "@brand/shared/components/wrapper";
import { sendContactEmail } from "@brand/shared/lib/actions/contact";
import { createPageMetadata } from "@brand/shared/lib/metadata";

export const metadata = createPageMetadata({
  title: "Kontakt",
  description:
    "Kontaktiraj Stridon tim za veleprodaju, tehničku podršku, servis ili saradnju. Tu smo da pomognemo.",
  canonicalUrl: "/kontakt",
});

const KontaktPage = () => {
  return (
    <div>
      <PageHeader
        title="Kontakt"
        lede="Imaš pitanje o našim alatima, treba ti pomoć da nađeš pravi proizvod, ili želiš da postaneš diler? Rado ćemo ti pomoći."
      />

      <section className="border-b border-border">
        <Wrapper className="py-14 lg:py-20">
          <Container>
            <h2 className="text-2xl font-semibold tracking-tight lg:text-3xl">
              Javi nam se
            </h2>
            <p className="mt-3 max-w-xl text-muted-foreground">
              Ostavi nam mejl i poruku, a mi ćemo odgovoriti u najkraćem roku.
            </p>
          </Container>

          <Container delay={0.3} className="mt-8 max-w-3xl">
            <ContactForm submitContact={sendContactEmail} />

            <p className="mt-6 text-sm text-muted-foreground">
              Ili nam piši direktno na{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-foreground transition-colors hover:text-primary"
              >
                {CONTACT_EMAIL}
              </a>
            </p>
          </Container>
        </Wrapper>
      </section>
    </div>
  );
};

export default KontaktPage;

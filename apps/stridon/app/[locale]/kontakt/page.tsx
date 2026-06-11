import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import ContactForm from "@/components/contact-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPinIcon, MailIcon, PhoneIcon } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt | Stridon Group",
  description: "Kontaktirajte Stridon Group — veleprodaja, B2B saradnja i opšti upiti.",
};

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("description")} />

      <Wrapper className="pb-20">
        <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
          {/* Contact info */}
          <Container animation="fadeLeft" delay={0.1}>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MapPinIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Lokacije</p>
                  <p className="text-muted-foreground text-sm mt-1">Vojislava Ilića 141g, Beograd</p>
                  <p className="text-muted-foreground text-sm">Ugrinovačka 212 (Altina), Beograd</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <MailIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:office@stridon.rs" className="text-muted-foreground text-sm hover:text-foreground transition-colors mt-1 block">
                    office@stridon.rs
                  </a>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <PhoneIcon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Telefon</p>
                  <a href="tel:+38111000000" className="text-muted-foreground text-sm hover:text-foreground transition-colors mt-1 block">
                    +381 11 000 0000
                  </a>
                </div>
              </div>
            </div>
          </Container>

          {/* Contact form */}
          <Container animation="fadeRight" delay={0.15}>
            <div className="rounded-xl border border-border/60 bg-card p-6">
              <ContactForm />
            </div>
          </Container>
        </div>
      </Wrapper>
    </div>
  );
}

import HeroHeader from "@brand/shared/components/hero-header";
import Wrapper from "@brand/shared/components/wrapper";
import Container from "@brand/shared/components/container";
import ContactForm from "@/components/contact-form";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { MapPinIcon } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });
  return {
    title: `${t("title")} | Stridon Group`,
    description: t("description"),
  };
}

const LOCATIONS = [
  {
    name: "Vojislava Ilića 141g",
    phone: "011/2886-509",
    phoneHref: "tel:0112886509",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d90567.5103257972!2d20.365943012636272!3d44.81678309583739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a7163a682044d%3A0x2a07a073e49f36ae!2sStridon%20group!5e0!3m2!1sen!2snl!4v1682522248790!5m2!1sen!2snl",
    mapTitle: "Stridon Group — Vojislava Ilića 141g",
  },
  {
    name: "Altina — Ugrinovačka 212",
    phone: "011/210-0230",
    phoneHref: "tel:0112100230",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2828.7173437038164!2d20.369132715536885!3d44.847689379098426!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x475a65d974f60c15%3A0xf5fe55315fa62f57!2sprodavnicaalata.rs!5e0!3m2!1sen!2srs!4v1690217663792!5m2!1sen!2srs",
    mapTitle: "Stridon Group — Altina, Ugrinovačka 212",
  },
];

export default async function KontaktPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("Contact");

  return (
    <div>
      <HeroHeader title={t("title")} description={t("description")} />

      <Wrapper className="pb-20">
        {/* Contact form */}
        <Container animation="fadeUp" delay={0.1}>
          <div className="mb-16 max-w-2xl">
            <h2 className="font-semibold mb-1">{t("formTitle")}</h2>
            <p className="text-sm text-muted-foreground mb-6">{t("formDescription")}</p>
            <ContactForm />
          </div>
        </Container>

        {/* Maps */}
        <div className="space-y-12">
          {LOCATIONS.map((loc, index) => (
            <Container key={loc.name} animation="fadeUp" delay={0.1 * index}>
              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <MapPinIcon className="size-5 text-primary shrink-0" />
                    <h2 className="text-lg font-semibold">{loc.name}</h2>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>
                      <span className="font-medium text-foreground">{t("emailLabel")}:</span>{" "}
                      <a href="mailto:office@stridon.rs" className="hover:text-primary transition-colors">
                        office@stridon.rs
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t("phoneLabel")}:</span>{" "}
                      <a href={loc.phoneHref} className="hover:text-primary transition-colors">
                        {loc.phone}
                      </a>
                    </p>
                    <p>
                      <span className="font-medium text-foreground">{t("locationLabel")}:</span> {loc.name}, Beograd
                    </p>
                  </div>
                </div>

                <div className="w-full h-64 rounded-xl overflow-hidden border border-border/60">
                  <iframe
                    src={loc.mapSrc}
                    title={loc.mapTitle}
                    loading="lazy"
                    width="100%"
                    height="100%"
                    className="w-full h-full"
                  />
                </div>
              </div>
            </Container>
          ))}
        </div>
      </Wrapper>
    </div>
  );
}

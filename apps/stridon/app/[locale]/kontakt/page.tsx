import { CONTACT_EMAIL } from "@/constants";
import { createLocalizedMetadata } from "@/lib/metadata";
import type { Locale } from "@brand/i18n/config";
import ContactPage from "@brand/shared/components/contact-page";
import { sendLocalizedContactEmail } from "@/lib/actions/contact";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

// The shared page exports a static `metadata` with a hardcoded Serbian title and
// a `/kontakt` canonical, which would make the English page point at the
// Serbian one. Built here instead; the page body is still the shared one.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact.meta" });

  return createLocalizedMetadata({
    locale: locale as Locale,
    href: "/kontakt",
    title: t("title"),
    description: t("description"),
  });
}

export default async function Page({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Contact" });

  return (
    <ContactPage
      email={CONTACT_EMAIL}
      // Bound so the shared client form still calls a one-argument action; the
      // action cannot read the locale itself inside a Server Action.
      submitContact={sendLocalizedContactEmail.bind(null, locale as Locale)}
      labels={{
        title: t("hero.title"),
        description: t("hero.description"),
        directMail: t("directMail"),
      }}
      formLabels={{
        emailLabel: t("form.emailLabel"),
        emailPlaceholder: t("form.emailPlaceholder"),
        messageLabel: t("form.messageLabel"),
        messagePlaceholder: t("form.messagePlaceholder"),
        submit: t("form.submit"),
        submitting: t("form.submitting"),
        success: t("form.success"),
      }}
      formErrors={{
        emailRequired: t("form.errors.emailRequired"),
        emailInvalid: t("form.errors.emailInvalid"),
        messageRequired: t("form.errors.messageRequired"),
        messageMin: t("form.errors.messageMin"),
        messageMax: t("form.errors.messageMax"),
      }}
    />
  );
}

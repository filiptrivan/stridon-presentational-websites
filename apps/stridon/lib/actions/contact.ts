"use server";

import { isLocale, type Locale } from "@brand/i18n/config";
import { sendContactEmail } from "@brand/shared/lib/actions/contact";
import type { ContactFormData } from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";
import { getTranslations } from "next-intl/server";

/**
 * The shared contact action with its error strings translated.
 *
 * The locale comes first so the page can `.bind(null, locale)` and hand the
 * client form the single-argument action it expects. It is an argument at all
 * because `next/root-params` does not work inside a Server Action - an action
 * is not tied to a route - and anything the client sends is untrusted, so it is
 * checked against the locale list rather than passed through.
 */
export async function sendLocalizedContactEmail(
  locale: Locale,
  data: ContactFormData,
): Promise<ActionResult> {
  const safeLocale = isLocale(locale) ? locale : "sr";
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "Contact.form.errors",
  });

  return sendContactEmail(data, {
    invalid: t("invalid"),
    unavailable: t("unavailable"),
    send: t("send"),
  });
}

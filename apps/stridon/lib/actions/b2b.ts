"use server";

import {
  createB2bRequestSchema,
  type B2bRequestData,
} from "@/lib/schemas/b2b";
import { getBrandConfig } from "@brand/config";
import { isLocale, type Locale } from "@brand/i18n/config";
import { reportError } from "@brand/shared/lib/report-error";
import type { ActionResult } from "@brand/shared/types/actions";
import { getTranslations } from "next-intl/server";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Kept app-local rather than folded into the shared contact action: this one
// mails a structured company record with its own subject, and no other brand
// has a B2B form. There is no PACMS endpoint for dealer applications yet.
//
// The locale is an argument rather than something this function reads, because
// `next/root-params` does not work inside a Server Action and is not planned to:
// an action is not tied to a route, so it has no root params to read. Anything
// the caller sends is untrusted, so it is checked against the locale list and
// falls back rather than being passed through.
export async function sendB2bRequest(
  data: B2bRequestData,
  locale: Locale,
): Promise<ActionResult> {
  const safeLocale = isLocale(locale) ? locale : "sr";
  const t = await getTranslations({
    locale: safeLocale,
    namespace: "B2b.form.errors",
  });

  const parsed = createB2bRequestSchema((key) => t(key)).safeParse(data);
  if (!parsed.success) {
    return { success: false, error: t("invalid") };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), {
      source: "sendB2bRequest",
    });
    return { success: false, error: t("unavailable") };
  }

  const { emailSender, emailRecipient } = getBrandConfig();
  const request = parsed.data;

  // The email goes to office@stridon.rs, so it stays Serbian whichever language
  // the visitor filled the form in.
  const rows: [string, string][] = [
    ["Ime i prezime", `${request.firstName} ${request.lastName}`],
    ["E-mail", request.email],
    ["Kontakt telefon", request.contactPhone],
    ["Naziv firme", request.companyName],
    ["Adresa firme", request.companyAddress],
    ["PIB", request.pib],
    ["Matični broj", request.companyRegistrationNumber],
  ];

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: emailSender,
        to: [emailRecipient],
        replyTo: { email: request.email },
        subject: `Zahtev za B2B pristup - ${request.companyName}`,
        htmlContent: `
          <h2>Nov zahtev za B2B pristup sa stridon.rs</h2>
          ${rows
            .map(
              ([label, value]) =>
                `<p><strong>${label}:</strong> ${escapeHtml(value)}</p>`,
            )
            .join("")}
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      reportError(new Error(`Brevo API error: ${response.status}`), {
        source: "sendB2bRequest",
        details: body,
      });
      return { success: false, error: t("send") };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "sendB2bRequest" });
    return { success: false, error: t("send") };
  }
}

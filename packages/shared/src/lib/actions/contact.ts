"use server";

import { getBrandConfig } from "@brand/config";
import { reportError } from "@brand/shared/lib/report-error";
import { THIRD_PARTY_BUDGET_MS } from "@brand/shared/lib/request-budget";
import {
  contactSchema,
  type ContactFormData,
} from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";

/** What the visitor is shown when something goes wrong. Serbian by default,
    which is what dck and sg-tools have always rendered. */
export type ContactActionErrors = {
  invalid: string;
  unavailable: string;
  send: string;
};

const DEFAULT_ERRORS: ContactActionErrors = {
  invalid: "Podaci nisu ispravni. Proveri unos.",
  unavailable: "Slanje poruke trenutno nije moguće. Pokušaj ponovo kasnije.",
  send: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
};

export async function sendContactEmail(
  data: ContactFormData,
  errors: ContactActionErrors = DEFAULT_ERRORS,
): Promise<ActionResult> {
  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: errors.invalid };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), {
      source: "sendContactEmail",
    });
    return { success: false, error: errors.unavailable };
  }

  // Sender / recipient / subject / heading are the only per-brand bits; they live
  // in brand-config (resolved from NEXT_PUBLIC_BRAND_SLUG), so one action serves
  // every brand instead of a hand-copied file per app.
  const { emailSender, emailRecipient, emailSubject, emailHeading } =
    getBrandConfig();

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      signal: AbortSignal.timeout(THIRD_PARTY_BUDGET_MS),
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: emailSender,
        to: [emailRecipient],
        replyTo: { email: parsed.data.email },
        subject: emailSubject,
        htmlContent: `
          <h2>${emailHeading}</h2>
          <p><strong>E-mail:</strong> ${parsed.data.email}</p>
          <p><strong>Poruka:</strong></p>
          <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      reportError(new Error(`Brevo API error: ${response.status}`), {
        source: "sendContactEmail",
        details: body,
      });
      return { success: false, error: errors.send };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "sendContactEmail" });
    return { success: false, error: errors.send };
  }
}

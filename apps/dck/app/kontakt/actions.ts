"use server";

import { reportError } from "@brand/shared/lib/report-error";
import {
  contactSchema,
  type ContactFormData,
} from "@brand/shared/lib/schemas/contact";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";
import type { ActionResult } from "@brand/shared/types/actions";

export async function sendContactEmail(
  data: ContactFormData,
  turnstileToken: string,
): Promise<ActionResult> {
  const isValidToken = await validateTurnstileToken(turnstileToken);
  if (!isValidToken) {
    return { success: false, error: TURNSTILE_VERIFICATION_FAILED };
  }

  const parsed = contactSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Podaci nisu ispravni. Proveri unos." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), {
      source: "sendContactEmail",
    });
    return {
      success: false,
      error: "Slanje poruke trenutno nije moguće. Pokušaj ponovo kasnije.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        sender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
        to: [{ email: "aleksatrivan@gmail.com", name: "DCK Srbija" }],
        replyTo: { email: parsed.data.email },
        subject: "DCK Srbija - Kontakt forma",
        htmlContent: `
          <h2>Nova poruka sa dcksrbija.rs</h2>
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
      return {
        success: false,
        error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
      };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "sendContactEmail" });
    return {
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    };
  }
}

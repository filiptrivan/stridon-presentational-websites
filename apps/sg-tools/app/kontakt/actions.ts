"use server";

import { contactSchema, type ContactFormData } from "@brand/shared/lib/schemas/contact";
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
    console.error("BREVO_API_KEY is not set");
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
        sender: { name: "SG Tools", email: "noreply@sgtools.rs" },
        to: [{ email: "aleksatrivan@gmail.com", name: "SG Tools" }],
        replyTo: { email: parsed.data.email },
        subject: "SG Tools — Contact Form",
        htmlContent: `
          <h2>Nova poruka sa sgtools.rs</h2>
          <p><strong>E-mail:</strong> ${parsed.data.email}</p>
          <p><strong>Poruka:</strong></p>
          <p>${parsed.data.message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error("Brevo API error:", response.status, body);
      return {
        success: false,
        error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Failed to send contact email:", error);
    return {
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    };
  }
}

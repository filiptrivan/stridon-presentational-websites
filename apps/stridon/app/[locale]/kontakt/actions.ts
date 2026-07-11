"use server";

import { getBrandConfig } from "@brand/config";
import { reportError } from "@brand/shared/lib/report-error";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const turnstileToken = formData.get("turnstile") as string;
  const isValidToken = await validateTurnstileToken(turnstileToken);
  if (!isValidToken) {
    return { success: false, error: TURNSTILE_VERIFICATION_FAILED };
  }

  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!name || !email || !message) {
    return { success: false, error: "Molimo popunite sva obavezna polja." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Unesi ispravnu e-mail adresu." };
  }
  if (message.length < 10) {
    return { success: false, error: "Poruka mora imati bar 10 karaktera." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), { source: "submitContactForm" });
    return { success: false, error: "Slanje poruke trenutno nije moguće. Pokušaj ponovo kasnije." };
  }

  const { emailSender, emailRecipient, emailSubject, emailHeading } = getBrandConfig();

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
        replyTo: { email, name },
        subject: emailSubject,
        htmlContent: `
          <h2>${emailHeading}</h2>
          <p><strong>Ime:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          <p><strong>Poruka:</strong></p>
          <p>${message.replace(/\n/g, "<br>")}</p>
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      reportError(new Error(`Brevo API error: ${response.status}`), {
        source: "submitContactForm",
        details: body,
      });
      return { success: false, error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije." };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "submitContactForm" });
    return { success: false, error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije." };
  }
}

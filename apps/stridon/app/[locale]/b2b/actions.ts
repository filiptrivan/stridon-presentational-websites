"use server";

import { getBrandConfig } from "@brand/config";
import { reportError } from "@brand/shared/lib/report-error";

export type B2BFormState = {
  success: boolean;
  error?: string;
};

export async function submitB2BForm(
  _prevState: B2BFormState,
  formData: FormData,
): Promise<B2BFormState> {
  const company = (formData.get("company") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const email = (formData.get("email") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const message = (formData.get("message") as string)?.trim();

  if (!company || !name || !email) {
    return { success: false, error: "Molimo popunite sva obavezna polja." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, error: "Unesi ispravnu e-mail adresu." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), { source: "submitB2BForm" });
    return { success: false, error: "Slanje poruke trenutno nije moguće. Pokušaj ponovo kasnije." };
  }

  const { emailSender, emailRecipient } = getBrandConfig();

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
        subject: "Stridon Group — B2B upit",
        htmlContent: `
          <h2>Nov B2B upit sa stridon.rs</h2>
          <p><strong>Firma:</strong> ${company}</p>
          <p><strong>Ime:</strong> ${name}</p>
          <p><strong>E-mail:</strong> ${email}</p>
          ${phone ? `<p><strong>Telefon:</strong> ${phone}</p>` : ""}
          ${message ? `<p><strong>Poruka:</strong></p><p>${message.replace(/\n/g, "<br>")}</p>` : ""}
        `,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      reportError(new Error(`Brevo API error: ${response.status}`), {
        source: "submitB2BForm",
        details: body,
      });
      return { success: false, error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije." };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "submitB2BForm" });
    return { success: false, error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije." };
  }
}

"use server";

import { b2bRequestSchema, type B2bRequestData } from "@/lib/schemas/b2b";
import { getBrandConfig } from "@brand/config";
import { reportError } from "@brand/shared/lib/report-error";
import type { ActionResult } from "@brand/shared/types/actions";

const SEND_FAILED_ERROR =
  "Slanje zahteva nije uspelo. Pokušaj ponovo kasnije.";

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Kept app-local rather than folded into the shared contact action: this one
// mails a structured company record with its own subject, and no other brand
// has a B2B form. There is no PACMS endpoint for dealer applications yet.
export async function sendB2bRequest(
  data: B2bRequestData,
): Promise<ActionResult> {
  const parsed = b2bRequestSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Podaci nisu ispravni. Proveri unos." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), {
      source: "sendB2bRequest",
    });
    return {
      success: false,
      error: "Slanje zahteva trenutno nije moguće. Pokušaj ponovo kasnije.",
    };
  }

  const { emailSender, emailRecipient } = getBrandConfig();
  const request = parsed.data;

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
      return { success: false, error: SEND_FAILED_ERROR };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "sendB2bRequest" });
    return { success: false, error: SEND_FAILED_ERROR };
  }
}

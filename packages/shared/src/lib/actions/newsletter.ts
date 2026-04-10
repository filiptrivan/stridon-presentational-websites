"use server";

import { reportError } from "@brand/shared/lib/report-error";
import { newsletterSchema } from "@brand/shared/lib/schemas/newsletter";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";
import type { ActionResult } from "@brand/shared/types/actions";

export async function subscribeNewsletter(
  data: { email: string },
  turnstileToken: string,
): Promise<ActionResult> {
  const isValidToken = await validateTurnstileToken(turnstileToken);
  if (!isValidToken) {
    return { success: false, error: TURNSTILE_VERIFICATION_FAILED };
  }

  const parsed = newsletterSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Unesi ispravnu e-mail adresu." };
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    reportError(new Error("BREVO_API_KEY is not set"), {
      source: "subscribeNewsletter",
    });
    return {
      success: false,
      error: "Prijava trenutno nije moguća. Pokušaj ponovo kasnije.",
    };
  }

  const listId = process.env.BREVO_NEWSLETTER_LIST_ID;
  const listIdNum = Number(listId);
  if (!listId || !Number.isInteger(listIdNum) || listIdNum <= 0) {
    reportError(
      new Error(`BREVO_NEWSLETTER_LIST_ID is invalid: "${listId}"`),
      { source: "subscribeNewsletter" },
    );
    return {
      success: false,
      error: "Prijava trenutno nije moguća. Pokušaj ponovo kasnije.",
    };
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": apiKey,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        email: parsed.data.email,
        listIds: [listIdNum],
        updateEnabled: true,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      reportError(new Error(`Brevo API error: ${response.status}`), {
        source: "subscribeNewsletter",
        details: body,
      });
      return {
        success: false,
        error: "Prijava nije uspela. Pokušaj ponovo kasnije.",
      };
    }

    return { success: true };
  } catch (error) {
    reportError(error, { source: "subscribeNewsletter" });
    return {
      success: false,
      error: "Prijava nije uspela. Pokušaj ponovo kasnije.",
    };
  }
}

"use server";

// Server-side Turnstile token verification.
// Docs: https://developers.cloudflare.com/turnstile/get-started/server-side-validation/

import { reportError } from "./report-error";

export async function validateTurnstileToken(token: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY;

  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      reportError(new Error("Missing TURNSTILE_SECRET_KEY in production"), { source: "validateTurnstileToken" });
      return false;
    }
    return true; // dev bypass when key not configured
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token }),
    },
  );

  const result = await response.json();
  return result.success === true;
}

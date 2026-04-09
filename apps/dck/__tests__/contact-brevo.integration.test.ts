import { describe, expect, it } from "vitest";

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const BREVO_URL = "https://api.brevo.com/v3/smtp/email";

const payload = {
  sender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
  to: [{ email: "filiptrivan5@gmail.com", name: "Test" }],
  replyTo: { email: "test@example.com" },
  subject: "[TEST] DCK Srbija — Kontakt forma",
  htmlContent: `
    <h2>[Automated Test] Nova poruka sa dcksrbija.rs</h2>
    <p><strong>E-mail:</strong> test@example.com</p>
    <p><strong>Poruka:</strong></p>
    <p>This is an automated test email from the DCK contact form test suite.</p>
  `,
};

describe.skipIf(!BREVO_API_KEY)("Brevo Integration — DCK", () => {
  it("sends email successfully with valid API key", async () => {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": BREVO_API_KEY!,
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    expect(response.status).toBe(201);
  });

  it("fails with invalid API key", async () => {
    const response = await fetch(BREVO_URL, {
      method: "POST",
      headers: {
        accept: "application/json",
        "api-key": "invalid-key-12345",
        "content-type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    expect(response.ok).toBe(false);
  });
});

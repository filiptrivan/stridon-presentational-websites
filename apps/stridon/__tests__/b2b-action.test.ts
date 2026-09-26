import { beforeEach, describe, expect, it, vi } from "vitest";

// The one server action here that is not a wrapper around a shared one: what
// it sends to Brevo, that what the visitor typed is escaped in the HTML body,
// and which language its errors come back in. fetch is stubbed, so nothing is
// ever mailed, whatever .env.local holds.
vi.mock("@brand/shared/lib/report-error", () => ({ reportError: vi.fn() }));

// Reads the real catalogs, so the test fails if an error key the action asks
// for is missing from either language.
vi.mock("next-intl/server", async () => {
  const catalogs = {
    sr: (await import("../messages/sr.json")).default,
    en: (await import("../messages/en.json")).default,
  };
  return {
    getTranslations: vi.fn(
      async ({ locale, namespace }: { locale: "sr" | "en"; namespace: string }) => {
        const node = namespace
          .split(".")
          .reduce<Record<string, unknown>>(
            (tree, key) => tree[key] as Record<string, unknown>,
            catalogs[locale],
          );
        return (key: string) => node[key];
      },
    ),
  };
});

import { sendB2bRequest } from "@/lib/actions/b2b";
import type { Locale } from "@brand/i18n/config";
import { reportError } from "@brand/shared/lib/report-error";
import en from "../messages/en.json";
import sr from "../messages/sr.json";

const mockFetch = vi.fn();

const validData = {
  firstName: "Petar",
  lastName: "Petrović",
  email: "petar@example.com",
  contactPhone: "0641234567",
  companyName: "Alati DOO",
  companyAddress: "Glavna 1, Novi Sad",
  pib: "123456789",
  companyRegistrationNumber: "12345678",
};

const invalidData = { ...validData, pib: "12" };

function sentBody() {
  return JSON.parse(mockFetch.mock.calls[0][1].body);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("BREVO_API_KEY", "test-api-key");
  vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", "stridon");

  mockFetch.mockResolvedValue({
    ok: true,
    status: 201,
    text: () => Promise.resolve(""),
  });
});

describe("sendB2bRequest", () => {
  it("mails the company record to the Stridon office", async () => {
    expect(await sendB2bRequest(validData, "sr")).toEqual({ success: true });

    const body = sentBody();
    expect(body.to).toEqual([
      { name: "Stridon Group", email: "office@stridon.rs" },
    ]);
    expect(body.replyTo).toEqual({ email: "petar@example.com" });
    expect(body.subject).toBe("Zahtev za B2B pristup - Alati DOO");
    expect(body.htmlContent).toContain("<strong>PIB:</strong> 123456789");
    expect(body.htmlContent).toContain(
      "<strong>Matični broj:</strong> 12345678",
    );
  });

  it("escapes what the visitor typed in the HTML body", async () => {
    await sendB2bRequest(
      { ...validData, companyName: '<a href="x">Firma</a> & Co' },
      "sr",
    );

    const html = sentBody().htmlContent;
    expect(html).toContain(
      "&lt;a href=&quot;x&quot;&gt;Firma&lt;/a&gt; &amp; Co",
    );
    expect(html).not.toContain('<a href="x">');
  });

  it("rejects invalid data without calling Brevo", async () => {
    expect(await sendB2bRequest(invalidData, "sr")).toEqual({
      success: false,
      error: sr.B2b.form.errors.invalid,
    });
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("answers in English on /en", async () => {
    expect(await sendB2bRequest(invalidData, "en")).toEqual({
      success: false,
      error: en.B2b.form.errors.invalid,
    });
  });

  it("falls back to Serbian for a locale that is not one of ours", async () => {
    // The locale is bound on the page but arrives through a Server Action,
    // so the client can send anything.
    expect(await sendB2bRequest(invalidData, "../../etc" as Locale)).toEqual({
      success: false,
      error: sr.B2b.form.errors.invalid,
    });
  });

  it("reports a missing Brevo key instead of sending", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    expect(await sendB2bRequest(validData, "sr")).toEqual({
      success: false,
      error: sr.B2b.form.errors.unavailable,
    });
    expect(reportError).toHaveBeenCalledTimes(1);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("reports a Brevo error", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      status: 400,
      text: () => Promise.resolve("bad request"),
    });

    expect(await sendB2bRequest(validData, "sr")).toEqual({
      success: false,
      error: sr.B2b.form.errors.send,
    });
    expect(reportError).toHaveBeenCalledTimes(1);
  });
});

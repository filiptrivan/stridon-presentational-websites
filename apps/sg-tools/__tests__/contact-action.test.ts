import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("@brand/shared/lib/report-error", () => ({
  reportError: vi.fn(),
}));

vi.mock("@brand/shared/lib/turnstile-server", () => ({
  validateTurnstileToken: vi.fn(),
}));

import { sendContactEmail } from "../app/kontakt/actions";
import { reportError } from "@brand/shared/lib/report-error";
import { validateTurnstileToken } from "@brand/shared/lib/turnstile-server";

const mockedValidateToken = vi.mocked(validateTurnstileToken);
const mockFetch = vi.fn();

const validData = {
  email: "user@example.com",
  message: "Hello, this is a valid test message",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("BREVO_API_KEY", "test-api-key");

  mockedValidateToken.mockResolvedValue(true);
  mockFetch.mockResolvedValue({
    ok: true,
    status: 201,
    text: () => Promise.resolve(""),
  });
});

describe("sendContactEmail — SG Tools", () => {
  it("returns success on happy path", async () => {
    const result = await sendContactEmail(validData, "valid-token");
    expect(result).toEqual({ success: true });
  });

  it("returns error when Turnstile verification fails", async () => {
    mockedValidateToken.mockResolvedValue(false);

    const result = await sendContactEmail(validData, "bad-token");
    expect(result).toEqual({
      success: false,
      error: expect.stringContaining("Verifikacija nije uspela"),
    });
  });

  it("returns error when form data is invalid", async () => {
    const result = await sendContactEmail(
      { email: "", message: "" },
      "valid-token",
    );
    expect(result).toEqual({
      success: false,
      error: "Podaci nisu ispravni. Proveri unos.",
    });
  });

  it("returns error and reports when BREVO_API_KEY is missing", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    const result = await sendContactEmail(validData, "valid-token");
    expect(result).toEqual({
      success: false,
      error: "Slanje poruke trenutno nije moguće. Pokušaj ponovo kasnije.",
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when Brevo returns non-OK", async () => {
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve("Internal Server Error"),
    });

    const result = await sendContactEmail(validData, "valid-token");
    expect(result).toEqual({
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await sendContactEmail(validData, "valid-token");
    expect(result).toEqual({
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("sends correct payload to Brevo", async () => {
    await sendContactEmail(validData, "valid-token");

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options.method).toBe("POST");
    expect(options.headers["api-key"]).toBe("test-api-key");
    expect(options.headers["content-type"]).toBe("application/json");

    const body = JSON.parse(options.body);
    expect(body.sender).toEqual({
      name: "SG Tools",
      email: "noreply@sgtools.rs",
    });
    expect(body.to).toEqual([
      { email: "aleksatrivan@gmail.com", name: "SG Tools" },
    ]);
    expect(body.replyTo).toEqual({ email: validData.email });
    expect(body.subject).toBe("SG Tools — Contact Form");
    expect(body.htmlContent).toContain("Nova poruka sa sgtools.rs");
    expect(body.htmlContent).toContain(validData.email);
    expect(body.htmlContent).toContain(validData.message);
  });
});

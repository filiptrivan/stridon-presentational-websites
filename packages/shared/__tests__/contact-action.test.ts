import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../src/lib/report-error", () => ({ reportError: vi.fn() }));

import { sendContactEmail } from "../src/lib/actions/contact";
import { reportError } from "../src/lib/report-error";

// One test for the action all three sites share, run once per brand. It used to
// be three copies, one per app, that differed only in the brand values below.
//
// The expected values are literals, not read from brand-config: a copied value
// would make the payload test agree with whatever brand-config says, a typo
// included. `getBrandConfig()` reads NEXT_PUBLIC_BRAND_SLUG on every call, so
// stubbing it per test is enough to switch brands.
const BRANDS = [
  {
    slug: "dck",
    sender: { name: "DCK Srbija", email: "noreply@dcksrbija.rs" },
    to: { email: "aleksa.trivan@stridon.rs", name: "DCK Srbija" },
    subject: "DCK Srbija - Kontakt forma",
    heading: "Nova poruka sa dcksrbija.rs",
  },
  {
    slug: "sg-tools",
    sender: { name: "SG TOOLS", email: "noreply@sgtools.rs" },
    to: { email: "aleksa.trivan@stridon.rs", name: "SG TOOLS" },
    subject: "SG TOOLS - Contact Form",
    heading: "Nova poruka sa sgtools.rs",
  },
  {
    slug: "stridon",
    sender: { name: "Stridon Group", email: "noreply@stridon.rs" },
    to: { email: "office@stridon.rs", name: "Stridon Group" },
    subject: "Stridon Group - kontakt forma",
    heading: "Nova poruka sa stridon.rs",
  },
] as const;

const mockFetch = vi.fn();

const validData = {
  email: "user@example.com",
  message: "Hello, this is a valid test message",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal("fetch", mockFetch);
  vi.stubEnv("BREVO_API_KEY", "test-api-key");

  mockFetch.mockResolvedValue({
    ok: true,
    status: 201,
    text: () => Promise.resolve(""),
  });
});

describe.each(BRANDS)("sendContactEmail - $slug", (brand) => {
  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", brand.slug);
  });

  it("returns success on happy path", async () => {
    const result = await sendContactEmail(validData);
    expect(result).toEqual({ success: true });
  });

  it("returns error when form data is invalid", async () => {
    const result = await sendContactEmail({ email: "", message: "" });
    expect(result).toEqual({
      success: false,
      error: "Podaci nisu ispravni. Proveri unos.",
    });
  });

  it("returns error and reports when BREVO_API_KEY is missing", async () => {
    vi.stubEnv("BREVO_API_KEY", "");

    const result = await sendContactEmail(validData);
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

    const result = await sendContactEmail(validData);
    expect(result).toEqual({
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("returns error and reports when fetch throws", async () => {
    mockFetch.mockRejectedValue(new Error("Network error"));

    const result = await sendContactEmail(validData);
    expect(result).toEqual({
      success: false,
      error: "Slanje poruke nije uspelo. Pokušaj ponovo kasnije.",
    });
    expect(reportError).toHaveBeenCalled();
  });

  it("sends the brand's payload to Brevo", async () => {
    await sendContactEmail(validData);

    expect(mockFetch).toHaveBeenCalledOnce();
    const [url, options] = mockFetch.mock.calls[0];

    expect(url).toBe("https://api.brevo.com/v3/smtp/email");
    expect(options.method).toBe("POST");
    expect(options.headers["api-key"]).toBe("test-api-key");
    expect(options.headers["content-type"]).toBe("application/json");

    const body = JSON.parse(options.body);
    expect(body.sender).toEqual(brand.sender);
    expect(body.to).toEqual([brand.to]);
    expect(body.replyTo).toEqual({ email: validData.email });
    expect(body.subject).toBe(brand.subject);
    expect(body.htmlContent).toContain(brand.heading);
    expect(body.htmlContent).toContain(validData.email);
    expect(body.htmlContent).toContain(validData.message);
  });
});

// Brand-independent: the optional second argument that lets a site show its
// own language instead of the Serbian defaults.
describe("sendContactEmail - errors argument", () => {
  const errors = {
    invalid: "The details are not valid.",
    unavailable: "Sending is unavailable right now.",
    send: "The message could not be sent.",
  };

  beforeEach(() => {
    vi.stubEnv("NEXT_PUBLIC_BRAND_SLUG", "stridon");
  });

  it("returns the caller's text for each failure", async () => {
    expect(await sendContactEmail({ email: "", message: "" }, errors)).toEqual({
      success: false,
      error: errors.invalid,
    });

    vi.stubEnv("BREVO_API_KEY", "");
    expect(await sendContactEmail(validData, errors)).toEqual({
      success: false,
      error: errors.unavailable,
    });

    vi.stubEnv("BREVO_API_KEY", "test-api-key");
    mockFetch.mockRejectedValue(new Error("Network error"));
    expect(await sendContactEmail(validData, errors)).toEqual({
      success: false,
      error: errors.send,
    });
  });
});

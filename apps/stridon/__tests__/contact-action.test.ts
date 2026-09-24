import { beforeEach, describe, expect, it, vi } from "vitest";

// The shared action is tested once for every brand in packages/shared. What is
// stridon's own is this wrapper: which language its error strings come from,
// and that a locale sent by the client is checked rather than trusted.
vi.mock("@brand/shared/lib/actions/contact", () => ({
  sendContactEmail: vi.fn(async () => ({ success: true })),
}));

// Reads the real catalogs, so the test fails if the keys the wrapper asks for
// are missing from either language.
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

import { sendLocalizedContactEmail } from "@/lib/actions/contact";
import type { Locale } from "@brand/i18n/config";
import { sendContactEmail } from "@brand/shared/lib/actions/contact";
import { getTranslations } from "next-intl/server";
import en from "../messages/en.json";
import sr from "../messages/sr.json";

const data = { email: "user@example.com", message: "Hello, this is a message" };

beforeEach(() => {
  vi.clearAllMocks();
});

describe("sendLocalizedContactEmail", () => {
  it("passes the English error strings on /en", async () => {
    await sendLocalizedContactEmail("en", data);

    const { invalid, unavailable, send } = en.Contact.form.errors;
    expect(sendContactEmail).toHaveBeenCalledWith(data, {
      invalid,
      unavailable,
      send,
    });
  });

  it("passes the Serbian error strings on Serbian pages", async () => {
    await sendLocalizedContactEmail("sr", data);

    const { invalid, unavailable, send } = sr.Contact.form.errors;
    expect(sendContactEmail).toHaveBeenCalledWith(data, {
      invalid,
      unavailable,
      send,
    });
  });

  it("falls back to Serbian for a locale that is not one of ours", async () => {
    // The locale is bound on the page but arrives through a Server Action,
    // so the client can send anything.
    await sendLocalizedContactEmail("../../etc" as Locale, data);

    expect(getTranslations).toHaveBeenCalledWith({
      locale: "sr",
      namespace: "Contact.form.errors",
    });
  });

  it("returns what the shared action returns", async () => {
    vi.mocked(sendContactEmail).mockResolvedValueOnce({
      success: false,
      error: "x",
    });

    expect(await sendLocalizedContactEmail("sr", data)).toEqual({
      success: false,
      error: "x",
    });
  });
});

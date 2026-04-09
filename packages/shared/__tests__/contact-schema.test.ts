import { describe, expect, it } from "vitest";
import { contactSchema } from "../src/lib/schemas/contact";

describe("Contact Schema Validation", () => {
  const validData = {
    email: "user@example.com",
    message: "Hello, this is a valid test message",
  };

  it("accepts valid data", () => {
    const result = contactSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("rejects empty email", () => {
    const result = contactSchema.safeParse({ ...validData, email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Unesi svoju e-mail adresu");
    }
  });

  it("rejects invalid email format", () => {
    const result = contactSchema.safeParse({
      ...validData,
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Unesi ispravnu e-mail adresu");
    }
  });

  it("rejects empty message", () => {
    const result = contactSchema.safeParse({ ...validData, message: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Unesi svoju poruku");
    }
  });

  it("rejects message shorter than 10 characters", () => {
    const result = contactSchema.safeParse({ ...validData, message: "Short" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Poruka mora imati bar 10 karaktera");
    }
  });

  it("rejects message longer than 2000 characters", () => {
    const result = contactSchema.safeParse({
      ...validData,
      message: "a".repeat(2001),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Poruka može imati najviše 2000 karaktera");
    }
  });

  it("accepts message at exactly 10 characters", () => {
    const result = contactSchema.safeParse({
      ...validData,
      message: "a".repeat(10),
    });
    expect(result.success).toBe(true);
  });

  it("accepts message at exactly 2000 characters", () => {
    const result = contactSchema.safeParse({
      ...validData,
      message: "a".repeat(2000),
    });
    expect(result.success).toBe(true);
  });
});

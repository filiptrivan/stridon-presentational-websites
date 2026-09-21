import { z } from "zod";

const DEFAULT_ERRORS = {
  emailRequired: "Unesi svoju e-mail adresu",
  emailInvalid: "Unesi ispravnu e-mail adresu",
  messageRequired: "Unesi svoju poruku",
  messageMin: "Poruka mora imati bar 10 karaktera",
  messageMax: "Poruka može imati najviše 2000 karaktera",
};

/**
 * A plain object rather than a lookup function on purpose: these messages are
 * handed to `ContactForm`, which is a client component, and a function cannot
 * cross that boundary.
 */
export type ContactErrorMessages = Partial<typeof DEFAULT_ERRORS>;

/**
 * A factory as well as a ready-made schema, because every message in here is
 * rendered under a field and therefore has to be in the visitor's language.
 * The single-language sites keep importing `contactSchema` and see no change.
 */
export function createContactSchema(errors?: ContactErrorMessages) {
  const t = { ...DEFAULT_ERRORS, ...errors };

  return z.object({
    email: z.string().min(1, t.emailRequired).email(t.emailInvalid),
    message: z
      .string()
      .min(1, t.messageRequired)
      .min(10, t.messageMin)
      .max(2000, t.messageMax),
  });
}

export const contactSchema = createContactSchema();

export type ContactFormData = z.infer<ReturnType<typeof createContactSchema>>;

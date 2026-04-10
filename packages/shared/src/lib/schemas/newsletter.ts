import { z } from "zod";

export const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, "Unesi svoju e-mail adresu")
    .email("Unesi ispravnu e-mail adresu"),
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

import { z } from "zod";

export const contactSchema = z.object({
  email: z
    .string()
    .min(1, "Unesi svoju e-mail adresu")
    .email("Unesi ispravnu e-mail adresu"),
  message: z
    .string()
    .min(1, "Unesi svoju poruku")
    .min(10, "Poruka mora imati bar 10 karaktera")
    .max(2000, "Poruka može imati najviše 2000 karaktera"),
});

export type ContactFormData = z.infer<typeof contactSchema>;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { contactSchema, type ContactFormData } from "@brand/shared/lib/schemas/contact";
import type { ActionResult } from "@brand/shared/types/actions";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";

const DEFAULT_LABELS = {
  emailLabel: "E-mail",
  emailPlaceholder: "petar@primer.rs",
  messageLabel: "Kako možemo da ti pomognemo?",
  messagePlaceholder: "Reci nam šta ti treba...",
  submit: "Pošalji poruku",
  submitting: "Šalje se...",
  success: "Poruka je uspešno poslata!",
};

export type ContactFormLabels = Partial<typeof DEFAULT_LABELS>;

interface ContactFormProps {
  submitContact: (data: ContactFormData) => Promise<ActionResult>;
  labels?: ContactFormLabels;
}

const ContactForm = ({ submitContact, labels }: ContactFormProps) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", message: "" },
  });

  const onSubmit = async (data: ContactFormData) => {
    const result = await submitContact(data);

    if (result.success) {
      toast.success(t.success);
      reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      <div className="space-y-3">
        <Label htmlFor="email">{t.emailLabel}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t.emailPlaceholder}
          className="border-border/50"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="message">{t.messageLabel}</Label>
        <Textarea
          id="message"
          placeholder={t.messagePlaceholder}
          className="min-h-[150px] border-border/50 resize-none"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t.submitting}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t.submit}
          </>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;

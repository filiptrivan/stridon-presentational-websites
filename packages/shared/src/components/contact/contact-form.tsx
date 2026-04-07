"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { contactSchema, type ContactFormData } from "@brand/shared/lib/schemas/contact";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import type { ActionResult } from "@brand/shared/types/actions";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";

interface ContactFormProps {
  submitContact: (
    data: ContactFormData,
    turnstileToken: string,
  ) => Promise<ActionResult>;
}

const ContactForm = ({ submitContact }: ContactFormProps) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: { email: "", message: "" },
  });

  const {
    token: turnstileToken,
    reset: resetTurnstile,
    widget: turnstileWidget,
  } = useTurnstile();

  const onSubmit = async (data: ContactFormData) => {
    if (!turnstileToken) {
      toast.error(TURNSTILE_VERIFICATION_FAILED);
      return;
    }

    const result = await submitContact(data, turnstileToken);

    resetTurnstile();

    if (result.success) {
      toast.success("Poruka je uspešno poslata!");
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
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="petar@primer.rs"
          className="border-border/50"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label htmlFor="message">Kako možemo da ti pomognemo?</Label>
        <Textarea
          id="message"
          placeholder="Reci nam šta ti treba..."
          className="min-h-[150px] border-border/50 resize-none"
          aria-invalid={!!errors.message}
          {...register("message")}
        />
        {errors.message && (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        )}
      </div>

      {turnstileWidget}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Šalje se...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Pošalji poruku
          </>
        )}
      </Button>
    </form>
  );
};

export default ContactForm;

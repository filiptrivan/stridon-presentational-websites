"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { subscribeNewsletter } from "@brand/shared/lib/actions/newsletter";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@brand/shared/lib/schemas/newsletter";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";

const NewsletterForm = () => {
  const [activated, setActivated] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const {
    token: turnstileToken,
    reset: resetTurnstile,
    widget: turnstileWidget,
  } = useTurnstile();

  const onSubmit = async (data: NewsletterFormData) => {
    if (!turnstileToken) {
      toast.error(TURNSTILE_VERIFICATION_FAILED);
      return;
    }

    const result = await subscribeNewsletter(data, turnstileToken);

    resetTurnstile();

    if (result.success) {
      toast.success("Uspešno si se prijavio/la na newsletter!");
      reset();
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col sm:flex-row gap-2"
      >
        <Input
          id="newsletter-email"
          type="email"
          placeholder="tvoj@email.com"
          className="border-border/50"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          {...register("email", {
            onBlur: () => setActivated(true),
          })}
          onFocus={() => setActivated(true)}
        />
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Prijavljuje se...
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              Prijavi se
            </>
          )}
        </Button>
      </form>
      {errors.email && (
        <p id="newsletter-email-error" className="mt-2 text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
      {activated && turnstileWidget}
    </div>
  );
};

export default NewsletterForm;

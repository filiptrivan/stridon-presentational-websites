"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { subscribeNewsletter } from "@brand/shared/lib/actions/newsletter";
import {
  newsletterSchema,
  type NewsletterFormData,
} from "@brand/shared/lib/schemas/newsletter";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";

const DEFAULT_LABELS = {
  placeholder: "tvoj@email.com",
  submit: "Prijavi se",
  submitting: "Prijavljuje se...",
  success: "Uspešno si se prijavio/la na newsletter!",
};

export type NewsletterFormLabels = Partial<typeof DEFAULT_LABELS>;

const NewsletterForm = ({ labels }: { labels?: NewsletterFormLabels }) => {
  const t = { ...DEFAULT_LABELS, ...labels };
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onSubmit = async (data: NewsletterFormData) => {
    const result = await subscribeNewsletter(data);

    if (result.success) {
      toast.success(t.success);
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
          placeholder={t.placeholder}
          className="border-border/50"
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "newsletter-email-error" : undefined}
          {...register("email")}
        />
        <Button type="submit" disabled={isSubmitting} className="shrink-0">
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t.submitting}
            </>
          ) : (
            <>
              <Mail className="mr-2 h-4 w-4" />
              {t.submit}
            </>
          )}
        </Button>
      </form>
      {errors.email && (
        <p id="newsletter-email-error" className="mt-2 text-sm text-destructive">
          {errors.email.message}
        </p>
      )}
    </div>
  );
};

export default NewsletterForm;

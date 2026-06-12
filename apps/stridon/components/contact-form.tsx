"use client";

import { useActionState } from "react";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { useTranslations } from "next-intl";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/kontakt/actions";

const initialState: ContactFormState = { success: false };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, initialState);
  const { token: turnstileToken, widget: turnstileWidget } = useTurnstile();
  const t = useTranslations("Contact");

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">{t("successTitle")}</p>
        <p className="text-sm text-muted-foreground">{t("successDescription")}</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="turnstile" value={turnstileToken ?? ""} />

      <div className="space-y-1.5">
        <Label htmlFor="name">{t("name")}</Label>
        <Input id="name" name="name" placeholder={t("namePlaceholder")} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")}</Label>
        <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("messagePlaceholder")}
          className="min-h-[130px] resize-none"
          required
        />
      </div>

      {turnstileWidget}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending || !turnstileToken}>
        {isPending ? (
          <><Loader2 className="size-4 animate-spin" /> {t("sending")}</>
        ) : (
          <><Send className="size-4" /> {t("send")}</>
        )}
      </Button>
    </form>
  );
}

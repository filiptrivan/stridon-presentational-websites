"use client";

import { useActionState } from "react";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { useTranslations } from "next-intl";
import { submitB2BForm, type B2BFormState } from "@/app/[locale]/b2b/actions";

const initialState: B2BFormState = { success: false };

export default function B2BForm() {
  const [state, action, isPending] = useActionState(submitB2BForm, initialState);
  const { token: turnstileToken, widget: turnstileWidget } = useTurnstile();
  const t = useTranslations("B2B");

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
        <Label htmlFor="company">{t("company")} <span className="text-destructive">*</span></Label>
        <Input id="company" name="company" placeholder={t("companyPlaceholder")} required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">{t("name")} <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" placeholder={t("namePlaceholder")} required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input id="phone" name="phone" type="tel" placeholder={t("phonePlaceholder")} />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">{t("email")} <span className="text-destructive">*</span></Label>
        <Input id="email" name="email" type="email" placeholder={t("emailPlaceholder")} required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">{t("message")}</Label>
        <Textarea
          id="message"
          name="message"
          placeholder={t("messagePlaceholder")}
          className="min-h-[110px] resize-none"
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

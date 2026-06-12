"use client";

import { useActionState } from "react";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { submitB2BForm, type B2BFormState } from "@/app/[locale]/b2b/actions";

const initialState: B2BFormState = { success: false };

export default function B2BForm() {
  const [state, action, isPending] = useActionState(submitB2BForm, initialState);
  const { token: turnstileToken, widget: turnstileWidget } = useTurnstile();

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Upit je poslat!</p>
        <p className="text-sm text-muted-foreground">Naš tim će te kontaktirati u najkraćem roku.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="turnstile" value={turnstileToken ?? ""} />

      <div className="space-y-1.5">
        <Label htmlFor="company">Naziv firme <span className="text-destructive">*</span></Label>
        <Input id="company" name="company" placeholder="Firma d.o.o." required />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name">Kontakt osoba <span className="text-destructive">*</span></Label>
          <Input id="name" name="name" placeholder="Petar Petrović" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" placeholder="+381 60 000 0000" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail <span className="text-destructive">*</span></Label>
        <Input id="email" name="email" type="email" placeholder="petar@firma.rs" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Poruka (opciono)</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Opišite šta vas zanima — brendovi, količine, uslovi saradnje..."
          className="min-h-[110px] resize-none"
        />
      </div>

      {turnstileWidget}

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending || !turnstileToken}>
        {isPending ? (
          <><Loader2 className="size-4 animate-spin" /> Šalje se...</>
        ) : (
          <><Send className="size-4" /> Pošalji upit</>
        )}
      </Button>
    </form>
  );
}

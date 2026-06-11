"use client";

import { useActionState } from "react";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { Textarea } from "@brand/ui/textarea";
import { Loader2, Send, CheckCircle2 } from "lucide-react";
import { submitContactForm, type ContactFormState } from "@/app/[locale]/kontakt/actions";

const initialState: ContactFormState = { success: false };

export default function ContactForm() {
  const [state, action, isPending] = useActionState(submitContactForm, initialState);

  if (state.success) {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <CheckCircle2 className="size-10 text-primary" />
        <p className="font-medium">Poruka je poslata!</p>
        <p className="text-sm text-muted-foreground">Javićemo ti se u najkraćem roku.</p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Ime i prezime</Label>
        <Input id="name" name="name" placeholder="Petar Petrović" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input id="email" name="email" type="email" placeholder="petar@primer.rs" required />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Poruka</Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Kako možemo da ti pomognemo?"
          className="min-h-[130px] resize-none"
          required
        />
      </div>

      {state.error && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? (
          <><Loader2 className="size-4 animate-spin" /> Šalje se...</>
        ) : (
          <><Send className="size-4" /> Pošalji poruku</>
        )}
      </Button>
    </form>
  );
}

"use client";

import { sendB2bRequest } from "@/app/b2b/actions";
import { b2bRequestSchema, type B2bRequestData } from "@/lib/schemas/b2b";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const FIELDS = [
  { name: "firstName", label: "Ime", placeholder: "Petar" },
  { name: "lastName", label: "Prezime", placeholder: "Petrović" },
  {
    name: "email",
    label: "E-mail",
    placeholder: "petar@primer.rs",
    type: "email",
  },
  {
    name: "contactPhone",
    label: "Kontakt telefon",
    placeholder: "060 123 4567",
    type: "tel",
  },
  { name: "companyName", label: "Naziv firme", placeholder: "Primer d.o.o." },
  {
    name: "companyAddress",
    label: "Adresa firme",
    placeholder: "Vojislava Ilića 141g, Beograd",
  },
  {
    name: "pib",
    label: "PIB firme",
    placeholder: "123456789",
    inputMode: "numeric" as const,
  },
  {
    name: "companyRegistrationNumber",
    label: "Matični broj firme",
    placeholder: "12345678",
    inputMode: "numeric" as const,
  },
] satisfies {
  name: keyof B2bRequestData;
  label: string;
  placeholder: string;
  type?: string;
  inputMode?: "numeric";
}[];

const B2bForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<B2bRequestData>({
    resolver: zodResolver(b2bRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      contactPhone: "",
      companyName: "",
      companyAddress: "",
      pib: "",
      companyRegistrationNumber: "",
    },
  });

  const onSubmit = async (data: B2bRequestData) => {
    const result = await sendB2bRequest(data);

    if (result.success) {
      toast.success(
        "Zahtev je poslat. Naša podrška će te kontaktirati u najkraćem roku.",
      );
      reset();
      return;
    }

    toast.error(result.error);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl w-full space-y-6"
    >
      {FIELDS.map((field) => (
        <div key={field.name} className="space-y-3">
          <Label htmlFor={field.name}>{field.label}</Label>
          <Input
            id={field.name}
            type={field.type ?? "text"}
            inputMode={field.inputMode}
            placeholder={field.placeholder}
            className="border-border/50"
            aria-invalid={!!errors[field.name]}
            {...register(field.name)}
          />
          {errors[field.name] && (
            <p className="text-sm text-destructive">
              {errors[field.name]?.message}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Šalje se...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            Pošalji zahtev
          </>
        )}
      </Button>
    </form>
  );
};

export default B2bForm;

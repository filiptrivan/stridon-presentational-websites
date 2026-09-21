"use client";

import { sendB2bRequest } from "@/lib/actions/b2b";
import {
  B2B_FIELDS,
  createB2bRequestSchema,
  type B2bRequestData,
} from "@/lib/schemas/b2b";
import type { Locale } from "@brand/i18n/config";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const B2bForm = ({ locale }: { locale: Locale }) => {
  const t = useTranslations("B2b.form");
  // Rebuilt only when the language changes; a new schema object on every render
  // would reset the resolver and with it the validation state.
  const schema = useMemo(
    () => createB2bRequestSchema((key) => t(`errors.${key}`)),
    [t],
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<B2bRequestData>({
    resolver: zodResolver(schema),
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
    // The action revalidates server-side and needs the locale explicitly:
    // `next/root-params` does not work inside a Server Action, permanently, so
    // it has no way of knowing which language to answer in.
    const result = await sendB2bRequest(data, locale);

    if (result.success) {
      toast.success(t("success"));
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
      {B2B_FIELDS.map((field) => (
        <div key={field.name} className="space-y-3">
          <Label htmlFor={field.name}>
            {t(`fields.${field.name}.label`)}
          </Label>
          <Input
            id={field.name}
            type={"type" in field ? field.type : "text"}
            inputMode={"inputMode" in field ? field.inputMode : undefined}
            placeholder={t(`fields.${field.name}.placeholder`)}
            className="border-border/50"
            // `aria-invalid` alone announces "invalid" without saying why:
            // the message below has to be pointed at to be read out.
            aria-describedby={
              errors[field.name] ? `${field.name}-error` : undefined
            }
            aria-invalid={!!errors[field.name]}
            {...register(field.name)}
          />
          {errors[field.name] && (
            <p id={`${field.name}-error`} className="text-sm text-destructive">
              {errors[field.name]?.message}
            </p>
          )}
        </div>
      ))}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("submitting")}
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            {t("submit")}
          </>
        )}
      </Button>
    </form>
  );
};

export default B2bForm;

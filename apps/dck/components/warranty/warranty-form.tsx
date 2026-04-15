"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { srLatn } from "date-fns/locale/sr-Latn";
import {
  Building2,
  CalendarIcon,
  Loader2,
  Send,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";

import { submitWarrantyRegistration } from "@/app/registracija-garancije/actions";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ProductAutocomplete } from "@/components/warranty/product-autocomplete";
import {
  ACCEPTED_FILE_TYPES,
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
  MAX_FILE_SIZE,
  RECEIPT_REQUIRED_ERROR,
  warrantySchema,
  type WarrantyFormData,
} from "@/lib/schemas/warranty";
import { useAutofillSync } from "@brand/shared/lib/hooks/useAutofillSync";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";

function downloadPdf(base64: string, fileName: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  const blob = new Blob([bytes], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

const WarrantyForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantySchema),
    mode: "onTouched",
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      product: undefined,
      serialNumber: "",
      purchaseDate: "",
      isCompanyOrder: false,
      companyPib: "",
    },
  });

  const isCompanyOrder = useWatch({ control, name: "isCompanyOrder" });
  const formRef = useAutofillSync(getValues, setValue);

  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    if (!file) {
      setFileName(null);
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError(FILE_TOO_LARGE_ERROR);
      e.target.value = "";
      setFileName(null);
      return;
    }
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError(FILE_TYPE_ERROR);
      e.target.value = "";
      setFileName(null);
      return;
    }
    setFileName(file.name);
  };

  const {
    token: turnstileToken,
    reset: resetTurnstile,
    widget: turnstileWidget,
  } = useTurnstile();

  const onSubmit = async (data: WarrantyFormData) => {
    if (!turnstileToken) {
      toast.error(TURNSTILE_VERIFICATION_FAILED);
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      setFileError(RECEIPT_REQUIRED_ERROR);
      return;
    }

    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("productSlug", data.product.slug);
    formData.append("serialNumber", data.serialNumber);
    formData.append("purchaseDate", data.purchaseDate);
    if (data.companyPib) {
      formData.append("companyPib", data.companyPib);
    }
    formData.append("turnstileToken", turnstileToken);
    formData.append("receiptImage", file);

    const result = await submitWarrantyRegistration(formData);

    resetTurnstile();

    if (result.success) {
      toast.success("Garancija je uspešno registrovana! PDF sertifikat se preuzima.");
      downloadPdf(result.pdfBase64, result.pdfFileName);
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      setFileName(null);
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form
      ref={formRef}
      onSubmit={(e) => handleSubmit(onSubmit)(e)}
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="firstName">Ime</Label>
          <Input
            id="firstName"
            placeholder="Petar"
            autoComplete="given-name"
            className="bg-background border-border/50"
            aria-invalid={!!errors.firstName}
            {...register("firstName")}
          />
          {errors.firstName && (
            <p className="text-sm text-destructive">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Prezime</Label>
          <Input
            id="lastName"
            placeholder="Petrović"
            autoComplete="family-name"
            className="bg-background border-border/50"
            aria-invalid={!!errors.lastName}
            {...register("lastName")}
          />
          {errors.lastName && (
            <p className="text-sm text-destructive">
              {errors.lastName.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="petar@primer.rs"
            autoComplete="email"
            className="bg-background border-border/50"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Broj telefona</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="065 123 4567"
            autoComplete="tel"
            className="bg-background border-border/50"
            aria-invalid={!!errors.phoneNumber}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>
      </div>

      <ProductAutocomplete control={control} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="serialNumber">Serijski broj alata</Label>
          <Input
            id="serialNumber"
            placeholder="Nalazi se na nalepnici alata"
            className="bg-background border-border/50"
            aria-invalid={!!errors.serialNumber}
            {...register("serialNumber")}
          />
          {errors.serialNumber && (
            <p className="text-sm text-destructive">
              {errors.serialNumber.message}
            </p>
          )}
        </div>

        <Controller
          name="purchaseDate"
          control={control}
          render={({ field }) => {
            const selectedDate = field.value
              ? new Date(field.value + "T00:00:00")
              : undefined;
            return (
              <div className="space-y-2">
                <Label id="purchaseDate-label">Datum kupovine</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      data-empty={!field.value}
                      className="w-full justify-start text-left font-normal bg-background border-border/50 data-[empty=true]:text-muted-foreground"
                      aria-invalid={!!errors.purchaseDate}
                      aria-labelledby="purchaseDate-label"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate
                        ? format(selectedDate, "PPP", { locale: srLatn })
                        : "Izaberi datum"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) =>
                        field.onChange(date ? format(date, "yyyy-MM-dd") : "")
                      }
                      disabled={(date) => date > new Date()}
                      locale={srLatn}
                    />
                  </PopoverContent>
                </Popover>
                {errors.purchaseDate && (
                  <p className="text-sm text-destructive">
                    {errors.purchaseDate.message}
                  </p>
                )}
              </div>
            );
          }}
        />
      </div>

      <div className="space-y-2">
        <Label id="receiptImage-label">Fotografija računa</Label>
        <input
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="sr-only"
          aria-labelledby="receiptImage-label"
          tabIndex={-1}
        />
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="bg-background border-border/50"
            onClick={() => fileInputRef.current?.click()}
            aria-invalid={!!fileError}
            aria-labelledby="receiptImage-label"
          >
            <Upload className="mr-2 h-4 w-4" />
            Izaberi fajl
          </Button>
          {fileName && (
            <span className="text-sm text-muted-foreground truncate">
              {fileName}
            </span>
          )}
        </div>
        {fileError && <p className="text-sm text-destructive">{fileError}</p>}
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP ili PDF - do 5MB
        </p>
      </div>

      {isCompanyOrder ? (
        <div className="space-y-3 rounded-lg border border-border/50 bg-background p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-sm font-medium">
              <Building2 className="size-3.5" />
              Registruješ kao firma
            </span>
            <button
              type="button"
              onClick={() => {
                setValue("isCompanyOrder", false);
                setValue("companyPib", "");
              }}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Otkaži registraciju kao firma"
            >
              <X className="size-4" />
            </button>
          </div>
          <div className="space-y-2">
            <Label htmlFor="companyPib">PIB</Label>
            <Input
              id="companyPib"
              placeholder="123456789"
              inputMode="numeric"
              maxLength={9}
              className="bg-background border-border/50"
              aria-invalid={!!errors.companyPib}
              {...register("companyPib")}
            />
            {errors.companyPib && (
              <p className="text-sm text-destructive">
                {errors.companyPib.message}
              </p>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setValue("isCompanyOrder", true)}
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Building2 className="size-3.5" />
          Registruješ kao firma?
        </button>
      )}

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
            Registruj garanciju
          </>
        )}
      </Button>
    </form>
  );
};

export default WarrantyForm;

"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { submitWarrantyRegistration } from "@/app/registracija-garancije/actions";
import { UNIQUE_DEALER_NAMES } from "@/constants/dealers";
import {
  warrantySchema,
  type WarrantyFormData,
  MAX_FILE_SIZE,
  ACCEPTED_FILE_TYPES,
  FILE_TOO_LARGE_ERROR,
  FILE_TYPE_ERROR,
} from "@/lib/schemas/warranty";
import { useTurnstile } from "@brand/shared/lib/hooks/useTurnstile";
import { TURNSTILE_VERIFICATION_FAILED } from "@brand/shared/lib/turnstile";
import { Button } from "@brand/ui/button";
import { Input } from "@brand/ui/input";
import { Label } from "@brand/ui/label";

const WarrantyForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<WarrantyFormData>({
    resolver: zodResolver(warrantySchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      productModel: "",
      serialNumber: "",
      purchaseDate: "",
      dealerName: "",
    },
  });

  const [fileError, setFileError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    setFileError(null);

    const file = fileInputRef.current?.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setFileError(FILE_TOO_LARGE_ERROR);
        return;
      }
      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        setFileError(FILE_TYPE_ERROR);
        return;
      }
    }

    const formData = new FormData();
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }
    formData.append("turnstileToken", turnstileToken);

    if (file) {
      formData.append("receiptImage", file);
    }

    const result = await submitWarrantyRegistration(formData);

    resetTurnstile();

    if (result.success) {
      toast.success("Garancija je uspešno registrovana!");
      reset();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } else {
      toast.error(result.error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-3xl mx-auto w-full space-y-6"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="firstName">Ime</Label>
          <Input
            id="firstName"
            placeholder="Petar"
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

        <div className="space-y-3">
          <Label htmlFor="lastName">Prezime</Label>
          <Input
            id="lastName"
            placeholder="Petrović"
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
        <div className="space-y-3">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="petar@primer.rs"
            className="bg-background border-border/50"
            aria-invalid={!!errors.email}
            {...register("email")}
          />
          {errors.email && (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="phoneNumber">Broj telefona</Label>
          <Input
            id="phoneNumber"
            type="tel"
            placeholder="065 123 4567"
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

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="productModel">Model proizvoda</Label>
          <Input
            id="productModel"
            placeholder="npr. DCJZ04-10"
            className="bg-background border-border/50"
            aria-invalid={!!errors.productModel}
            {...register("productModel")}
          />
          {errors.productModel && (
            <p className="text-sm text-destructive">
              {errors.productModel.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="serialNumber">Serijski broj</Label>
          <Input
            id="serialNumber"
            placeholder="Nalazi se na nalepnici proizvoda"
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
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label htmlFor="purchaseDate">Datum kupovine</Label>
          <Input
            id="purchaseDate"
            type="date"
            className="bg-background border-border/50"
            aria-invalid={!!errors.purchaseDate}
            {...register("purchaseDate")}
          />
          {errors.purchaseDate && (
            <p className="text-sm text-destructive">
              {errors.purchaseDate.message}
            </p>
          )}
        </div>

        <div className="space-y-3">
          <Label htmlFor="dealerName">Prodajno mesto</Label>
          <select
            id="dealerName"
            className="flex h-9 w-full min-w-0 rounded-md border border-border/50 bg-background px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 aria-invalid:border-destructive md:text-sm"
            aria-invalid={!!errors.dealerName}
            {...register("dealerName")}
          >
            <option value="">Izaberi prodajno mesto</option>
            {UNIQUE_DEALER_NAMES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          {errors.dealerName && (
            <p className="text-sm text-destructive">
              {errors.dealerName.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="receiptImage">
          Fotografija računa{" "}
          <span className="text-muted-foreground font-normal">(opciono)</span>
        </Label>
        <Input
          id="receiptImage"
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          className="bg-background border-border/50"
          ref={fileInputRef}
          aria-invalid={!!fileError}
        />
        {fileError && <p className="text-sm text-destructive">{fileError}</p>}
        <p className="text-xs text-muted-foreground">
          JPG, PNG, WebP ili PDF — do 5MB
        </p>
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
            Registruj garanciju
          </>
        )}
      </Button>
    </form>
  );
};

export default WarrantyForm;

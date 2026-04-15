"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Loader2, Pencil } from "lucide-react";

import type { ProductAutocompleteHit } from "@/app/api/products/search/route";
import type { WarrantyFormData } from "@/lib/schemas/warranty";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { Button } from "@brand/ui/button";
import { Label } from "@brand/ui/label";

const DEBOUNCE_MS = 250;

type Props = {
  control: Control<WarrantyFormData>;
};

export function ProductAutocomplete({ control }: Props) {
  return (
    <Controller
      name="product"
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          <Label id="product-label">Proizvod</Label>
          {field.value?.slug ? (
            <SelectedCard
              product={field.value}
              onClear={() => field.onChange(undefined)}
            />
          ) : (
            <ProductPicker
              onSelect={(hit) => field.onChange(hit)}
              invalid={!!fieldState.error}
            />
          )}
          {fieldState.error && (
            <p className="text-sm text-destructive">
              {fieldState.error.message}
            </p>
          )}
        </div>
      )}
    />
  );
}

function SelectedCard({
  product,
  onClear,
}: {
  product: NonNullable<WarrantyFormData["product"]>;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-md border border-border/50 bg-background p-3">
      {product.imageUrl ? (
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-sm bg-muted">
          <Image
            src={product.imageUrl}
            alt={product.title}
            fill
            sizes="64px"
            className="object-contain"
          />
        </div>
      ) : (
        <div className="h-16 w-16 shrink-0 rounded-sm bg-muted" />
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">{product.title}</p>
        {product.sku && (
          <p className="truncate text-xs text-muted-foreground">
            Šifra: {product.sku}
          </p>
        )}
      </div>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        <Pencil className="h-4 w-4" />
        <span className="hidden sm:inline">Promeni</span>
      </Button>
    </div>
  );
}

function ProductPicker({
  onSelect,
  invalid,
}: {
  onSelect: (hit: ProductAutocompleteHit) => void;
  invalid?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ProductAutocompleteHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      abortRef.current?.abort();
      setHits((prev) => (prev.length === 0 ? prev : []));
      setLoading(false);
      return;
    }

    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (controller.signal.aborted) return;
        if (!res.ok) {
          setHits([]);
          return;
        }
        const data = (await res.json()) as { hits: ProductAutocompleteHit[] };
        if (controller.signal.aborted) return;
        setHits(data.hits);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setHits([]);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query]);

  useEffect(() => () => abortRef.current?.abort(), []);

  return (
    <Combobox
      items={hits}
      filter={null}
      inputValue={query}
      onInputValueChange={setQuery}
      onValueChange={(hit: ProductAutocompleteHit | null) => {
        if (hit) onSelect(hit);
      }}
      itemToStringLabel={(hit: ProductAutocompleteHit) => hit.title}
      itemToStringValue={(hit: ProductAutocompleteHit) => hit.slug}
    >
      <ComboboxInput
        placeholder="Pretraži po nazivu ili šifri..."
        aria-invalid={invalid}
        aria-labelledby="product-label"
        showClear={query.length > 0}
        className="w-full"
      />
      <ComboboxContent>
        {loading && (
          <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Tražim...
          </div>
        )}
        {!loading && (
          <ComboboxEmpty>
            {query.trim().length === 0
              ? "Kucaj naziv ili šifru proizvoda."
              : "Nema rezultata."}
          </ComboboxEmpty>
        )}
        <ComboboxList>
          {(hit: ProductAutocompleteHit) => (
            <ComboboxItem key={hit.slug} value={hit} className="gap-3">
              {hit.imageUrl ? (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-sm bg-muted">
                  <Image
                    src={hit.imageUrl}
                    alt={hit.title}
                    fill
                    sizes="40px"
                    className="object-contain"
                  />
                </div>
              ) : (
                <div className="h-10 w-10 shrink-0 rounded-sm bg-muted" />
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">{hit.title}</p>
                {hit.sku && (
                  <p className="truncate text-xs text-muted-foreground">
                    {hit.sku}
                  </p>
                )}
              </div>
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}

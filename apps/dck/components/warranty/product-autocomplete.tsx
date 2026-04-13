"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Controller, type Control } from "react-hook-form";
import { Loader2, Pencil } from "lucide-react";

import type { ProductAutocompleteHit } from "@/app/api/products/search/route";
import type { WarrantyFormData } from "@/lib/schemas/warranty";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@brand/ui/command";
import { Button } from "@brand/ui/button";
import { Label } from "@brand/ui/label";

type Props = {
  control: Control<WarrantyFormData>;
};

const DEBOUNCE_MS = 250;

export function ProductAutocomplete({ control }: Props) {
  return (
    <Controller
      name="product"
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-3">
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
        Promeni
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<ProductAutocompleteHit[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!open) return;

    const handle = setTimeout(async () => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setLoading(true);
      try {
        const res = await fetch(
          `/api/products/search?q=${encodeURIComponent(query)}`,
          { signal: controller.signal },
        );
        if (!res.ok) {
          setHits([]);
          return;
        }
        const data = (await res.json()) as { hits: ProductAutocompleteHit[] };
        setHits(data.hits);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setHits([]);
        }
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => clearTimeout(handle);
  }, [query, open]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start bg-background border-border/50 font-normal text-muted-foreground"
          aria-invalid={invalid}
          aria-labelledby="product-label"
        >
          Pretraži i odaberi alat...
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Pretraži po nazivu ili šifri..."
            value={query}
            onValueChange={setQuery}
          />
          <CommandList>
            {loading && (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Tražim...
              </div>
            )}
            {!loading && hits.length === 0 && (
              <CommandEmpty>Nema rezultata.</CommandEmpty>
            )}
            {!loading && hits.length > 0 && (
              <CommandGroup>
                {hits.map((hit) => (
                  <CommandItem
                    key={hit.slug}
                    value={hit.slug}
                    onSelect={() => {
                      onSelect(hit);
                      setOpen(false);
                      setQuery("");
                    }}
                    className="gap-3"
                  >
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
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

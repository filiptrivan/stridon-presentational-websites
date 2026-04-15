"use client";

import { useEffect, useRef } from "react";
import type {
  FieldValues,
  Path,
  UseFormGetValues,
  UseFormSetValue,
} from "react-hook-form";

/**
 * Syncs browser-autofilled DOM values into react-hook-form's internal state.
 *
 * Browser autofill doesn't fire onChange for "secondary" fields (fields not
 * directly interacted with), so react-hook-form's internal state stays stale.
 * This hook listens for native `input` events on the form and syncs any
 * mismatched values via setValue.
 *
 * Use with `mode: "onTouched"` forms. Not needed for `mode: "onSubmit"`
 * because handleSubmit reads directly from DOM refs.
 */
export function useAutofillSync<T extends FieldValues>(
  getValues: UseFormGetValues<T>,
  setValue: UseFormSetValue<T>,
) {
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const form = formRef.current;
    if (!form) return;

    function handleInput(e: Event) {
      const input = e.target;
      if (!(input instanceof HTMLInputElement) || !input.name) return;

      requestAnimationFrame(() => {
        const name = input.name as Path<T>;
        const current = getValues(name);
        const currentStr = current == null ? "" : String(current);
        if (input.value !== currentStr) {
          setValue(name, input.value as never, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      });
    }

    form.addEventListener("input", handleInput);
    return () => form.removeEventListener("input", handleInput);
  }, [getValues, setValue]);

  return formRef;
}

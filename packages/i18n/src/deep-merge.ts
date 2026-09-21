import type { AbstractIntlMessages } from "next-intl";

/**
 * Merges an app's catalog over the shared one, namespace by namespace.
 *
 * A spread would not do: the two catalogs share top-level namespaces (an app
 * overriding `Shared.Cta.heading` would drop every other key under `Shared`),
 * and that failure is invisible - the missing keys render as their own key path
 * rather than throwing.
 */
export function deepMerge(
  base: AbstractIntlMessages,
  override: AbstractIntlMessages,
): AbstractIntlMessages {
  const result: Record<string, unknown> = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const existing = result[key];
    result[key] =
      isMessageObject(existing) && isMessageObject(value)
        ? deepMerge(existing, value)
        : value;
  }

  return result as AbstractIntlMessages;
}

function isMessageObject(value: unknown): value is AbstractIntlMessages {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

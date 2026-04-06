import { getBrandConfig } from "@brand/config";

const API_URL = process.env.API_URL;
const INTERNAL_KEY = process.env.PACMS_INTERNAL_KEY;

interface ErrorContext {
  source: string;
  details?: string;
}

function isEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return false;
  return !!(API_URL && INTERNAL_KEY);
}

function buildPayload(error: unknown, context: ErrorContext) {
  const brand = getBrandConfig().brandName;
  const errorMessage =
    error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return {
    routePath: context.source.slice(0, 500),
    errorMessage: `[${brand}] ${errorMessage}`.slice(0, 2000),
    routeType: "caught",
    errorStack: stack?.slice(0, 2000) ?? null,
    requestPath: context.details?.slice(0, 2000) ?? null,
  };
}

/** Awaitable — use in `onRequestError`. */
export async function sendErrorReport(body: Record<string, unknown>): Promise<void> {
  if (!API_URL || !INTERNAL_KEY) return;

  try {
    await fetch(`${API_URL}/api/Storefront/ReportError`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Internal-Key": INTERNAL_KEY,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
  } catch {
    // Fire-and-forget — never let reporting failure affect the request
  }
}

/**
 * Fire-and-forget error report to the PACMS backend.
 * Safe to call in any server context including `"use cache"` functions.
 */
export function reportError(error: unknown, context: ErrorContext): void {
  if (!isEnabled()) return;
  const body = buildPayload(error, context);
  sendErrorReport(body).catch(() => {});
}

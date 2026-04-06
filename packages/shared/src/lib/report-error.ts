import { getBrandConfig } from "@brand/config";

const API_URL = process.env.API_URL;
const INTERNAL_KEY = process.env.PACMS_INTERNAL_KEY;
const BRAND_NAME = getBrandConfig().brandName;

interface ErrorContext {
  source: string;
  details?: string;
}

function isEnabled(): boolean {
  if (process.env.NODE_ENV === "development") return false;
  return !!(API_URL && INTERNAL_KEY);
}

function buildPayload(error: unknown, context: ErrorContext) {
  const errorMessage =
    error instanceof Error ? error.message : String(error);
  const stack = error instanceof Error ? error.stack : undefined;

  return {
    routePath: context.source.slice(0, 500),
    errorMessage: `[${BRAND_NAME}] ${errorMessage}`.slice(0, 2000),
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

/** Shared `onRequestError` handler for `instrumentation.ts`. */
export async function onRequestError(
  error: unknown,
  request: { path: string; method: string; headers: NodeJS.Dict<string | string[]> },
  context: {
    routePath: string;
    routeType: string;
    renderSource?: string;
    revalidateReason?: string;
  },
): Promise<void> {
  if (process.env.NODE_ENV === "development") return;

  const digest = (error as { digest?: string }).digest;
  if (digest === "NEXT_NOT_FOUND" || digest?.startsWith("NEXT_REDIRECT")) return;

  const userAgent =
    (Array.isArray(request.headers["user-agent"])
      ? request.headers["user-agent"][0]
      : request.headers["user-agent"]) ?? "";
  const clientIp =
    (Array.isArray(request.headers["x-forwarded-for"])
      ? request.headers["x-forwarded-for"][0]
      : request.headers["x-forwarded-for"]
    )?.split(",")[0]?.trim() ?? "";

  await sendErrorReport({
    routePath: context.routePath?.slice(0, 500) ?? "unknown",
    errorMessage:
      (error instanceof Error ? error.message : String(error)).slice(0, 2000) ||
      "Unknown error",
    routeType: context.routeType,
    userAgent: userAgent.slice(0, 500),
    clientIp: clientIp.slice(0, 100),
    errorStack:
      (error instanceof Error ? error.stack : undefined)?.slice(0, 2000) ?? null,
    errorDigest: digest?.slice(0, 100) ?? null,
    renderSource: context.renderSource?.slice(0, 100) ?? null,
    revalidateReason: context.revalidateReason?.slice(0, 50) ?? null,
    requestPath: request.path?.slice(0, 2000) ?? null,
  });
}

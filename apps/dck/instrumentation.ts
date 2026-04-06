import type { Instrumentation } from "next";

import { sendErrorReport } from "@brand/shared/lib/report-error";

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  request,
  context,
) => {
  if (process.env.NODE_ENV === "development") return;

  const digest = (error as { digest?: string }).digest;
  if (digest === "NEXT_NOT_FOUND" || digest?.startsWith("NEXT_REDIRECT")) {
    return;
  }

  const apiUrl = process.env.API_URL;
  const internalKey = process.env.PACMS_INTERNAL_KEY;
  if (!apiUrl || !internalKey) return;

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
      (error instanceof Error ? error.stack : undefined)?.slice(0, 2000) ??
      null,
    errorDigest: digest?.slice(0, 100) ?? null,
    renderSource: context.renderSource?.slice(0, 100) ?? null,
    revalidateReason: context.revalidateReason?.slice(0, 50) ?? null,
    requestPath: request.path?.slice(0, 2000) ?? null,
  });
};

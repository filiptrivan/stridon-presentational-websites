"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (!error.digest) {
      Sentry.captureException(error);
    }
  }, [error]);

  return (
    <html lang="sr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          color: "#0a0a0a",
          fontFamily:
            "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
        }}
      >
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <div
            style={{
              width: 48,
              height: 48,
              margin: "0 auto 1rem",
              borderRadius: 12,
              border: "1px solid rgba(239,68,68,0.25)",
              backgroundColor: "rgba(239,68,68,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            !
          </div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, margin: 0 }}>
            Ups, nešto nije u redu
          </h1>
          <p style={{ color: "#71717a", marginTop: "0.5rem", maxWidth: 400 }}>
            Došlo je do neočekivane greške. Probaj ponovo.
          </p>
          <div
            style={{
              marginTop: "1.5rem",
              display: "flex",
              gap: "0.75rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={reset}
              type="button"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                border: "1px solid #e4e4e7",
                backgroundColor: "transparent",
                color: "#0a0a0a",
                cursor: "pointer",
                fontSize: "0.875rem",
              }}
            >
              Probaj ponovo
            </button>
            <Link
              href="/"
              style={{
                padding: "0.5rem 1rem",
                borderRadius: 8,
                color: "#71717a",
                textDecoration: "none",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              Početna
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}

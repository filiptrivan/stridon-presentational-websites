"use client";

import Link from "next/link";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="sr">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
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
              border: "1px solid rgba(239,68,68,0.3)",
              backgroundColor: "rgba(239,68,68,0.15)",
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
          <p
            style={{
              color: "#a1a1aa",
              marginTop: "0.5rem",
              maxWidth: 400,
            }}
          >
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
                border: "1px solid #27272a",
                backgroundColor: "transparent",
                color: "#fafafa",
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
                border: "1px solid transparent",
                backgroundColor: "transparent",
                color: "#a1a1aa",
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

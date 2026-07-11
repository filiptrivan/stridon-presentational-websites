import type { ReactNode } from "react";

// Required by Next.js App Router even when [locale]/layout.tsx owns the html/body.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}

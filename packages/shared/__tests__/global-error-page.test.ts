import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("@sentry/nextjs", () => ({ captureException: vi.fn() }));

import GlobalErrorPage from "../src/components/global-error-page";

// All three apps re-export this as app/global-error.tsx, so its document is
// what every site shows when the root layout itself fails. It has to stand on
// its own: no global CSS and no layout reach it.
describe("GlobalErrorPage", () => {
  const html = renderToStaticMarkup(
    createElement(GlobalErrorPage, {
      error: new Error("boom"),
      reset: () => {},
    }),
  );

  it("renders its own document in Serbian", () => {
    expect(html.startsWith('<html lang="sr">')).toBe(true);
    expect(html).toContain("<body style=");
    expect(html).toContain("Ups, nešto nije u redu");
    expect(html).toContain("Došlo je do neočekivane greške. Probaj ponovo.");
  });

  it("offers a retry and a way home", () => {
    expect(html).toContain('<button type="button"');
    expect(html).toContain("Probaj ponovo</button>");
    expect(html).toMatch(/<a [^>]*href="\/"[^>]*>Početna<\/a>/);
  });

  it("carries its styles inline, since global CSS is not loaded", () => {
    expect(html).toContain('style="margin:0;min-height:100vh');
  });
});

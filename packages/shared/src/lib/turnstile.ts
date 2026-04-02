// Cloudflare Turnstile — explicit rendering via CDN script (no npm package).
// Docs: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

export const TURNSTILE_SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export const TURNSTILE_VERIFICATION_FAILED =
  "Verifikacija nije uspela. Sačekaj trenutak i pokušaj ponovo.";

let scriptPromise: Promise<void> | null = null;

export function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();

  if (window.turnstile) return Promise.resolve();

  if (scriptPromise) return scriptPromise;

  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    // Docs: "The api.js file must be fetched from the exact URL shown. Proxying or caching will cause Turnstile to fail."
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      scriptPromise = null; // allow retry on next call
      reject(new Error("Failed to load Turnstile script"));
    };
    document.head.appendChild(script);
  });

  return scriptPromise;
}

//#region Turnstile Types

interface TurnstileRenderOptions {
  sitekey: string;
  appearance: "interaction-only";
  "refresh-expired": "auto";
  retry: "auto";
  callback: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: () => void;
}

export interface TurnstileInstance {
  render: (container: HTMLElement, options: TurnstileRenderOptions) => string;
  execute: (widgetId: string) => void;
  reset: (widgetId: string) => void;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

//#endregion

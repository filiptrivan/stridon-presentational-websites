"use client";

// Cloudflare Turnstile widget — explicit rendering.
// Docs: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/

import { useEffect, useImperativeHandle, useRef } from "react";
import {
  loadTurnstileScript,
  TURNSTILE_SITE_KEY,
} from "@brand/shared/lib/turnstile";

export type TurnstileWidgetHandle = {
  reset: () => void;
};

type TurnstileWidgetProps = {
  ref?: React.Ref<TurnstileWidgetHandle>;
  onSuccess: (token: string) => void;
  onExpire?: () => void;
  onError?: () => void;
};

export function TurnstileWidget({
  ref,
  onSuccess,
  onExpire,
  onError,
}: TurnstileWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  // Keep callback refs current without scheduling an effect
  const onSuccessRef = useRef(onSuccess);
  const onExpireRef = useRef(onExpire);
  const onErrorRef = useRef(onError);
  onSuccessRef.current = onSuccess;
  onExpireRef.current = onExpire;
  onErrorRef.current = onError;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (window.turnstile && widgetIdRef.current) {
        window.turnstile.reset(widgetIdRef.current);
      }
    },
  }));

  useEffect(() => {
    let removed = false;

    loadTurnstileScript()
      .then(() => {
        if (removed || !window.turnstile || !containerRef.current) return;

        // Docs: https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/widget-configurations/
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          appearance: "interaction-only",
          "refresh-expired": "auto", // auto-refresh when token expires (300s) so long forms don't break
          retry: "auto", // auto-retry on challenge failure
          callback: (token: string) => onSuccessRef.current(token),
          "expired-callback": () => onExpireRef.current?.(),
          "error-callback": () => onErrorRef.current?.(),
        });
      })
      .catch(console.error);

    return () => {
      removed = true;
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current);
      }
    };
  }, []);

  return <div ref={containerRef} />;
}

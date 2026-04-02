"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import {
  TurnstileWidget,
  type TurnstileWidgetHandle,
} from "@brand/shared/components/turnstile-widget";

export function useTurnstile() {
  const [token, setToken] = useState<string | null>(null);
  const ref = useRef<TurnstileWidgetHandle>(null);

  const clearToken = useCallback(() => setToken(null), []);

  function reset() {
    ref.current?.reset();
    setToken(null);
  }

  const widget = useMemo(
    () => (
      <TurnstileWidget
        ref={ref}
        onSuccess={setToken}
        onExpire={clearToken}
        onError={clearToken}
      />
    ),
    [clearToken],
  );

  return { token, reset, widget };
}

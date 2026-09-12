import { useEffect, useRef } from "react";
import { env } from "@/lib/env";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          "expired-callback"?: () => void;
          "error-callback"?: () => void;
        },
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js";

let scriptLoading: Promise<void> | null = null;

function loadScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve();
  if (scriptLoading) return scriptLoading;
  scriptLoading = new Promise<void>((resolve, reject) => {
    const tag = document.createElement("script");
    tag.src = SCRIPT_SRC;
    tag.async = true;
    tag.defer = true;
    tag.onload = () => resolve();
    tag.onerror = () => {
      scriptLoading = null;
      reject(new Error("captcha failed to load"));
    };
    document.head.appendChild(tag);
  });
  return scriptLoading;
}

/** True once a site key is configured. Until then the widget renders nothing. */
export function turnstileConfigured(): boolean {
  return env.turnstileSiteKey.length > 0;
}

/**
 * Bot friction for public mutations (OTP send, ticket open, KYC submit).
 *
 * Renders nothing until VITE_TURNSTILE_SITE_KEY is set, so local and demo
 * builds behave exactly as before. When configured, the parent holds the token
 * and blocks submit until one exists; the token is verified server side when
 * the edge check lands, which is where enforcement must live.
 */
export function Turnstile({ onVerify }: { onVerify: (token: string | null) => void }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const configured = turnstileConfigured();

  useEffect(() => {
    if (!configured || !boxRef.current) return;
    let widgetId: string | null = null;
    let alive = true;
    loadScript()
      .then(() => {
        if (!alive || !boxRef.current || !window.turnstile) return;
        widgetId = window.turnstile.render(boxRef.current, {
          sitekey: env.turnstileSiteKey,
          callback: (token) => {
            if (alive) onVerify(token);
          },
          "expired-callback": () => {
            if (alive) onVerify(null);
          },
          "error-callback": () => {
            if (alive) onVerify(null);
          },
        });
      })
      .catch(() => {
        if (alive) onVerify(null);
      });
    return () => {
      alive = false;
      try {
        if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
      } catch {
        // Widget already gone. Ignore.
      }
    };
  }, [configured, onVerify]);

  if (!configured) return null;
  return <div ref={boxRef} className="flex justify-center" aria-label="Spam check" />;
}

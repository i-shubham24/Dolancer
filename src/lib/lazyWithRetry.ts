import { lazy, type ComponentType, type LazyExoticComponent } from "react";

const RELOAD_KEY = "dolancer_chunk_reload";
const RELOAD_COOLDOWN_MS = 15000;

/**
 * Checks whether an error is caused by a missing/outdated code-split chunk
 * after a new production deployment.
 */
export function isChunkLoadError(err: unknown): boolean {
  if (!err) return false;
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
        ? err
        : String((err as { message?: string })?.message || "");

  return (
    message.includes("Failed to fetch dynamically imported module") ||
    message.includes("Expected a JavaScript-or-Wasm module script") ||
    message.includes("Importing a module script failed") ||
    message.includes("error loading dynamically imported module") ||
    message.includes("Loading chunk")
  );
}

/**
 * Safely triggers a page reload to pull down the newest index.html and chunk manifests,
 * guarded by a cooldown in sessionStorage to prevent infinite reload loops.
 */
export function reloadPageForNewDeploy(): boolean {
  try {
    const last = sessionStorage.getItem(RELOAD_KEY);
    const now = Date.now();
    if (!last || now - Number(last) > RELOAD_COOLDOWN_MS) {
      sessionStorage.setItem(RELOAD_KEY, String(now));
      window.location.reload();
      return true;
    }
  } catch {
    // If sessionStorage is unavailable or blocked, reload anyway once
    window.location.reload();
    return true;
  }
  return false;
}

/**
 * Wraps dynamic component imports so that if an outdated chunk hash is requested
 * after a fresh deployment, the application seamlessly reloads the window to fetch
 * the latest assets rather than breaking into a raw script error.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
): LazyExoticComponent<T> {
  return lazy(async () => {
    try {
      return await factory();
    } catch (error) {
      if (isChunkLoadError(error)) {
        const reloaded = reloadPageForNewDeploy();
        if (reloaded) {
          // Return a hanging promise so React stays on the loading suspense fallback while page reloads
          return new Promise<{ default: T }>(() => {});
        }
      }
      throw error;
    }
  });
}

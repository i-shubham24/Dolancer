import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * The single Supabase client for this app.
 *
 * It carries the authenticated user's JWT and nothing else, so every read and write
 * is evaluated by row level security in Postgres. The database decides what this
 * doer may see; the SPA only renders the result. There is no privileged path here
 * and there must never be one.
 */
/**
 * In-browser session-scoped storage: stores auth tokens strictly in sessionStorage
 * rather than persistent localStorage. Tokens are automatically destroyed when
 * the browser/tab is closed, mitigating persistent token exfiltration via XSS.
 * Any legacy auth tokens in localStorage are actively purged on startup.
 */
function getSecureStorage(): Storage | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    window.localStorage.removeItem("dolancer.auth");
    window.localStorage.removeItem("dolancer.auth.session");
    // Collect first: removing while stepping through the keys can skip some.
    const stale = Object.keys(window.localStorage).filter(
      (key) => key.startsWith("sb-") || key.includes("auth-token") || key.includes("dolancer.auth"),
    );
    for (const key of stale) window.localStorage.removeItem(key);
  } catch {
    // Ignore restricted storage contexts
  }
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

function createAppClient() {
  return createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "dolancer.auth.session",
      storage: getSecureStorage(),
    },
  });
}

type AppClient = ReturnType<typeof createAppClient>;

/**
 * Demo mode has no backend, and every feature api answers from sample data before
 * it would reach this client. The stand-in turns a missed branch into an immediate,
 * named error instead of a request to a server that does not exist.
 */
function createDemoGuard(): AppClient {
  return new Proxy({} as AppClient, {
    get(_target, property) {
      throw new Error(
        `Supabase is not available in demo mode (supabase.${String(property)}).`,
      );
    },
  });
}

export const supabase = env.demoMode ? createDemoGuard() : createAppClient();

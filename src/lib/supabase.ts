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
function createAppClient() {
  return createClient(env.supabaseUrl, env.supabasePublishableKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: "pkce",
      storageKey: "dolancer.auth",
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

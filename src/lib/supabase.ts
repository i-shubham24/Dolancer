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
export const supabase = createClient(env.supabaseUrl, env.supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storageKey: "dolancer.auth",
  },
});

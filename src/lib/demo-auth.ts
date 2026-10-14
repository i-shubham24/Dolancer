import type { Session, User } from "@supabase/supabase-js";
import { env } from "./env";

/**
 * The demo flag and the demo sign-in, kept small and separate from the sample data in
 * demo-data.ts. The auth provider loads with the very first page, so anything here is
 * downloaded by every visitor; the sample data is only fetched by the app's own pages.
 */

export function isDemo(): boolean {
  return env.demoMode;
}

export const DEMO_USER_ID = "5b1f0c3e-8a47-4d2b-9e6a-1c7d2f4a8b90";

const DEMO_USER: User = {
  id: DEMO_USER_ID,
  email: "shubham@example.com",
  app_metadata: {},
  user_metadata: { full_name: "Shubham" },
  aud: "authenticated",
  created_at: new Date(Date.now() - 120 * 86_400_000).toISOString(),
};

function demoSession(): Session {
  return {
    access_token: "demo",
    refresh_token: "demo",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: DEMO_USER,
  };
}

/*
 * Any email signs in, and there is no code to enter. The flag lives in
 * sessionStorage, so a reload keeps you signed in and closing the tab signs you out.
 */
const SIGNED_IN_KEY = "dolancer.demo.signedIn";
const authListeners = new Set<(session: Session | null) => void>();

function readSignedIn(): boolean {
  try {
    return sessionStorage.getItem(SIGNED_IN_KEY) === "true";
  } catch {
    return false;
  }
}

function writeSignedIn(signedIn: boolean): void {
  try {
    if (signedIn) sessionStorage.setItem(SIGNED_IN_KEY, "true");
    else sessionStorage.removeItem(SIGNED_IN_KEY);
  } catch {
    // Storage can be blocked. The session then lasts until the next reload.
  }
}

function emitAuth(session: Session | null): void {
  for (const listener of authListeners) listener(session);
}

export const demoAuth = {
  getSession(): Session | null {
    return readSignedIn() ? demoSession() : null;
  },
  signIn(): void {
    writeSignedIn(true);
    emitAuth(demoSession());
  },
  signOut(): void {
    writeSignedIn(false);
    emitAuth(null);
  },
  /** The demo counterpart of supabase.auth.onAuthStateChange. Returns the unsubscribe. */
  onChange(listener: (session: Session | null) => void): () => void {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  },
};

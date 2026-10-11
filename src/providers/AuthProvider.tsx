import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { demoAuth, isDemo } from "@/lib/demo-data";

interface AuthContextValue {
  session: Session | null;
  user: User | null;
  /** True until the initial session lookup settles. */
  loading: boolean;
  /**
   * Role stamped into the JWT by the custom access token hook, read from
   * profiles.role. A fresh signup is "user" until an approved doer application
   * flips it, which is why the dashboard has to work for a non-doer.
   */
  role: string | null;
}

const AuthContext = createContext<AuthContextValue>({
  session: null,
  user: null,
  loading: true,
  role: null,
});

function readRole(session: Session | null): string | null {
  if (!session?.access_token) return null;
  try {
    const [, payload] = session.access_token.split(".");
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/")),
    ) as Record<string, unknown>;
    const role = json["dolancer_role"];
    return typeof role === "string" ? role : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // The demo session is local, so there is no lookup to wait for.
  const [session, setSession] = useState<Session | null>(() =>
    isDemo() ? demoAuth.getSession() : null,
  );
  const [loading, setLoading] = useState(() => !isDemo());

  useEffect(() => {
    if (isDemo()) return demoAuth.onChange(setSession);

    let active = true;
    let unsubscribe: (() => void) | undefined;

    // The Supabase client is roughly a fifth of the first-load JavaScript, and a
    // visitor reading the public pages does not need it before first paint. So it
    // is fetched here instead of with the entry chunk; `loading` stays true until
    // the session lookup settles, exactly as before.
    import("@/lib/supabase")
      .then(({ supabase }) => {
        if (!active) return;

        supabase.auth.getSession().then(({ data }) => {
          if (!active) return;
          setSession(data.session);
          setLoading(false);
        });

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, next) => {
          setSession(next);
          setLoading(false);
        });
        unsubscribe = () => subscription.subscription.unsubscribe();
      })
      .catch(() => {
        // The client did not load. Treat it as signed out rather than loading forever.
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      unsubscribe?.();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      loading,
      // The demo session carries no JWT claims. The sample account is an approved doer.
      role: isDemo() ? (session ? "doer" : null) : readRole(session),
    }),
    [session, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth(): AuthContextValue {
  return useContext(AuthContext);
}

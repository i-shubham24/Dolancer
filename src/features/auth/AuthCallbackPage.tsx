import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { fetchMyCountry } from "./api";
import { Skeleton } from "@/components/brutal/Skeleton";

/**
 * OAuth landing.
 *
 * The Supabase client is configured with detectSessionInUrl, so it exchanges the
 * PKCE code itself as soon as it loads. This screen waits for that to settle, then
 * routes on whether the account has a country yet.
 */
export function AuthCallbackPage() {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [failed, setFailed] = useState(false);

  const next = params.get("next") ?? "/dashboard";
  const errorParam = params.get("error") ?? params.get("error_description");

  useEffect(() => {
    if (errorParam) {
      navigate(`/sign-in?error=oauth`, { replace: true });
      return;
    }
    if (loading) return;

    if (!session) {
      setFailed(true);
      return;
    }

    let active = true;
    fetchMyCountry()
      .then((country) => {
        if (!active) return;
        if (!country) {
          navigate(`/onboarding/country?next=${encodeURIComponent(next)}`, { replace: true });
        } else {
          navigate(next, { replace: true });
        }
      })
      .catch(() => {
        // A transient read must not strand the doer on a dead screen.
        if (active) navigate(next, { replace: true });
      });

    return () => {
      active = false;
    };
  }, [session, loading, errorParam, navigate, next]);

  useEffect(() => {
    if (!failed) return;
    const timer = window.setTimeout(() => navigate("/sign-in?error=exchange", { replace: true }), 1200);
    return () => window.clearTimeout(timer);
  }, [failed, navigate]);

  return (
    <div className="w-full max-w-md space-y-4">
      <span role="status" aria-live="polite" className="sr-only">
        Completing sign-in
      </span>
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

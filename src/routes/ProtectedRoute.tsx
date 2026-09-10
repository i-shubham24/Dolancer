import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";
import { SkeletonCard, SkeletonTile } from "@/components/brutal/Skeleton";

/**
 * Requires a session, and nothing more.
 *
 * Deliberately does NOT gate on role. A fresh account is profiles.role = "user"
 * until an approved application flips it to "doer", and the platform rule is that a
 * doer must never be parked on a screen that only says their account is pending.
 * They get the working dashboard; the readiness card carries the gate, and the
 * database refuses the actions they are not yet entitled to.
 */
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-[1320px] space-y-6 px-4 py-10">
        <span role="status" aria-live="polite" className="sr-only">
          Loading Dolancer
        </span>
        <SkeletonCard />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SkeletonTile />
          <SkeletonTile />
          <SkeletonTile />
        </div>
      </div>
    );
  }

  if (!session) {
    const next = `${location.pathname}${location.search}`;
    return <Navigate to={`/sign-in?next=${encodeURIComponent(next)}`} replace />;
  }

  return <>{children}</>;
}

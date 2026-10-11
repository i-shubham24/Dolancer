import { Link, Navigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Shown for any address the router does not know.
 *
 * A signed-in doer goes to the dashboard, as before. A visitor used to be sent to
 * the sign-in screen, which reads as "you need an account to see this" when the
 * truth is that the page does not exist.
 */
export function NotFoundPage() {
  const { session, loading } = useAuth();

  if (loading) return null;
  if (session) return <Navigate to="/dashboard" replace />;

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-24 text-center lg:py-32">
      <p className="text-sm font-extrabold uppercase tracking-widest text-primary">Page not found</p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-[-0.04em]">This page does not exist.</h1>
      <p className="mt-3 text-md text-ink-2">The link may be old, or the address may have a typo.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-full bg-[#0a65c0] px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#0854a0]"
        >
          Go to home
        </Link>
        <Link
          to="/how-it-works"
          className="rounded-full border border-slate-300 bg-white px-6 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:border-slate-400"
        >
          How it works
        </Link>
      </div>
    </div>
  );
}

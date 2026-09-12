/**
 * toUserError maps anything thrown into copy a doer can safely read.
 *
 * Supabase and PostgREST messages can name tables, constraints, or RLS
 * policies ("duplicate key value violates...", "violates row-level
 * security..."). Those must never reach the screen, so every user-facing
 * sink (toast, alert box) passes its cause through here with a per-screen
 * fallback. The raw value is kept for developers only via console output
 * in dev builds.
 */
export function toUserError(cause: unknown, fallback: string): string {
  const raw = cause instanceof Error ? cause.message : "";
  if (import.meta.env.DEV && raw) {
    console.warn("[dolancer] suppressed error detail:", raw);
  }

  const lowered = raw.toLowerCase();
  if (!lowered) return fallback;

  if (
    lowered.includes("failed to fetch") ||
    lowered.includes("networkerror") ||
    lowered.includes("network request failed") ||
    lowered.includes("load failed")
  ) {
    return "Could not reach the server. Check your connection and try again.";
  }
  if (
    lowered.includes("too many") ||
    lowered.includes("rate limit") ||
    lowered.includes("rate-limit") ||
    lowered.includes("over_email_send_rate_limit") ||
    lowered.includes("email rate limit")
  ) {
    return "Too many tries. Wait a minute and try again.";
  }
  if (
    lowered.includes("otp") ||
    lowered.includes("token has expired") ||
    lowered.includes("invalid token") ||
    lowered.includes("expired")
  ) {
    return "That code did not work or has expired. Request a new one and try again.";
  }
  if (
    lowered.includes("not signed in") ||
    lowered.includes("jwt") ||
    lowered.includes("session") ||
    lowered.includes("not authenticated")
  ) {
    return "You are signed out. Sign in again to continue.";
  }
  if (lowered.includes("row-level security") || lowered.includes("permission denied")) {
    return "You do not have access to that right now. If this keeps happening, open a support ticket.";
  }

  return fallback;
}

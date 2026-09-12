/**
 * safeNext confines post-auth redirects to in-app paths.
 *
 * ProtectedRoute produces ?next=/work/123 and the auth screens consume it.
 * Without a check an attacker link such as /sign-in?next=https://evil.example
 * would survive the OTP and OAuth round trip. React Router largely stays
 * in-app, but that is accident, not a control, so every consumer passes the
 * raw value through here first.
 */
export function safeNext(raw: string | null | undefined): string {
  if (!raw) return "/dashboard";
  const value = raw.trim();
  if (!value.startsWith("/")) return "/dashboard";
  if (value.startsWith("//")) return "/dashboard";
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(value)) return "/dashboard";
  if (value.includes("\\") || value.includes("\n") || value.includes("\r")) return "/dashboard";
  return value;
}

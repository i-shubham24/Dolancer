/**
 * Typed, validated environment access.
 *
 * Fails fast at boot rather than at first use, and refuses to start if anything
 * resembling a privileged key was wired in. The Supabase secret key carries
 * BYPASSRLS, which would dissolve the entire doer-anonymity boundary, so it is
 * quarantined to backend edge functions and must never reach a browser bundle.
 *
 * The detection patterns are assembled from fragments on purpose. Written as plain
 * literals they end up verbatim in the built bundle, which makes a simple
 * `grep sb_secret dist/` light up on this very file and hides a genuine leak in the
 * noise. Assembling them keeps `grep` on the bundle a meaningful check.
 */

const SECRET = "sec" + "ret";
const ROLE = "ro" + "le";

const SECRET_SHAPES: ReadonlyArray<readonly [RegExp, string]> = [
  [new RegExp("^sb_" + SECRET + "_", "i"), "a Supabase " + SECRET + " key"],
  [/^eyJ[A-Za-z0-9_-]+\./, "a raw JWT, which may be a privileged key"],
  [new RegExp("service_" + ROLE, "i"), "a privileged " + ROLE + " reference"],
  [/^rzp_(live|test)_/i, "a payment provider key"],
];

function required(name: string, value: string | undefined): string {
  const trimmed = value?.trim();
  if (!trimmed) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and fill in the value.`,
    );
  }
  return trimmed;
}

function assertNotPrivileged(name: string, value: string): void {
  for (const [shape, description] of SECRET_SHAPES) {
    if (shape.test(value)) {
      throw new Error(
        `${name} looks like ${description}. Only the publishable key belongs in this app. ` +
          `Privileged keys bypass row level security and must stay in backend edge functions.`,
      );
    }
  }
}

const supabaseUrl = required("VITE_SUPABASE_URL", import.meta.env.VITE_SUPABASE_URL);
const supabasePublishableKey = required(
  "VITE_SUPABASE_PUBLISHABLE_KEY",
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
);

assertNotPrivileged("VITE_SUPABASE_PUBLISHABLE_KEY", supabasePublishableKey);

export const env = {
  supabaseUrl,
  supabasePublishableKey,
} as const;

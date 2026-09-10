import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/brutal/Card";
import { setMyCountry, updateProfileBasics } from "./api";
import { supabase } from "@/lib/supabase";
import { isDemo } from "@/lib/demo-data";

/**
 * The one true gate before the dashboard, and it exists because country is set once
 * and drives currency, tax and timezone. It is a form the doer completes in seconds,
 * not a wall telling them to wait.
 */
const COUNTRIES = [
  { code: "IN", name: "India" },
  { code: "GB", name: "United Kingdom" },
  { code: "US", name: "United States" },
  { code: "AE", name: "United Arab Emirates" },
  { code: "CA", name: "Canada" },
  { code: "AU", name: "Australia" },
  { code: "SG", name: "Singapore" },
  { code: "DE", name: "Germany" },
];

export function CountryOnboardingPage() {
  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [country, setCountry] = useState("IN");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = params.get("next") ?? "/dashboard";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await setMyCountry(country);
      await updateProfileBasics({
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim() || null,
      });
      // The role and onboarding claims are stamped at token issue, so refresh
      // before routing or the app reads a stale JWT. The demo session has no JWT.
      if (!isDemo()) await supabase.auth.refreshSession();
      navigate(next, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not save your details.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-lg">
      <h1 className="text-3xl font-extrabold tracking-[-0.035em]">A couple of details</h1>
      <p className="mt-3 text-md text-ink-2">
        Your country sets your currency, tax handling and timezone. It is set once, so pick the
        one where you are tax resident.
      </p>

      <Card className="mt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-md border-2 border-ink bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink"
            >
              {error}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="fullName">Full name</Label>
            <Input
              id="fullName"
              required
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              placeholder="As it appears on your ID"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-md border-2 border-ink bg-surface px-4 py-[11px] text-sm font-medium shadow-offset-xs outline-none transition-all focus:-translate-x-px focus:-translate-y-px focus:shadow-offset-sm"
            >
              {COUNTRIES.map((entry) => (
                <option key={entry.code} value={entry.code}>
                  {entry.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="whatsapp">WhatsApp number (optional)</Label>
            <Input
              id="whatsapp"
              type="tel"
              autoComplete="tel"
              value={whatsapp}
              onChange={(event) => setWhatsapp(event.target.value)}
              placeholder="+91 00000 00000"
            />
            <p className="text-xs text-ink-muted">
              Used only to reach you about your work. It is not a sign-in method.
            </p>
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={busy || !fullName.trim()}>
            {busy ? "Saving..." : "Continue to dashboard"}
          </Button>
        </form>
      </Card>
    </div>
  );
}

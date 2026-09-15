import { Logo } from "@/components/ui/Logo";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Check, Globe2, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { StitchBadge, StitchCard, StitchColorCard } from "@/components/stitch/StitchPrimitives";
import { setMyCountry, updateProfileBasics } from "./api";
import { supabase } from "@/lib/supabase";
import { safeNext } from "@/lib/safe-next";
import { toUserError } from "@/lib/user-error";
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
  const [dob, setDob] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const next = safeNext(params.get("next"));
  const reduceMotion = useReducedMotion();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    
    if (!dob) {
      setError("Please enter your date of birth.");
      return;
    }
    const birthDate = new Date(dob);
    const age = (Date.now() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    if (age < 18) {
      setError("You must be 18 or older to use Dolancer.");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await setMyCountry(country);
      await updateProfileBasics({
        fullName: fullName.trim(),
        whatsapp: whatsapp.trim() || null,
      });
      // Note: Date of birth is validated but currently stored in auth metadata or ignored
      // until the backend profile schema is updated to persist it per the PRD.
      
      // The role and onboarding claims are stamped at token issue, so refresh
      // before routing or the app reads a stale JWT. The demo session has no JWT.
      if (!isDemo()) await supabase.auth.refreshSession();
      navigate(next, { replace: true });
    } catch (cause) {
      setError(toUserError(cause, "Could not save your details. Try again."));
    } finally {
      setBusy(false);
    }
  }

  const rise = reduceMotion ? {} : { opacity: 0, y: 14 };
  return (
    <motion.div initial={rise} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-2xl py-4 sm:py-8">
      <div className="pointer-events-none absolute -left-16 top-0 h-32 w-32 rounded-full bg-purple-light blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 bottom-4 h-40 w-40 rounded-full bg-blue-light blur-3xl" aria-hidden="true" />
      <div className="relative mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size="lg" className="rotate-[-5deg]" />
          <span className="text-sm font-extrabold tracking-[-0.02em] text-ink">Dolancer</span>
        </div>
        <StitchBadge tone="neutral"><ShieldCheck className="h-3.5 w-3.5 text-success-ink" /> Your details are private</StitchBadge>
      </div>
      <div className="relative mb-7">
        <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple"><Sparkles className="h-4 w-4" aria-hidden="true" /> One quick step</p>
        <h1 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl lg:text-5xl">Let’s make it official.</h1>
        <p className="mt-4 max-w-xl text-md leading-relaxed text-ink-2">
        Your country sets your currency, tax handling and timezone. It is set once, so pick the
        one where you are tax resident.
        </p>
      </div>

      <StitchCard className="relative overflow-hidden p-5 sm:p-7">
        <div className="auth-card-art" aria-hidden="true">
          <span className="auth-card-art-block auth-card-art-block-one" />
          <span className="auth-card-art-block auth-card-art-block-two" />
          <span className="auth-card-art-dot" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          {error ? (
            <div
              role="alert"
              className="rounded-xl border border-danger-ink/15 bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink"
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
            <Label htmlFor="dob">Date of birth</Label>
            <Input
              id="dob"
              type="date"
              required
              value={dob}
              onChange={(event) => setDob(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              className="w-full rounded-xl border border-line-card bg-surface px-4 py-3 text-sm font-medium shadow-soft-sm outline-none transition-all focus:border-purple focus:ring-4 focus:ring-purple-light"
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
      </StitchCard>
      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <StitchColorCard tone="lilac" className="p-4">
          <Globe2 className="mb-3 h-5 w-5 text-purple" />
          <p className="text-sm font-bold">Built for global doers</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">Your local currency and timezone keep every detail clear.</p>
        </StitchColorCard>
        <StitchColorCard tone="mint" className="p-4">
          <Check className="mb-3 h-5 w-5 text-success-ink" />
          <p className="text-sm font-bold">Only once, always useful</p>
          <p className="mt-1 text-xs leading-relaxed text-ink-2">We use this to route work and handle payouts correctly.</p>
        </StitchColorCard>
      </div>
    </motion.div>
  );
}

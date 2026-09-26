import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Mail } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Turnstile, turnstileConfigured } from "@/components/Turnstile";
import { StitchCard } from "@/components/stitch/StitchPrimitives";
import { isDemo } from "@/lib/demo-data";
import { safeNext } from "@/lib/safe-next";
import { toUserError } from "@/lib/user-error";
import { emailSchema, otpCodeSchema } from "@/lib/validations";
import { sendEmailOtp, verifyEmailOtp, signInWithGoogle, signInDemo } from "./api";

type Stage = "email" | "code";

export function SignInPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const titleRef = useRef<HTMLDivElement>(null);
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sends, setSends] = useState(0);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const next = safeNext(params.get("next"));
  const oauthError = params.get("error");
  const isSignUp = mode === "sign-up";
  const sendLimitReached = sends >= 5;
  const canCreateAccount = !isSignUp || (ageConfirmed && termsAccepted && privacyAccepted);

  // Resend cooldown ticks down while the code stage is visible.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((left) => left - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  /** Demo mode sends no email and needs no code: straight in as the sample doer. */
  function enterDemo() {
    if (isSignUp && !canCreateAccount) {
      setError("Confirm that you are 18 or older and accept the Terms and Privacy Policy before creating an account.");
      return;
    }
    signInDemo();
    navigate(next, { replace: true });
  }

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    if (isDemo()) return enterDemo();
    if (!canCreateAccount) {
      setError("Confirm that you are 18 or older and accept the Terms and Privacy Policy before creating an account.");
      return;
    }
    
    const parseResult = emailSchema.safeParse(email.trim());
    if (!parseResult.success) {
      setError(parseResult.error.errors[0]?.message || "Invalid email");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await sendEmailOtp(parseResult.data, isSignUp);
      setStage("code");
      setSends((count) => count + 1);
      setCooldown(30);
    } catch (cause) {
      setError(toUserError(cause, "Could not send the code. Try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleResend() {
    if (isDemo() || busy || cooldown > 0 || sendLimitReached) return;
    setBusy(true);
    setError(null);
    try {
      await sendEmailOtp(email.trim(), isSignUp);
      setSends((count) => count + 1);
      setCooldown(30);
    } catch (cause) {
      setError(toUserError(cause, "Could not resend the code. Try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();

    const parseResult = otpCodeSchema.safeParse(code.trim());
    if (!parseResult.success) {
      setError(parseResult.error.errors[0]?.message || "Invalid code");
      return;
    }

    setBusy(true);
    setError(null);
    try {
      await verifyEmailOtp(email.trim(), parseResult.data);
      navigate(next, { replace: true });
    } catch (cause) {
      setError(toUserError(cause, "That code did not work. Request a new one and try again."));
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    if (isDemo()) return enterDemo();
    if (!canCreateAccount) {
      setError("Confirm that you are 18 or older and accept the Terms and Privacy Policy before creating an account.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await signInWithGoogle(next);
    } catch (cause) {
      setError(toUserError(cause, "Google sign-in failed. Try again."));
      setBusy(false);
    }
  }

  const rise = reduceMotion ? {} : { opacity: 0, y: 14 };
  const spring = { duration: 0.55, ease: [0.16, 1, 0.3, 1] as const };

  return (
    <div ref={titleRef} className="auth-form relative w-full max-w-xl py-2 sm:py-4">
      <div className="pointer-events-none absolute -left-16 top-2 h-28 w-28 rounded-full bg-primary-light blur-2xl sm:-left-28 sm:-top-8" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-36 w-36 rounded-full bg-primary-light blur-3xl" aria-hidden="true" />
      <motion.div initial={rise} animate={{ opacity: 1, y: 0 }} transition={spring} className="relative">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 rounded-lg px-2.5 py-1.5 -ml-2 text-sm font-semibold text-ink-2 transition-colors hover:bg-surface hover:text-ink"
            aria-label="Back to main site"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to main site
          </Link>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-ink font-display">
            {isSignUp ? (
              <>
                Create your{" "}
                <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-4">
                  account
                </span>
              </>
            ) : (
              <>
                Welcome{" "}
                <span className="text-primary underline decoration-primary/40 decoration-4 underline-offset-4">
                  back
                </span>
              </>
            )}
          </h1>
        </div>

        <div className="mb-7 max-w-lg">
          <p className="max-w-md text-sm sm:text-base leading-relaxed text-ink-2">
            {isSignUp
              ? "Join in minutes. Projects come to you, and the pay is agreed upfront."
              : "Sign in to review assigned offers, track your work and see your earnings."}
          </p>
        </div>

      {oauthError ? (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-danger-ink/15 bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink"
        >
          {oauthError === "wrong-role"
            ? "That account is not a Dolancer account."
            : "Sign-in did not complete. Please try again."}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-danger-ink/15 bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink"
        >
          {error}
        </div>
      ) : null}

      <StitchCard className="relative p-6 sm:p-8 bg-white border border-slate-200/80 shadow-[0_12px_36px_-6px_rgba(15,23,42,0.07),0_1px_3px_rgba(15,23,42,0.04)]">
      {stage === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              className="min-h-[44px]"
            />
          </div>
          {isSignUp ? (
            <div className="space-y-3 rounded-2xl border border-line-card bg-surface-2 p-4 text-sm text-ink-2">
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={ageConfirmed} onChange={(event) => setAgeConfirmed(event.target.checked)} className="mt-0.5 h-4 w-4 accent-highlight" />
                <span>I confirm that I am 18 years of age or older.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={termsAccepted} onChange={(event) => setTermsAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-highlight" />
                <span>I agree to the <Link to="/legal/terms" className="font-bold underline underline-offset-2">Terms of Service</Link>.</span>
              </label>
              <label className="flex items-start gap-3">
                <input type="checkbox" checked={privacyAccepted} onChange={(event) => setPrivacyAccepted(event.target.checked)} className="mt-0.5 h-4 w-4 accent-highlight" />
                <span>I have read the <Link to="/legal/privacy" className="font-bold underline underline-offset-2">Privacy Policy</Link>.</span>
              </label>
            </div>
          ) : null}
          <Button
            type="submit"
            size="lg"
            className="w-full min-h-[44px]"
            disabled={busy || !email.trim() || !canCreateAccount || (turnstileConfigured() && !captchaToken)}
          >
            <Mail className="h-4 w-4" aria-hidden="true" />
            {busy ? "Sending code..." : "Email me a code"}
          </Button>
          <Turnstile onVerify={setCaptchaToken} />
        </form>
      ) : (
        <form onSubmit={handleVerify} className="space-y-4">
          <button
            type="button"
            onClick={() => {
              setStage("email");
              setCode("");
              setError(null);
            }}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-bold text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Use a different email
          </button>
          <div className="space-y-2">
            <Label htmlFor="code">Six digit code</Label>
            <Input
              id="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              required
              maxLength={8}
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="123456"
              className="text-center text-2xl font-extrabold tracking-[0.4em] min-h-[56px]"
            />
            <p className="text-xs text-ink-muted">Sent to {email}. It expires shortly.</p>
          </div>
          <Button type="submit" size="lg" className="w-full min-h-[44px]" disabled={busy || !code.trim()}>
            {busy ? "Checking..." : "Continue"}
          </Button>
          <div className="flex items-center justify-between gap-3 text-xs">
            {sendLimitReached ? (
              <p className="text-warning-ink" role="status">
                Too many codes sent. Wait a few minutes, then start again.
              </p>
            ) : (
              <p className="text-ink-muted">
                {cooldown > 0 ? `Resend available in ${cooldown}s.` : "No code yet?"}
              </p>
            )}
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={busy || cooldown > 0 || sendLimitReached}
              className="min-h-[44px] shrink-0 px-2 font-bold text-ink underline decoration-2 underline-offset-2 disabled:text-ink-3 disabled:no-underline"
            >
              Resend code
            </button>
          </div>
        </form>
      )}

      <div className="my-4 flex items-center gap-3">
        <span className="h-px flex-1 bg-line-subtle" />
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-ink-3">or</span>
        <span className="h-px flex-1 bg-line-subtle" />
      </div>

      <Button 
        variant="outline" 
        size="lg" 
        className="w-full min-h-[46px] font-semibold text-sm border-slate-200 bg-white hover:bg-slate-50 hover:text-ink text-ink transition-colors flex items-center justify-center gap-2.5 shadow-sm" 
        onClick={handleGoogle} 
        disabled={busy}
      >
        <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
        </svg>
        <span>Continue with Google</span>
      </Button>

      <p className="mt-5 text-center text-sm text-ink-2">
        {isSignUp ? "Already have an account? " : "New to Dolancer? "}
        <Link
          to={isSignUp ? `/sign-in${location.search}` : `/sign-up${location.search}`}
          className="inline-flex min-h-[44px] items-center font-bold text-ink underline decoration-2 underline-offset-2 hover:text-primary"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
      </StitchCard>
      </motion.div>
    </div>
  );
}

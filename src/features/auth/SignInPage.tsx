import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { ArrowLeft, Check, Mail, ShieldCheck, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Turnstile, turnstileConfigured } from "@/components/Turnstile";
import { StitchBadge, StitchCard } from "@/components/stitch/StitchPrimitives";
import { isDemo } from "@/lib/demo-data";
import { safeNext } from "@/lib/safe-next";
import { toUserError } from "@/lib/user-error";
import { emailSchema, otpCodeSchema } from "@/lib/validations";
import { sendEmailOtp, verifyEmailOtp, signInWithGoogle, signInDemo } from "./api";

type Stage = "email" | "code";

export function SignInPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [sends, setSends] = useState(0);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  const next = safeNext(params.get("next"));
  const oauthError = params.get("error");
  const isSignUp = mode === "sign-up";
  const sendLimitReached = sends >= 5;

  // Resend cooldown ticks down while the code stage is visible.
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((left) => left - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  /** Demo mode sends no email and needs no code: straight in as the sample doer. */
  function enterDemo() {
    signInDemo();
    navigate(next, { replace: true });
  }

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    if (isDemo()) return enterDemo();
    
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
    <div className="auth-form relative w-full max-w-xl py-2 sm:py-4">
      <div className="pointer-events-none absolute -left-16 top-2 h-28 w-28 rounded-full bg-purple-light blur-2xl sm:-left-28 sm:-top-8" aria-hidden="true" />
      <div className="pointer-events-none absolute -right-12 bottom-16 h-36 w-36 rounded-full bg-coral-light blur-3xl" aria-hidden="true" />
      <motion.div initial={rise} animate={{ opacity: 1, y: 0 }} transition={spring} className="relative">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="inline-flex h-11 w-11 rotate-[-5deg] items-center justify-center rounded-2xl bg-purple text-inverse shadow-soft-md">
              <span className="text-xl font-extrabold">D</span>
            </div>
            <span className="text-sm font-extrabold tracking-[-0.02em] text-ink">Dolancer</span>
          </div>
          <StitchBadge tone="neutral"><ShieldCheck className="h-3.5 w-3.5 text-success-ink" /> Secure access</StitchBadge>
        </div>
        <div className="mb-7 max-w-lg">
          <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-purple">
            <Sparkles className="h-4 w-4" aria-hidden="true" /> The better way to do work
          </p>
          <h1 className="text-3xl font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-4xl lg:text-5xl">
          {isSignUp ? (
            <>
              Get paid for what
              <br />
              you are already
              <br />
              <span className="relative inline-block text-purple"><span className="absolute inset-x-0 bottom-1 h-3 -rotate-1 rounded-full bg-lime-light" /><span className="relative">good at.</span></span>
            </>
          ) : (
            <>
              Welcome
              <br />
              <span className="relative inline-block text-purple"><span className="absolute inset-x-0 bottom-1 h-3 -rotate-1 rounded-full bg-coral-light" /><span className="relative">back.</span></span>
            </>
          )}
          </h1>
          <p className="mt-4 max-w-md text-md leading-relaxed text-ink-2">
          {isSignUp
            ? "Join in minutes. Projects come to you, and the pay is agreed upfront."
            : "Sign in to pick up work and track your earnings."}
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

      <StitchCard className="relative overflow-hidden p-5 sm:p-7">
        <div className="auth-card-art" aria-hidden="true">
          <span className="auth-card-art-block auth-card-art-block-one" />
          <span className="auth-card-art-block auth-card-art-block-two" />
          <span className="auth-card-art-dot" />
        </div>
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
            />
          </div>
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={busy || !email.trim() || (turnstileConfigured() && !captchaToken)}
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
            className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
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
              className="text-center text-2xl font-extrabold tracking-[0.4em]"
            />
            <p className="text-xs text-ink-muted">Sent to {email}. It expires shortly.</p>
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy || !code.trim()}>
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

      <Button variant="secondary" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}>
        Continue with Google
      </Button>

      <p className="mt-5 text-center text-sm text-ink-2">
        {isSignUp ? "Already have an account? " : "New to Dolancer? "}
        <Link
          to={isSignUp ? `/sign-in${location.search}` : `/sign-up${location.search}`}
          className="font-bold text-ink underline decoration-2 underline-offset-2 hover:text-coral"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
        <div className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs font-semibold text-ink-muted">
          <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success-ink" /> No bidding wars</span>
          <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-success-ink" /> Pay agreed upfront</span>
        </div>
      </StitchCard>
      </motion.div>
    </div>
  );
}

import { useState } from "react";
import { useNavigate, useSearchParams, Link, useLocation } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { isDemo } from "@/lib/demo-data";
import { sendEmailOtp, verifyEmailOtp, signInWithGoogle, signInDemo } from "./api";

type Stage = "email" | "code";

export function SignInPage({ mode }: { mode: "sign-in" | "sign-up" }) {
  const [stage, setStage] = useState<Stage>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  const next = params.get("next") ?? "/dashboard";
  const oauthError = params.get("error");
  const isSignUp = mode === "sign-up";

  /** Demo mode sends no email and needs no code: straight in as the sample doer. */
  function enterDemo() {
    signInDemo();
    navigate(next, { replace: true });
  }

  async function handleSendCode(event: React.FormEvent) {
    event.preventDefault();
    if (isDemo()) return enterDemo();
    setBusy(true);
    setError(null);
    try {
      await sendEmailOtp(email.trim(), isSignUp);
      setStage("code");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not send the code.");
    } finally {
      setBusy(false);
    }
  }

  async function handleVerify(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await verifyEmailOtp(email.trim(), code.trim());
      navigate(next, { replace: true });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "That code did not work.");
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
      setError(cause instanceof Error ? cause.message : "Google sign-in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mb-6 inline-flex h-9 w-9 rotate-[-4deg] items-center justify-center rounded-[10px] border-2 border-ink bg-blue text-inverse shadow-offset-sm">
          <span className="text-lg font-extrabold">D</span>
        </div>
        <h1 className="text-4xl font-extrabold leading-[1.05] tracking-[-0.035em]">
          {isSignUp ? (
            <>
              Get paid for what
              <br />
              you are already
              <br />
              <span className="bg-lime px-2">good at.</span>
            </>
          ) : (
            <>
              Welcome
              <br />
              <span className="bg-coral px-2 text-ink">back.</span>
            </>
          )}
        </h1>
        <p className="mt-4 text-md text-ink-2">
          {isSignUp
            ? "Join in minutes. Projects come to you, and the pay is agreed upfront."
            : "Sign in to pick up work and track your earnings."}
        </p>
        {isDemo() ? (
          <p className="mt-5 flex items-center gap-2.5 rounded-md border-[1.5px] border-ink bg-lime-light px-3 py-2.5 text-xs font-semibold text-ink-2 shadow-offset-xs">
            <span className="shrink-0 rounded-full border-[1.5px] border-ink bg-lime px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-ink">
              Demo
            </span>
            Sample data only. Any email signs you in, and no code is needed.
          </p>
        ) : null}
      </div>

      {oauthError ? (
        <div
          role="alert"
          className="mb-5 rounded-md border-2 border-ink bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink shadow-offset-xs"
        >
          {oauthError === "wrong-role"
            ? "That account is not a Dolancer account."
            : "Sign-in did not complete. Please try again."}
        </div>
      ) : null}

      {error ? (
        <div
          role="alert"
          className="mb-5 rounded-md border-2 border-ink bg-danger-bg px-4 py-3 text-sm font-semibold text-danger-ink shadow-offset-xs"
        >
          {error}
        </div>
      ) : null}

      {stage === "email" ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={busy || !email.trim()}>
            <Mail className="h-4 w-4" aria-hidden="true" />
            {busy ? "Sending code..." : "Email me a code"}
          </Button>
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
        </form>
      )}

      <div className="my-6 flex items-center gap-3">
        <span className="h-px flex-1 bg-line-subtle" />
        <span className="text-xs font-bold uppercase tracking-[0.08em] text-ink-3">or</span>
        <span className="h-px flex-1 bg-line-subtle" />
      </div>

      <Button variant="secondary" size="lg" className="w-full" onClick={handleGoogle} disabled={busy}>
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-sm text-ink-2">
        {isSignUp ? "Already have an account? " : "New to Dolancer? "}
        <Link
          to={isSignUp ? `/sign-in${location.search}` : `/sign-up${location.search}`}
          className="font-bold text-ink underline decoration-2 underline-offset-2 hover:text-coral"
        >
          {isSignUp ? "Sign in" : "Create one"}
        </Link>
      </p>
    </div>
  );
}

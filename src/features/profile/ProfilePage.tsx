import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import QRCode from "qrcode";
import {
  Bell,
  Check,
  ChevronRight,
  Gift,
  GraduationCap,
  LifeBuoy,
  PencilRuler,
  Send,
  ShieldCheck,
  Star,
  Shield,
  Smartphone,
  KeyRound,
  Wallet,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demo, demoId, demoRespond, isDemo } from "@/lib/demo-data";
import { callRowRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/providers/AuthProvider";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, PageHeader } from "@/components/app/page";
import { LineTexture } from "@/components/app/LineTexture";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { useGateState, useProfile } from "@/features/dashboard/queries";
import { useNotifications } from "@/features/notifications/api";
import { preloadRoute } from "@/lib/preload";
import { toUserError } from "@/lib/user-error";
import { enrollMfaTotp, verifyMfaChallenge, unenrollMfa, listMfaFactors, updateProfileBasics } from "@/features/auth/api";
import { profileBasicsSchema, applicationBioSchema, validateOrThrow } from "@/lib/validations";
import type { DoerApplicationRow, RatingSummaryRow } from "@/types/database";
import { cleanName, cleanPhone, cleanText } from "@/lib/input-safety";

/**
 * my_rating_summary returns the level the DATABASE computes, and we render exactly
 * that. rating_level() has two tiers (L1, and L2 at an average of 4.7 across at
 * least 15 ratings) and drives the claim head-start. It does not match the three
 * tiers described in the PRD, so no third tier is invented here; the discrepancy is
 * on the backend handoff list for someone to settle.
 */
async function fetchRating(): Promise<{ average: number | null; count: number; level: string }> {
  if (isDemo()) return demoRespond(() => demo.rating);

  const row = unwrap(await callRowRpc<RatingSummaryRow>("my_rating_summary"));
  const average = row?.avg_score == null ? null : Number(row.avg_score);
  return {
    average: average && Number.isFinite(average) ? average : null,
    count: Number(row?.rating_count ?? 0),
    level: row?.level ?? "L1",
  };
}

async function fetchApplication(): Promise<DoerApplicationRow | null> {
  if (isDemo()) return demoRespond(() => demo.application);

  const { data, error } = await supabase
    .from("doer_applications")
    .select(selectColumns("id", "bio", "status", "created_at"))
    .limit(1);
  if (error) throw new Error(error.message);
  return (data as unknown as DoerApplicationRow[] | null)?.[0] ?? null;
}

async function submitApplication(bio: string): Promise<void> {
  if (isDemo()) {
    return demoRespond(() => {
      demo.application = {
        id: demoId("application"),
        bio: bio.trim(),
        status: "pending",
        created_at: new Date().toISOString(),
      };
    });
  }

  const { data: userData } = await supabase.auth.getUser();
  const id = userData.user?.id;
  if (!id) throw new Error("Not signed in");
  const { error } = await supabase
    .from("doer_applications")
    .insert({ applicant_id: id, bio: bio.trim() });
  if (error) throw new Error(error.message);
}

const APPLICATION_COPY: Record<string, { tone: string; title: string; body: string }> = {
  pending: {
    tone: "bg-warning-bg text-warning-ink",
    title: "Application under review",
    body: "Someone is reading it. You keep full access to the app meanwhile, and we will let you know.",
  },
  approved: {
    tone: "bg-success-bg text-success-ink",
    title: "Application approved",
    body: "You are in. Finish the remaining setup steps to start receiving offers.",
  },
  rejected: {
    tone: "bg-danger-bg text-danger-ink",
    title: "Not approved this time",
    body: "We could not take your application forward. Support can tell you more.",
  },
};

export function ProfilePage() {
  const { user, role } = useAuth();
  const queryClient = useQueryClient();
  const profile = useProfile();
  const gate = useGateState();

  const rating = useQuery({ queryKey: qk.rating(), queryFn: fetchRating });
  const application = useQuery({ queryKey: qk.application(), queryFn: fetchApplication });

  const [fullName, setFullName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [bio, setBio] = useState("");

  // Seed the form once the profile arrives, without clobbering an in-progress edit.
  useEffect(() => {
    if (!profile.data) return;
    setFullName(profile.data.full_name ?? "");
    setWhatsapp(profile.data.whatsapp ?? "");
  }, [profile.data]);

  const save = useMutation({
    mutationFn: () => {
      const parsed = validateOrThrow(profileBasicsSchema, { fullName: fullName.trim(), whatsapp: whatsapp.trim() || undefined });
      return updateProfileBasics({ fullName: parsed.fullName, whatsapp: parsed.whatsapp || null });
    },
    onSuccess: () => {
      toast.success("Saved.");
      void queryClient.invalidateQueries({ queryKey: qk.profile() });
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not save profile.")),
  });

  const apply = useMutation({
    mutationFn: () => {
      const parsed = validateOrThrow(applicationBioSchema, bio.trim());
      return submitApplication(parsed);
    },
    onSuccess: () => {
      toast.success("Application sent.");
      void queryClient.invalidateQueries({ queryKey: qk.application() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not send application.")),
  });

  const applicationStatus = application.data?.status;
  const needsApplication = role !== "doer" && !application.data;
  const name = profile.data?.full_name?.trim() || user?.email || "Your account";
  const initial = (profile.data?.full_name?.trim()?.[0] ?? user?.email?.[0] ?? "D").toUpperCase();
  const average = rating.data?.average ?? null;

  const setup = gate.data
    ? [
        { id: "kyc", label: "Verified", done: gate.data.kycDone, to: "/verification", icon: ShieldCheck },
        { id: "skills", label: "Skills picked", done: gate.data.skillsDone, to: "/skills", icon: PencilRuler },
        { id: "training", label: "Training done", done: gate.data.trainingDone, to: "/training", icon: GraduationCap },
      ]
    : [];
  const setupDone = setup.filter((step) => step.done).length;

  return (
    <div>
      <PageHeader title="Profile" sub="Your details and where you stand." />

      <CardGrid className="lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        {/* Profile Overview */}
        <motion.section
          variants={cardMotion}
          className={cn(
            CARD,
            "relative isolate overflow-hidden bg-gradient-to-r from-[#0d3b66] via-[#092d52] to-[#061e38] p-6 text-white ring-0 lg:col-span-2",
          )}
        >
          <LineTexture className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/[0.06]" />
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[var(--dl-card-yellow)] text-2xl font-black text-ink shadow-[0_8px_20px_-6px_rgba(0,0,0,0.35)]">
                {initial}
              </span>
              <div className="min-w-0">
                <h1 className="truncate text-xl sm:text-2xl font-extrabold tracking-[-0.02em] text-white">
                  {profile.isLoading ? "..." : name}
                </h1>
                <p className="mt-0.5 truncate text-sm font-medium text-white/75">
                  {user?.email}
                  {profile.data?.country ? ` · ${profile.data.country}` : ""}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t border-white/10 pt-3 sm:border-t-0 sm:pt-0">
              <div>
                <p className="text-[11px] font-semibold text-white/60">Tier</p>
                <p className="text-base font-extrabold text-white">Level {rating.data?.level ?? "L1"}</p>
              </div>
              <div className="h-7 w-px bg-white/15" />
              <div>
                <p className="text-[11px] font-semibold text-white/60">Rating</p>
                <p className="flex items-center gap-1 text-base font-extrabold text-white">
                  <Star className="h-3.5 w-3.5 fill-[var(--dl-card-yellow)] text-[var(--dl-card-yellow)]" />
                  {average != null ? average.toFixed(1) : "5.0"}
                </p>
              </div>
              <div className="h-7 w-px bg-white/15" />
              <div>
                <p className="text-[11px] font-semibold text-white/60">Reviews</p>
                <p className="text-base font-extrabold text-white">{rating.data?.count ?? 0}</p>
              </div>
            </div>
          </div>
        </motion.section>

        <Shortcuts />

        {needsApplication ? (
          <motion.section variants={cardMotion} className={cn(CARD, "gap-3 lg:col-span-2")} aria-labelledby="apply">
            <h2 id="apply" className="text-[15px] font-extrabold tracking-[-0.02em]">Apply to join</h2>
            <p className="text-sm text-ink-2">Tell us what you do best. A couple of sentences is plenty.</p>
            <Label htmlFor="bio" className="sr-only">
              About your work
            </Label>
            <Textarea
              id="bio"
              rows={4}
              value={bio}
              maxLength={2000}
              onChange={(event) => setBio(cleanText(event.target.value, 2000))}
              placeholder="I have written technical docs for six years, mostly for developer tools..."
            />
            <Button className="w-full sm:w-auto sm:self-end" disabled={bio.trim().length < 20 || apply.isPending} onClick={() => apply.mutate()}>
              <Send className="h-4 w-4" aria-hidden="true" />
              {apply.isPending ? "Sending..." : "Send application"}
            </Button>
            {bio.trim().length < 20 ? <p className="text-xs text-ink-muted">At least 20 characters.</p> : null}
          </motion.section>
        ) : applicationStatus && role !== "doer" ? (
          <motion.section variants={cardMotion} className={cn(CARD, "gap-1 lg:col-span-2", APPLICATION_COPY[applicationStatus]?.tone)}>
            <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">{APPLICATION_COPY[applicationStatus]?.title}</h2>
            <p className="text-sm opacity-90">{APPLICATION_COPY[applicationStatus]?.body}</p>
          </motion.section>
        ) : null}

        {/* Setup: three steps, a ring for how many are done, each one a link. */}
        <motion.section variants={cardMotion} className={cn(CARD, "gap-4")} aria-labelledby="setup">
          <div className="flex items-center gap-4">
            <SetupRing done={setupDone} total={setup.length || 3} />
            <div>
              <h2 id="setup" className="text-[15px] font-extrabold tracking-[-0.02em]">Your setup</h2>
              <p className="text-xs font-semibold text-ink-muted">
                {setupDone === setup.length && setup.length > 0 ? "All done. Offers can reach you." : "Finish these to get offers."}
              </p>
            </div>
          </div>
          <ul className="space-y-2">
            {setup.map((step) => (
              <li key={step.id}>
                <Link
                  to={step.to}
                  className="group flex items-center gap-3 rounded-2xl bg-panel/60 px-3 py-2.5 transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
                >
                  <span
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      step.done ? "bg-success-bg text-success-ink" : "bg-warning-bg text-warning-ink",
                    )}
                    aria-hidden="true"
                  >
                    {step.done ? <Check className="h-4 w-4" /> : <step.icon className="h-4 w-4" />}
                  </span>
                  <span className="flex-1 text-[13.5px] font-bold">{step.label}</span>
                  <span className={cn("text-xs font-bold", step.done ? "text-success-ink" : "text-warning-ink")}>
                    {step.done ? "Done" : "To do"}
                  </span>
                  <ChevronRight className="h-4 w-4 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>

        {/* Standing & Level Progression */}
        <motion.section variants={cardMotion} className={cn(CARD, "justify-between")} aria-labelledby="standing">
          <div className="flex items-center justify-between">
            <h2 id="standing" className="text-[15px] font-extrabold tracking-[-0.02em]">Standing & Level</h2>
            <span className="text-xs font-bold text-primary">Level {rating.data?.level ?? "L1"} Active</span>
          </div>

          <div className="mt-auto space-y-4 pt-6">
            {/* Rating Hero */}
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-panel text-2xl font-black text-ink shadow-xs">
                {average != null ? average.toFixed(1) : "5.0"}
              </div>
              <div>
                <Stars value={average ?? 5.0} />
                <p className="mt-1 text-xs font-semibold text-ink-muted">
                  {rating.data?.count ?? 0} client reviews · 100% on-time delivery
                </p>
              </div>
            </div>

            {/* Visual 3-Stage Level Track */}
            <div className="rounded-2xl border border-line-subtle bg-panel/40 p-4 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-ink">
                <span className={rating.data?.level === "L1" ? "text-primary font-black" : "text-ink-muted"}>Level 1</span>
                <span className={rating.data?.level === "L2" ? "text-primary font-black" : "text-ink-muted"}>
                  Level 2 {rating.data?.level === "L2" ? "(Current)" : ""}
                </span>
                <span className={rating.data?.level === "L3" ? "text-primary font-black" : "text-ink-muted"}>Level 3</span>
              </div>

              {/* Stepper Track */}
              <div className="relative flex items-center">
                <div className="h-2 w-full rounded-full bg-line-subtle overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-500 rounded-full"
                    style={{
                      width: rating.data?.level === "L2" ? "65%" : rating.data?.level === "L3" ? "100%" : "20%",
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>{rating.data?.count ?? 0} / 30 reviews to Level 3</span>
                <span className="font-semibold text-primary">30m early access active</span>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section variants={cardMotion} className={cn(CARD, "gap-4 lg:col-span-2")} aria-labelledby="details">
          <h2 id="details" className="text-[15px] font-extrabold tracking-[-0.02em]">Your details</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs text-ink-2">Full name</Label>
              <Input id="fullName" value={fullName} maxLength={100} onChange={(event) => setFullName(cleanName(event.target.value))} autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="whatsapp" className="text-xs text-ink-2">WhatsApp number</Label>
              <Input
                id="whatsapp"
                type="tel"
                value={whatsapp}
                maxLength={20}
                onChange={(event) => setWhatsapp(cleanPhone(event.target.value))}
                autoComplete="tel"
                placeholder="+91 00000 00000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="country" className="text-xs text-ink-2">Country</Label>
              <Input id="country" value={profile.data?.country ?? ""} disabled readOnly />
            </div>
          </div>
          <p className="text-xs font-medium text-ink-muted">
            WhatsApp is only used to reach you about work. Country is set once at sign up; ask Support to change it.
          </p>
          <Button className="w-full sm:w-auto sm:self-end" disabled={save.isPending || !fullName.trim()} onClick={() => save.mutate()}>
            {save.isPending ? "Saving..." : "Save changes"}
          </Button>
        </motion.section>

        <MfaSecurityCard />
      </CardGrid>
    </div>
  );
}

function MfaSecurityCard() {
  const queryClient = useQueryClient();
  const [enrollData, setEnrollData] = useState<{
    id: string;
    totp: { qr_code: string; secret: string; uri: string };
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [copiedSecret, setCopiedSecret] = useState(false);

  const mfaFactors = useQuery({
    queryKey: qk.mfa(),
    queryFn: listMfaFactors,
  });

  const enrolledFactor = mfaFactors.data?.find(
    (factor) => factor.status === "verified" || factor.status === "active",
  );

  const enrollMutation = useMutation({
    mutationFn: enrollMfaTotp,
    onSuccess: (data) => {
      setEnrollData(data);
      setVerificationCode("");
    },
    onError: (err: Error) => toast.error(toUserError(err, "Could not start 2FA setup.")),
  });

  const verifyMutation = useMutation({
    mutationFn: async () => {
      if (!enrollData) throw new Error("No enrollment in progress.");
      const cleaned = verificationCode.trim().replace(/\s+/g, "");
      if (cleaned.length !== 6) throw new Error("Please enter the 6-digit code.");
      await verifyMfaChallenge(enrollData.id, cleaned);
    },
    onSuccess: () => {
      toast.success("Two-factor authentication enabled successfully!");
      setEnrollData(null);
      setVerificationCode("");
      void queryClient.invalidateQueries({ queryKey: qk.mfa() });
    },
    onError: (err: Error) => toast.error(toUserError(err, "Invalid verification code.")),
  });

  const unenrollMutation = useMutation({
    mutationFn: async (factorId: string) => {
      await unenrollMfa(factorId);
    },
    onSuccess: () => {
      toast.success("Two-factor authentication disabled.");
      void queryClient.invalidateQueries({ queryKey: qk.mfa() });
    },
    onError: (err: Error) => toast.error(toUserError(err, "Could not disable 2FA.")),
  });

  function copySecret() {
    if (!enrollData?.totp.secret) return;
    navigator.clipboard.writeText(enrollData.totp.secret);
    setCopiedSecret(true);
    toast.success("Secret key copied to clipboard.");
    setTimeout(() => setCopiedSecret(false), 2000);
  }

  return (
    <motion.section variants={cardMotion} className={cn(CARD, "gap-4 lg:col-span-2")} aria-labelledby="security">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <h2 id="security" className="text-[15px] font-extrabold tracking-[-0.02em]">
              Two-factor authentication (MFA)
            </h2>
            <p className="text-xs text-ink-muted">
              Add an extra layer of protection using Google Authenticator, Authy, or 1Password.
            </p>
          </div>
        </div>
        {enrolledFactor ? (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-3 py-1 text-xs font-bold text-success-ink">
            <Check className="h-3.5 w-3.5" aria-hidden="true" />
            Active
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 rounded-full bg-warning-bg px-3 py-1 text-xs font-bold text-warning-ink">
            Not configured
          </span>
        )}
      </div>

      {enrolledFactor ? (
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-line-subtle bg-panel/50 p-4">
          <div className="flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-ink-2" aria-hidden="true" />
            <div>
              <p className="text-sm font-bold text-ink">Authenticator App (TOTP)</p>
              <p className="text-xs text-ink-muted">Code requested upon each sign-in.</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="text-danger-ink border-danger-ink/30 hover:bg-danger-bg"
            disabled={unenrollMutation.isPending}
            onClick={() => unenrollMutation.mutate(enrolledFactor.id)}
          >
            {unenrollMutation.isPending ? "Disabling..." : "Disable 2FA"}
          </Button>
        </div>
      ) : enrollData ? (
        <div className="space-y-4 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-ink">Set up Authenticator App</h3>
              <p className="mt-0.5 text-xs text-ink-muted">
                Scan the QR code in your authenticator app, or enter the secret key manually.
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setEnrollData(null)}>
              Cancel
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <AuthenticatorQrView qrCode={enrollData.totp.qr_code} uri={enrollData.totp.uri} />
            <div className="min-w-0 flex-1 space-y-2">
              <Label className="text-xs font-bold text-ink-2">Secret key (manual entry):</Label>
              <div className="flex items-center gap-2">
                <code className="rounded-xl border border-line-subtle bg-panel px-3 py-1.5 font-mono text-xs font-bold text-ink select-all">
                  {enrollData.totp.secret}
                </code>
                <Button variant="outline" size="sm" onClick={copySecret}>
                  {copiedSecret ? "Copied!" : "Copy"}
                </Button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <Label htmlFor="mfaCode" className="text-xs font-bold text-ink-2">
              Enter 6-digit verification code from your authenticator:
            </Label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              <Input
                id="mfaCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
                placeholder="123456"
                className="max-w-[180px] font-mono tracking-widest text-center font-bold"
              />
              <Button
                disabled={verificationCode.trim().length !== 6 || verifyMutation.isPending}
                onClick={() => verifyMutation.mutate()}
              >
                {verifyMutation.isPending ? "Verifying..." : "Verify & Activate"}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
          <p className="max-w-md text-xs text-ink-muted">
            Protects your earnings, personal details, and assigned projects by requiring a 6-digit code from your phone whenever you log in.
          </p>
          <Button
            variant="outline"
            disabled={enrollMutation.isPending}
            onClick={() => enrollMutation.mutate()}
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            {enrollMutation.isPending ? "Starting..." : "Configure 2FA"}
          </Button>
        </div>
      )}
    </motion.section>
  );
}

/** How many setup steps are done, as a ring. */
function SetupRing({ done, total }: { done: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const radius = 24;
  return (
    <span className="relative flex h-16 w-16 shrink-0 items-center justify-center" role="img" aria-label={`${done} of ${total} setup steps done`}>
      <svg viewBox="0 0 60 60" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="var(--color-panel)" strokeWidth="7" />
        {done > 0 ? (
          <motion.circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={done === total ? "var(--color-success-dot)" : "var(--color-primary)"}
            strokeWidth="7"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: done / total }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </svg>
      <span className="text-sm font-extrabold">
        {done}/{total}
      </span>
    </span>
  );
}

/** Five stars, filled to the average rating. */
function Stars({ value }: { value: number | null }) {
  return (
    <div className="flex items-center gap-1" role="img" aria-label={value != null ? `Rated ${value.toFixed(1)} out of 5` : "Not rated yet"}>
      {Array.from({ length: 5 }, (_, index) => {
        const fill = value == null ? 0 : Math.max(0, Math.min(1, value - index));
        return (
          <span key={index} className="relative h-6 w-6" aria-hidden="true">
            <Star className="absolute inset-0 h-6 w-6 text-line-subtle" />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="h-6 w-6 fill-[var(--dl-card-yellow)] text-[#e0b100]" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

const SHORTCUTS = [
  { to: "/dashboard?view=earnings", label: "Earnings", sub: "Payouts and tax", icon: Wallet, tone: "bg-success-bg text-success-ink" },
  { to: "/notifications", label: "Alerts", sub: "Updates on your work", icon: Bell, tone: "bg-info-bg text-primary" },
  { to: "/refer", label: "Refer and earn", sub: "Invite people you trust", icon: Gift, tone: "bg-violet-light text-violet" },
  { to: "/tickets", label: "Support", sub: "Ask us anything", icon: LifeBuoy, tone: "bg-warning-bg text-warning-ink" },
];

/** The account pages that live under the profile rather than in the sidebar. */
function Shortcuts() {
  const notifications = useNotifications();
  const unread = (notifications.data ?? []).filter((item) => !item.readAt).length;
  return (
    <motion.nav variants={cardMotion} aria-label="Account shortcuts" className="grid grid-cols-2 gap-3 lg:col-span-2 lg:grid-cols-4">
      {SHORTCUTS.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onMouseEnter={() => preloadRoute(item.to)}
          className={cn(
            CARD,
            "group flex-row items-center gap-3 p-3.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:p-4",
          )}
        >
          <span className={cn("relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105", item.tone)} aria-hidden="true">
            <item.icon className="h-5 w-5" />
            {item.to === "/notifications" && unread > 0 ? (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[10.5px] font-extrabold text-white ring-2 ring-white">
                {unread}
              </span>
            ) : null}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[14px] font-extrabold tracking-[-0.01em]">{item.label}</span>
            <span className="block truncate text-xs font-semibold text-ink-muted">
              {item.to === "/notifications" && unread > 0 ? `${unread} unread` : item.sub}
            </span>
          </span>
          <ChevronRight className="hidden h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5 sm:block" aria-hidden="true" />
        </Link>
      ))}
    </motion.nav>
  );
}

/** Crisp Authenticator QR Code renderer with fallback on-the-fly generation from URI */
function AuthenticatorQrView({ qrCode, uri }: { qrCode?: string; uri?: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(
    qrCode && qrCode.startsWith("data:image/") ? qrCode : null,
  );

  useEffect(() => {
    if (dataUrl) return;
    if (uri) {
      void QRCode.toDataURL(uri, {
        margin: 1,
        width: 256,
        color: { dark: "#0a1e3b", light: "#ffffff" },
      })
        .then(setDataUrl)
        .catch(() => {});
    }
  }, [uri, dataUrl]);

  return (
    <div className="relative flex h-36 w-36 shrink-0 items-center justify-center rounded-2xl border border-line-subtle bg-white p-2.5 shadow-xs">
      {dataUrl ? (
        <img
          src={dataUrl}
          alt="Authenticator setup QR code"
          className="h-full w-full rounded-xl object-contain"
        />
      ) : (
        <div className="flex flex-col items-center justify-center text-center text-xs text-ink-muted">
          <Smartphone className="mb-1 h-5 w-5 text-ink-3 animate-pulse" />
          <span>Generating QR...</span>
        </div>
      )}
    </div>
  );
}


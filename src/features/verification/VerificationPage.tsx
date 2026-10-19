import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  Clock,
  IdCard,
  Landmark,
  Lock,
  Pencil,
  ShieldCheck,
  UserRound,
  X,
  type LucideIcon,
} from "lucide-react";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { TickBox } from "@/components/app/TickBox";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/brutal/Skeleton";
import { cn } from "@/lib/cn";
import { toUserError } from "@/lib/user-error";
import { qk } from "@/lib/query-keys";
import { updateProfileBasics } from "@/features/auth/api";
import { useProfile } from "@/features/dashboard/queries";
import type { KycStatus } from "@/types/database";
import { IFSC_PATTERN, PAN_PATTERN, fetchKycStatus, sameName, submitKyc, validateIdentityFile } from "./api";

const STEPS: { id: string; label: string; icon: LucideIcon }[] = [
  { id: "profile", label: "Profile", icon: UserRound },
  { id: "pan", label: "PAN card", icon: IdCard },
  { id: "bank", label: "Bank", icon: Landmark },
  { id: "review", label: "Review", icon: CheckCircle2 },
];

const NAME_PATTERN = /^[\p{L}\s.'-]{3,100}$/u;

/** Ten digits starting 6 to 9, from whatever the doer typed or had saved. */
function tenDigits(raw: string | null | undefined): string {
  const digits = (raw ?? "").replace(/\D/g, "");
  return digits.length > 10 ? digits.slice(-10) : digits;
}

const maskPan = (pan: string) => (pan.length === 10 ? `${pan.slice(0, 5)}****${pan.slice(9)}` : pan);
const maskAccount = (account: string) => (account.length > 4 ? `**** ${account.slice(-4)}` : account);

/** The four steps along the top. Steps already done can be tapped to go back. */
function Stepper({ step, onJump }: { step: number; onJump: (step: number) => void }) {
  return (
    <ol className="grid grid-cols-4" aria-label="Verification steps">
      {STEPS.map((item, index) => {
        const done = index < step;
        const now = index === step;
        return (
          <li key={item.id} className="min-w-0">
            <button
              type="button"
              disabled={!done}
              onClick={() => onJump(index)}
              aria-current={now ? "step" : undefined}
              className="flex w-full flex-col items-center gap-2 text-center disabled:cursor-default"
            >
              <span className="relative flex w-full items-center">
                <span className={cn("h-1 flex-1 rounded-full", index === 0 ? "bg-transparent" : index <= step ? "bg-primary" : "bg-panel")} />
                <span
                  className={cn(
                    "mx-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors",
                    done ? "bg-success-dot text-white" : now ? "bg-primary text-white shadow-[0_6px_16px_-6px_rgba(10,101,192,0.7)]" : "bg-panel text-ink-3",
                  )}
                >
                  {done ? <Check className="h-5 w-5" strokeWidth={3} /> : <item.icon className="h-[18px] w-[18px]" />}
                </span>
                <span className={cn("h-1 flex-1 rounded-full", index === STEPS.length - 1 ? "bg-transparent" : index < step ? "bg-primary" : "bg-panel")} />
              </span>
              <span className={cn("truncate text-[12px] font-bold", now ? "text-primary" : done ? "text-ink" : "text-ink-3")}>{item.label}</span>
            </button>
          </li>
        );
      })}
    </ol>
  );
}

/** Pick a photo or PDF; images show a preview so the doer can see what they chose. */
function UploadTile({
  id,
  label,
  hint,
  file,
  error,
  round = false,
  icon: Icon,
  onPick,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  error: string | null;
  round?: boolean;
  icon: LucideIcon;
  onPick: (file: File | null) => void;
}) {
  const preview = useMemo(() => (file && file.type.startsWith("image/") ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => (preview ? URL.revokeObjectURL(preview) : undefined), [preview]);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-4 rounded-2xl p-3.5 transition-colors",
          "has-[+input:focus-visible]:outline-2 has-[+input:focus-visible]:outline-primary",
          error ? "bg-danger-bg" : file ? "bg-success-bg" : "bg-panel/60 hover:bg-panel",
        )}
      >
        <span
          className={cn(
            "flex shrink-0 items-center justify-center overflow-hidden bg-white",
            round ? "h-16 w-16 rounded-full" : "h-14 w-20 rounded-xl",
            error ? "text-danger-ink" : file ? "text-success-ink" : "text-primary",
          )}
          aria-hidden="true"
        >
          {preview ? <img src={preview} alt="" className="h-full w-full object-cover" /> : file ? <Check className="h-6 w-6" /> : <Icon className="h-6 w-6" />}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-bold text-ink">{label}</span>
          <span className="block truncate text-xs font-semibold text-ink-muted">{file ? file.name : hint}</span>
        </span>
        <span className="shrink-0 rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-primary">{file ? "Change" : "Upload"}</span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={(event) => {
          onPick(event.target.files?.[0] ?? null);
          event.target.value = "";
        }}
      />
      {error ? (
        <p role="alert" className="px-1 text-xs font-semibold text-danger-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function Field({
  id,
  label,
  error,
  ok,
  children,
}: {
  id: string;
  label: string;
  error?: string | null;
  ok?: string | null;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-bold text-ink-2">
        {label}
      </Label>
      {children}
      {error ? (
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold text-danger-ink">
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          {error}
        </p>
      ) : ok ? (
        <p className="flex items-center gap-1.5 px-1 text-xs font-semibold text-success-ink">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          {ok}
        </p>
      ) : null}
    </div>
  );
}

/** Where the account stands once details are sent: checking, verified, or try again. */
function StatusCard({ status }: { status: KycStatus }) {
  const reduceMotion = useReducedMotion();
  const approved = status === "approved";
  const stages = ["Sent", "Checking", "Verified"];
  const reached = approved ? 3 : 1;
  return (
    <motion.section variants={cardMotion} className={cn(CARD, "items-center gap-5 px-6 py-8 text-center")}>
      <motion.span
        className={cn("flex h-20 w-20 items-center justify-center rounded-full", approved ? "bg-success-bg text-success-ink" : "bg-info-bg text-primary")}
        initial={reduceMotion ? false : { scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 18 }}
        aria-hidden="true"
      >
        {approved ? <ShieldCheck className="h-10 w-10" /> : <Clock className="h-10 w-10" />}
      </motion.span>
      <div>
        <h2 className="text-xl font-extrabold tracking-[-0.03em]">{approved ? "You are verified" : "We are checking your details"}</h2>
        <p className="mt-1 text-sm text-ink-2">
          {approved ? "Your PAN and bank account are confirmed. Payouts can reach you." : "This usually takes a short while. We will let you know here."}
        </p>
      </div>
      <ol className="grid w-full max-w-md grid-cols-3 gap-2" aria-label="Progress">
        {stages.map((label, index) => {
          const done = index < reached;
          const now = index === reached && !approved;
          return (
            <li key={label} className="space-y-2" aria-current={now ? "step" : undefined}>
              <span className="block h-2 overflow-hidden rounded-full bg-panel">
                <motion.span
                  className={cn("block h-full rounded-full", done ? "bg-success-dot" : "bg-primary")}
                  initial={reduceMotion ? false : { width: "0%" }}
                  animate={{ width: done ? "100%" : now ? "50%" : "0%" }}
                  transition={{ duration: 0.8, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
                />
              </span>
              <span className={cn("block text-xs font-bold", done ? "text-success-ink" : now ? "text-primary" : "text-ink-3")}>{label}</span>
            </li>
          );
        })}
      </ol>
      {approved ? (
        <Button asChild>
          <Link to="/home">
            Back to your steps
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </motion.section>
  );
}

/**
 * Verification, one step at a time: profile, PAN card, bank account, then a review
 * before sending. The bank account must be in the same name as the Dolancer profile,
 * which is the name on the PAN card, so payouts go to the person who did the work.
 */
export function VerificationPage() {
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const profile = useProfile();
  const status = useQuery({
    queryKey: qk.kyc(),
    queryFn: fetchKycStatus,
    // While it is being checked, look again every few seconds so approval shows at once.
    refetchInterval: (query) => (query.state.data === "submitted" ? 3000 : false),
  });

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [seeded, setSeeded] = useState(false);

  const [photo, setPhoto] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  const [pan, setPan] = useState("");
  const [panPhoto, setPanPhoto] = useState<File | null>(null);
  const [panPhotoError, setPanPhotoError] = useState<string | null>(null);
  const [panNameOk, setPanNameOk] = useState(false);

  const [holder, setHolder] = useState("");
  const [account, setAccount] = useState("");
  const [account2, setAccount2] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [agree, setAgree] = useState(false);

  // Fill in what the profile already knows, once.
  useEffect(() => {
    if (seeded || !profile.data) return;
    setFullName(profile.data.full_name ?? "");
    setMobile(tenDigits(profile.data.whatsapp));
    setHolder(profile.data.full_name ?? "");
    setSeeded(true);
  }, [profile.data, seeded]);

  // When the check finishes, refresh everything that depends on it.
  const current = status.data ?? "pending";
  useEffect(() => {
    if (current !== "approved") return;
    void queryClient.invalidateQueries({ queryKey: qk.gate() });
    void queryClient.invalidateQueries({ queryKey: qk.notifications.all() });
  }, [current, queryClient]);

  const saveProfile = useMutation({
    mutationFn: () => updateProfileBasics({ fullName: fullName.trim().replace(/\s+/g, " "), whatsapp: `+91 ${mobile}` }),
    onSuccess: () => void queryClient.invalidateQueries({ queryKey: qk.profile() }),
  });

  const submit = useMutation({
    mutationFn: () =>
      submitKyc({
        document: panPhoto as File,
        selfie: photo as File,
        panNumber: pan,
        payout: { method: "bank", accountNumber: account, ifsc, name: holder.trim() },
      }),
    onSuccess: () => {
      toast.success("Sent. We will let you know once it is checked.");
      void queryClient.invalidateQueries({ queryKey: qk.kyc() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not send. Check your details and try again.")),
  });

  const profileName = fullName.trim();
  const nameError = profileName && !NAME_PATTERN.test(profileName) ? "Use letters and spaces only, as on your PAN card." : null;
  const mobileError = mobile && !/^[6-9]\d{9}$/.test(mobile) ? "Enter a 10 digit mobile number." : null;
  const profileReady = Boolean(photo && !photoError && profileName.length >= 3 && !nameError && /^[6-9]\d{9}$/.test(mobile));

  const panError = pan.length === 10 && !PAN_PATTERN.test(pan) ? "That does not look like a PAN. It is 5 letters, 4 numbers, 1 letter." : null;
  const panReady = PAN_PATTERN.test(pan) && Boolean(panPhoto && !panPhotoError) && panNameOk;

  const holderMatches = sameName(holder, profileName);
  const holderError = holder.trim() && !holderMatches ? `Must match your profile name: ${profileName}` : null;
  const accountError = account && !/^\d{9,18}$/.test(account) ? "Account numbers are 9 to 18 digits." : null;
  const account2Error = account2 && account2 !== account ? "The two numbers do not match." : null;
  const ifscError = ifsc.length === 11 && !IFSC_PATTERN.test(ifsc) ? "That does not look like an IFSC code." : null;
  const bankReady = holderMatches && /^\d{9,18}$/.test(account) && account === account2 && IFSC_PATTERN.test(ifsc);

  const ready = profileReady && panReady && bankReady && agree;
  const canSubmit = current === "pending" || current === "rejected";

  function go(next: number) {
    setDirection(next > step ? 1 : -1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
  }

  function pickFile(file: File | null, set: (file: File | null) => void, setError: (error: string | null) => void) {
    const problem = file ? validateIdentityFile(file) : null;
    setError(problem);
    set(problem ? null : file);
  }

  async function continueFromProfile() {
    const changed = profileName !== (profile.data?.full_name ?? "").trim() || `+91 ${mobile}` !== (profile.data?.whatsapp ?? "");
    if (changed) {
      try {
        await saveProfile.mutateAsync();
      } catch (error) {
        toast.error(toUserError(error, "Could not save your profile. Try again."));
        return;
      }
    }
    // The bank account has to be in this name, so start it off the same.
    if (!holder.trim() || !sameName(holder, profileName)) setHolder(profileName);
    go(1);
  }

  const slide = {
    initial: reduceMotion ? false : { opacity: 0, x: 24 * direction },
    animate: { opacity: 1, x: 0 },
    exit: reduceMotion ? undefined : { opacity: 0, x: -24 * direction, transition: { duration: 0.15 } },
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] as const },
  };

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader title="Verification" sub="Four short steps. Your details stay private." />

      <CardGrid>
        {status.isLoading || profile.isLoading ? (
          <Skeleton className="h-80 w-full rounded-[20px]" />
        ) : status.isError ? (
          <EmptyPanel
            tone="danger"
            icon={<AlertTriangle />}
            title="Status did not load"
            action={
              <Button variant="outline" onClick={() => void status.refetch()}>
                Try again
              </Button>
            }
          />
        ) : !canSubmit ? (
          <StatusCard status={current} />
        ) : (
          <motion.section variants={cardMotion} className={cn(CARD, "gap-6 overflow-hidden p-5 sm:p-7")}>
            {current === "rejected" ? (
              <p className="flex items-center gap-2.5 rounded-2xl bg-danger-bg px-4 py-3 text-[13px] font-bold text-danger-ink">
                <AlertTriangle className="h-4 w-4 shrink-0" aria-hidden="true" />
                We could not confirm your last details. Please send them again with clear photos.
              </p>
            ) : null}

            <Stepper step={step} onJump={go} />

            <AnimatePresence mode="wait" initial={false}>
              {step === 0 ? (
                <motion.div key="profile" {...slide} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-[-0.025em]">Your profile</h2>
                    <p className="text-sm text-ink-2">Use your name exactly as it is on your PAN card.</p>
                  </div>
                  <UploadTile
                    id="kyc-photo"
                    label="Your photo"
                    hint="A clear photo of your face"
                    icon={Camera}
                    round
                    file={photo}
                    error={photoError}
                    onPick={(file) => pickFile(file, setPhoto, setPhotoError)}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="full-name" label="Full name, as on PAN" error={nameError}>
                      <Input id="full-name" value={fullName} onChange={(event) => setFullName(event.target.value)} autoComplete="name" placeholder="Shubham Kumar" />
                    </Field>
                    <Field id="mobile" label="Mobile number" error={mobileError}>
                      <div className="flex items-stretch gap-2">
                        <span className="flex items-center rounded-xl bg-panel px-3 text-sm font-bold text-ink-2">+91</span>
                        <Input
                          id="mobile"
                          inputMode="numeric"
                          value={mobile}
                          maxLength={10}
                          onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 10))}
                          autoComplete="tel-national"
                          placeholder="98765 43210"
                        />
                      </div>
                    </Field>
                  </div>
                  <p className="text-xs font-semibold text-ink-muted">This name becomes your Dolancer profile name.</p>
                  <Button size="lg" className="w-full" disabled={!profileReady || saveProfile.isPending} onClick={() => void continueFromProfile()}>
                    {saveProfile.isPending ? "Saving..." : "Continue"}
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </motion.div>
              ) : step === 1 ? (
                <motion.div key="pan" {...slide} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-[-0.025em]">PAN card</h2>
                    <p className="text-sm text-ink-2">Needed for tax on your payouts.</p>
                  </div>

                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#0a65c0] to-[#3d8bfd] p-5 text-white" aria-hidden="true">
                    <span className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/10" />
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-white/75">Permanent account number</span>
                      <IdCard className="h-5 w-5 text-white/80" />
                    </div>
                    <p className="mt-4 font-mono text-[22px] font-extrabold tracking-[0.18em] sm:text-[26px]">{pan.padEnd(10, "_").replace(/(.{5})(.{4})(.)/, "$1 $2 $3")}</p>
                    <p className="mt-2 truncate text-sm font-bold text-white/90">{profileName || "Your name"}</p>
                  </div>

                  <Field id="pan" label="PAN number" error={panError} ok={PAN_PATTERN.test(pan) ? "Looks right" : null}>
                    <Input
                      id="pan"
                      value={pan}
                      maxLength={10}
                      onChange={(event) => setPan(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10))}
                      autoComplete="off"
                      placeholder="ABCDE1234F"
                      className="font-mono tracking-[0.12em]"
                    />
                  </Field>
                  <UploadTile
                    id="kyc-pan"
                    label="Photo of your PAN card"
                    hint="Front side, all four corners showing"
                    icon={IdCard}
                    file={panPhoto}
                    error={panPhotoError}
                    onPick={(file) => pickFile(file, setPanPhoto, setPanPhotoError)}
                  />
                  <TickBox checked={panNameOk} onChange={setPanNameOk}>
                    The name on my PAN card is <span className="text-ink">{profileName}</span>
                  </TickBox>
                  <div className="grid grid-cols-[auto_1fr] gap-2.5">
                    <Button variant="outline" size="lg" onClick={() => go(0)} aria-label="Back">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="lg" disabled={!panReady} onClick={() => go(2)}>
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </motion.div>
              ) : step === 2 ? (
                <motion.div key="bank" {...slide} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-[-0.025em]">Bank account</h2>
                    <p className="text-sm text-ink-2">Where your payouts land. It must be in your own name.</p>
                  </div>
                  <Field
                    id="holder"
                    label="Account holder name"
                    error={holderError}
                    ok={holder.trim() && holderMatches ? "Matches your profile name" : null}
                  >
                    <Input id="holder" value={holder} onChange={(event) => setHolder(event.target.value)} autoComplete="off" />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field id="account" label="Account number" error={accountError}>
                      <Input
                        id="account"
                        inputMode="numeric"
                        value={account}
                        onChange={(event) => setAccount(event.target.value.replace(/\D/g, "").slice(0, 18))}
                        autoComplete="off"
                      />
                    </Field>
                    <Field id="account2" label="Type it again" error={account2Error} ok={account2 && account2 === account && !accountError ? "Numbers match" : null}>
                      <Input
                        id="account2"
                        inputMode="numeric"
                        value={account2}
                        onChange={(event) => setAccount2(event.target.value.replace(/\D/g, "").slice(0, 18))}
                        autoComplete="off"
                      />
                    </Field>
                  </div>
                  <Field id="ifsc" label="IFSC code" error={ifscError} ok={IFSC_PATTERN.test(ifsc) ? "Looks right" : null}>
                    <Input
                      id="ifsc"
                      value={ifsc}
                      maxLength={11}
                      onChange={(event) => setIfsc(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11))}
                      placeholder="SBIN0001234"
                      autoComplete="off"
                      className="font-mono tracking-[0.08em]"
                    />
                  </Field>
                  <p className="flex items-start gap-2 text-[11.5px] font-medium text-ink-muted">
                    <Lock className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    We keep only the last four digits. The full number goes to our payments provider.
                  </p>
                  <div className="grid grid-cols-[auto_1fr] gap-2.5">
                    <Button variant="outline" size="lg" onClick={() => go(1)} aria-label="Back">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="lg" disabled={!bankReady} onClick={() => go(3)}>
                      Continue
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="review" {...slide} className="space-y-5">
                  <div>
                    <h2 className="text-lg font-extrabold tracking-[-0.025em]">Check and send</h2>
                    <p className="text-sm text-ink-2">Tap a section to change it.</p>
                  </div>
                  <ul className="space-y-2.5">
                    {[
                      { label: "Profile", icon: UserRound, lines: [profileName, `+91 ${mobile}`, photo ? "Photo added" : ""], to: 0 },
                      { label: "PAN card", icon: IdCard, lines: [maskPan(pan), panPhoto ? "Card photo added" : ""], to: 1 },
                      { label: "Bank", icon: Landmark, lines: [holder.trim(), maskAccount(account), ifsc], to: 2 },
                    ].map((row) => (
                      <li key={row.label}>
                        <button
                          type="button"
                          onClick={() => go(row.to)}
                          className="group flex w-full items-center gap-3.5 rounded-2xl bg-panel/60 p-3.5 text-left transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
                        >
                          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success-bg text-success-ink" aria-hidden="true">
                            <row.icon className="h-5 w-5" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block text-[13.5px] font-extrabold">{row.label}</span>
                            <span className="block truncate text-xs font-semibold text-ink-muted">{row.lines.filter(Boolean).join(" · ")}</span>
                          </span>
                          <Pencil className="h-4 w-4 shrink-0 text-ink-3 group-hover:text-primary" aria-hidden="true" />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <TickBox checked={agree} onChange={setAgree}>
                    These details are mine and correct
                  </TickBox>
                  <div className="grid grid-cols-[auto_1fr] gap-2.5">
                    <Button variant="outline" size="lg" onClick={() => go(2)} aria-label="Back">
                      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button size="lg" disabled={!ready || submit.isPending} onClick={() => submit.mutate()}>
                      <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                      {submit.isPending ? "Sending..." : "Send for verification"}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.section>
        )}
      </CardGrid>
    </div>
  );
}

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ShieldCheck, Upload, Check, Clock, X } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Skeleton } from "@/components/brutal/Skeleton";
import { ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import type { KycStatus } from "@/types/database";
import { fetchKycStatus, submitKyc, type PayoutInput } from "./api";

const STATUS_COPY: Record<KycStatus, { tone: string; icon: typeof Check; title: string; body: string }> = {
  pending: {
    tone: "bg-warning-bg text-warning-ink",
    icon: Clock,
    title: "Not verified yet",
    body: "Send us your details and a supervisor will confirm them. You keep full access to the app meanwhile.",
  },
  submitted: {
    tone: "bg-info-bg text-info-ink",
    icon: Clock,
    title: "With our team",
    body: "Your documents are being checked. This usually takes a short while, and you will be notified when it is done.",
  },
  approved: {
    tone: "bg-success-bg text-success-ink",
    icon: Check,
    title: "Verified",
    body: "You are verified and can claim work and be paid.",
  },
  rejected: {
    tone: "bg-danger-bg text-danger-ink",
    icon: X,
    title: "Something was not right",
    body: "We could not confirm your details from what was sent. Submit again with clearer documents.",
  },
};

function FileField({
  id,
  label,
  hint,
  file,
  onChange,
}: {
  id: string;
  label: string;
  hint: string;
  file: File | null;
  onChange: (file: File | null) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <label
        htmlFor={id}
        className={cn(
          "flex cursor-pointer items-center gap-3 rounded-md border-2 border-dashed border-ink px-4 py-3.5",
          "text-sm font-semibold transition-colors",
          file ? "bg-success-bg" : "bg-surface hover:bg-hover",
        )}
      >
        {file ? (
          <Check className="h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
        ) : (
          <Upload className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
        )}
        <span className="min-w-0 flex-1 truncate">{file ? file.name : "Choose a file"}</span>
      </label>
      <input
        id={id}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <p className="text-xs text-ink-muted">{hint}</p>
    </div>
  );
}

export function VerificationPage() {
  const queryClient = useQueryClient();
  const status = useQuery({ queryKey: qk.kyc(), queryFn: fetchKycStatus });

  const [document, setDocument] = useState<File | null>(null);
  const [selfie, setSelfie] = useState<File | null>(null);
  const [method, setMethod] = useState<"upi" | "bank">("upi");
  const [vpa, setVpa] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [holder, setHolder] = useState("");

  const submit = useMutation({
    mutationFn: submitKyc,
    onSuccess: () => {
      toast.success("Sent. We will let you know once it is checked.");
      void queryClient.invalidateQueries({ queryKey: qk.kyc() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
      setDocument(null);
      setSelfie(null);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const payout: PayoutInput =
    method === "upi"
      ? { method: "upi", vpa: vpa.trim() }
      : {
          method: "bank",
          accountNumber: accountNumber.trim(),
          ifsc: ifsc.trim().toUpperCase(),
          name: holder.trim(),
        };

  const payoutReady =
    method === "upi"
      ? vpa.trim().length > 2
      : accountNumber.trim().length >= 6 && ifsc.trim().length === 11 && holder.trim().length > 0;

  const ready = Boolean(document && selfie && payoutReady);
  const current = status.data ?? "pending";
  const spec = STATUS_COPY[current];
  const canSubmit = current === "pending" || current === "rejected";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Verification</h1>
        <p className="mt-2 text-md text-ink-2">
          We check who you are before money can move. This is the step that unlocks earning.
        </p>
      </header>

      {status.isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : status.isError ? (
        <ErrorState
          description="Your verification status did not load."
          onRetry={() => void status.refetch()}
        />
      ) : (
        <Card className={cn("border-2", spec.tone)}>
          <div className="flex items-start gap-3">
            <spec.icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.025em]">{spec.title}</h2>
              <p className="mt-1 text-sm leading-relaxed opacity-90">{spec.body}</p>
            </div>
          </div>
        </Card>
      )}

      {canSubmit ? (
        <form
          className="space-y-6"
          onSubmit={(event) => {
            event.preventDefault();
            if (!document || !selfie) return;
            submit.mutate({ document, selfie, payout });
          }}
        >
          <Card className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.025em]">Who you are</h2>
              <p className="mt-1 text-sm text-ink-2">
                A government photo ID, and a photo of your face so we can match it.
              </p>
            </div>

            <FileField
              id="kyc-document"
              label="Government photo ID"
              hint="PAN card, passport, driving licence or Aadhaar. JPG, PNG, WEBP or PDF, under 10MB."
              file={document}
              onChange={setDocument}
            />
            <FileField
              id="kyc-selfie"
              label="A photo of you"
              hint="A clear, recent photo of your face. Not a picture of your ID."
              file={selfie}
              onChange={setSelfie}
            />

            <p className="rounded-md border border-line-card bg-surface-2 px-3 py-2.5 text-[11px] leading-relaxed text-ink-2">
              Documents are stored encrypted under a random reference, never under your name.
              They are deleted once your identity is confirmed. Only an irreversible hash is
              kept afterwards, solely to stop a removed account signing up again.
            </p>
          </Card>

          <Card className="space-y-5">
            <div>
              <h2 className="text-lg font-extrabold tracking-[-0.025em]">Where you get paid</h2>
              <p className="mt-1 text-sm text-ink-2">
                Payouts go here once work is approved.
              </p>
            </div>

            <div className="flex gap-2">
              {(["upi", "bank"] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setMethod(option)}
                  aria-pressed={method === option}
                  className={cn(
                    "flex-1 rounded-md border-2 border-ink px-4 py-2.5 text-sm font-extrabold transition-all duration-[120ms]",
                    method === option
                      ? "bg-lime shadow-offset-sm"
                      : "bg-surface hover:bg-hover",
                  )}
                >
                  {option === "upi" ? "UPI" : "Bank account"}
                </button>
              ))}
            </div>

            {method === "upi" ? (
              <div className="space-y-2">
                <Label htmlFor="vpa">UPI ID</Label>
                <Input
                  id="vpa"
                  value={vpa}
                  onChange={(event) => setVpa(event.target.value)}
                  placeholder="yourname@bank"
                  autoComplete="off"
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="holder">Account holder name</Label>
                  <Input
                    id="holder"
                    value={holder}
                    onChange={(event) => setHolder(event.target.value)}
                    placeholder="As it appears on the account"
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="account">Account number</Label>
                  <Input
                    id="account"
                    inputMode="numeric"
                    value={accountNumber}
                    onChange={(event) => setAccountNumber(event.target.value)}
                    autoComplete="off"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ifsc">IFSC code</Label>
                  <Input
                    id="ifsc"
                    value={ifsc}
                    onChange={(event) => setIfsc(event.target.value.toUpperCase())}
                    placeholder="ABCD0123456"
                    maxLength={11}
                    autoComplete="off"
                  />
                </div>
              </div>
            )}

            <p className="rounded-md border border-line-card bg-surface-2 px-3 py-2.5 text-[11px] leading-relaxed text-ink-2">
              Your full account number is never stored here. It is exchanged for a token with
              our payments provider, and we keep only a masked version to show you which
              account it is.
            </p>
          </Card>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={!ready || submit.isPending}
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {submit.isPending ? "Sending..." : "Submit for verification"}
          </Button>

          {!ready ? (
            <p className="text-center text-xs text-ink-muted">
              Add both documents and your payout details to continue.
            </p>
          ) : null}
        </form>
      ) : null}
    </div>
  );
}

import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, Check, Info, Landmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { isDemo } from "@/lib/demo-auth";
import { cleanName, cleanText } from "@/lib/input-safety";
import { toUserError } from "@/lib/user-error";
import { formatDateTime } from "@/lib/datetime";
import { useProfile } from "@/features/dashboard/queries";
import {
  HOLD_HOURS,
  checkPayoutAccount,
  methodName,
  newMethodProblem,
  savePayoutMethod,
  sendPayoutCode,
  type NewPayoutMethod,
  type PayoutMethod,
  type PayoutMethodKind,
} from "./api";

function Field({ id, label, children, hint }: { id: string; label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-bold text-ink-2">
        {label}
      </label>
      {children}
      {hint ? <p className="text-[11.5px] font-semibold text-ink-muted">{hint}</p> : null}
    </div>
  );
}

/**
 * Add a UPI ID or bank account, or replace one. Three short steps on one card: type
 * the details, see whose account it is (it must be the doer's own, by the PAN name),
 * then enter the code sent to their phone. A new method gets payouts after a
 * 24-hour wait, unless it is the first one.
 */
export function AddMethodDialog({
  open,
  onOpenChange,
  methods,
  replacing,
  startKind,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  methods: PayoutMethod[];
  /** The method being changed, if any. Its kind is fixed. */
  replacing: PayoutMethod | null;
  startKind: PayoutMethodKind;
}) {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const profileName = profile.data?.full_name ?? "";
  const phone = profile.data?.whatsapp ?? "your phone";

  const [kind, setKind] = useState<PayoutMethodKind>(replacing?.kind ?? startKind);
  const [vpa, setVpa] = useState("");
  const [holder, setHolder] = useState(profileName);
  const [account, setAccount] = useState("");
  const [account2, setAccount2] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [found, setFound] = useState<{ holderName: string; matches: boolean } | null>(null);
  const [code, setCode] = useState("");

  const input: NewPayoutMethod =
    kind === "upi" ? { kind, vpa: vpa.trim() } : { kind, accountNumber: account, ifsc, holderName: holder };
  const typed = newMethodProblem(input);
  const accountsDiffer = kind === "bank" && account2.length > 0 && account !== account2;
  const firstMethod = methods.length === 0;
  // While the new one waits, payouts keep going to the method that is not being replaced.
  const fallback = methods.find((method) => method.id !== replacing?.id && method.kind !== kind) ?? null;

  function resetCheck() {
    setFound(null);
    setCode("");
  }

  const check = useMutation({
    mutationFn: async () => {
      const result = await checkPayoutAccount(input, profileName);
      if (result.matches) await sendPayoutCode();
      return result;
    },
    onSuccess: (result) => setFound(result),
    onError: (error: Error) => toast.error(toUserError(error, "Could not check that account. Try again.")),
  });

  const resend = useMutation({
    mutationFn: sendPayoutCode,
    onSuccess: () => toast.success("A new code is on its way."),
    onError: (error: Error) => toast.error(toUserError(error, "Could not send a code. Try again.")),
  });

  const save = useMutation({
    mutationFn: () => savePayoutMethod(input, code, replacing?.id ?? null),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.payouts.all() });
      const from = new Date(Date.now() + HOLD_HOURS * 3_600_000);
      toast.success(firstMethod ? "Saved. Your payouts go here now." : `Saved. Payouts start going here on ${formatDateTime(from.toISOString())}.`);
      onOpenChange(false);
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not save. Check the code and try again.")),
  });

  const title = replacing ? `Change ${replacing.kind === "upi" ? "UPI ID" : "bank account"}` : "Add where your pay goes";
  // Only one of each: the tab for a kind the doer already has is replaced through Change.
  const kindTaken = (value: PayoutMethodKind) => !replacing && methods.some((method) => method.kind === value);

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/40" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-[460px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-[22px] bg-white p-5 shadow-soft-lg focus:outline-none sm:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <Dialog.Title className="text-[19px] font-extrabold tracking-[-0.02em]">{title}</Dialog.Title>
              {replacing ? <p className="mt-0.5 text-xs font-semibold text-ink-muted">Now: {methodName(replacing)}</p> : null}
            </div>
            <Dialog.Close aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full text-ink-2 hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary">
              <X className="h-4 w-4" aria-hidden="true" />
            </Dialog.Close>
          </div>

          {!replacing ? (
            <div role="tablist" aria-label="Kind of account" className="mt-4 grid grid-cols-2 gap-1.5 rounded-[14px] bg-panel p-1.5">
              {(["upi", "bank"] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  role="tab"
                  aria-selected={kind === value}
                  disabled={kindTaken(value)}
                  onClick={() => {
                    setKind(value);
                    resetCheck();
                  }}
                  className={cn(
                    "rounded-[10px] py-2.5 text-[13px] font-extrabold transition-colors focus-visible:outline-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-45",
                    kind === value ? "bg-white text-primary shadow-soft-sm" : "text-ink-2 hover:text-ink",
                  )}
                >
                  {value === "upi" ? "UPI ID" : "Bank account"}
                </button>
              ))}
            </div>
          ) : null}

          <div className="mt-4 space-y-3.5">
            {kind === "upi" ? (
              <Field id="vpa" label="UPI ID" hint="It looks like name@bank. Find it in your UPI app.">
                <Input
                  id="vpa"
                  value={vpa}
                  maxLength={100}
                  inputMode="email"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="yourname@okhdfcbank"
                  onChange={(event) => {
                    setVpa(cleanText(event.target.value, 100).replace(/\s/g, ""));
                    resetCheck();
                  }}
                />
              </Field>
            ) : (
              <>
                <Field id="holder" label="Name on the account">
                  <Input
                    id="holder"
                    value={holder}
                    maxLength={100}
                    autoComplete="off"
                    onChange={(event) => {
                      setHolder(cleanName(event.target.value));
                      resetCheck();
                    }}
                  />
                </Field>
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field id="account" label="Account number">
                    <Input
                      id="account"
                      value={account}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={18}
                      onChange={(event) => {
                        setAccount(event.target.value.replace(/\D/g, "").slice(0, 18));
                        resetCheck();
                      }}
                    />
                  </Field>
                  <Field id="account2" label="Type it again">
                    <Input
                      id="account2"
                      value={account2}
                      inputMode="numeric"
                      autoComplete="off"
                      maxLength={18}
                      onPaste={(event) => event.preventDefault()}
                      onChange={(event) => {
                        setAccount2(event.target.value.replace(/\D/g, "").slice(0, 18));
                        resetCheck();
                      }}
                    />
                  </Field>
                </div>
                <Field id="ifsc" label="IFSC code" hint="11 characters, on your cheque book or bank app.">
                  <Input
                    id="ifsc"
                    value={ifsc}
                    maxLength={11}
                    autoComplete="off"
                    spellCheck={false}
                    onChange={(event) => {
                      setIfsc(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 11));
                      resetCheck();
                    }}
                  />
                </Field>
                {accountsDiffer ? (
                  <p role="alert" className="text-xs font-semibold text-danger-ink">
                    The two account numbers do not match.
                  </p>
                ) : null}
              </>
            )}
          </div>

          {found ? (
            <div
              className={cn("mt-4 flex items-center gap-3 rounded-2xl p-3.5", found.matches ? "bg-success-bg" : "bg-danger-bg")}
              role={found.matches ? "status" : "alert"}
            >
              <span
                className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white", found.matches ? "bg-success-dot" : "bg-danger-dot")}
                aria-hidden="true"
              >
                {found.matches ? <Check className="h-4 w-4" strokeWidth={3} /> : <AlertTriangle className="h-4 w-4" />}
              </span>
              <span className="min-w-0">
                <span className="block text-[14px] font-extrabold">Found: {found.holderName || "no name"}</span>
                <span className={cn("block text-xs font-semibold", found.matches ? "text-ink-muted" : "text-danger-ink")}>
                  {found.matches ? "Matches the name on your PAN." : "This is not in your name. Your pay can only go to your own account."}
                </span>
              </span>
            </div>
          ) : null}

          {found?.matches ? (
            <div className="mt-4">
              <Field id="code" label={`Code sent to ${phone}`} hint={isDemo() ? "In the demo, any 6 digits work." : undefined}>
                <div className="flex gap-2">
                  <Input
                    id="code"
                    value={code}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    className="tracking-[0.4em]"
                    onChange={(event) => setCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                  />
                  <Button type="button" variant="outline" size="sm" disabled={resend.isPending} onClick={() => resend.mutate()}>
                    Send again
                  </Button>
                </div>
              </Field>
            </div>
          ) : null}

          {!firstMethod ? (
            <p className="mt-4 flex items-start gap-2.5 rounded-2xl bg-panel/70 px-3.5 py-3 text-[12.5px] font-semibold text-ink-2">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              {fallback
                ? `Payouts start going here ${HOLD_HOURS} hours after you save. Until then they go to ${methodName(fallback)}.`
                : `Payouts start going here ${HOLD_HOURS} hours after you save.`}
            </p>
          ) : null}

          {found?.matches ? (
            <Button className="mt-5 w-full" size="lg" disabled={code.length !== 6 || save.isPending} onClick={() => save.mutate()}>
              {save.isPending ? "Saving..." : kind === "upi" ? "Save UPI ID" : "Save bank account"}
            </Button>
          ) : (
            <Button
              className="mt-5 w-full"
              size="lg"
              disabled={Boolean(typed) || accountsDiffer || (kind === "bank" && account !== account2) || check.isPending}
              onClick={() => check.mutate()}
            >
              {kind === "bank" ? <Landmark className="h-4 w-4" aria-hidden="true" /> : null}
              {check.isPending ? "Checking..." : kind === "upi" ? "Check UPI ID" : "Check account"}
            </Button>
          )}
          {kind === "bank" && !found ? (
            <p className="mt-2 text-center text-[11.5px] font-semibold text-ink-muted">We send ₹1 to the account to read the name on it.</p>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

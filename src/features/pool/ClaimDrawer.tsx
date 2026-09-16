import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Lock, AlertTriangle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "@/components/brutal/Pill";
import { DeadlineBadge } from "@/components/brutal/DeadlineBadge";
import { formatPaise } from "@/lib/paise";
import { formatDateTime } from "@/lib/datetime";
import { CLIENT_LABEL, MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { PoolOffer } from "@/types/domain";
import { useClaimProject } from "./queries";

/**
 * The assigned-offer drawer.
 *
 * The existing mutation is retained for the local demo and current API contract,
 * but the user-facing action is explicitly an accept or decline decision. There is
 * no public pool race in this interface.
 */
export function ClaimDrawer({
  offer,
  open,
  onOpenChange,
  blockedReason,
}: {
  offer: PoolOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  blockedReason: string | null;
}) {
  const [confirming, setConfirming] = useState(false);
  const accept = useClaimProject();

  function close() {
    setConfirming(false);
    onOpenChange(false);
  }

  async function handleAccept() {
    if (!offer) return;
    const result = await accept.mutateAsync(offer.id);
    if (result.ok || result.kind === "rejected") close();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/20 backdrop-blur-md" />
        <Dialog.Content
          className="fixed inset-y-3 right-3 z-50 flex w-[calc(100%-1.5rem)] max-w-lg flex-col overflow-hidden rounded-[1.75rem] border border-line-card bg-canvas/95 shadow-[0_24px_80px_rgba(15,23,42,0.18)] backdrop-blur-xl focus:outline-none sm:inset-y-5 sm:right-5 sm:w-[calc(100%-2.5rem)]"
          aria-describedby={undefined}
        >
          {offer ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b border-line-card bg-surface/80 px-6 py-5">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryPill>{offer.category}</CategoryPill>
                    <DeadlineBadge deadline={offer.deliveryAt} />
                  </div>
                  <Dialog.Title className="break-words text-2xl font-extrabold leading-tight tracking-[-0.03em]">
                    {offer.brief?.trim().split("\n")[0] || `${offer.category} offer`}
                  </Dialog.Title>
                </div>
                <Dialog.Close className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line-card bg-surface shadow-soft-sm transition-all hover:-translate-y-0.5 hover:shadow-soft-md">
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <div className="relative overflow-hidden rounded-2xl border border-line-card bg-gradient-to-br from-lime-light via-surface to-secondary-light p-5 shadow-soft-md">
                  <span className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-lime/40 blur-2xl" aria-hidden="true" />
                  <div className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink/65">Your agreed payout</div>
                  <div className="relative mt-1.5 break-words text-4xl font-extrabold leading-none tracking-[-0.045em] tabular-nums sm:text-5xl">
                    {formatPaise(offer.payoutPaise)}
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-snug text-ink/70">
                    The amount is shown before any required withholding. Your earnings record will show the relevant gross, withholding and net figures.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">The brief</h3>
                  <div className="whitespace-pre-wrap rounded-2xl border border-line-card bg-surface p-4 text-sm leading-relaxed shadow-soft-sm">
                    {offer.brief?.trim() || "Your supervisor will share the detail with this offer."}
                  </div>
                </div>

                <dl className="grid grid-cols-1 gap-3 min-[400px]:grid-cols-2">
                  <div className="rounded-xl border border-line-card bg-surface p-3">
                    <dt className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">Due</dt>
                    <dd className="mt-1 text-sm font-extrabold">{offer.deliveryAt ? formatDateTime(offer.deliveryAt) : "Not set"}</dd>
                  </div>
                  <div className="rounded-xl border border-line-card bg-surface p-3">
                    <dt className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">Work for</dt>
                    <dd className="mt-1 text-sm font-extrabold">{CLIENT_LABEL}</dd>
                  </div>
                </dl>

                <div className="flex items-start gap-2.5 rounded-xl border border-line-card bg-surface-2 p-4">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
                  <p className="text-xs leading-relaxed text-ink-2">
                    You work with a supervisor, who is your only point of contact. The {CLIENT_LABEL.toLowerCase()} does not receive your name, contact details or other identifying information.
                  </p>
                </div>

                <div className="rounded-xl border border-line-card bg-surface-2 p-4">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">What happens after acceptance</h3>
                  <ol className="mt-2.5 list-none space-y-2 text-xs leading-relaxed text-ink-2">
                    <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-card bg-lime text-[10px] font-extrabold text-ink" aria-hidden="true">1</span> Your supervisor confirms the project and working workspace.</li>
                    <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-card bg-lime text-[10px] font-extrabold text-ink" aria-hidden="true">2</span> You work to the stated scope and deadline and keep questions in the supervisor thread.</li>
                    <li className="flex gap-2"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-line-card bg-lime text-[10px] font-extrabold text-ink" aria-hidden="true">3</span> Your supervisor reviews delivery before the client approval and payout gates.</li>
                  </ol>
                </div>
              </div>

              <div className="space-y-3 border-t border-line-card bg-surface/85 px-6 py-5 backdrop-blur">
                {blockedReason ? (
                  <div className="flex items-start gap-2.5 rounded-md border border-line-card bg-warning-bg px-3.5 py-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
                    <p className="text-xs font-semibold leading-snug text-warning-ink">{blockedReason}</p>
                  </div>
                ) : confirming ? (
                  <>
                    <div className="flex items-start gap-2.5 rounded-md border border-line-card bg-info-bg px-3.5 py-3">
                      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-info-ink" aria-hidden="true" />
                      <p className="text-xs font-semibold leading-snug text-info-ink">
                        Accepting commits you to deliver by {offer.deliveryAt ? formatDateTime(offer.deliveryAt) : "the agreed date"} and uses one of your {MAX_ACTIVE_PROJECTS} active-project slots.
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button variant="secondary" className="flex-1" onClick={() => setConfirming(false)} disabled={accept.isPending}>Back</Button>
                      <Button className="flex-1" onClick={() => void handleAccept()} disabled={accept.isPending}>
                        {accept.isPending ? "Accepting..." : "Accept this offer"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Button variant="secondary" className="flex-1" onClick={close}>Decline for now</Button>
                    <Button size="lg" className="flex-1" onClick={() => setConfirming(true)}>Review and accept</Button>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

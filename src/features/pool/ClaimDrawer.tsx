import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { X, Lock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CategoryPill } from "@/components/brutal/Pill";
import { DeadlineBadge } from "@/components/brutal/DeadlineBadge";
import { formatPaise } from "@/lib/paise";
import { formatDateTime } from "@/lib/datetime";
import { CLIENT_LABEL, MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { PoolOffer } from "@/types/domain";
import { useClaimProject } from "./queries";

/**
 * The claim drawer.
 *
 * A drawer rather than a page so the doer keeps their scroll position and can
 * compare tasks. Claiming needs an explicit second step because it is a commitment
 * against a hard three-slot cap, and the deadline is repeated at the point of
 * commitment rather than only on the card they skimmed.
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
  const claim = useClaimProject();

  function close() {
    setConfirming(false);
    onOpenChange(false);
  }

  async function handleClaim() {
    if (!offer) return;
    const result = await claim.mutateAsync(offer.id);
    // Close on a real claim, and also when someone beat us to it: either way this
    // task is settled and the board behind has already been invalidated.
    if (result.ok || result.kind === "rejected") close();
  }

  return (
    <Dialog.Root open={open} onOpenChange={(next) => (next ? onOpenChange(true) : close())}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-40 bg-ink/30 backdrop-blur-[2px]" />
        <Dialog.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-lg flex-col border-l-2 border-ink bg-canvas shadow-modal focus:outline-none"
          aria-describedby={undefined}
        >
          {offer ? (
            <>
              <div className="flex items-start justify-between gap-4 border-b-2 border-ink bg-surface px-6 py-5">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <CategoryPill>{offer.category}</CategoryPill>
                    <DeadlineBadge deadline={offer.deliveryAt} />
                  </div>
                  <Dialog.Title className="text-2xl font-extrabold leading-tight tracking-[-0.03em]">
                    {offer.brief?.trim().split("\n")[0] || `${offer.category} task`}
                  </Dialog.Title>
                </div>
                <Dialog.Close className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border-2 border-ink bg-surface shadow-offset-xs transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-sm">
                  <X className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Close</span>
                </Dialog.Close>
              </div>

              <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-6 py-5">
                <div className="rounded-2xl border-2 border-ink bg-lime p-5 shadow-offset-md">
                  <div className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink/65">
                    You earn
                  </div>
                  <div className="mt-1.5 text-5xl font-extrabold leading-none tracking-[-0.045em]">
                    {formatPaise(offer.payoutPaise)}
                  </div>
                  <p className="mt-3 text-xs font-semibold leading-snug text-ink/70">
                    Fixed. Agreed before you start, and paid on approval. Tax is withheld at
                    payout and shown on your earnings record.
                  </p>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                    The brief
                  </h3>
                  <div className="whitespace-pre-wrap rounded-xl border-[1.5px] border-ink bg-surface p-4 text-sm leading-relaxed shadow-offset-xs">
                    {offer.brief?.trim() || "Your supervisor will share the detail once you claim."}
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-line-card bg-surface p-3">
                    <dt className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
                      Due
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold">
                      {offer.deliveryAt ? formatDateTime(offer.deliveryAt) : "Not set"}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-line-card bg-surface p-3">
                    <dt className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
                      Work for
                    </dt>
                    <dd className="mt-1 text-sm font-extrabold">{CLIENT_LABEL}</dd>
                  </div>
                </dl>

                <p className="text-xs leading-relaxed text-ink-muted">
                  You will work with a supervisor, who is your only point of contact. You
                  will not deal with the {CLIENT_LABEL.toLowerCase()} directly.
                </p>
              </div>

              <div className="space-y-3 border-t-2 border-ink bg-surface px-6 py-5">
                {blockedReason ? (
                  <div className="flex items-start gap-2.5 rounded-md border-[1.5px] border-ink bg-warning-bg px-3.5 py-3">
                    <Lock className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
                    <p className="text-xs font-semibold leading-snug text-warning-ink">
                      {blockedReason}
                    </p>
                  </div>
                ) : confirming ? (
                  <>
                    <div className="flex items-start gap-2.5 rounded-md border-[1.5px] border-ink bg-info-bg px-3.5 py-3">
                      <AlertTriangle
                        className="mt-0.5 h-4 w-4 shrink-0 text-info-ink"
                        aria-hidden="true"
                      />
                      <p className="text-xs font-semibold leading-snug text-info-ink">
                        Claiming commits you to deliver by{" "}
                        {offer.deliveryAt ? formatDateTime(offer.deliveryAt) : "the agreed date"},
                        and uses one of your {MAX_ACTIVE_PROJECTS} slots.
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        className="flex-1"
                        onClick={() => setConfirming(false)}
                        disabled={claim.isPending}
                      >
                        Back
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() => void handleClaim()}
                        disabled={claim.isPending}
                      >
                        {claim.isPending ? "Claiming..." : "Yes, claim it"}
                      </Button>
                    </div>
                  </>
                ) : (
                  <Button size="lg" className="w-full" onClick={() => setConfirming(true)}>
                    Claim this task
                  </Button>
                )}
              </div>
            </>
          ) : null}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

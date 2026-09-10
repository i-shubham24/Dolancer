import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { CLIENT_LABEL } from "@/lib/constants";
import { CategoryPill, MicroChip } from "@/components/brutal/Pill";
import { DeadlineBadge } from "@/components/brutal/DeadlineBadge";
import type { PoolOffer } from "@/types/domain";

/**
 * A pool card.
 *
 * Payout is the largest thing on the card, because it is the fixed, pre-disclosed
 * number the whole model rests on: no bidding, no negotiation, agreed before you
 * start. It is labelled "before tax" because the PRD requires the exact gross in
 * INR pre-TDS, and the per-project withholding is not knowable until release.
 *
 * What is deliberately NOT here: proposal counts, client names, client ratings,
 * client spend, "payment verified", or how many others are looking. A public
 * marketplace card is mostly client-trust signalling, and we can show none of it,
 * so the card leans entirely on platform-owned facts instead.
 */
export function PoolCard({
  offer,
  onOpen,
  selected = false,
  hideAccessories = false,
}: {
  offer: PoolOffer;
  onOpen: () => void;
  selected?: boolean;
  /**
   * When the detail drawer is open, accessories move into it rather than being
   * shown twice.
   */
  hideAccessories?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${offer.category} task, ${formatPaise(offer.payoutPaise)}`}
      className={cn(
        "w-full rounded-2xl border-2 border-ink bg-surface p-5 text-left",
        "transition-all duration-[180ms] ease-spring",
        selected
          ? "-translate-x-[3px] -translate-y-[3px] shadow-offset-2xl"
          : "shadow-offset-md hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-offset-lg",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill>{offer.category}</CategoryPill>
            {!hideAccessories ? <DeadlineBadge deadline={offer.deliveryAt} /> : null}
          </div>

          <h3 className="text-lg font-extrabold leading-[1.3] tracking-[-0.025em]">
            {offer.brief?.trim().split("\n")[0] || `${offer.category} task`}
          </h3>

          {!hideAccessories && offer.brief ? (
            <p className="line-clamp-2 text-sm leading-relaxed text-ink-2">{offer.brief}</p>
          ) : null}

          {!hideAccessories ? (
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <MicroChip>{CLIENT_LABEL}</MicroChip>
              <MicroChip>Fixed payout</MicroChip>
            </div>
          ) : null}
        </div>

        <div className="shrink-0 text-right">
          <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            You earn
          </div>
          <div className="text-3xl font-extrabold leading-none tracking-[-0.04em]">
            {formatPaise(offer.payoutPaise)}
          </div>
          <div className="mt-1 text-[11px] text-ink-muted">before tax</div>
        </div>
      </div>
    </button>
  );
}

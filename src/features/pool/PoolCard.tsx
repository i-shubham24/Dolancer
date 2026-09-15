import { motion } from "framer-motion";
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
    <motion.button
      type="button"
      onClick={onOpen}
      aria-label={`Open ${offer.category} task, ${formatPaise(offer.payoutPaise)}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative w-full overflow-hidden rounded-[1.5rem] border border-line-card bg-surface p-5 text-left",
        "transition-colors duration-[220ms] ease-spring hover:border-purple/35",
        selected
          ? "border-purple/40 shadow-soft-lg"
          : "shadow-soft-md hover:shadow-soft-lg",
      )}
    >
      <span className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-purple-light/70 blur-3xl transition-transform duration-500 group-hover:scale-125" aria-hidden="true" />
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <CategoryPill>{offer.category}</CategoryPill>
            {!hideAccessories ? <DeadlineBadge deadline={offer.deliveryAt} /> : null}
          </div>

          <h3 className="relative text-lg font-extrabold leading-[1.3] tracking-[-0.025em] transition-colors group-hover:text-purple">
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

        <div className="relative shrink-0 rounded-2xl bg-lime-light/70 px-3.5 py-2.5 text-right ring-1 ring-lime/30">
          <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            You earn
          </div>
          <div className="text-3xl font-extrabold leading-none tracking-[-0.04em]">
            {formatPaise(offer.payoutPaise)}
          </div>
          <div className="mt-1 text-[11px] font-semibold text-ink-muted">before tax</div>
        </div>
      </div>
    </motion.button>
  );
}

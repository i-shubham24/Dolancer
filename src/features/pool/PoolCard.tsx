import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { deadlineUrgency, relativeDeadline } from "@/lib/datetime";
import { taskTitle } from "@/lib/task-title";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CategoryTile } from "@/components/app/ui";
import type { PoolOffer } from "@/types/domain";

const URGENCY_TAG = {
  overdue: "bg-danger-bg text-danger-ink",
  urgent: "bg-danger-bg text-danger-ink",
  soon: "bg-warning-bg text-warning-ink",
  comfortable: "bg-info-bg text-info-ink",
  none: "bg-neutral-bg text-neutral-ink",
} as const;

/**
 * An assigned offer as a simple card: what it is, when it is due, what it pays.
 *
 * Payout is the largest figure, because it is the fixed, pre-disclosed number the
 * whole model rests on. What is deliberately not here: proposal counts, client
 * names, ratings or spend. The doer never sees the client, so the card leans on
 * platform facts alone.
 */
export function PoolCard({ offer, onOpen }: { offer: PoolOffer; onOpen: () => void }) {
  const reduceMotion = useReducedMotion();
  const urgency = deadlineUrgency(offer.deliveryAt);

  return (
    <motion.div variants={cardMotion} whileHover={reduceMotion ? undefined : { y: -4 }} className="min-w-0">
      <button
        type="button"
        onClick={onOpen}
        aria-label={`${taskTitle(offer)}, ${formatPaise(offer.payoutPaise)} before tax. View offer`}
        className={cn(
          CARD,
          "group h-full w-full gap-4 text-left transition-shadow hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.3)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <span className="flex min-w-0 items-center gap-2.5">
            <CategoryTile category={offer.category} className="h-9 w-9 rounded-lg text-[11px]" />
            <span className="truncate text-xs font-bold text-ink-muted">{offer.category}</span>
          </span>
          <span className={cn("inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold", URGENCY_TAG[urgency])}>
            <Clock className="h-3 w-3" aria-hidden="true" />
            {relativeDeadline(offer.deliveryAt)}
          </span>
        </div>

        <h3 className="line-clamp-2 text-[16px] font-extrabold leading-snug tracking-[-0.02em] transition-colors group-hover:text-primary">
          {taskTitle(offer)}
        </h3>

        <div className="mt-auto flex items-end justify-between gap-3 border-t border-line-subtle pt-3.5">
          <div>
            <p className="text-[11px] font-bold text-ink-muted">You earn</p>
            <p className="text-[24px] font-extrabold leading-none tracking-[-0.03em] tabular-nums">{formatPaise(offer.payoutPaise)}</p>
            <p className="mt-0.5 text-[10.5px] font-semibold text-ink-3">before tax</p>
          </div>
          <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-panel px-4 text-[13px] font-bold text-primary transition-colors group-hover:bg-primary group-hover:text-white">
            View
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
          </span>
        </div>
      </button>
    </motion.div>
  );
}

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { formatPaise } from "@/lib/paise";
import { preloadRoute } from "@/lib/preload";
import { taskTitle } from "@/lib/task-title";
import type { PoolOffer } from "@/types/domain";
import { formatDayShort } from "@/features/calendar/dates";
import { MoreLink, Panel, PanelHeader } from "./ui";

/**
 * A peek at assigned offers. Accepting stays on the offers page, behind its
 * confirm step, because it is a commitment against the three-slot cap.
 */
export function OffersCard({
  offers,
  loading,
  error,
  unlocked,
  atCap,
}: {
  offers: PoolOffer[];
  loading: boolean;
  error: boolean;
  unlocked: boolean;
  atCap: boolean;
}) {
  const empty = !unlocked
    ? "Finish verification and offers that match your skills show here."
    : atCap
      ? "All your slots are full, so new offers are paused. Finish a task to see more."
      : error
        ? "Offers did not load. Open the offers page to try again."
        : "No offers right now. Matching work shows here when a supervisor sends it.";

  return (
    <Panel className="[grid-area:offers]" aria-labelledby="offers-for-you">
      <PanelHeader id="offers-for-you" title="Offers for you" sub="Matched to your skills, pay fixed" />

      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-[60px] w-full rounded-2xl" />
          <div className="skeleton h-[60px] w-full rounded-2xl" />
        </div>
      ) : offers.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-panel/60 px-4 py-6 text-center">
          <Layers className="h-5 w-5 text-ink-3" aria-hidden="true" />
          <p className="text-xs font-semibold leading-relaxed text-ink-muted">{empty}</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {offers.slice(0, 2).map((offer, index) => (
            <motion.li
              key={offer.id}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.08 }}
            >
              <Link
                to="/pool"
                onMouseEnter={() => preloadRoute("/pool")}
                onFocus={() => preloadRoute("/pool")}
                className="flex items-center justify-between gap-3 rounded-2xl bg-panel/60 px-3 py-2.5 transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="min-w-0">
                  <span className="line-clamp-2 text-[12.5px] font-bold leading-snug text-ink">{taskTitle(offer)}</span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-ink-muted">
                    {offer.deliveryAt ? `Due ${formatDayShort(new Date(offer.deliveryAt))}` : "No deadline set"}
                  </span>
                </span>
                <span className="shrink-0 text-sm font-extrabold tabular-nums">{formatPaise(offer.payoutPaise)}</span>
              </Link>
            </motion.li>
          ))}
        </ul>
      )}

      <div className="min-h-3 flex-1" aria-hidden="true" />
      <MoreLink to="/pool" className="self-start">
        See all offers
      </MoreLink>
    </Panel>
  );
}

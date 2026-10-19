import { Link } from "react-router-dom";
import { ArrowRight, CalendarClock } from "lucide-react";
import { CategoryTile } from "@/components/app/ui";
import { formatPaise } from "@/lib/paise";
import { taskTitle } from "@/lib/task-title";
import { formatDayShort } from "@/features/calendar/dates";
import { usePool } from "@/features/pool/queries";
import { useActiveProjects } from "@/features/dashboard/queries";
import { availabilityState, useAvailabilityStore } from "@/stores/useAvailabilityStore";

/**
 * An offer a supervisor shared in chat, drawn as a card under their message, the
 * way a shared post shows up in a direct message. It reads the live board, so it
 * says so plainly once the offer is taken or gone.
 */
export function OfferBubble({ offerId }: { offerId: string }) {
  const pool = usePool("newest");
  const active = useActiveProjects();
  const offer = pool.data?.items.find((item) => item.id === offerId);
  const mine = active.data?.find((project) => project.id === offerId);
  const available = useAvailabilityStore((state) => state.available);
  const activeCount = useAvailabilityStore((state) => state.activeCount);
  const state = availabilityState({ activeCount, available });

  if (pool.isLoading) {
    return <div className="skeleton h-40 w-[min(300px,85%)] rounded-2xl" aria-hidden="true" />;
  }

  if (mine) {
    return (
      <Link
        to={`/work/${mine.id}`}
        className="flex w-[min(300px,85%)] items-center gap-3 rounded-2xl bg-success-bg px-3.5 py-3 text-success-ink transition-colors hover:brightness-[0.98] focus-visible:outline-2 focus-visible:outline-primary"
      >
        <CategoryTile category={mine.category} className="h-9 w-9" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[13px] font-extrabold">{taskTitle(mine)}</span>
          <span className="block text-[11.5px] font-bold">In your work</span>
        </span>
        <ArrowRight className="h-4 w-4 shrink-0" aria-hidden="true" />
      </Link>
    );
  }

  if (!offer) {
    return (
      <div className="w-[min(300px,85%)] rounded-2xl bg-white/70 px-3.5 py-3 text-[12.5px] font-bold text-ink-muted ring-1 ring-ink/[0.05]">
        {state === "paused"
          ? "Switch to Available to open this offer."
          : "This offer is no longer open."}
      </div>
    );
  }

  const due = offer.deliveryAt ? new Date(offer.deliveryAt) : null;
  return (
    <div className="w-[min(300px,85%)] overflow-hidden rounded-2xl bg-white shadow-[0_8px_24px_-14px_rgba(15,23,42,0.35)] ring-1 ring-ink/[0.06]">
      <div className="flex items-center gap-3 p-3.5">
        <CategoryTile category={offer.category} />
        <div className="min-w-0">
          <p className="line-clamp-2 text-[13.5px] font-extrabold leading-snug">{taskTitle(offer)}</p>
          <p className="text-[11.5px] font-semibold text-ink-muted">{offer.category}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 border-y border-line-subtle">
        <div className="px-3.5 py-2.5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-ink-3">You earn</p>
          <p className="text-[15px] font-extrabold tabular-nums">{formatPaise(offer.payoutPaise)}</p>
        </div>
        <div className="border-l border-line-subtle px-3.5 py-2.5">
          <p className="text-[10.5px] font-bold uppercase tracking-[0.06em] text-ink-3">Due</p>
          <p className="flex items-center gap-1.5 text-[13.5px] font-extrabold">
            <CalendarClock className="h-3.5 w-3.5 text-ink-muted" aria-hidden="true" />
            {due ? formatDayShort(due) : "Open"}
          </p>
        </div>
      </div>
      <div className="p-2.5">
        <Link
          to={`/pool?offer=${encodeURIComponent(offer.id)}`}
          className="flex h-10 w-full items-center justify-center gap-1.5 rounded-xl bg-primary text-[13px] font-extrabold text-white transition-colors hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          View offer
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}

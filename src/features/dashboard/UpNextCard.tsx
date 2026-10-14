import { Link } from "react-router-dom";
import { ArrowRight, Clock, Link2Off } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { deadlineUrgency, relativeDeadline, timeAgo } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { preloadWorkbench } from "@/lib/preload";
import { Button } from "@/components/ui/button";
import type { DoerProject } from "@/types/domain";
import { formatDayShort, formatTime } from "@/features/calendar/dates";
import { Panel } from "./ui";
import { Gauge } from "./Gauge";

const URGENCY_TAG = {
  overdue: "bg-danger-bg text-danger-ink",
  urgent: "bg-danger-bg text-danger-ink",
  soon: "bg-warning-bg text-warning-ink",
  comfortable: "bg-info-bg text-info-ink",
  none: "bg-neutral-bg text-neutral-ink",
} as const;

export function UpNextCard({
  project,
  loading,
  unlocked,
}: {
  project: DoerProject | null;
  loading: boolean;
  unlocked: boolean;
}) {
  if (loading) {
    return (
      <Panel className="[grid-area:next]" aria-busy="true">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton mt-4 h-5 w-full" />
        <div className="skeleton mt-2 h-5 w-3/4" />
        <div className="skeleton mt-6 h-3 w-full" />
        <div className="skeleton mt-3 h-3 w-full" />
        <div className="min-h-4 flex-1" />
        <div className="skeleton h-11 w-full rounded-full" />
      </Panel>
    );
  }

  if (!project) {
    return (
      <Panel className="[grid-area:next]" aria-labelledby="up-next">
        <span id="up-next" className="flex items-center gap-1.5 text-xs font-bold text-ink-muted">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          Up next
        </span>
        <p className="mt-3 text-lg font-extrabold leading-snug tracking-[-0.025em]">Nothing on your plate</p>
        <p className="mt-1.5 text-sm text-ink-2">
          {unlocked
            ? "Accept an offer and it shows here with its deadline and pay."
            : "Finish verification and your first offers can arrive."}
        </p>
        <div className="min-h-4 flex-1" aria-hidden="true" />
        <Button asChild className="w-full">
          <Link to={unlocked ? "/pool" : "/verification"}>
            {unlocked ? "See offers" : "Get verified"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </Panel>
    );
  }

  const due = project.deliveryAt ? new Date(project.deliveryAt) : null;
  const urgency = deadlineUrgency(project.deliveryAt);
  const status = statusDisplay(project.status, project.workingDocUrl);
  const progress = Math.max(0, Math.min(100, project.progressPct));
  const needsLink = status.label === "Link needed";
  const review = project.status === "in_review" || project.status === "delivered";

  return (
    <Panel className="[grid-area:next]" aria-labelledby="up-next">
      <span id="up-next" className="flex items-center gap-1.5 text-xs font-bold text-ink-muted">
        <Clock className="h-3.5 w-3.5" aria-hidden="true" />
        Up next
      </span>
      <h3 className="mt-2.5 line-clamp-2 text-lg font-extrabold leading-[1.25] tracking-[-0.025em]">
        {taskTitle(project)}
      </h3>
      <span className={cn("mt-2.5 self-start rounded-full px-2.5 py-1 text-[11.5px] font-bold", URGENCY_TAG[urgency])}>
        {relativeDeadline(project.deliveryAt)}
      </span>

      <dl className="mt-3.5 space-y-2 text-[12.5px] font-semibold">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-2">Due</dt>
          <dd className="text-right font-bold text-ink">{due ? `${formatDayShort(due)}, ${formatTime(due)}` : "Not set"}</dd>
        </div>
        <div className="flex items-center justify-between gap-3">
          <dt className="text-ink-2">Pay for this task</dt>
          <dd className="font-bold text-ink tabular-nums">{formatPaise(project.payoutPaise)}</dd>
        </div>
      </dl>

      {needsLink ? (
        <p className="mt-3 flex items-start gap-2 rounded-xl bg-warning-bg px-3 py-2 text-xs font-bold text-warning-ink">
          <Link2Off className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          Waiting for your supervisor to add the working link.
        </p>
      ) : (
        <div className="mt-4">
          <Gauge
            value={review ? 100 : progress}
            tone={review ? "var(--color-highlight)" : "var(--color-primary)"}
            label={review ? "Sent for review" : "Done so far"}
          />
          <div className="mt-2.5 flex items-center justify-center gap-4 text-[11px] font-semibold text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Done
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="chart-hatch h-2 w-2 rounded-full" aria-hidden="true" />
              Left
            </span>
            <span>Updated {timeAgo(project.updatedAt)}</span>
          </div>
        </div>
      )}

      <div className="min-h-4 flex-1" aria-hidden="true" />
      <Button asChild className="w-full">
        <Link to={`/work/${project.id}`} onMouseEnter={preloadWorkbench} onFocus={preloadWorkbench}>
          Open task
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </Panel>
  );
}

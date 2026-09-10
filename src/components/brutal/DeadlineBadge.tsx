import { Clock, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import { relativeDeadline, deadlineUrgency, formatDateTime } from "@/lib/datetime";

const TONE = {
  none: "bg-neutral-bg text-neutral-ink border-line-card",
  comfortable: "bg-neutral-bg text-neutral-ink border-line-card",
  soon: "bg-warning-bg text-warning-ink border-ink",
  urgent: "bg-danger-bg text-danger-ink border-ink",
  overdue: "bg-danger-bg text-danger-ink border-ink",
} as const;

/**
 * One escalation rule, used everywhere: neutral above 48h, warning 12 to 48h,
 * critical under 12h. Urgency is never colour alone, so the text always carries it
 * too, and overdue reads as elapsed time rather than a negative countdown.
 *
 * Cards get the relative form; detail views get the absolute time with a timezone,
 * because deadlines are stored in UTC and a doer may be in a different country from
 * whoever set it.
 */
export function DeadlineBadge({
  deadline,
  absolute = false,
  className,
}: {
  deadline: string | null | undefined;
  absolute?: boolean;
  className?: string;
}) {
  const urgency = deadlineUrgency(deadline);
  const critical = urgency === "urgent" || urgency === "overdue";

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-2.5 py-[3px]",
        "text-2xs font-extrabold leading-tight",
        TONE[urgency],
        critical && "shadow-offset-xs",
        className,
      )}
      title={deadline ? formatDateTime(deadline) : undefined}
    >
      {critical ? (
        <AlertTriangle className="h-3 w-3 shrink-0" aria-hidden="true" />
      ) : (
        <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
      )}
      {absolute && deadline ? formatDateTime(deadline) : relativeDeadline(deadline)}
    </span>
  );
}

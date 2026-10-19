import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { countdownParts, deadlineUrgency } from "@/lib/datetime";
import { cn } from "@/lib/cn";

export function DeadlineCounter({
  deliveryAt,
  className,
  showIcon = true,
}: {
  deliveryAt: string | null | undefined;
  className?: string;
  showIcon?: boolean;
}) {
  const [parts, setParts] = useState(() => countdownParts(deliveryAt));

  useEffect(() => {
    const tick = () => setParts(countdownParts(deliveryAt));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deliveryAt]);

  if (!deliveryAt) return null;

  const urgency = deadlineUrgency(deliveryAt);
  const isOverdue = urgency === "overdue";

  if (isOverdue) {
    return (
      <span className={cn("inline-flex items-center gap-1 font-mono text-xs font-black text-danger-ink", className)}>
        <span className="h-2 w-2 rounded-full bg-danger-dot animate-pulse" />
        <span>Overdue</span>
      </span>
    );
  }

  if (!parts) {
    return (
      <span className={cn("font-mono text-xs font-bold text-ink-muted", className)}>
        Due now
      </span>
    );
  }

  const { days, hours, minutes, seconds } = parts;

  const formatted =
    days > 0
      ? `${days}d ${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`
      : `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(2, "0")}m ${String(seconds).padStart(2, "0")}s`;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 font-mono text-xs font-extrabold tabular-nums tracking-tight",
        urgency === "urgent"
          ? "text-danger-ink"
          : urgency === "soon"
            ? "text-amber-600"
            : "text-primary",
        className,
      )}
      title="Live time remaining until project submission deadline"
    >
      {showIcon ? <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" /> : null}
      <span>{formatted}</span>
    </span>
  );
}

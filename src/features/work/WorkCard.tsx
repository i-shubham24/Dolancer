import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock } from "lucide-react";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CategoryTile } from "@/components/app/ui";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { deadlineUrgency, formatDate, relativeDeadline } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { preloadWorkbench } from "@/lib/preload";
import type { DoerProject } from "@/types/domain";

const URGENCY_TEXT = {
  overdue: "text-danger-ink",
  urgent: "text-danger-ink",
  soon: "text-warning-ink",
  comfortable: "text-ink-muted",
  none: "text-ink-muted",
} as const;

/** A ring for how far along the work is, with room for "100%" inside it. */
function Ring({ value, tone }: { value: number; tone: string }) {
  const reduceMotion = useReducedMotion();
  const radius = 25;
  return (
    <span className="relative flex h-[60px] w-[60px] shrink-0 items-center justify-center" aria-hidden="true">
      <svg viewBox="0 0 60 60" className="absolute inset-0 -rotate-90">
        <circle cx="30" cy="30" r={radius} fill="none" stroke="white" strokeWidth="5" />
        {value > 0 ? (
          <motion.circle
            cx="30"
            cy="30"
            r={radius}
            fill="none"
            stroke={tone}
            strokeWidth="5"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: value / 100 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </svg>
      <span className="text-[12px] font-extrabold tabular-nums tracking-[-0.02em]">{value}%</span>
    </span>
  );
}

/** One task as a card: what it is, where it stands, when it is due, what it pays. */
export function WorkCard({ project }: { project: DoerProject }) {
  const reduceMotion = useReducedMotion();
  const status = statusDisplay(project.status, project.workingDocUrl);
  const closed = project.status === "approved" || project.status === "cancelled";
  const review = project.status === "in_review" || project.status === "delivered";
  const progress = review || project.status === "approved" ? 100 : Math.max(0, Math.min(100, project.progressPct));
  const urgency = deadlineUrgency(project.deliveryAt);

  return (
    <motion.div variants={cardMotion} whileHover={reduceMotion ? undefined : { y: -4 }} className="min-w-0">
      <Link
        to={`/work/${project.id}`}
        onMouseEnter={preloadWorkbench}
        onFocus={preloadWorkbench}
        className={cn(
          CARD,
          "group h-full gap-3.5 transition-shadow hover:shadow-[0_18px_36px_-18px_rgba(15,23,42,0.3)]",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        <div className="flex items-center justify-between gap-3">
          <StatusBadge tone={status.tone} label={status.label} className="whitespace-nowrap" />
          <CategoryTile category={project.category} className="h-9 w-9 rounded-lg text-[11px]" />
        </div>

        <div className="min-w-0">
          <h3 className="line-clamp-2 min-h-[2.75em] text-[16px] font-extrabold leading-snug tracking-[-0.02em] transition-colors group-hover:text-primary">
            {taskTitle(project)}
          </h3>
          <p className="mt-1 truncate text-xs font-semibold text-ink-muted">{project.category}</p>
        </div>

        <div className="mt-auto flex items-center gap-3 rounded-2xl bg-panel/60 p-2.5">
          {project.status === "cancelled" ? null : (
            <Ring value={progress} tone={project.status === "approved" ? "var(--color-success-dot)" : review ? "var(--color-highlight)" : "var(--color-primary)"} />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-ink-muted">{closed ? "Finished" : "Due"}</p>
            <p className={cn("flex items-center gap-1 whitespace-nowrap text-[13px] font-bold", closed ? "text-ink" : URGENCY_TEXT[urgency])}>
              {closed ? null : <Clock className="h-3.5 w-3.5" aria-hidden="true" />}
              {closed ? formatDate(project.updatedAt) : relativeDeadline(project.deliveryAt)}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="text-[16px] font-extrabold tabular-nums tracking-[-0.02em]">{formatPaise(project.payoutPaise)}</p>
            <p className="text-[10.5px] font-semibold text-ink-3">before tax</p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-primary">
          Open task
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </span>
      </Link>
    </motion.div>
  );
}

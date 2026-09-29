import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { preloadWorkbench } from "@/lib/preload";
import { SUPERVISOR_LABEL } from "@/lib/constants";
import type { DoerProject } from "@/types/domain";
import { StatusBadge } from "./StatusBadge";
import { CategoryPill, ProgressPill, MicroChip } from "./Pill";

/**
 * Shared project surface used by work and pool views.
 *
 * The counterparty is always rendered as the SUPERVISOR_LABEL constant. There is no
 * client identity in projects_doer to render even if we wanted to, which is the
 * point: anonymity is structural, not a formatting choice.
 */
function parseBrief(brief?: string | null, category?: string) {
  if (!brief || !brief.trim()) {
    return { title: `${category || "Assigned"} task`, description: "" };
  }
  const trimmed = brief.trim();
  const firstNewline = trimmed.indexOf("\n");
  if (firstNewline > 0) {
    return {
      title: trimmed.slice(0, firstNewline).trim(),
      description: trimmed.slice(firstNewline + 1).trim(),
    };
  }
  if (trimmed.length > 55) {
    const periodIdx = trimmed.indexOf(".");
    if (periodIdx > 20 && periodIdx < 75) {
      return {
        title: trimmed.slice(0, periodIdx).trim(),
        description: trimmed.slice(periodIdx + 1).trim(),
      };
    }
  }
  return { title: trimmed, description: "" };
}

export function ProjectCard({ project, className }: { project: DoerProject; className?: string }) {
  const status = statusDisplay(project.status, project.workingDocUrl);
  const progress = Math.max(0, Math.min(100, project.progressPct));
  const parsed = parseBrief(project.brief, project.category);

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } }}
      whileTap={{ scale: 0.985 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/work/${project.id}`}
        onMouseEnter={preloadWorkbench}
        onFocus={preloadWorkbench}
        className={cn(
          "group flex h-full flex-col gap-3 rounded-2xl border border-line-card bg-surface p-5",
          "shadow-soft-sm transition-all duration-200 ease-spring",
          "hover:border-blue-300/80 hover:shadow-soft-lg",
          "focus-visible:border-blue-500 focus-visible:shadow-soft-lg",
          className,
        )}
      >
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill>{project.category}</CategoryPill>
          <StatusBadge tone={status.tone} label={status.label} />
          {progress > 0 ? <ProgressPill>{progress}%</ProgressPill> : null}
        </div>

        <div className="space-y-1">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-[-0.015em] text-slate-900 transition-colors group-hover:text-[#0A65C0]">
            {parsed.title}
          </h3>
          {parsed.description ? (
            <p className="line-clamp-2 text-xs font-normal leading-relaxed text-slate-500">
              {parsed.description}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-line-subtle bg-slate-50/80 px-3.5 py-2.5 min-[380px]:grid-cols-2">
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Payout</div>
            <div className="break-words text-sm font-bold tracking-tight text-slate-900 tabular-nums">
              {formatPaise(project.payoutPaise)}
            </div>
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-slate-500">Due</div>
            <div className="text-sm font-bold tracking-tight text-slate-900">
              {relativeDeadline(project.deliveryAt)}
            </div>
          </div>
        </div>

        {progress > 0 ? (
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Work progress"
          >
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#0A65C0] to-cyan-500 transition-[width] duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        ) : null}

        <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
          <MicroChip>{SUPERVISOR_LABEL}</MicroChip>
          {project.qcBounceCount > 0 ? (
            <MicroChip>
              {project.qcBounceCount} revision{project.qcBounceCount === 1 ? "" : "s"}
            </MicroChip>
          ) : null}
        </div>
      </Link>
    </motion.div>
  );
}

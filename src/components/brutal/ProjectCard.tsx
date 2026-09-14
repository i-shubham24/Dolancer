import { Link } from "react-router-dom";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { preloadWorkbench } from "@/lib/preload";
import { CLIENT_LABEL } from "@/lib/constants";
import type { DoerProject } from "@/types/domain";
import { StatusBadge } from "./StatusBadge";
import { CategoryPill, ProgressPill, MicroChip } from "./Pill";

/**
 * Shared project surface used by work and pool views.
 *
 * The counterparty is always rendered as the CLIENT_LABEL constant. There is no
 * client identity in projects_doer to render even if we wanted to, which is the
 * point: anonymity is structural, not a formatting choice.
 */
export function ProjectCard({ project, className }: { project: DoerProject; className?: string }) {
  const status = statusDisplay(project.status, project.workingDocUrl);
  const progress = Math.max(0, Math.min(100, project.progressPct));

  return (
    <Link
      to={`/work/${project.id}`}
      onMouseEnter={preloadWorkbench}
      onFocus={preloadWorkbench}
      className={cn(
        "group flex flex-col gap-[13px] rounded-3xl border border-line-card bg-surface px-[22px] pb-[22px] pt-5",
        "shadow-soft-md transition-[transform,box-shadow,border-color] duration-[220ms] ease-spring",
        "hover:-translate-y-1 hover:border-blue/40 hover:shadow-soft-lg",
        "focus-visible:-translate-y-1 focus-visible:border-blue/40 focus-visible:shadow-soft-lg",
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2">
        <CategoryPill>{project.category}</CategoryPill>
        <StatusBadge tone={status.tone} label={status.label} />
        {progress > 0 ? <ProgressPill>{progress}%</ProgressPill> : null}
      </div>

      <h3 className="line-clamp-3 break-words text-lg font-extrabold leading-[1.3] tracking-[-0.025em] transition-colors group-hover:text-coral">
        {project.brief?.trim() || `${project.category} task`}
      </h3>

      <div className="grid grid-cols-1 gap-3 rounded-xl border border-line-card bg-subtle px-3 py-[9px] min-[380px]:grid-cols-2">
          <div className="min-w-0">
            <div className="text-2xs font-bold uppercase tracking-[0.04em] text-ink-muted">Payout</div>
            <div className="break-words text-md font-extrabold tracking-[-0.02em]">
              {formatPaise(project.payoutPaise)}
            </div>
          </div>
          <div className="min-w-0">
          <div className="text-2xs font-bold uppercase tracking-[0.04em] text-ink-muted">Due</div>
          <div className="text-md font-extrabold tracking-[-0.02em]">
            {relativeDeadline(project.deliveryAt)}
          </div>
        </div>
      </div>

      {progress > 0 ? (
        <div
          className="h-2 w-full overflow-hidden rounded-full bg-subtle"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Work progress"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue to-purple transition-[width] duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-2 pt-1">
        <MicroChip>{CLIENT_LABEL}</MicroChip>
        {project.qcBounceCount > 0 ? (
          <MicroChip>
            {project.qcBounceCount} revision{project.qcBounceCount === 1 ? "" : "s"}
          </MicroChip>
        ) : null}
      </div>
    </Link>
  );
}

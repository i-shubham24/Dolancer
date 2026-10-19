import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline, timeAgo } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { preloadWorkbench } from "@/lib/preload";
import type { DoerProject } from "@/types/domain";
import { formatDayShort, formatTime } from "@/features/calendar/dates";
import { CategoryTile } from "@/components/app/ui";
import { Gauge } from "@/components/app/Gauge";

/** The brief without its headline, which is already the drawer's title. */
function briefBody(brief: string | null): string {
  const lines = brief?.trim().split("\n") ?? [];
  return lines.slice(1).join("\n").trim();
}

/**
 * A quick look at one task without leaving the dashboard: it slides in from the
 * right over a blurred page, like the profile panel in the reel. Everything that
 * changes the task's status still happens in the workbench.
 */
export function TaskPeek({
  project,
  open,
  onOpenChange,
}: {
  project: DoerProject | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open && project ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild forceMount>
              <motion.div
                className="fixed inset-0 z-50 bg-ink/25 backdrop-blur-[3px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild forceMount aria-describedby={undefined}>
              <motion.aside
                className="fixed inset-y-0 right-0 z-50 flex w-full max-w-[420px] flex-col overflow-y-auto bg-white p-5 shadow-[-24px_0_60px_-30px_rgba(11,31,58,0.5)] focus:outline-none sm:inset-y-3 sm:right-3 sm:rounded-[24px] sm:p-6"
                initial={reduceMotion ? { opacity: 0 } : { x: "105%" }}
                animate={reduceMotion ? { opacity: 1 } : { x: 0 }}
                exit={reduceMotion ? { opacity: 0 } : { x: "105%" }}
                transition={{ type: "spring", stiffness: 320, damping: 34 }}
              >
                <PeekBody project={project} />
              </motion.aside>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}

function PeekBody({
  project,
}: {
  project: DoerProject;
}) {
  const status = statusDisplay(project.status, project.workingDocUrl);
  const review = project.status === "in_review" || project.status === "delivered";
  const due = project.deliveryAt ? new Date(project.deliveryAt) : null;
  const body = briefBody(project.brief);
  const item = (index: number) => ({
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: 0.12 + index * 0.05, ease: [0.16, 1, 0.3, 1] as const },
  });

  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className="flex items-center gap-2.5">
          <CategoryTile category={project.category} />
          <span className="text-xs font-bold text-ink-muted">{project.category}</span>
        </span>
        <Dialog.Close
          aria-label="Close"
          className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-panel hover:text-ink focus-visible:outline-2 focus-visible:outline-primary"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </Dialog.Close>
      </div>

      <motion.div {...item(0)}>
        <Dialog.Title className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.03em]">
          {taskTitle(project)}
        </Dialog.Title>
        <div className="mt-2.5 flex flex-wrap items-center gap-2">
          <StatusBadge tone={status.tone} label={status.label} />
          <span className="rounded-full bg-panel px-2.5 py-[5px] text-2xs font-bold text-ink-2">
            {relativeDeadline(project.deliveryAt)}
          </span>
        </div>
      </motion.div>

      <motion.div {...item(1)} className="mt-5 rounded-2xl bg-panel/60 px-4 pb-4 pt-5">
        <Gauge
          value={review ? 100 : project.progressPct}
          tone={review ? "var(--color-highlight)" : "var(--color-primary)"}
          label={review ? "Sent for review" : "Done so far"}
          delay={0.25}
        />
      </motion.div>

      <motion.dl {...item(2)} className="mt-4 divide-y divide-line-subtle text-[13px]">
        {[
          ["Due", due ? `${formatDayShort(due)}, ${formatTime(due)}` : "Not set"],
          ["Pay for this task", `${formatPaise(project.payoutPaise)} before tax`],
          ["Working link", project.workingDocUrl ? "Added" : "Waiting for your supervisor"],
          ["Last update", timeAgo(project.updatedAt)],
          ...(project.revisionCount > 0 ? [["Changes asked for", `${project.revisionCount} time${project.revisionCount === 1 ? "" : "s"}`]] : []),
        ].map(([term, value]) => (
          <div key={term} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="font-semibold text-ink-2">{term}</dt>
            <dd className="text-right font-bold text-ink">{value}</dd>
          </div>
        ))}
      </motion.dl>

      {body ? (
        <motion.div {...item(3)} className="mt-3">
          <p className="text-xs font-bold uppercase tracking-[0.06em] text-ink-muted">The brief</p>
          <p className="mt-1.5 line-clamp-6 whitespace-pre-line text-[13px] leading-relaxed text-ink-2">{body}</p>
        </motion.div>
      ) : null}

      <div className="min-h-6 flex-1" aria-hidden="true" />
      <motion.div {...item(4)} className="pt-2">
        <Button asChild className="w-full">
          <Link to={`/work/${project.id}`} onMouseEnter={preloadWorkbench} onFocus={preloadWorkbench}>
            Open task
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>
    </>
  );
}

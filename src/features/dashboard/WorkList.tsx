import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { preloadWorkbench } from "@/lib/preload";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Button } from "@/components/ui/button";
import type { DoerProject } from "@/types/domain";
import { CategoryTile, MoreLink, Panel, PanelHeader, Segments } from "./ui";

type Filter = "all" | "to-start" | "in-progress" | "review";

const FILTERS: { id: Filter; label: string; match: (p: DoerProject) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "to-start", label: "To start", match: (p) => ["claimed", "quoted", "paid"].includes(p.status) },
  { id: "in-progress", label: "In progress", match: (p) => p.status === "in_progress" },
  { id: "review", label: "With supervisor", match: (p) => p.status === "in_review" || p.status === "delivered" },
];

function progressNote(project: DoerProject): string {
  if (project.status === "in_review" || project.status === "delivered") return "Sent for review";
  return `${project.progressPct}% done, ${relativeDeadline(project.deliveryAt).toLowerCase()}`;
}

export function WorkList({
  projects,
  loading,
  error,
  onRetry,
  onOpen,
  unlocked,
}: {
  projects: DoerProject[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
  /** Opens the quick-look drawer for a task. */
  onOpen: (project: DoerProject) => void;
  unlocked: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const [filter, setFilter] = useState<Filter>("all");
  const active = FILTERS.find((entry) => entry.id === filter) ?? FILTERS[0]!;
  const visible = useMemo(() => projects.filter(active.match), [projects, active]);
  const free = Math.max(0, MAX_ACTIVE_PROJECTS - projects.length);

  return (
    <Panel className="[grid-area:work]" aria-labelledby="your-work">
      <PanelHeader
        id="your-work"
        title="Your work"
        sub={`${projects.length} of ${MAX_ACTIVE_PROJECTS} slots in use`}
        className="flex-wrap"
        right={
          projects.length > 0 ? (
            <Segments
              label="Filter your work"
              value={filter}
              onChange={setFilter}
              className="max-w-full overflow-x-auto scrollbar-hide"
              options={FILTERS.map((entry) => ({
                id: entry.id,
                label: `${entry.label} ${projects.filter(entry.match).length}`,
              }))}
            />
          ) : null
        }
      />

      {loading ? (
        <div className="space-y-2.5">
          <div className="skeleton h-[66px] w-full rounded-2xl" />
          <div className="skeleton h-[66px] w-full rounded-2xl" />
        </div>
      ) : error ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl bg-panel/60 p-6 text-center">
          <p className="text-sm font-bold">Your work did not load.</p>
          <Button variant="outline" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      ) : (
        <LayoutGroup>
          <motion.ul layout={!reduceMotion} className="flex flex-col gap-2.5">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((project) => {
                const status = statusDisplay(project.status, project.workingDocUrl);
                const progress = Math.max(0, Math.min(100, project.progressPct));
                const review = project.status === "in_review" || project.status === "delivered";
                return (
                  <motion.li
                    key={project.id}
                    layout={!reduceMotion}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.97 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <button
                      type="button"
                      onClick={() => onOpen(project)}
                      onMouseEnter={preloadWorkbench}
                      onFocus={preloadWorkbench}
                      aria-label={`Quick look: ${taskTitle(project)}`}
                      className={cn(
                        "grid w-full grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl bg-panel/60 p-3 text-left transition-[background-color,transform] duration-200 md:grid-cols-[40px_minmax(0,1fr)_130px_auto]",
                        "hover:-translate-y-px hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary",
                      )}
                    >
                      <CategoryTile category={project.category} />
                      <span className="min-w-0">
                        <span className="block truncate text-[13.5px] font-bold text-ink">{taskTitle(project)}</span>
                        <span className="mt-1 flex min-w-0 items-center gap-2 overflow-hidden whitespace-nowrap text-[11.5px] font-semibold text-ink-muted">
                          <StatusBadge tone={status.tone} label={status.label} />
                          <span className="truncate">{project.category}</span>
                        </span>
                      </span>
                      <span className="hidden min-w-0 md:block">
                        <span className="block h-1.5 overflow-hidden rounded-full bg-white">
                          <motion.span
                            className={cn("block h-full rounded-full", review ? "bg-highlight" : "bg-primary")}
                            initial={reduceMotion ? false : { width: "0%" }}
                            animate={{ width: `${review ? 100 : progress}%` }}
                            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          />
                        </span>
                        <span className="mt-1.5 block truncate text-[11px] font-bold text-ink-muted">
                          {progressNote(project)}
                        </span>
                      </span>
                      <span className="text-right">
                        <span className="block text-[15px] font-extrabold tabular-nums tracking-[-0.02em]">
                          {formatPaise(project.payoutPaise)}
                        </span>
                        <span className="block text-[10.5px] font-semibold text-ink-3">before tax</span>
                      </span>
                    </button>
                  </motion.li>
                );
              })}
            </AnimatePresence>

            {projects.length > 0 && visible.length === 0 ? (
              <motion.li layout={!reduceMotion} className="rounded-2xl bg-panel/60 px-4 py-5 text-center text-xs font-semibold text-ink-muted">
                Nothing {active.label.toLowerCase()} right now.{" "}
                <button type="button" onClick={() => setFilter("all")} className="font-bold text-primary">
                  Show all
                </button>
              </motion.li>
            ) : null}

            {free > 0 ? (
              <motion.li layout={!reduceMotion}>
                <div className="grid grid-cols-[40px_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-dashed border-line-subtle p-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-panel text-ink-muted" aria-hidden="true">
                    <Plus className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[13.5px] font-bold text-ink-2">
                      {free} slot{free === 1 ? "" : "s"} open
                    </span>
                    <span className="block text-[11.5px] font-semibold text-ink-muted">
                      {unlocked
                        ? "Pick an offer that fits around your deadlines."
                        : "Finish verification to start getting offers."}
                    </span>
                  </span>
                  <MoreLink to={unlocked ? "/pool" : "/verification"} className="hidden sm:inline-flex">
                    {unlocked ? "See offers" : "Get verified"}
                  </MoreLink>
                </div>
              </motion.li>
            ) : null}
          </motion.ul>
        </LayoutGroup>
      )}
    </Panel>
  );
}

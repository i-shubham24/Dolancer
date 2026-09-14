import { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Inbox, Archive } from "lucide-react";
import { SkeletonCard, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { ProjectCard } from "@/components/brutal/ProjectCard";
import { SegmentedToggle } from "@/components/brutal/SegmentedToggle";
import { Button } from "@/components/ui/button";
import { statusDisplay } from "@/lib/status";
import { useUiStore } from "@/stores/useUiStore";
import type { DoerProject, WorkBucket } from "@/types/domain";
import { useProjects } from "./queries";

/**
 * Group order runs closest-to-done first, so whatever needs the doer's hands rises
 * to the top and finished work sinks. "Link needed" outranks everything because it
 * is the one state where nothing at all can progress.
 */
const GROUP_ORDER = [
  "Link needed",
  "In progress",
  "Ready to start",
  "With your supervisor",
  "Awaiting approval",
  "Assigned",
  "Approved",
  "Cancelled",
];

function groupProjects(projects: DoerProject[]): { label: string; items: DoerProject[] }[] {
  const groups = new Map<string, DoerProject[]>();

  for (const project of projects) {
    const { label } = statusDisplay(project.status, project.workingDocUrl);
    const bucket = groups.get(label);
    if (bucket) bucket.push(project);
    else groups.set(label, [project]);
  }

  return [...groups.entries()]
    .map(([label, items]) => ({ label, items }))
    .sort((a, b) => {
      const ai = GROUP_ORDER.indexOf(a.label);
      const bi = GROUP_ORDER.indexOf(b.label);
      return (ai === -1 ? 99 : ai) - (bi === -1 ? 99 : bi);
    });
}

const BUCKETS = [
  { id: "active" as const, label: "Active" },
  { id: "closed" as const, label: "Finished" },
];

export function WorkPage() {
  const reduceMotion = useReducedMotion();
  const bucket = useUiStore((state) => state.workBucket);
  const setBucket = useUiStore((state) => state.setWorkBucket);
  const projects = useProjects(bucket);

  const groups = useMemo(() => groupProjects(projects.data ?? []), [projects.data]);
  const total = projects.data?.length ?? 0;

  return (
    <motion.div className="relative space-y-7" initial={reduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
      <div className="pointer-events-none absolute -right-20 -top-24 -z-10 h-72 w-72 rounded-full bg-blue-light/70 blur-3xl" aria-hidden="true" />
      <header className="flex flex-wrap items-end justify-between gap-4 rounded-[1.75rem] border border-line-card bg-gradient-to-br from-blue-light/70 via-surface to-purple-light/60 p-6 shadow-soft-md sm:p-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue shadow-soft-sm">
            <span className="h-2 w-2 rounded-full bg-secondary" aria-hidden="true" /> Active pipeline
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">My workbench</h1>
          <p className="mt-2 text-md text-ink-2">
            {bucket === "active"
              ? "Everything on your plate, with whatever needs you first."
              : "Work you have finished."}
          </p>
        </div>
        <SegmentedToggle
          label="Work bucket"
          options={BUCKETS}
          value={bucket}
          onChange={(next: WorkBucket) => setBucket(next)}
        />
      </header>

      {projects.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          <LoadingAnnounce label="Loading your work" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : projects.isError ? (
        <ErrorState
          description="Your work list did not load."
          onRetry={() => void projects.refetch()}
        />
      ) : total === 0 ? (
        bucket === "active" ? (
          <EmptyState
            icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
            title="Nothing on your plate"
            description="When you claim work from the board it lands here, grouped by what needs doing next."
            action={
              <Button asChild>
                <Link to="/pool">Browse the board</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Archive className="h-6 w-6" aria-hidden="true" />}
            title="No finished work yet"
            description="Approved and cancelled projects move here once they are closed out."
          />
        )
      ) : (
        <div className="space-y-8">
          {groups.map((group) => (
            <section key={group.label} aria-labelledby={`group-${group.label}`}>
              {/* Sticky so the group stays identifiable while scrolling a long list. */}
              <div className="sticky top-16 z-10 -mx-1 mb-3 flex items-center gap-2 bg-canvas/95 px-1 py-2 backdrop-blur lg:top-0">
                <h2
                  id={`group-${group.label}`}
                  className="text-sm font-extrabold uppercase tracking-[0.05em] text-ink-muted"
                >
                  {group.label}
                </h2>
                <span className="rounded-full border border-line-card bg-surface px-2 py-0.5 text-[10px] font-extrabold">
                  {group.items.length}
                </span>
              </div>
              <motion.div className="grid gap-4 md:grid-cols-2" initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}>
                {group.items.map((project) => (
                  <motion.div key={project.id} variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.35 }}>
                    <ProjectCard project={project} />
                  </motion.div>
                ))}
              </motion.div>
            </section>
          ))}
        </div>
      )}
    </motion.div>
  );
}

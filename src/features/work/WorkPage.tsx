import { useMemo } from "react";
import { Link } from "react-router-dom";
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
  const bucket = useUiStore((state) => state.workBucket);
  const setBucket = useUiStore((state) => state.setWorkBucket);
  const projects = useProjects(bucket);

  const groups = useMemo(() => groupProjects(projects.data ?? []), [projects.data]);
  const total = projects.data?.length ?? 0;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">My work</h1>
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
                <span className="rounded-full border-[1.5px] border-ink bg-surface px-2 py-0.5 text-[10px] font-extrabold">
                  {group.items.length}
                </span>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {group.items.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}

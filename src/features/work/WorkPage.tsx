import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Archive, Inbox } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { Button } from "@/components/ui/button";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { Segments } from "@/components/app/ui";
import { statusDisplay } from "@/lib/status";
import { useUiStore } from "@/stores/useUiStore";
import type { DoerProject, WorkBucket } from "@/types/domain";
import { useProjects } from "./queries";
import { WorkCard } from "./WorkCard";

/**
 * Closest-to-done first, so whatever needs the doer's hands rises to the top and
 * finished work sinks. "Link needed" outranks everything because nothing at all can
 * move until it is resolved.
 */
const ORDER = [
  "Link needed",
  "In progress",
  "Ready to start",
  "With your supervisor",
  "Awaiting approval",
  "Assigned",
  "Approved",
  "Cancelled",
];

type Filter = "all" | "needs-you" | "review";

const FILTERS: { id: Filter; label: string; match: (p: DoerProject) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  {
    id: "needs-you",
    label: "Needs you",
    match: (p) => ["claimed", "quoted", "paid", "in_progress"].includes(p.status),
  },
  { id: "review", label: "With supervisor", match: (p) => p.status === "in_review" || p.status === "delivered" },
];

function rank(project: DoerProject): number {
  const index = ORDER.indexOf(statusDisplay(project.status, project.workingDocUrl).label);
  return index === -1 ? 99 : index;
}

export function WorkPage() {
  const bucket = useUiStore((state) => state.workBucket);
  const setBucket = useUiStore((state) => state.setWorkBucket);
  const projects = useProjects(bucket);
  const [filter, setFilter] = useState<Filter>("all");

  const all = useMemo(
    () =>
      [...(projects.data ?? [])].sort((a, b) =>
        bucket === "active" ? rank(a) - rank(b) : b.updatedAt.localeCompare(a.updatedAt),
      ),
    [projects.data, bucket],
  );
  const active = FILTERS.find((entry) => entry.id === filter) ?? FILTERS[0]!;
  const visible = bucket === "active" ? all.filter(active.match) : all;
  const needsYou = all.filter(FILTERS[1]!.match).length;

  return (
    <div>
      <PageHeader
        eyebrow="Work"
        title="My work"
        sub={
          projects.isLoading
            ? "Loading your tasks..."
            : bucket === "active"
              ? all.length === 0
                ? "Nothing on your plate right now."
                : `${all.length} active, ${needsYou} need${needsYou === 1 ? "s" : ""} you.`
              : `${all.length} finished task${all.length === 1 ? "" : "s"}.`
        }
        actions={
          <Segments
            label="Active or finished"
            value={bucket}
            onChange={(next: WorkBucket) => {
              setBucket(next);
              setFilter("all");
            }}
            className="bg-white ring-1 ring-ink/[0.05]"
            options={[
              { id: "active", label: "Active" },
              { id: "closed", label: "Finished" },
            ]}
          />
        }
      />

      {bucket === "active" && all.length > 0 ? (
        <Segments
          label="Filter tasks"
          value={filter}
          onChange={setFilter}
          className="mb-4 w-fit max-w-full overflow-x-auto scrollbar-hide"
          options={FILTERS.map((entry) => ({ id: entry.id, label: `${entry.label} ${all.filter(entry.match).length}` }))}
        />
      ) : null}

      {projects.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LoadingAnnounce label="Loading your work" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-56 w-full rounded-[20px]" />
          ))}
        </div>
      ) : projects.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Your work did not load"
          action={
            <Button variant="outline" onClick={() => void projects.refetch()}>
              Try again
            </Button>
          }
        />
      ) : all.length === 0 ? (
        bucket === "active" ? (
          <EmptyPanel
            icon={<Inbox />}
            title="Nothing on your plate"
            body="Accept an offer and it shows here."
            action={
              <Button asChild>
                <Link to="/pool">See offers</Link>
              </Button>
            }
          />
        ) : (
          <EmptyPanel icon={<Archive />} title="No finished work yet" body="Approved tasks move here." />
        )
      ) : visible.length === 0 ? (
        <EmptyPanel
          icon={<Inbox />}
          title="Nothing here"
          action={
            <Button variant="outline" onClick={() => setFilter("all")}>
              Show all
            </Button>
          }
        />
      ) : (
        <CardGrid key={`${bucket}-${filter}`} className="md:grid-cols-2 xl:grid-cols-3">
          {visible.map((project) => (
            <WorkCard key={project.id} project={project} />
          ))}
        </CardGrid>
      )}
    </div>
  );
}

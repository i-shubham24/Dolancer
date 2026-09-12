import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Inbox, Layers, ArrowRight, Wallet, Receipt, Briefcase } from "lucide-react";
import { SkeletonCard, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { ProjectCard } from "@/components/brutal/ProjectCard";
import { ColorStat } from "@/components/brutal/ColorStat";
import { SegmentedToggle } from "@/components/brutal/SegmentedToggle";
import { Card, CardTitle } from "@/components/brutal/Card";
import { CategoryPill } from "@/components/brutal/Pill";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { preloadRoute } from "@/lib/preload";
import { isActiveStatus, statusDisplay } from "@/lib/status";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { DoerProject } from "@/types/domain";
import {
  useProfile,
  useGateState,
  useActiveProjects,
  usePoolPreview,
  useEarningsSummary,
} from "./queries";
import { ReadinessCard } from "./ReadinessCard";
import { SpotlightHero } from "./SpotlightHero";
import { SearchTrigger } from "@/components/SearchTrigger";
import { AvailabilityToggle } from "./AvailabilityToggle";
import { CapacityRail } from "./CapacityRail";

function firstName(fullName: string | null | undefined): string {
  const name = fullName?.trim().split(/\s+/)[0];
  return name || "there";
}

type WorkFilter = "all" | "to-start" | "in-progress" | "in-review";

const FILTERS: { id: WorkFilter; label: string; match: (p: DoerProject) => boolean }[] = [
  { id: "all", label: "All", match: () => true },
  { id: "to-start", label: "To start", match: (p) => p.status === "paid" },
  { id: "in-progress", label: "In progress", match: (p) => p.status === "in_progress" },
  {
    id: "in-review",
    label: "In review",
    match: (p) => p.status === "in_review" || p.status === "delivered",
  },
];

export function DashboardPage() {
  const profile = useProfile();
  const gate = useGateState();
  const projects = useActiveProjects();
  const pool = usePoolPreview();
  const earnings = useEarningsSummary();
  const [filter, setFilter] = useState<WorkFilter>("all");

  const all = useMemo(
    () => (projects.data ?? []).filter((project) => isActiveStatus(project.status)),
    [projects.data],
  );

  const options = useMemo(
    () => FILTERS.map((entry) => ({ id: entry.id, label: entry.label, count: all.filter(entry.match).length })),
    [all],
  );

  const active = FILTERS.find((entry) => entry.id === filter) ?? FILTERS[0]!;
  const visible = all.filter(active.match);
  const activeCount = all.length;
  const linkNeeded = all.filter(
    (project) => statusDisplay(project.status, project.workingDocUrl).label === "Link needed",
  ).length;
  const focus = useMemo(() => {
    const dated = all.filter((p) => p.deliveryAt);
    const pool = (dated.length > 0 ? dated : all).slice();
    pool.sort((a, b) => {
      if (!a.deliveryAt) return 1;
      if (!b.deliveryAt) return -1;
      return +new Date(a.deliveryAt) - +new Date(b.deliveryAt);
    });
    return pool[0] ?? null;
  }, [all]);
  const poolCount = pool.data?.length ?? 0;

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">
            {profile.isLoading ? (
              <span className="skeleton inline-block h-9 w-64 align-middle" />
            ) : (
              <>Hey {firstName(profile.data?.full_name)}.</>
            )}
          </h1>
          <p className="mt-2 text-md text-ink-2">
            Here is where your work and your money stand today.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <SearchTrigger />
          <AvailabilityToggle />
        </div>
      </header>

      {gate.isLoading ? <SkeletonCard /> : gate.data ? <ReadinessCard gate={gate.data} /> : null}

      <SpotlightHero
        name={firstName(profile.data?.full_name)}
        activeCount={activeCount}
        poolCount={poolCount}
        focus={focus}
        unlocked={gate.data?.unlocked ?? false}
      />

      {/*
        Three figures, and only three. Gross, tax and net are always shown as separate
        numbers rather than collapsed into one, so what was withheld is never implicit.
      */}
      <section aria-labelledby="figures">
        <h2 id="figures" className="sr-only">
          Your figures
        </h2>
        {earnings.isError ? (
          <ErrorState
            description="We could not load your earnings just now."
            onRetry={() => void earnings.refetch()}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <ColorStat
              tone="lime"
              label="Paid out to date"
              value={formatPaise(earnings.data?.netPaise ?? 0)}
              subtext="Net of everything withheld"
              icon={<Wallet />}
              loading={earnings.isLoading}
            />
            <ColorStat
              tone="blue"
              label="Tax withheld"
              value={formatPaise(earnings.data?.taxWithheldPaise ?? 0)}
              subtext={`Cumulative TDS and GST. Gross released ${formatPaise(
                earnings.data?.grossPaise ?? 0,
              )}.`}
              icon={<Receipt />}
              loading={earnings.isLoading}
            />
            <ColorStat
              tone="coral"
              label="Active work"
              value={`${activeCount} of ${MAX_ACTIVE_PROJECTS}`}
              subtext={
                activeCount >= MAX_ACTIVE_PROJECTS
                  ? "At your limit. Finish one to take on more."
                  : `${MAX_ACTIVE_PROJECTS - activeCount} slot${
                      MAX_ACTIVE_PROJECTS - activeCount === 1 ? "" : "s"
                    } open for new work.`
              }
              icon={<Briefcase />}
              loading={projects.isLoading}
            />
          </div>
        )}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-7">
          {linkNeeded > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-xl border-2 border-ink bg-warning-bg px-4 py-3 shadow-offset-sm">
              <span className="rounded-full border-[1.5px] border-ink bg-surface px-2.5 py-0.5 text-2xs font-extrabold">
                {linkNeeded} waiting
              </span>
              <p className="min-w-0 flex-1 text-sm font-bold">
                {linkNeeded === 1
                  ? "One project is frozen until you add its working link."
                  : `${linkNeeded} projects are frozen until you add their working links.`}
              </p>
              <Button asChild size="sm" variant="secondary">
                <Link to="/work">Fix now</Link>
              </Button>
            </div>
          ) : null}

          <section aria-labelledby="active-work" className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="active-work" className="text-2xl font-extrabold tracking-[-0.03em]">
                Your work
              </h2>
              {activeCount > 0 ? (
                <Button asChild variant="ghost" size="sm">
                  <Link to="/work">
                    See all
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Button>
              ) : null}
            </div>

            {activeCount > 0 ? (
              <SegmentedToggle
                label="Filter your work"
                options={options}
                value={filter}
                onChange={setFilter}
              />
            ) : null}

            {projects.isLoading ? (
              <div className="grid gap-4 md:grid-cols-2">
                <LoadingAnnounce label="Loading your projects" />
                <SkeletonCard />
                <SkeletonCard />
              </div>
            ) : projects.isError ? (
              <ErrorState
                description="Your project list did not load."
                onRetry={() => void projects.refetch()}
              />
            ) : activeCount === 0 ? (
              <EmptyState
                icon={<Inbox className="h-6 w-6" aria-hidden="true" />}
                title="No active work yet"
                description={
                  gate.data?.unlocked
                    ? "Nothing on your plate right now. Check the board for work that matches your skills."
                    : "Once you are verified, matching projects will show up here."
                }
                action={
                  <Button asChild>
                    <Link to={gate.data?.unlocked ? "/pool" : "/verification"}>
                      {gate.data?.unlocked ? "Browse the board" : "Get verified"}
                    </Link>
                  </Button>
                }
              />
            ) : visible.length === 0 ? (
              <EmptyState
                icon={<Layers className="h-6 w-6" aria-hidden="true" />}
                title={`Nothing ${active.label.toLowerCase()}`}
                description="Try another filter to see the rest of your work."
                action={
                  <Button variant="secondary" onClick={() => setFilter("all")}>
                    Show all
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {visible.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </section>
        </div>

        <CapacityRail activeCount={activeCount} gate={gate.data} />
      </div>

      <section aria-labelledby="board" className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <h2 id="board" className="text-2xl font-extrabold tracking-[-0.03em]">
                On the board
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/pool">
                  Open board
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {pool.isLoading ? (
              <div className="grid gap-3">
                <LoadingAnnounce label="Loading available work" />
                <SkeletonCard />
              </div>
            ) : pool.isError || !pool.data?.length ? (
              <EmptyState
                icon={<Layers className="h-6 w-6" aria-hidden="true" />}
                title="Nothing matching right now"
                description="Work appears here when it matches your skills and you are set to Available. New briefs land through the day."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pool.data.map((offer) => (
                  <Card
                    key={offer.id}
                    hoverable
                    className="flex flex-wrap items-center gap-4"
                    onMouseEnter={() => preloadRoute("/pool")}
                    onFocus={() => preloadRoute("/pool")}
                  >
                    <div className="min-w-0 flex-1 space-y-2">
                      <CategoryPill>{offer.category}</CategoryPill>
                      <CardTitle className="line-clamp-2" title={offer.brief?.trim() || `${offer.category} task`}>
                        {offer.brief?.trim() || `${offer.category} task`}
                      </CardTitle>
                      <p className="text-xs text-ink-muted">{relativeDeadline(offer.deliveryAt)}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <div className="text-2xs font-bold uppercase tracking-[0.05em] text-ink-muted">
                        Payout
                      </div>
                      <div className="text-2xl font-extrabold tracking-[-0.03em]">
                        {formatPaise(offer.payoutPaise)}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
      </section>
    </div>
  );
}

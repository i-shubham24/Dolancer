import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Inbox, Layers, ArrowRight, Wallet, Receipt, Briefcase } from "lucide-react";
import { SkeletonCard, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { ProjectCard } from "@/components/brutal/ProjectCard";
import { ColorStat } from "@/components/brutal/ColorStat";
import { SegmentedToggle } from "@/components/brutal/SegmentedToggle";
import { MotionCard, CardTitle } from "@/components/brutal/Card";
import { CategoryPill } from "@/components/brutal/Pill";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { ActionHub } from "@/components/brutal/ActionHub";
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
  const reduceMotion = useReducedMotion();
  const profile = useProfile();
  const gate = useGateState();
  const projects = useActiveProjects();
  const pool = usePoolPreview();
  const earnings = useEarningsSummary();
  const navigate = useNavigate();
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
    <motion.div
      className="space-y-8"
      initial={reduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
    >
      <header className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-line-card bg-surface p-5 shadow-soft-md transition-all duration-200 hover:shadow-soft-lg sm:p-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.04em] text-ink sm:text-4xl">
            {profile.isLoading ? (
              <span className="skeleton inline-block h-9 w-64 align-middle" />
            ) : (
              <>Hey {firstName(profile.data?.full_name)}.</>
            )}
          </h1>
          <p className="mt-2 text-md font-medium text-ink-2">
            Here is where your work and your money stand today.
          </p>
        </div>
        <AvailabilityToggle />
      </header>

      {gate.isLoading ? <SkeletonCard /> : gate.data ? <ReadinessCard gate={gate.data} /> : null}

      <SpotlightHero
        name={firstName(profile.data?.full_name)}
        activeCount={activeCount}
        poolCount={poolCount}
        focus={focus}
        unlocked={gate.data?.unlocked ?? false}
      />

      {/* Action Hubs */}
      {projects.data?.map(p => {
        if (p.revisionCount > 0 && p.status === "in_progress") {
          return (
            <ActionHub
              key={`rev-${p.id}`}
              tone="warning"
              title={`Revision requested: ${(p.brief?.split("\n")[0] || p.category || "").substring(0, 40)}`}
              description="Your supervisor requested a revision. Please review the feedback and update your delivery."
              actionLabel="View Revision"
              onAction={() => navigate(`/work/${p.id}`)}
            />
          );
        }
        if (!p.workingDocUrl && p.status === "in_progress") {
          return (
            <ActionHub
              key={`wl-${p.id}`}
              tone="danger"
              title={`Working link needed: ${(p.brief?.split("\n")[0] || p.category || "").substring(0, 40)}`}
              description="You must provide a working link so your supervisor can monitor progress."
              actionLabel="Add Link"
              onAction={() => navigate(`/work/${p.id}`)}
            />
          );
        }
        return null;
      })}

      {/*
        Three figures, and only three. Gross, tax and net are always shown as separate
        numbers rather than collapsed into one, so what was withheld is never implicit.
      */}
      <section aria-labelledby="figures" className="rounded-2xl border border-line-card bg-surface p-4 shadow-soft-md transition-all duration-200 hover:shadow-soft-lg sm:p-5">
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
              tone="accent"
              label="Paid out to date"
              value={formatPaise(earnings.data?.netPaise ?? 0)}
              subtext="Net of everything withheld"
              icon={<Wallet />}
              loading={earnings.isLoading}
            />
            <ColorStat
              tone="secondary"
              label="Tax withheld"
              value={formatPaise(earnings.data?.taxWithheldPaise ?? 0)}
              subtext={`Cumulative TDS and GST. Gross released ${formatPaise(
                earnings.data?.grossPaise ?? 0,
              )}.`}
              icon={<Receipt />}
              loading={earnings.isLoading}
            />
            <ColorStat
              tone="primary"
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
            <div className="flex flex-wrap items-center gap-3 rounded-xl border border-line-card bg-warning-bg px-4 py-3 shadow-soft-sm">
              <span className="rounded-full border border-line-card bg-surface px-2.5 py-0.5 text-2xs font-extrabold">
                {linkNeeded} waiting
              </span>
              <p className="min-w-0 flex-1 text-sm font-bold">
                {linkNeeded === 1
                  ? "One project is frozen until you add its working link."
                  : `${linkNeeded} projects are frozen until you add their working links.`}
              </p>
              <Button asChild size="sm" variant="outline">
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
                    ? "Nothing on your plate right now. New offers appear here when a supervisor routes a suitable project to you."
                    : "Once you are verified, assigned offers can appear here when a supervisor routes a suitable project."
                }
                action={
                  <Button asChild>
                    <Link to={gate.data?.unlocked ? "/pool" : "/verification"}>
                      {gate.data?.unlocked ? "View assigned offers" : "Get verified"}
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
                  <Button variant="outline" onClick={() => setFilter("all")}>
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

      <section aria-labelledby="assigned-offers" className="space-y-4 rounded-2xl border border-line-card bg-surface p-5 shadow-soft-md transition-all duration-200 hover:shadow-soft-lg sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <h2 id="assigned-offers" className="text-2xl font-extrabold tracking-[-0.03em]">
                Assigned offers
              </h2>
              <Button asChild variant="ghost" size="sm">
                <Link to="/pool">
                  View all offers
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </Button>
            </div>

            {pool.isLoading ? (
              <div className="grid gap-3">
                <LoadingAnnounce label="Loading assigned offers" />
                <SkeletonCard />
              </div>
            ) : pool.isError || !pool.data?.length ? (
              <EmptyState
                icon={<Layers className="h-6 w-6" aria-hidden="true" />}
                title="Nothing matching right now"
                description="Offers appear here when a supervisor routes a project that fits your verified disciplines and capacity."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {pool.data.map((offer) => (
                  <Link
                    key={offer.id}
                    to="/pool"
                    onMouseEnter={() => preloadRoute("/pool")}
                    onFocus={() => preloadRoute("/pool")}
                  >
                    <MotionCard
                      hoverable
                      className="flex h-full flex-wrap items-center gap-4 transition-colors hover:border-highlight/35"
                    >
                      <div className="min-w-0 flex-1 space-y-2">
                        <CategoryPill>{offer.category}</CategoryPill>
                        <CardTitle className="line-clamp-2" title={offer.brief?.trim() || `${offer.category} offer`}>
                          {offer.brief?.trim() || `${offer.category} offer`}
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
                    </MotionCard>
                  </Link>
                ))}
              </div>
            )}
      </section>
    </motion.div>
  );
}

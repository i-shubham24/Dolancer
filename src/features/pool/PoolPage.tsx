import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Layers, Lock, SlidersHorizontal, ShieldCheck, BellRing, Bell } from "lucide-react";
import { SkeletonCard, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { SegmentedToggle } from "@/components/brutal/SegmentedToggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { availabilityState, AVAILABILITY_COPY } from "@/stores/useAvailabilityStore";
import { useAvailability, useGateState } from "@/features/dashboard/queries";
import { AvailabilityToggle } from "@/features/dashboard/AvailabilityToggle";
import type { PoolOffer } from "@/types/domain";
import { usePool } from "./queries";
import { PoolCard } from "./PoolCard";
import { ClaimDrawer } from "./ClaimDrawer";
import { useBoardNotify } from "./useBoardNotify";
import type { PoolSort } from "./api";

const SORTS = [
  { id: "newest" as const, label: "Newest" },
  { id: "payout" as const, label: "Highest pay" },
  { id: "deadline" as const, label: "Due soonest" },
];

const SORT_IDS: PoolSort[] = ["newest", "payout", "deadline"];

function sortFromParams(params: URLSearchParams): PoolSort {
  const raw = params.get("sort");
  return SORT_IDS.includes(raw as PoolSort) ? (raw as PoolSort) : "newest";
}

export function PoolPage() {
  const [params, setParams] = useSearchParams();
  const sort = sortFromParams(params);
  const setSort = (next: PoolSort) => {
    setParams((current) => {
      const copy = new URLSearchParams(current);
      copy.set("sort", next);
      return copy;
    });
  };
  const [selected, setSelected] = useState<PoolOffer | null>(null);
  const { watching, toggle: toggleWatch } = useBoardNotify();

  const pool = usePool(sort);
  const gate = useGateState();
  const { available, activeCount, isLoading: availabilityLoading } = useAvailability();

  const state = availabilityState({ activeCount, available });
  const atCap = state === "at-capacity";
  const paused = state === "paused";
  const unverified = gate.data ? !gate.data.unlocked : false;

  /**
   * Why claiming is blocked, if it is, in priority order.
   *
   * The cap outranks pause, because at the cap the pause is a consequence rather
   * than a choice and reporting it would hide the real reason. Verification comes
   * last because it is the slowest to resolve.
   */
  const blockedReason = atCap
    ? AVAILABILITY_COPY["at-capacity"].detail
    : unverified
      ? "Finish your setup to start claiming work."
      : null;

  const offers = pool.data?.items ?? [];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Job board</h1>
          <p className="mt-2 max-w-xl text-md text-ink-2">
            Work matched to your skills. The pay is fixed and shown upfront, and the first
            qualified claim wins.
          </p>
        </div>
        <AvailabilityToggle />
      </header>

      {/*
        Capacity is stated before it bites, not only at the moment it blocks. The
        counter is always visible so the cap is legible while there is still room.
      */}
      {!availabilityLoading ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-xl border-2 border-ink px-4 py-3 shadow-offset-sm",
            atCap ? "bg-warning-bg" : "bg-surface",
          )}
        >
          {atCap ? (
            <Lock className="h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
          ) : (
            <Layers className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
          )}
          <span className="text-sm font-extrabold">
            {activeCount} of {MAX_ACTIVE_PROJECTS} slots in use
          </span>
          <span className="text-xs text-ink-2">
            {atCap
              ? "Submit or finish a project to claim another. This does not affect your standing or your rating."
              : "You can claim while you have a slot free."}
          </span>
          {atCap ? (
            <Button asChild size="sm" variant="secondary" className="w-full sm:ml-auto sm:w-auto">
              <Link to="/work">Go to my work</Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-bold text-ink-2">
          <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
          {pool.isLoading ? "Loading..." : `${offers.length} available`}
        </div>
        <SegmentedToggle label="Sort work" options={SORTS} value={sort} onChange={setSort} />
      </div>

      {pool.isLoading ? (
        <div className="grid gap-4">
          <LoadingAnnounce label="Loading available work" />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : pool.isError ? (
        <ErrorState
          description="The board did not load."
          onRetry={() => void pool.refetch()}
        />
      ) : offers.length === 0 ? (
        /*
         * Three distinct empty states, each with its own cause and its own action.
         * Collapsing them into one message would leave a paused doer staring at
         * "nothing available" with no idea they hid the board themselves.
         */
        atCap ? (
          <EmptyState
            icon={<Lock className="h-6 w-6" aria-hidden="true" />}
            title="Your slots are full"
            description={`You are holding ${MAX_ACTIVE_PROJECTS} projects, so the board is hidden while you finish them.`}
            action={
              <Button asChild>
                <Link to="/work">Go to my work</Link>
              </Button>
            }
          />
        ) : paused ? (
          <EmptyState
            icon={<Layers className="h-6 w-6" aria-hidden="true" />}
            title="You are paused"
            description="You have hidden the board. Switch back to Available to see work matched to your skills."
            action={<AvailabilityToggle compact />}
          />
        ) : unverified ? (
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
            title="Finish your setup to see work"
            description="Verification, skills and training decide which projects reach you. You keep full access to the app while you complete them."
            action={
              <Button asChild>
                <Link to="/verification">Continue setup</Link>
              </Button>
            }
          />
        ) : (
          <EmptyState
            icon={<Layers className="h-6 w-6" aria-hidden="true" />}
            title="Nothing matching right now"
            description={
              watching
                ? "You are watching the board. New matches land here first, newest on top."
                : "Work shows here as soon as a brief matches your skills. New ones land through the day, so check back."
            }
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant={watching ? "secondary" : "primary"} onClick={toggleWatch}>
                  {watching ? (
                    <>
                      <BellRing className="h-4 w-4" aria-hidden="true" />
                      Watching. Turn off
                    </>
                  ) : (
                    <>
                      <Bell className="h-4 w-4" aria-hidden="true" />
                      Notify me when work appears
                    </>
                  )}
                </Button>
                <Button asChild variant="secondary">
                  <Link to="/skills">Review my skills</Link>
                </Button>
              </div>
            }
          />
        )
      ) : (
        <div className="grid gap-4">
          {offers.map((offer) => (
            <PoolCard
              key={offer.id}
              offer={offer}
              selected={selected?.id === offer.id}
              hideAccessories={selected?.id === offer.id}
              onOpen={() => setSelected(offer)}
            />
          ))}
        </div>
      )}

      <ClaimDrawer
        offer={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        blockedReason={blockedReason}
      />
    </div>
  );
}

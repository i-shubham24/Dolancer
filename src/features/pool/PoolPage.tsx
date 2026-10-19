import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, BellRing, Layers, PauseCircle, ShieldCheck } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { Button } from "@/components/ui/button";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { Segments } from "@/components/app/ui";
import { availabilityState } from "@/stores/useAvailabilityStore";
import { useAvailability, useGateState } from "@/features/dashboard/queries";
import { AvailabilityToggle } from "@/features/dashboard/AvailabilityToggle";
import type { PoolOffer } from "@/types/domain";
import { usePool } from "./queries";
import type { PoolSort } from "./api";
import { PoolCard } from "./PoolCard";
import { ClaimDrawer } from "./ClaimDrawer";
import { useBoardNotify } from "./useBoardNotify";

/** Active tasks count indicator. */
function ActiveWorkPill({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <div
      className="flex h-11 items-center gap-2 rounded-full bg-white px-4 ring-1 ring-ink/[0.05]"
      aria-label={`${count} active task${count === 1 ? "" : "s"}`}
    >
      <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      <span className="text-[13px] font-bold text-ink">
        {count} active {count === 1 ? "task" : "tasks"}
      </span>
    </div>
  );
}

export function PoolPage() {
  const [selected, setSelected] = useState<PoolOffer | null>(null);
  const [sort, setSort] = useState<PoolSort>("newest");
  const { watching, toggle: toggleWatch } = useBoardNotify();
  const pool = usePool(sort);
  const gate = useGateState();
  const { available, activeCount } = useAvailability();

  const state = availabilityState({ activeCount, available });
  const paused = state === "paused";
  const unverified = gate.data ? !gate.data.unlocked : false;
  const offers = pool.data?.items ?? [];

  // A chat can link straight to one offer; open it once the board has loaded.
  const [params, setParams] = useSearchParams();
  const wanted = params.get("offer");
  useEffect(() => {
    if (!wanted || !pool.data) return;
    const match = pool.data.items.find((offer) => offer.id === wanted);
    if (match) setSelected(match);
    setParams((current) => {
      const next = new URLSearchParams(current);
      next.delete("offer");
      return next;
    }, { replace: true });
  }, [wanted, pool.data, setParams]);

  const blockedReason = unverified ? "Finish your setup before accepting offers." : null;

  return (
    <div>
      <PageHeader
        title="Assigned offers"
        sub={
          pool.isLoading
            ? "Checking your offers..."
            : offers.length > 0
              ? `${offers.length} offer${offers.length === 1 ? "" : "s"} for your skills. Pay is fixed before you say yes.`
              : "Offers for your skills land here."
        }
        actions={<ActiveWorkPill count={activeCount} />}
      />

      {offers.length > 1 ? (
        <Segments
          label="Sort offers"
          value={sort}
          onChange={setSort}
          className="mb-4 w-fit max-w-full overflow-x-auto scrollbar-hide"
          options={[
            { id: "newest", label: "Newest" },
            { id: "payout", label: "Highest pay" },
            { id: "deadline", label: "Due soonest" },
          ]}
        />
      ) : null}

      {pool.isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <LoadingAnnounce label="Loading assigned offers" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-52 w-full rounded-[20px]" />
          ))}
        </div>
      ) : pool.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Offers did not load"
          action={
            <Button variant="outline" onClick={() => void pool.refetch()}>
              Try again
            </Button>
          }
        />
      ) : offers.length === 0 ? (
        paused ? (
          <EmptyPanel
            icon={<PauseCircle />}
            title="You are not available"
            body="Switch on Available when you want new offers."
            action={<AvailabilityToggle />}
          />
        ) : unverified ? (
          <EmptyPanel
            icon={<ShieldCheck />}
            title="Finish your setup first"
            body="Verification, skills and training help your supervisor send the right work."
            action={
              <Button asChild>
                <Link to="/home">Continue setup</Link>
              </Button>
            }
          />
        ) : (
          <EmptyPanel
            icon={<Layers />}
            title="No offers right now"
            body={watching ? "We will let you know when one arrives." : "Your supervisor sends offers that fit your skills."}
            action={
              <>
                <Button variant={watching ? "outline" : "primary"} onClick={toggleWatch}>
                  <BellRing className="h-4 w-4" aria-hidden="true" />
                  {watching ? "Stop notifying me" : "Notify me"}
                </Button>
                <Button asChild variant="outline">
                  <Link to="/skills">Check my skills</Link>
                </Button>
              </>
            }
          />
        )
      ) : (
        <CardGrid key={sort} className="md:grid-cols-2 xl:grid-cols-3">
          {offers.map((offer) => (
            <PoolCard key={offer.id} offer={offer} onOpen={() => setSelected(offer)} />
          ))}
        </CardGrid>
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

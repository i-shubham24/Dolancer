import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Layers, Lock, ShieldCheck, BellRing, ClipboardCheck } from "lucide-react";
import { SkeletonCard, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { availabilityState } from "@/stores/useAvailabilityStore";
import { useAvailability, useGateState } from "@/features/dashboard/queries";
import { AvailabilityToggle } from "@/features/dashboard/AvailabilityToggle";
import type { PoolOffer } from "@/types/domain";
import { usePool } from "./queries";
import { PoolCard } from "./PoolCard";
import { ClaimDrawer } from "./ClaimDrawer";
import { useBoardNotify } from "./useBoardNotify";
import { StitchOrbitalGraphic } from "@/components/stitch/StitchPrimitives";

export function PoolPage() {
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState<PoolOffer | null>(null);
  const { watching, toggle: toggleWatch } = useBoardNotify();
  const pool = usePool("newest");
  const gate = useGateState();
  const { available, activeCount, isLoading: availabilityLoading } = useAvailability();

  const state = availabilityState({ activeCount, available });
  const atCap = state === "at-capacity";
  const paused = state === "paused";
  const unverified = gate.data ? !gate.data.unlocked : false;
  const offers = pool.data?.items ?? [];

  const blockedReason = atCap
    ? "Your active-project limit is full. Finish an existing project before accepting another offer."
    : unverified
      ? "Finish your setup before accepting project offers."
      : null;

  return (
    <motion.div
      className="relative space-y-7"
      initial={reduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pointer-events-none absolute -left-24 -top-24 -z-10 h-72 w-72 rounded-full bg-purple-light/70 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-40 -z-10 h-64 w-64 rounded-full bg-blue-light/70 blur-3xl" aria-hidden="true" />

      <header className="relative overflow-hidden rounded-[1.75rem] border border-line-card bg-gradient-to-br from-purple-light/80 via-surface to-blue-light/60 p-6 shadow-soft-md sm:p-8">
        <StitchOrbitalGraphic className="absolute -right-10 -top-10 h-48 w-48 opacity-70" />
        <div className="relative max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-surface/80 px-3 py-1 text-xs font-bold uppercase tracking-wider text-purple shadow-soft-sm">
            <span className="h-2 w-2 animate-pulse rounded-full bg-secondary" aria-hidden="true" />
            Private offer desk
          </div>
          <h1 className="text-3xl font-extrabold tracking-[-0.045em] sm:text-4xl">Assigned offers</h1>
          <p className="mt-2 max-w-xl text-md text-ink-2">
            Review project offers routed to you by a supervisor. Each offer shows its scope, deadline and doer payout before you accept it.
          </p>
        </div>
        <div className="relative mt-5 flex flex-wrap items-center gap-2 text-xs font-semibold text-ink-2">
          <span className="rounded-full bg-surface/80 px-3 py-1.5 shadow-soft-sm">Supervisor routed</span>
          <span className="rounded-full bg-surface/80 px-3 py-1.5 shadow-soft-sm">No bidding</span>
          <span className="rounded-full bg-surface/80 px-3 py-1.5 shadow-soft-sm">Identity protected</span>
        </div>
        <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 text-xs font-bold text-ink-2">
            <ClipboardCheck className="h-4 w-4 text-purple" aria-hidden="true" />
            Offers are private to your account
          </div>
          <AvailabilityToggle />
        </div>
      </header>

      {!availabilityLoading ? (
        <div
          className={cn(
            "flex flex-wrap items-center gap-3 rounded-2xl border border-line-card px-4 py-3 shadow-soft-md",
            atCap ? "bg-warning-bg" : "bg-surface",
          )}
        >
          {atCap ? (
            <Lock className="h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
          ) : (
            <Layers className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
          )}
          <span className="text-sm font-extrabold">
            {activeCount} of {MAX_ACTIVE_PROJECTS} projects active
          </span>
          <span className="text-xs text-ink-2">
            {atCap
              ? "New offers pause until one of your active projects is complete."
              : "Your supervisor can route an offer while you have capacity."}
          </span>
          {atCap ? (
            <Button asChild size="sm" variant="secondary" className="w-full sm:ml-auto sm:w-auto">
              <Link to="/work">Go to my work</Link>
            </Button>
          ) : null}
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line-card bg-surface p-4 shadow-soft-md">
        <div className="flex items-center gap-2 text-sm font-bold text-ink-2">
          <ShieldCheck className="h-4 w-4 text-success-ink" aria-hidden="true" />
          {pool.isLoading ? "Checking your offers..." : `${offers.length} assigned offer${offers.length === 1 ? "" : "s"}`}
        </div>
        <span className="text-xs font-semibold text-ink-muted">Offers are routed manually, not claimed from a public pool.</span>
      </div>

      {pool.isLoading ? (
        <div className="grid gap-4">
          <LoadingAnnounce label="Loading assigned offers" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : pool.isError ? (
        <ErrorState description="Your assigned offers did not load." onRetry={() => void pool.refetch()} />
      ) : offers.length === 0 ? (
        atCap ? (
          <EmptyState
            icon={<Lock className="h-6 w-6" aria-hidden="true" />}
            title="Your project capacity is full"
            description={`You are holding ${MAX_ACTIVE_PROJECTS} active projects. New offers will appear after you clear one.`}
            action={<Button asChild><Link to="/work">Go to my work</Link></Button>}
          />
        ) : paused ? (
          <EmptyState
            icon={<Layers className="h-6 w-6" aria-hidden="true" />}
            title="Offers are paused"
            description="You have hidden new offers for now. Switch back to Available when you want your supervisor to consider you for work."
            action={<AvailabilityToggle compact />}
          />
        ) : unverified ? (
          <EmptyState
            icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
            title="Finish your setup first"
            description="Verification, disciplines and training help the team route suitable offers. You can explore the app while you complete them."
            action={<Button asChild><Link to="/verification">Continue setup</Link></Button>}
          />
        ) : (
          <EmptyState
            icon={<Layers className="h-6 w-6" aria-hidden="true" />}
            title="No assigned offers right now"
            description={watching ? "You are watching for new routing activity. Your supervisor will send an offer when a suitable project is ready." : "Suitable projects are routed by supervisors. Keep your disciplines and availability current so the team knows when to consider you."}
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button variant={watching ? "secondary" : "primary"} onClick={toggleWatch}>
                  <BellRing className="h-4 w-4" aria-hidden="true" />
                  {watching ? "Watching. Turn off" : "Notify me about routing"}
                </Button>
                <Button asChild variant="secondary"><Link to="/skills">Review my disciplines</Link></Button>
              </div>
            }
          />
        )
      ) : (
        <motion.div
          className="grid gap-4"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: reduceMotion ? 0 : 0.06 } } }}
        >
          {offers.map((offer) => (
            <motion.div
              key={offer.id}
              variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <PoolCard
                offer={offer}
                selected={selected?.id === offer.id}
                hideAccessories={selected?.id === offer.id}
                onOpen={() => setSelected(offer)}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      <ClaimDrawer
        offer={selected}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        blockedReason={blockedReason}
      />
    </motion.div>
  );
}

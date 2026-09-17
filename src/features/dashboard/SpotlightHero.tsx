import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Flame, Layers, Timer } from "lucide-react";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { DoerProject } from "@/types/domain";
import { cn } from "@/lib/cn";

/**
 * SpotlightHero is pure presentation over data the dashboard already loads.
 * It invents no money figure, renames no status, and links only to existing
 * routes. Safe to keep when the backend lands.
 */
export function SpotlightHero({
  name,
  activeCount,
  poolCount,
  focus,
  unlocked,
}: {
  name: string;
  activeCount: number;
  poolCount: number;
  focus: DoerProject | null;
  unlocked: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const hour = new Date().getHours();
  const daypart = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const freeSlots = Math.max(0, MAX_ACTIVE_PROJECTS - activeCount);
  const atCap = activeCount >= MAX_ACTIVE_PROJECTS;

  return (
    <motion.section
      aria-label="Today spotlight"
      className="relative overflow-hidden rounded-[28px] border border-highlight/20 bg-gradient-to-br from-[var(--dl-purple)] via-[var(--dl-primary)] to-[var(--dl-secondary)] text-inverse shadow-soft-lg"
      initial={reduceMotion ? false : { opacity: 0, scale: 0.985 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.08 }}
    >
      <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
      <style>{`@keyframes dolancer-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Top meta row */}
      <div className="relative flex flex-wrap items-center justify-between gap-2 border-b border-white/15 px-5 py-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/85">
          {today} <span className="mx-2 text-white/55">/</span> Doer mode
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/60 bg-accent/10 px-2.5 py-1 text-[11px] font-extrabold text-accent">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" aria-hidden="true" />
            {poolCount} assigned offers
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold",
              atCap ? "border-primary/70 bg-primary/15 text-primary" : "border-white/35 bg-white/10 text-white",
            )}
          >
            <Flame className="h-3 w-3" aria-hidden="true" />
            {activeCount} of {MAX_ACTIVE_PROJECTS} slots used
          </span>
        </div>
      </div>

      <div className="relative grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Left: greeting + actions */}
        <div className="min-w-0">
          <div           className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white backdrop-blur-sm">
            Fixed pay <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> No bidding
          </div>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-4xl text-white drop-shadow-sm">
            {daypart}, {name}.
            <span className="mt-1 block text-white/95">
              {focus ? "Your next deadline is waiting." : freeSlots > 0 ? "Room to take something new." : "Finish strong, then accept again."}
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm font-medium leading-relaxed text-white drop-shadow-sm">
            {unlocked
              ? "Accept your assigned offer, add your working link, submit for supervisor review. Pay stays fixed from the start."
              : "View your assignments. Finish verification to unlock offers and payouts."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/pool"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-extrabold text-[var(--dl-primary)] shadow-soft-md transition-all duration-150 hover:bg-hover"
            >
              View assigned offers
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/work"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-extrabold text-inverse transition-all duration-150 hover:bg-white/20"
            >
              My work
            </Link>
            <Link
              to="/training"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-extrabold text-inverse transition-all duration-150 hover:bg-white/20"
            >
              Training
            </Link>
          </div>
        </div>

        {/* Right: focus card, derived from real active work only */}
        <div className="min-w-0">
          {focus ? (
            <Link
              to={`/work/${focus.id}`}
              className="group block rounded-2xl border border-white/60 bg-surface/95 p-5 text-ink shadow-soft-lg transition-all duration-150 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
                  <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                  Up next
                </span>
                <span className="rounded-full border border-[var(--dl-secondary)]/20 bg-[var(--dl-secondary-light)] px-2 py-0.5 text-[11px] font-extrabold text-[var(--dl-ink)]">
                  {relativeDeadline(focus.deliveryAt)}
                </span>
              </div>
              <p className="mt-3 truncate text-lg font-extrabold tracking-[-0.02em]">
                {focus.brief?.trim() || `${focus.category} task`}
              </p>
              <div className="mt-2 flex min-w-0 flex-wrap items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-ink-muted">Payout before tax</div>
                  <div className="break-words text-3xl font-extrabold tracking-[-0.03em]">{formatPaise(focus.payoutPaise)}</div>
                </div>
                <span className="inline-flex min-h-[44px] items-center gap-1 rounded-xl bg-[var(--dl-primary)] px-3 py-2 text-xs font-extrabold text-inverse transition-transform group-hover:translate-x-0.5">
                  Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full border border-line-card bg-surface-2"
                role="progressbar"
                aria-valuenow={focus.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task progress"
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${Math.min(100, Math.max(0, focus.progressPct))}%` }} />
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-dashed border-white/25 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white/85">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                No active work
              </div>
              <p className="mt-3 text-lg font-extrabold leading-snug">
                Nothing on your plate. Offers are routed manually by your supervisor.
              </p>
              <Link
                to={unlocked ? "/pool" : "/verification"}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-line-card bg-accent px-4 py-2.5 text-sm font-extrabold text-ink shadow-soft-sm transition-all hover:-translate-y-px"
              >
                {unlocked ? "View assigned offers" : "Get verified"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          )}

          {/* Slot meter, mirrors CapacityRail without replacing it */}
          <div className="mt-3 flex items-center gap-2" aria-hidden="true">
            {Array.from({ length: MAX_ACTIVE_PROJECTS }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full border border-white/30",
                  i < activeCount ? (atCap ? "bg-primary" : "bg-accent") : "bg-white/10",
                )}
              />
            ))}
            <span className="ml-1 font-mono text-[11px] font-bold text-white/80">
              {freeSlots} open
            </span>
          </div>
        </div>
      </div>

      {/* Bottom marquee, static copy only */}
      <div className="overflow-hidden border-t border-white/15 bg-black/10 py-2.5 backdrop-blur-sm" aria-hidden="true">
        <div className="flex w-max animate-none gap-8 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/90 [animation:dolancer-marquee_28s_linear_infinite]">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-8">
              <span>Assigned offers</span><span className="text-[var(--dl-accent)]">Fixed payout</span><span className="text-white/70">Supervisor review</span><span className="text-white">Working link first</span><span className="text-white/70">3 slot cap</span><span className="text-white">No client contact</span>
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

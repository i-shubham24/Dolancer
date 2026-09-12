import { Link } from "react-router-dom";
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
    <section aria-label="Today spotlight" className="overflow-hidden rounded-2xl border-2 border-ink bg-ink text-inverse shadow-offset-lg">
      <style>{`@keyframes dolancer-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>

      {/* Top meta row */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/15 px-5 py-3">
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.14em] text-white/60">
          {today} <span className="mx-2 text-white/25">/</span> Doer mode
        </p>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-lime/60 bg-lime/10 px-2.5 py-1 text-[11px] font-extrabold text-lime">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime" aria-hidden="true" />
            {poolCount} on the board
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-extrabold",
              atCap ? "border-coral/70 bg-coral/15 text-coral" : "border-white/20 bg-white/5 text-white/80",
            )}
          >
            <Flame className="h-3 w-3" aria-hidden="true" />
            {activeCount} of {MAX_ACTIVE_PROJECTS} slots used
          </span>
        </div>
      </div>

      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
        {/* Left: greeting + actions */}
        <div className="min-w-0">
          <div className="inline-flex rotate-[-1.5deg] items-center gap-1.5 rounded-md border-[1.5px] border-ink bg-lime px-2.5 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink shadow-offset-xs">
            Fixed pay <ArrowUpRight className="h-3 w-3" aria-hidden="true" /> No bidding
          </div>
          <h2 className="mt-4 text-3xl font-extrabold leading-[1.02] tracking-[-0.035em] sm:text-4xl">
            {daypart}, {name}.
            <span className="mt-1 block text-white/70">
              {focus ? "Your next deadline is waiting." : freeSlots > 0 ? "Room to take something new." : "Finish strong, then claim again."}
            </span>
          </h2>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">
            {unlocked
              ? "Claim from the blind board, add your working link, submit for supervisor review. Pay stays fixed from the start."
              : "Browse freely. Finish verification to unlock claiming and payouts."}
          </p>

          <div className="mt-5 flex flex-wrap gap-2.5">
            <Link
              to="/pool"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-[1.5px] border-ink bg-coral px-4 py-3 text-sm font-extrabold text-ink shadow-[3px_3px_0px_#ff6b5b55] transition-all duration-150 hover:-translate-y-px hover:shadow-[4px_4px_0px_#ff6b5b88] active:translate-x-px active:translate-y-px active:shadow-none"
            >
              Browse the board
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/work"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-[1.5px] border-white/25 bg-white/5 px-4 py-3 text-sm font-extrabold text-inverse transition-all duration-150 hover:-translate-y-px hover:border-lime/60 hover:text-lime"
            >
              My work
            </Link>
            <Link
              to="/training"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-lg border-[1.5px] border-white/25 bg-white/5 px-4 py-3 text-sm font-extrabold text-inverse transition-all duration-150 hover:-translate-y-px hover:border-blue/70 hover:text-blue"
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
              className="group block rounded-xl border-[1.5px] border-ink bg-surface p-5 text-ink shadow-[4px_4px_0px_#c7ff3d] transition-all duration-150 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="inline-flex items-center gap-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">
                  <Timer className="h-3.5 w-3.5" aria-hidden="true" />
                  Up next
                </span>
                <span className="rounded-full border-[1.5px] border-ink bg-blue-light px-2 py-0.5 text-[11px] font-extrabold text-info-ink">
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
                <span className="inline-flex min-h-[44px] items-center gap-1 rounded-lg border-[1.5px] border-ink bg-ink px-3 py-2 text-xs font-extrabold text-inverse transition-transform group-hover:translate-x-0.5">
                  Open <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </div>
              <div
                className="mt-4 h-2 overflow-hidden rounded-full border border-ink bg-surface-2"
                role="progressbar"
                aria-valuenow={focus.progressPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Task progress"
              >
                <div className="h-full rounded-full bg-coral" style={{ width: `${Math.min(100, Math.max(0, focus.progressPct))}%` }} />
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border-[1.5px] border-dashed border-white/25 bg-white/[0.04] p-5">
              <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white/60">
                <Layers className="h-3.5 w-3.5" aria-hidden="true" />
                No active work
              </div>
              <p className="mt-3 text-lg font-extrabold leading-snug">
                Nothing on your plate. The board refreshes through the day.
              </p>
              <Link
                to={unlocked ? "/pool" : "/verification"}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border-[1.5px] border-ink bg-lime px-4 py-2.5 text-sm font-extrabold text-ink shadow-offset-xs transition-all hover:-translate-y-px"
              >
                {unlocked ? "Find something to claim" : "Get verified"} <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                  i < activeCount ? (atCap ? "bg-coral" : "bg-lime") : "bg-white/10",
                )}
              />
            ))}
            <span className="ml-1 font-mono text-[11px] font-bold text-white/50">
              {freeSlots} open
            </span>
          </div>
        </div>
      </div>

      {/* Bottom marquee, static copy only */}
      <div className="overflow-hidden border-t border-white/15 bg-white/[0.03] py-2" aria-hidden="true">
        <div className="flex w-max animate-none gap-8 whitespace-nowrap font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-white/40 [animation:dolancer-marquee_28s_linear_infinite]">
          {[0, 1].map((copy) => (
            <span key={copy} className="flex gap-8">
              <span>Blind board</span><span className="text-lime/70">Fixed payout</span><span>Supervisor review</span><span className="text-coral/80">Working link first</span><span>3 slot cap</span><span className="text-blue/80">No client contact</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

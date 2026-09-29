import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Clock, CheckCircle2 } from "lucide-react";
import { formatPaise } from "@/lib/paise";
import { relativeDeadline } from "@/lib/datetime";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { DoerProject } from "@/types/domain";
import { cn } from "@/lib/cn";

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
      className="relative overflow-hidden rounded-2xl border border-blue-200/90 bg-gradient-to-br from-[#D6E8FA] via-[#E0EFFD] to-[#CFE3F8] p-5 sm:p-6 shadow-soft-xs"
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-center">
        {/* Left column: Overview & Actions */}
        <div className="flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <span>{today}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 rounded-md bg-blue-100/70 px-2 py-0.5 font-semibold text-[#0A65C0]">
                {poolCount} {poolCount === 1 ? "offer" : "offers"} ready
              </span>
            </div>

            <h2 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
              {daypart}, {name}.
            </h2>

            <p className="mt-1.5 max-w-lg text-sm text-slate-600 leading-relaxed">
              {focus
                ? "You have active work in progress. Review deliverables and submit your working link before the deadline."
                : freeSlots > 0
                ? "You have capacity to accept new assignments. Browse available offers in your pool."
                : "All work slots are currently in use. Complete active tasks to unlock more."}
            </p>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2.5">
            <Link
              to="/pool"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl bg-[#0A65C0] px-4 py-2 text-sm font-semibold text-white shadow-soft-xs transition-colors hover:bg-[#0854A0]"
            >
              View assigned offers
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              to="/work"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-blue-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-soft-2xs transition-colors hover:bg-white hover:text-slate-900"
            >
              My work
            </Link>
            <Link
              to="/training"
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl border border-blue-200/80 bg-white/90 px-4 py-2 text-sm font-medium text-slate-700 shadow-soft-2xs transition-colors hover:bg-white hover:text-slate-900"
            >
              Training
            </Link>
          </div>
        </div>

        {/* Right column: Next task card or Status summary */}
        <div>
          {focus ? (
            <Link
              to={`/work/${focus.id}`}
              className="group block rounded-xl border border-blue-100 bg-white p-4 shadow-soft-xs transition-all duration-150 hover:border-blue-300 hover:shadow-soft-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-[#0A65C0]" aria-hidden="true" />
                  Upcoming Deadline
                </span>
                <span className="rounded-md border border-amber-200/80 bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-800">
                  {relativeDeadline(focus.deliveryAt)}
                </span>
              </div>

              <p className="mt-2 font-medium text-sm text-slate-900 line-clamp-2 leading-snug">
                {focus.brief?.split("\n")[0]?.trim() || `${focus.category} task`}
              </p>

              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
                <div>
                  <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Fixed Payout</span>
                  <span className="text-lg font-bold text-slate-900 tabular-nums">
                    {formatPaise(focus.payoutPaise)}
                  </span>
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#0A65C0] group-hover:translate-x-0.5 transition-transform">
                  Continue task <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="rounded-xl border border-blue-100 bg-white p-4 shadow-soft-xs">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                All caught up
              </div>
              <p className="mt-1.5 text-sm text-slate-600">
                You have no active deadlines right now. Ready for more assignments?
              </p>
              <Link
                to={unlocked ? "/pool" : "/verification"}
                className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#0A65C0] hover:underline"
              >
                {unlocked ? "Browse available offers" : "Complete verification"} →
              </Link>
            </div>
          )}

          {/* Capacity strip */}
          <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
            <span>Capacity</span>
            <div className="flex items-center gap-1.5">
              <div className="flex items-center gap-1" aria-hidden="true">
                {Array.from({ length: MAX_ACTIVE_PROJECTS }, (_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1.5 w-6 rounded-full transition-colors",
                      i < activeCount ? (atCap ? "bg-amber-500" : "bg-[#0A65C0]") : "bg-blue-200/60",
                    )}
                  />
                ))}
              </div>
              <span className="font-medium text-slate-700">
                {activeCount}/{MAX_ACTIVE_PROJECTS} slots
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}

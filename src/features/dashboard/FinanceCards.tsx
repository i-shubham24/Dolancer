import { motion, useReducedMotion } from "framer-motion";
import { Wallet } from "lucide-react";
import { CountUp } from "@/components/common/CountUp";
import { MoreLink, Panel, PanelHeader } from "@/components/app/ui";
import { formatPaise } from "@/lib/paise";
import type { LedgerRow } from "@/features/earnings/api";
import type { EarningsSummary } from "@/types/domain";

const pct = (value: number) => `${Math.round(value)}%`;

/**
 * Gross, minus tax, equals what reached the doer: a ring for the share kept and
 * three lines that reconcile. Itemised, never blended, because TDS has to be
 * checkable against the doer's own filing.
 */
export function MoneySplitCard({ earnings, loading }: { earnings: EarningsSummary | undefined; loading: boolean }) {
  const reduceMotion = useReducedMotion();
  const gross = earnings?.grossPaise ?? 0;
  const net = earnings?.netPaise ?? 0;
  const tax = earnings?.taxWithheldPaise ?? 0;
  const kept = gross > 0 ? (net / gross) * 100 : 0;
  const radius = 84;
  const circumference = 2 * Math.PI * radius;
  // Round caps reach past each arc's end, so leave a gap of a cap and a bit more.
  const gap = 10 / circumference;
  const keptShare = kept / 100;
  const netArc = Math.max(keptShare - gap, 0);
  const taxArc = Math.max(1 - keptShare - gap, 0);

  return (
    <Panel className="[grid-area:split]" aria-labelledby="money-split">
      <PanelHeader id="money-split" title="How it adds up" sub="All payouts so far" />
      <div className="flex flex-1 flex-col items-center justify-evenly gap-5">
        <div className="relative aspect-square w-full max-w-[220px]" role="img" aria-label={`You kept ${Math.round(kept)}% after tax`}>
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90" aria-hidden="true">
            <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--color-panel)" strokeWidth="14" />
            {gross > 0 ? (
              <>
                <motion.circle
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke="var(--color-primary)"
                  strokeWidth="14"
                  strokeLinecap="round"
                  style={{ rotate: `${(gap / 2) * 360}deg` }}
                  initial={reduceMotion ? false : { pathLength: 0 }}
                  animate={{ pathLength: netArc }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                />
                {taxArc > 0 ? (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r={radius}
                    fill="none"
                    stroke="var(--color-warning-dot)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    style={{ rotate: `${(keptShare + gap / 2) * 360}deg` }}
                    initial={reduceMotion ? false : { pathLength: 0 }}
                    animate={{ pathLength: taxArc }}
                    transition={{ duration: 0.6, delay: 1.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
              </>
            ) : null}
          </svg>
          <div className="absolute inset-[18%] flex flex-col items-center justify-center rounded-full bg-panel/50 text-center">
            {loading ? (
              <span className="skeleton h-8 w-16" />
            ) : (
              <CountUp value={kept} format={pct} delay={0.4} duration={1.2} className="text-[34px] font-extrabold leading-none tracking-[-0.04em] tabular-nums" />
            )}
            <span className="mt-1.5 text-[11.5px] font-semibold text-ink-muted">kept after tax</span>
          </div>
        </div>

        <dl className="w-full space-y-2.5 text-[13px]">
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 font-semibold text-ink-2">
              <span className="h-2.5 w-2.5 rounded-full bg-ink/20" aria-hidden="true" />
              Gross released
            </dt>
            <dd className="font-bold tabular-nums">{formatPaise(gross)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3">
            <dt className="flex items-center gap-2 font-semibold text-ink-2">
              <span className="h-2.5 w-2.5 rounded-full bg-warning-dot" aria-hidden="true" />
              Tax withheld
            </dt>
            <dd className="font-bold tabular-nums text-warning-ink">- {formatPaise(tax)}</dd>
          </div>
          <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-2.5">
            <dt className="flex items-center gap-2 font-extrabold text-ink">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" aria-hidden="true" />
              You received
            </dt>
            <dd className="text-[15px] font-extrabold tabular-nums">{formatPaise(net)}</dd>
          </div>
        </dl>
      </div>
    </Panel>
  );
}

const DAY = new Intl.DateTimeFormat("en-IN", { day: "numeric" });
const MONTH = new Intl.DateTimeFormat("en-IN", { month: "short" });

/** The latest released payouts, newest first, named after the task they paid for. */
export function RecentPayouts({
  rows,
  titles,
  loading,
}: {
  rows: LedgerRow[];
  titles: Map<string, string>;
  loading: boolean;
}) {
  const latest = [...rows].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 4);
  return (
    <Panel className="[grid-area:pays]" aria-labelledby="recent-payouts">
      <PanelHeader id="recent-payouts" title="Recent payouts" sub="Released to your bank or UPI, before tax" right={<MoreLink to="/earnings">All payouts</MoreLink>} />
      {loading ? (
        <div className="space-y-2">
          <div className="skeleton h-14 w-full rounded-2xl" />
          <div className="skeleton h-14 w-full rounded-2xl" />
        </div>
      ) : latest.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 rounded-2xl bg-panel/60 px-4 py-8 text-center">
          <Wallet className="h-5 w-5 text-ink-3" aria-hidden="true" />
          <p className="text-xs font-semibold text-ink-muted">Your first payout shows here after a task is approved.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {latest.map((row, index) => {
            const date = new Date(row.createdAt);
            return (
              <motion.li
                key={row.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.35, delay: 0.3 + index * 0.07 }}
                className="flex items-center gap-3 rounded-2xl bg-panel/60 p-2.5 pr-3.5"
              >
                <span className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl bg-white text-center leading-none ring-1 ring-ink/[0.05]">
                  <span className="text-[15px] font-extrabold">{DAY.format(date)}</span>
                  <span className="mt-0.5 text-[10px] font-bold uppercase text-ink-muted">{MONTH.format(date)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold">{titles.get(row.projectId) ?? "A finished task"}</span>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[10.5px] font-bold text-success-ink">
                    Released
                  </span>
                </span>
                <span className="shrink-0 text-[15px] font-extrabold tabular-nums">{formatPaise(row.amountPaise)}</span>
              </motion.li>
            );
          })}
        </ul>
      )}
    </Panel>
  );
}

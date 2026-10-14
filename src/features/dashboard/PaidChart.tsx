import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/common/CountUp";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { fyStartYear } from "@/lib/fy";
import type { LedgerRow } from "@/features/earnings/api";
import { Panel, PanelHeader, Segments } from "./ui";

/**
 * Money released to the doer, month by month.
 *
 * Built only from ledger_doer, which holds released payouts and nothing else, so
 * every bar is money that has actually been paid. A month with nothing paid is a
 * striped outline, never a zero-height bar that reads as missing data, and months
 * still ahead in the financial year stay faded. Figures are before tax, because tax
 * is withheld against the whole year and has no per-month value to show.
 */
type Range = "six" | "fy";

interface Bucket {
  key: string;
  short: string;
  long: string;
  paise: number;
  count: number;
  future: boolean;
}

const SHORT = new Intl.DateTimeFormat("en-IN", { month: "short" });
const LONG = new Intl.DateTimeFormat("en-IN", { month: "long", year: "numeric" });

function buildBuckets(rows: LedgerRow[], range: Range, now: Date): Bucket[] {
  const months: Date[] = [];
  if (range === "six") {
    for (let back = 5; back >= 0; back -= 1) months.push(new Date(now.getFullYear(), now.getMonth() - back, 1));
  } else {
    const start = fyStartYear(now);
    for (let index = 0; index < 12; index += 1) months.push(new Date(start, 3 + index, 1));
  }
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1).getTime();

  return months.map((month) => {
    const inMonth = rows.filter((row) => {
      const date = new Date(row.createdAt);
      return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth();
    });
    return {
      key: `${month.getFullYear()}-${month.getMonth()}`,
      short: SHORT.format(month),
      long: LONG.format(month),
      paise: inMonth.reduce((sum, row) => sum + row.amountPaise, 0),
      count: inMonth.length,
      future: month.getTime() > thisMonth,
    };
  });
}

export function PaidChart({ rows, loading }: { rows: LedgerRow[]; loading: boolean }) {
  const reduceMotion = useReducedMotion();
  const [range, setRange] = useState<Range>("six");
  const [hovered, setHovered] = useState<string | null>(null);

  const buckets = useMemo(() => buildBuckets(rows, range, new Date()), [rows, range]);
  const max = Math.max(1, ...buckets.map((bucket) => bucket.paise));
  const latestPaid = [...buckets].reverse().find((bucket) => bucket.paise > 0);
  const activeKey = hovered ?? latestPaid?.key ?? null;
  const total = buckets.reduce((sum, bucket) => sum + bucket.paise, 0);
  // The first tooltip waits for the bars to land; after that it follows the pointer.
  const landed = useRef(false);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      landed.current = true;
    }, 1600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <Panel className="[grid-area:chart]" aria-labelledby="paid-chart">
      <PanelHeader
        id="paid-chart"
        title="Money paid to you"
        sub={
          total > 0 ? (
            <>
              <CountUp value={total} format={(v) => formatPaise(Math.round(v / 100) * 100)} delay={0.5} duration={1.2} />{" "}
              released {range === "six" ? "in the last 6 months" : "this financial year"}, before tax
            </>
          ) : (
            "Released each month, before tax"
          )
        }
        right={
          <Segments
            label="Chart range"
            value={range}
            onChange={(next) => {
              setRange(next);
              setHovered(null);
            }}
            options={[
              { id: "six", label: "6 months" },
              { id: "fy", label: "This year" },
            ]}
          />
        }
      />

      <div
        className={cn(
          "relative flex min-h-[200px] flex-1 items-stretch pt-12",
          range === "fy" ? "gap-1.5 sm:gap-2.5" : "gap-3 sm:gap-4",
        )}
        onMouseLeave={() => setHovered(null)}
      >
        {loading
          ? Array.from({ length: 6 }, (_, index) => (
              <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                <div className="skeleton w-full max-w-[56px] rounded-full" style={{ height: `${30 + ((index * 23) % 50)}%` }} />
                <div className="skeleton h-3 w-7" />
              </div>
            ))
          : buckets.map((bucket, index) => {
              const fraction = bucket.paise > 0 ? 0.2 + (0.8 * bucket.paise) / max : 0.24;
              const ratio = bucket.paise / max;
              const tone = ratio >= 0.999 ? "bg-primary" : ratio >= 0.75 ? "bg-bar-2" : "bg-bar-3";
              const active = bucket.key === activeKey && bucket.paise > 0;
              const label =
                bucket.paise > 0
                  ? `${bucket.long}: ${formatPaise(bucket.paise)} paid for ${bucket.count} task${bucket.count === 1 ? "" : "s"}`
                  : `${bucket.long}: ${bucket.future ? "still ahead" : "nothing paid"}`;

              return (
                <div key={`${range}-${bucket.key}`} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                  <button
                    type="button"
                    aria-label={label}
                    onMouseEnter={() => setHovered(bucket.key)}
                    onFocus={() => setHovered(bucket.key)}
                    onBlur={() => setHovered(null)}
                    className="relative w-full max-w-[56px] flex-1 rounded-full focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
                  >
                    <motion.span
                      aria-hidden="true"
                      className={cn(
                        "absolute inset-x-0 bottom-0 block rounded-full",
                        bucket.paise > 0 ? tone : "chart-hatch",
                        bucket.future && "opacity-50",
                        active && "ring-4 ring-primary/15",
                      )}
                      initial={reduceMotion ? false : { height: "0%" }}
                      animate={{ height: `${fraction * 100}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 14, mass: 0.9, delay: 0.35 + index * 0.07 }}
                      whileHover={reduceMotion ? undefined : { scaleX: 1.06 }}
                    />
                    <AnimatePresence>
                      {active ? (
                        <motion.span
                          key="tip"
                          aria-hidden="true"
                          initial={{ opacity: 0, y: 8, scale: 0.9, x: "-50%" }}
                          animate={{ opacity: 1, y: 0, scale: 1, x: "-50%" }}
                          exit={{ opacity: 0, y: 4, scale: 0.95, x: "-50%" }}
                          transition={{ type: "spring", stiffness: 420, damping: 28, delay: landed.current || reduceMotion ? 0 : 1.1 }}
                          className="pointer-events-none absolute left-1/2 z-10 whitespace-nowrap rounded-[10px] bg-ink px-2.5 py-1.5 text-center text-[11.5px] font-bold leading-tight text-white shadow-[0_8px_20px_-8px_rgba(9,14,26,0.6)]"
                          style={{ bottom: `calc(${fraction * 100}% + 12px)` }}
                        >
                          {formatPaise(bucket.paise)}
                          <span className="block text-[10.5px] font-semibold text-white/70">
                            {bucket.count} task{bucket.count === 1 ? "" : "s"} paid
                          </span>
                          <span className="absolute -bottom-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-ink" />
                        </motion.span>
                      ) : null}
                    </AnimatePresence>
                  </button>
                  <span
                    className={cn(
                      "text-[11.5px] font-bold",
                      bucket.future ? "text-ink-3/60" : index === buckets.length - 1 || bucket.key === activeKey ? "text-ink" : "text-ink-3",
                    )}
                  >
                    {bucket.short}
                  </span>
                </div>
              );
            })}

        {!loading && total === 0 && rows.length === 0 ? (
          <p className="absolute inset-x-0 top-1 text-center text-xs font-semibold text-ink-muted">
            Your first payout shows here after a task is approved.
          </p>
        ) : null}
      </div>

      <div className="mt-3.5 flex flex-wrap gap-4 text-[11.5px] font-semibold text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-[3px] bg-primary" aria-hidden="true" />
          Paid
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="chart-hatch h-2.5 w-2.5 rounded-[3px]" aria-hidden="true" />
          Nothing paid
        </span>
      </div>
    </Panel>
  );
}

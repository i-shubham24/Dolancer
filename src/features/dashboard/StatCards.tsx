import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/common/CountUp";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { preloadRoute } from "@/lib/preload";
import type { EarningsSummary } from "@/types/domain";
import { formatDayShort } from "@/features/calendar/dates";
import { Clock } from "lucide-react";
import { CornerArrow } from "@/components/app/ui";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { LineTexture } from "@/components/app/LineTexture";

/** Whole rupees while counting, so the figure never flickers through paise. */
const rupees = (paise: number) => formatPaise(Math.round(paise / 100) * 100);
const whole = (value: number) => String(Math.round(value));

function StatCard({
  to,
  label,
  area,
  hero = false,
  children,
  foot,
}: {
  /** Where the card leads. Without it the card is a plain figure. */
  to?: string;
  label: string;
  /** A literal grid-area class, so the stylesheet build can see it. */
  area: string;
  hero?: boolean;
  children: React.ReactNode;
  foot: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div variants={cardMotion} whileHover={reduceMotion ? undefined : { y: -3 }} className={cn("min-w-0", area)}>
      <Shell
        to={to}
        className={cn(
          CARD,
          "group h-full justify-between transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          hero
            ? "isolate overflow-hidden bg-gradient-to-br from-primary to-primary-hover text-inverse ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)]"
            : "hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.22)]",
        )}
      >
        {hero ? <LineTexture className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/[0.09]" /> : null}
        <div>
          <div className="flex items-start justify-between gap-3">
            <span className={cn("text-[13px] font-bold tracking-tight", hero ? "text-white/85" : "text-ink-2")}>{label}</span>
            {to ? <CornerArrow inverse={hero} /> : null}
          </div>
          <div className="mt-3 text-[26px] font-extrabold min-[420px]:text-[30px] sm:text-[34px] leading-none tracking-[-0.035em] tabular-nums">
            {children}
          </div>
        </div>
        <div className={cn("mt-auto pt-3 border-t text-xs font-semibold", hero ? "border-white/15 text-white/90" : "border-line-subtle/70 text-ink-muted")}>
          {foot}
        </div>
      </Shell>
    </motion.div>
  );
}

/** A link when the card leads somewhere, a plain box when it does not. */
function Shell({ to, className, children }: { to?: string; className: string; children: React.ReactNode }) {
  if (!to) return <div className={className}>{children}</div>;
  return (
    <Link to={to} onMouseEnter={() => preloadRoute(to)} onFocus={() => preloadRoute(to)} className={className}>
      {children}
    </Link>
  );
}

function ValueSkeleton({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn("inline-block h-8 w-28 rounded-lg align-middle", inverse ? "bg-white/20" : "skeleton")}
    />
  );
}

/** The two task figures: active work and what is due before Sunday. */
export function TaskStats({
  activeCount,
  activeLoading,
  dueThisWeek,
  inReviewCount = 0,
}: {
  activeCount: number;
  activeLoading: boolean;
  /** Deadlines from today to Sunday, soonest first. */
  dueThisWeek: Date[];
  inReviewCount?: number;
}) {
  const next = dueThisWeek[0];
  const soon = next ? next.getTime() - Date.now() < 48 * 3_600_000 : false;

  return (
    <>
      <StatCard
        to="/work"
        label="Active work"
        area="[grid-area:k1]"
        hero
        foot={
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="truncate">
              {activeCount === 0
                ? "Ready for new offers"
                : inReviewCount > 0 && inReviewCount < activeCount
                  ? `${activeCount - inReviewCount} drafting • ${inReviewCount} in review`
                  : inReviewCount > 0
                    ? `${inReviewCount} with supervisor`
                    : "All actively on schedule"}
            </span>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-bold text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" aria-hidden="true" />
              {activeCount === 0 ? "Available" : "On track"}
            </span>
          </div>
        }
      >
        {activeLoading ? (
          <ValueSkeleton inverse />
        ) : (
          <div className="flex items-baseline gap-2">
            <CountUp value={activeCount} format={whole} delay={0.3} />
            <span className="text-sm min-[400px]:text-[15px] font-semibold text-white/80">
              {activeCount === 1 ? "task ongoing" : "tasks ongoing"}
            </span>
          </div>
        )}
      </StatCard>

      <StatCard
        to="/calendar"
        label="Due this week"
        area="[grid-area:k2]"
        foot={
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-semibold text-ink-2">Earliest due</span>
            {next ? (
              <span
                className={cn(
                  "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11.5px] font-bold",
                  soon ? "bg-danger-bg text-danger-ink" : "bg-panel text-ink",
                )}
              >
                <Clock className="h-3 w-3 shrink-0" aria-hidden="true" />
                {formatDayShort(next)}
              </span>
            ) : (
              <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 text-[11.5px] font-bold text-success-ink">
                All clear
              </span>
            )}
          </div>
        }
      >
        {activeLoading ? (
          <ValueSkeleton />
        ) : (
          <div className="flex items-baseline gap-2">
            <CountUp value={dueThisWeek.length} format={whole} delay={0.38} />
            <span className="text-sm min-[400px]:text-[15px] font-semibold text-ink-muted">
              {dueThisWeek.length === 1 ? "delivery scheduled" : "deliveries scheduled"}
            </span>
          </div>
        )}
      </StatCard>
    </>
  );
}

/**
 * The four money figures. Net, tax and gross are always separate numbers so what
 * was withheld is never implicit, and the year figure is released money only.
 */
export function MoneyStats({
  earnings,
  loading,
  error,
  yearPaise,
  yearCount,
  yearLabel,
  linkTo = "",
}: {
  /** Where each card leads; leave it out on the Earnings page itself. */
  linkTo?: string;
  earnings: EarningsSummary | undefined;
  loading: boolean;
  error: boolean;
  /** Gross released this financial year, from the payout history. */
  yearPaise: number;
  yearCount: number;
  yearLabel: string;
}) {
  const failed = error ? "--" : null;
  return (
    <>
      <StatCard to={linkTo} label="Paid to you" area="[grid-area:f1]" hero foot={error ? "Could not load. Open Earnings to retry." : "After tax, since you joined"}>
        {loading ? <ValueSkeleton inverse /> : failed ?? <CountUp value={earnings?.netPaise ?? 0} format={rupees} delay={0.3} duration={1.3} />}
      </StatCard>
      <StatCard to={linkTo} label="Tax withheld" area="[grid-area:f2]" foot="TDS at 1% under Sec 194C credited to PAN">
        {loading ? <ValueSkeleton /> : failed ?? <CountUp value={earnings?.taxWithheldPaise ?? 0} format={rupees} delay={0.38} duration={1.3} />}
      </StatCard>
      <StatCard to={linkTo} label="Gross released" area="[grid-area:f3]" foot="Before tax, all time">
        {loading ? <ValueSkeleton /> : failed ?? <CountUp value={earnings?.grossPaise ?? 0} format={rupees} delay={0.45} duration={1.3} />}
      </StatCard>
      <StatCard
        to={linkTo}
        label={`This year (${yearLabel})`}
        area="[grid-area:f4]"
        foot={`${yearCount} payout${yearCount === 1 ? "" : "s"}, before tax`}
      >
        {loading ? <ValueSkeleton /> : <CountUp value={yearPaise} format={rupees} delay={0.52} duration={1.3} />}
      </StatCard>
    </>
  );
}

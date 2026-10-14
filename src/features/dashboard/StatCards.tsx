import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/common/CountUp";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { preloadRoute } from "@/lib/preload";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import type { EarningsSummary } from "@/types/domain";
import { formatDayShort } from "@/features/calendar/dates";
import { CornerArrow } from "./ui";
import { CARD, cardMotion } from "./card-styles";
import { LineTexture } from "./LineTexture";

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
  to: string;
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
      <Link
        to={to}
        onMouseEnter={() => preloadRoute(to)}
        onFocus={() => preloadRoute(to)}
        className={cn(
          CARD,
          "group h-full transition-shadow duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
          hero
            ? "isolate overflow-hidden bg-gradient-to-br from-primary to-primary-hover text-inverse ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)]"
            : "hover:shadow-[0_14px_30px_-16px_rgba(15,23,42,0.22)]",
        )}
      >
        {hero ? <LineTexture className="pointer-events-none absolute inset-0 -z-10 h-full w-full text-white/[0.09]" /> : null}
        <div className="flex items-start justify-between gap-3">
          <span className={cn("text-[13px] font-bold", hero ? "text-white/85" : "text-ink-2")}>{label}</span>
          <CornerArrow inverse={hero} />
        </div>
        <div className="mb-1 mt-2.5 text-[26px] font-extrabold min-[420px]:text-[30px] sm:text-[34px] leading-none tracking-[-0.035em] tabular-nums">
          {children}
        </div>
        <div className={cn("text-xs font-semibold", hero ? "text-white/85" : "text-ink-muted")}>{foot}</div>
      </Link>
    </motion.div>
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

export function StatCards({
  activeCount,
  activeLoading,
  dueThisWeek,
  earnings,
  earningsLoading,
  earningsError,
}: {
  activeCount: number;
  activeLoading: boolean;
  /** Deadlines from today to Sunday, soonest first. */
  dueThisWeek: Date[];
  earnings: EarningsSummary | undefined;
  earningsLoading: boolean;
  earningsError: boolean;
}) {
  const reduceMotion = useReducedMotion();
  const free = Math.max(0, MAX_ACTIVE_PROJECTS - activeCount);
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
          <>
            <span>
              {activeCount >= MAX_ACTIVE_PROJECTS
                ? "All slots full. Finish one to take more."
                : `${free} slot${free === 1 ? "" : "s"} open for new work`}
            </span>
            <span className="mt-3 flex gap-1.5" aria-hidden="true">
              {Array.from({ length: MAX_ACTIVE_PROJECTS }, (_, index) => (
                <span key={index} className="h-[7px] flex-1 overflow-hidden rounded-full bg-white/25">
                  <motion.span
                    className="block h-full origin-left rounded-full bg-white"
                    initial={reduceMotion ? false : { scaleX: 0 }}
                    animate={{ scaleX: index < activeCount ? 1 : 0 }}
                    transition={{ duration: 0.6, delay: 0.35 + index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  />
                </span>
              ))}
            </span>
          </>
        }
      >
        {activeLoading ? (
          <ValueSkeleton inverse />
        ) : (
          <>
            <CountUp value={activeCount} format={whole} delay={0.3} />
            <span className="ml-1 text-base font-bold tracking-normal text-white/85">of {MAX_ACTIVE_PROJECTS}</span>
          </>
        )}
      </StatCard>

      <StatCard
        to="/calendar"
        label="Due this week"
        area="[grid-area:k2]"
        foot={
          next ? (
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-1 text-[11.5px] font-bold",
                soon ? "bg-danger-bg text-danger-ink" : "bg-info-bg text-info-ink",
              )}
            >
              Next: {formatDayShort(next)}
            </span>
          ) : (
            "Nothing due before Sunday"
          )
        }
      >
        {activeLoading ? <ValueSkeleton /> : <CountUp value={dueThisWeek.length} format={whole} delay={0.38} />}
      </StatCard>

      <StatCard to="/earnings" label="Paid to you" area="[grid-area:k3]" foot={earningsError ? "Could not load. Open Earnings to retry." : "After tax, since you joined"}>
        {earningsLoading ? <ValueSkeleton /> : earningsError ? "--" : <CountUp value={earnings?.netPaise ?? 0} format={rupees} delay={0.45} duration={1.3} />}
      </StatCard>

      <StatCard
        to="/earnings"
        label="Tax withheld"
        area="[grid-area:k4]"
        foot={earnings ? `TDS and GST. Gross ${formatPaise(earnings.grossPaise)}` : "TDS and GST so far"}
      >
        {earningsLoading ? (
          <ValueSkeleton />
        ) : earningsError ? (
          "--"
        ) : (
          <CountUp value={earnings?.taxWithheldPaise ?? 0} format={rupees} delay={0.52} duration={1.3} />
        )}
      </StatCard>
    </>
  );
}

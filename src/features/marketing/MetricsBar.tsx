import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, TrendingUp, Briefcase, Star, Clock, ShieldCheck, CheckCircle2 } from "lucide-react";

interface MetricItem {
  icon: typeof Users;
  stat: string;
  label: string;
  tag: string;
  highlight?: boolean;
}

const METRICS_LIST: MetricItem[] = [
  {
    icon: Users,
    stat: "2,400+",
    label: "Verified Dolancers",
    tag: "Across 40+ Fields",
    highlight: true,
  },
  {
    icon: TrendingUp,
    stat: "₹8Cr+",
    label: "Total Paid Out",
    tag: "100% Pre-funded",
    highlight: true,
  },
  {
    icon: Briefcase,
    stat: "12,000+",
    label: "Completed Briefs",
    tag: "Zero Dispute Rate",
  },
  {
    icon: Star,
    stat: "4.9 / 5",
    label: "Specialist Rating",
    tag: "Verified Reviews",
  },
  {
    icon: Clock,
    stat: "48 Hours",
    label: "Direct Bank Release",
    tag: "UPI & NEFT",
  },
  {
    icon: ShieldCheck,
    stat: "Upfront Pay",
    label: "Guaranteed Compensation",
    tag: "Zero Bidding",
  },
  {
    icon: CheckCircle2,
    stat: "Supervisor QA",
    label: "No Direct Client Drama",
    tag: "Academic Shields",
  },
];

export function MetricsBar() {
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <div
      id="metrics-ticker"
      className="relative w-full py-3.5 overflow-hidden select-none bg-transparent"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      {/* Subtle edge fade masks for smooth infinite marquee appearance */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-r from-canvas to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-12 sm:w-24 bg-gradient-to-l from-canvas to-transparent" />

      <div className="flex w-max items-center">
        <motion.div
          animate={reduceMotion || paused ? { x: undefined } : { x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 26,
          }}
          className="flex shrink-0 items-center gap-4 sm:gap-5 pr-4 sm:pr-5"
        >
          {[...METRICS_LIST, ...METRICS_LIST, ...METRICS_LIST].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={`metric-${item.label}-${idx}`}
                className="inline-flex items-center gap-3 rounded-xl border border-line-card/60 bg-surface/50 px-3.5 py-2 shadow-soft-xs hover:border-line-card hover:bg-surface transition-all duration-200 cursor-default"
              >
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    item.highlight
                      ? "bg-coral-light text-coral"
                      : "bg-subtle text-ink-2"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </div>

                <div className="flex flex-col text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm sm:text-base font-extrabold font-display tracking-tight text-ink">
                      {item.stat}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wide text-ink-muted bg-subtle px-1.5 py-0.5 rounded">
                      {item.tag}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-ink-2">
                    {item.label}
                  </span>
                </div>
              </div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}

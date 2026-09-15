import type { ReactNode, ComponentType } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Users, TrendingUp, Clock, Sparkles } from "lucide-react";
import { StitchBadge, StitchColorCard } from "@/components/stitch/StitchPrimitives";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

interface StatItem {
  icon: ComponentType | (() => ReactNode);
  num: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
  subtext: string;
  tone: "lilac" | "pink" | "yellow" | "mint";
}

const STATS: StatItem[] = [
  {
    icon: Users,
    num: 2400,
    suffix: "+",
    label: "Active Dolancers",
    subtext: "Verified specialists earning across disciplines",
    tone: "lilac",
  },
  {
    icon: () => <span className="text-xl font-extrabold">₹</span>,
    num: 8,
    prefix: "₹",
    suffix: "Cr+",
    label: "Total Paid Out",
    subtext: "Reliably transferred directly to bank accounts",
    tone: "pink",
  },
  {
    icon: TrendingUp,
    num: 12000,
    suffix: "+",
    label: "Briefs Completed",
    subtext: "Approved by supervisors without client disputes",
    tone: "yellow",
  },
  {
    icon: Clock,
    num: 48,
    suffix: "h",
    label: "Average Release",
    subtext: "From supervisor sign-off to direct payout",
    tone: "mint",
  },
];

export function NumbersSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="earnings" className="fresh-section py-20">
      <div className="fresh-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-coral" />
            Live Network Numbers
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em]">
            Numbers that <span className="fresh-highlight fresh-underline fresh-underline-yellow">speak for themselves.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 font-medium">
            Real outcomes across India's academic and technical expert community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, i) => {
            const IconComponent = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <StitchColorCard
                  tone={stat.tone}
                  className="flex flex-col items-center text-center h-full p-7 rounded-[2rem]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface/80 text-ink shadow-soft-sm mb-4 border border-line-card/50">
                    <IconComponent />
                  </div>
                  <span className="text-3xl sm:text-4xl font-extrabold text-ink tracking-tight mb-1 font-display">
                    {reduceMotion ? (
                      `${stat.prefix ?? ""}${stat.num.toLocaleString()}${stat.suffix ?? ""}`
                    ) : (
                      <AnimatedCounter
                        end={stat.num}
                        prefix={stat.prefix}
                        suffix={stat.suffix}
                        decimals={stat.decimals}
                      />
                    )}
                  </span>
                  <span className="text-sm font-extrabold text-ink mb-1">
                    {stat.label}
                  </span>
                  <span className="text-xs font-medium text-ink-2">
                    {stat.subtext}
                  </span>
                </StitchColorCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

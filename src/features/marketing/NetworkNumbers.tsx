import { motion, useReducedMotion } from "framer-motion";
import { Users, IndianRupee, TrendingUp, Clock, Sparkles } from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";

interface NetworkStat {
  icon: React.ComponentType<{ className?: string }>;
  end: number;
  prefix?: string;
  suffix?: string;
  label: string;
  body: string;
  cardClass: string;
  /** Resting hand-placed tilt - straightens on hover. */
  tiltClass: string;
}

const STATS: NetworkStat[] = [
  {
    icon: Users,
    end: 2400,
    suffix: "+",
    label: "Active Dolancers",
    body: "Verified specialists earning across disciplines",
    cardClass: "bg-[color-mix(in_srgb,var(--dl-card-lilac)_45%,var(--color-surface))]",
    tiltClass: "-rotate-[1.4deg]",
  },
  {
    icon: IndianRupee,
    end: 8,
    prefix: "₹",
    suffix: "Cr+",
    label: "Total Paid Out",
    body: "Reliably transferred directly to bank accounts",
    cardClass: "bg-[color-mix(in_srgb,var(--dl-card-pink)_45%,var(--color-surface))]",
    tiltClass: "rotate-[1deg] translate-y-1.5",
  },
  {
    icon: TrendingUp,
    end: 12000,
    suffix: "+",
    label: "Briefs Completed",
    body: "Approved by supervisors without client disputes",
    cardClass: "bg-[color-mix(in_srgb,var(--dl-card-yellow)_45%,var(--color-surface))]",
    tiltClass: "-rotate-[0.6deg] -translate-y-1",
  },
  {
    icon: Clock,
    end: 48,
    suffix: "h",
    label: "Average Release",
    body: "From supervisor sign-off to direct payout",
    cardClass: "bg-[color-mix(in_srgb,var(--dl-card-mint)_45%,var(--color-surface))]",
    tiltClass: "rotate-[1.8deg] translate-y-1",
  },
];

export function NetworkNumbers() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="fresh-section pt-10 pb-20 relative">
      <div className="fresh-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <StitchBadge tone="neutral">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Live Network Numbers
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold text-ink tracking-[-0.04em] font-display">
            Numbers that speak for{" "}
            <span className="fresh-underline fresh-underline-yellow">themselves.</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-ink-2 font-medium">
            Real outcomes across India&apos;s academic and technical expert community.
          </p>
        </div>

        {/* 4 Stat Cards - hand-tilted at rest, straighten + lift on hover.
            Entrance runs on the outer wrapper; tilt lives on the inner card
            so the two transforms never fight. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.4, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className={`rounded-[2rem] p-8 text-center shadow-soft-xs transition-[rotate,translate,box-shadow] duration-300 hover:rotate-0 hover:-translate-y-1 hover:shadow-soft-lg ${stat.cardClass} ${stat.tiltClass}`}
                >
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-soft-sm">
                    <Icon className="h-6 w-6 text-ink" />
                  </div>
                  <p className="mt-5 font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-ink tabular-nums">
                    <AnimatedCounter
                      end={stat.end}
                      prefix={stat.prefix ?? ""}
                      suffix={stat.suffix ?? ""}
                      duration={reduceMotion ? 0 : 1.8}
                    />
                  </p>
                  <p className="mt-2 text-base font-extrabold text-ink">{stat.label}</p>
                  <p className="mt-2 text-sm font-medium leading-relaxed text-ink-2">
                    {stat.body}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

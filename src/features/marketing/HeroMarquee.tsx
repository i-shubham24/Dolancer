import {
  Briefcase,
  Star,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Users,
  TrendingUp,
} from "lucide-react";

/**
 * Straight auto-running stats ribbon directly below the home hero.
 *
 * Transparent band (no background, no borders) - trust pills float over the
 * page canvas. Seamless doubled-track loop, pauses on hover, static under
 * prefers-reduced-motion. Decorative - screen readers skip the duplicates.
 */

interface Stat {
  icon: typeof Briefcase;
  iconClass: string;
  headline: string;
  sub: string;
  tag: string;
}

const STATS: Stat[] = [
  {
    icon: Briefcase,
    iconClass: "bg-primary-light text-primary",
    headline: "12,000+",
    sub: "Completed Briefs",
    tag: "Zero dispute rate",
  },
  {
    icon: Star,
    iconClass: "bg-highlight-light text-highlight",
    headline: "4.9 / 5",
    sub: "Specialist Rating",
    tag: "Verified reviews",
  },
  {
    icon: Clock,
    iconClass: "bg-secondary-light text-secondary",
    headline: "48 Hours",
    sub: "Direct Bank Release",
    tag: "UPI & NEFT",
  },
  {
    icon: ShieldCheck,
    iconClass: "bg-success-bg text-success-ink",
    headline: "Upfront Pay",
    sub: "Guaranteed Compensation",
    tag: "Zero bidding",
  },
  {
    icon: BadgeCheck,
    iconClass: "bg-primary-light text-primary",
    headline: "Supervisor QA",
    sub: "No Direct Client Drama",
    tag: "Academic shields",
  },
  {
    icon: Users,
    iconClass: "bg-secondary-light text-secondary",
    headline: "2,400+",
    sub: "Verified Dolancers",
    tag: "Across 40+ fields",
  },
  {
    icon: TrendingUp,
    iconClass: "bg-success-bg text-success-ink",
    headline: "₹8Cr+",
    sub: "Total Paid Out",
    tag: "100% pre-funded",
  },
];

function StatPill({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-line-card bg-surface px-5 py-3 shadow-soft-xs">
      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${stat.iconClass}`}>
        <Icon className="h-5 w-5" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-base font-extrabold tracking-tight text-ink">
          {stat.headline}
          <span className="ml-2 rounded-md bg-subtle px-1.5 py-0.5 align-middle text-[10px] font-extrabold uppercase tracking-wider text-ink-2">
            {stat.tag}
          </span>
        </span>
        <span className="text-sm font-medium text-ink-2">{stat.sub}</span>
      </span>
    </span>
  );
}

export function HeroMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative z-[2] overflow-hidden py-5 [-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] md:py-6"
    >
      <div className="marquee-track flex w-max items-center gap-4 pr-4">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0 items-center gap-4" aria-hidden={half === 1}>
            {STATS.map((stat) => (
              <StatPill key={`${half}-${stat.headline}`} stat={stat} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

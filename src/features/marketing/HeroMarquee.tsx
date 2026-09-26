import {
  Briefcase,
  Star,
  Clock,
  ShieldCheck,
  BadgeCheck,
  Users,
  TrendingUp,
} from "lucide-react";

interface Stat {
  icon: typeof Briefcase;
  headline: string;
  sub: string;
  tag: string;
}

const STATS: Stat[] = [
  {
    icon: Briefcase,
    headline: "12,000+",
    sub: "Completed Briefs",
    tag: "Zero dispute rate",
  },
  {
    icon: Star,
    headline: "4.9 / 5",
    sub: "Specialist Rating",
    tag: "Verified reviews",
  },
  {
    icon: Clock,
    headline: "48 Hours",
    sub: "Direct Bank Release",
    tag: "UPI & NEFT",
  },
  {
    icon: ShieldCheck,
    headline: "Upfront Pay",
    sub: "Guaranteed Compensation",
    tag: "Zero bidding",
  },
  {
    icon: BadgeCheck,
    headline: "Supervisor QA",
    sub: "No Direct Client Drama",
    tag: "Academic shields",
  },
  {
    icon: Users,
    headline: "2,400+",
    sub: "Verified Dolancers",
    tag: "Across 40+ fields",
  },
  {
    icon: TrendingUp,
    headline: "₹8Cr+",
    sub: "Total Paid Out",
    tag: "100% pre-funded",
  },
];

function StatPill({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <span className="inline-flex shrink-0 items-center gap-3 rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 shadow-sm backdrop-blur-md text-white">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
        <Icon className="h-4 w-4" />
      </span>
      <span className="flex flex-col leading-tight">
        <span className="text-sm font-extrabold tracking-tight text-white flex items-center gap-2">
          {stat.headline}
          <span className="rounded bg-white/20 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white/90">
            {stat.tag}
          </span>
        </span>
        <span className="text-xs font-medium text-white/80">{stat.sub}</span>
      </span>
    </span>
  );
}

export function HeroMarquee() {
  return (
    <div
      aria-hidden="true"
      className="relative z-10 overflow-hidden bg-[#0a65c0] py-3.5 sm:py-4 border-y border-[#0854a0] shadow-sm select-none [-webkit-mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)] [mask-image:linear-gradient(to_right,transparent,black_4%,black_96%,transparent)]"
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

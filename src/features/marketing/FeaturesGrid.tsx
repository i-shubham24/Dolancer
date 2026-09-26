import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  Sparkles,
  CheckCircle2
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";

interface StackingFeature {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  body: string;
  color: string;
  accentBg: string;
  cardBg: string;
  chips: string[];
  metricLabel: string;
  metricValue: string;
}

const STACKING_FEATURES: StackingFeature[] = [
  {
    number: "01",
    icon: Wallet,
    title: "Agreed Upfront Pay",
    tagline: "100% Pre-funded into Escrow",
    body: "Compensation is agreed and locked before you begin work. No bidding wars, no price cuts, and no negotiating after delivery.",
    color: "text-cyan-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/30",
    cardBg: "bg-[#0b1329]",
    chips: ["Fixed upfront price", "Pre-funded escrow", "Zero bidding wars"],
    metricLabel: "Escrow Protection",
    metricValue: "100% Guaranteed",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "Supervisor Shield",
    tagline: "Your Identity & Delivery Protected",
    body: "Deliver work under verified discipline tags. Supervisors review your drafts, protect your scope, and manage all client conversations.",
    color: "text-emerald-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
    cardBg: "bg-[#091824]",
    chips: ["Anonymized briefs", "Dedicated coordinator", "No direct client contact"],
    metricLabel: "Dispute Rate",
    metricValue: "0.0% Historic",
  },
  {
    number: "03",
    icon: Clock,
    title: "Payouts After Approval",
    tagline: "Direct UPI & NEFT Transfers",
    body: "Once your supervisor clears quality review and the approval gate is met, funds release automatically to your registered bank account.",
    color: "text-purple-400",
    accentBg: "bg-purple-500/10 border-purple-500/30",
    cardBg: "bg-[#11112b]",
    chips: ["Direct to bank", "Automatic release", "Zero invoice chasing"],
    metricLabel: "Release Window",
    metricValue: "Within 48h",
  },
  {
    number: "04",
    icon: Calendar,
    title: "Clear Timelines & Scope",
    tagline: "Defined Milestones, No Creep",
    body: "Every brief has clear acceptance criteria and strict turnaround windows for both your delivery and the supervisor's feedback.",
    color: "text-blue-400",
    accentBg: "bg-blue-500/10 border-blue-500/30",
    cardBg: "bg-[#0c162f]",
    chips: ["Explicit acceptance criteria", "Strict review turnaround", "Guaranteed milestone scope"],
    metricLabel: "Milestone Clarity",
    metricValue: "Pre-Scored",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-[#050914] pt-24 pb-32 overflow-hidden">
      {/* Top curved divider directly matching the white background of the section above */}
      <CurvedSectionDivider variant="wave" position="top" fillColor="fill-white" showBorderLine={false} showAccentGlow={false} />

      {/* Decorative ambient lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="fresh-container relative z-10 px-4 md:px-8 max-w-[1240px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 md:mb-20">
          <StitchBadge tone="light">
            <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
            Why Choose Dolancer
          </StitchBadge>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Built for specialists who value{" "}
            <span className="text-white fresh-underline fresh-underline-mint">
              clarity & respect.
            </span>
          </h2>
          <p className="mt-3.5 text-base sm:text-lg text-slate-300 font-medium leading-relaxed">
            Everything is engineered to shield your focus, eliminate client friction, and guarantee fair, transparent compensation.
          </p>
        </div>

        {/* Stacking Cards Experience */}
        <div className="flex flex-col gap-8 max-w-3xl mx-auto pb-12">
          {STACKING_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.title}
                className={`sticky rounded-3xl border border-white/10 p-7 sm:p-10 shadow-2xl backdrop-blur-2xl transition-all duration-300 ${feat.cardBg}`}
                style={{
                  top: `calc(100px + ${idx * 24}px)`,
                }}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left Column: Number, Title, Body */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${feat.accentBg} ${feat.color}`}>
                        Pillar {feat.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">
                        {feat.tagline}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${feat.accentBg} ${feat.color}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {feat.title}
                    </h3>

                    <p className="text-base sm:text-lg text-slate-200 font-medium leading-relaxed max-w-xl">
                      {feat.body}
                    </p>

                    {/* Chips */}
                    <div className="pt-2 flex flex-wrap gap-2">
                      {feat.chips.map((chip) => (
                        <span
                          key={chip}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-white/5 border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300"
                        >
                          <CheckCircle2 className={`h-3.5 w-3.5 ${feat.color}`} />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Metric Highlight Badge */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center p-4 rounded-2xl bg-white/[0.03] border border-white/10 shrink-0 min-w-[140px] text-right">
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {feat.metricLabel}
                    </p>
                    <p className={`text-xl sm:text-2xl font-black mt-1 ${feat.color} font-display`}>
                      {feat.metricValue}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

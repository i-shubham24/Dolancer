import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { CurvedSectionDivider } from "@/components/stitch/CurvedSectionDivider";
import { cn } from "@/lib/cn";

interface StackingFeature {
  number: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  body: string;
  color: string;
  accentBg: string;
  cardBorder: string;
  glowColor: string;
  glowAccent: string;
  chips: string[];
  chipClass: string;
  metricLabel: string;
  metricValue: string;
  metricBoxClass: string;
  metricValueClass: string;
}

const STACKING_FEATURES: StackingFeature[] = [
  {
    number: "01",
    icon: Wallet,
    title: "Pay fixed first",
    tagline: "You know your pay before you start",
    body: "Your pay is fixed before you start work. No bidding, no price cuts and no arguments about money later.",
    color: "text-sky-600",
    accentBg: "bg-sky-50 text-sky-700 border-sky-200",
    cardBorder: "border-sky-200/90 shadow-[0_16px_40px_-12px_rgba(14,165,233,0.12),0_4px_16px_-2px_rgba(15,23,42,0.04)]",
    glowColor: "rgba(14, 165, 233, 0.16)",
    glowAccent: "#0ea5e9",
    chips: ["Fixed pay", "No price cuts", "No bidding"],
    chipClass: "bg-sky-50/80 border-sky-200/80 text-sky-950",
    metricLabel: "Your pay",
    metricValue: "Fixed first",
    metricBoxClass: "bg-sky-50/90 border-sky-200/80",
    metricValueClass: "text-sky-700",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "A supervisor on your side",
    tagline: "Your name stays private",
    body: "Your supervisor checks your work, stops extra unpaid changes and talks to the client for you. The client never learns who you are.",
    color: "text-emerald-600",
    accentBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cardBorder: "border-emerald-200/90 shadow-[0_16px_40px_-12px_rgba(16,185,129,0.12),0_4px_16px_-2px_rgba(15,23,42,0.04)]",
    glowColor: "rgba(16, 185, 129, 0.16)",
    glowAccent: "#10b981",
    chips: ["Name kept private", "One guide", "No client calls"],
    chipClass: "bg-emerald-50/80 border-emerald-200/80 text-emerald-950",
    metricLabel: "Client talks",
    metricValue: "Handled for you",
    metricBoxClass: "bg-emerald-50/90 border-emerald-200/80",
    metricValueClass: "text-emerald-700",
  },
  {
    number: "03",
    icon: Clock,
    title: "Paid after approval",
    tagline: "Straight to your bank or UPI",
    body: "When your work is approved, the money is sent to your bank account. No invoices and no chasing.",
    color: "text-purple-600",
    accentBg: "bg-purple-50 text-purple-700 border-purple-200",
    cardBorder: "border-purple-200/90 shadow-[0_16px_40px_-12px_rgba(168,85,247,0.12),0_4px_16px_-2px_rgba(15,23,42,0.04)]",
    glowColor: "rgba(168, 85, 247, 0.16)",
    glowAccent: "#a855f7",
    chips: ["Straight to bank", "No invoices", "No chasing"],
    chipClass: "bg-purple-50/80 border-purple-200/80 text-purple-950",
    metricLabel: "Payout time",
    metricValue: "Within 48h",
    metricBoxClass: "bg-purple-50/90 border-purple-200/80",
    metricValueClass: "text-purple-700",
  },
  {
    number: "04",
    icon: Calendar,
    title: "Clear work and deadlines",
    tagline: "No extra work added later",
    body: "Every project tells you what to do and when it is due. You always know the next step.",
    color: "text-blue-600",
    accentBg: "bg-blue-50 text-blue-700 border-blue-200",
    cardBorder: "border-blue-200/90 shadow-[0_16px_40px_-12px_rgba(10,101,192,0.12),0_4px_16px_-2px_rgba(15,23,42,0.04)]",
    glowColor: "rgba(10, 101, 192, 0.16)",
    glowAccent: "#0a65c0",
    chips: ["Clear brief", "Quick feedback", "No surprise changes"],
    chipClass: "bg-blue-50/80 border-blue-200/80 text-blue-950",
    metricLabel: "The brief",
    metricValue: "Clear from day one",
    metricBoxClass: "bg-blue-50/90 border-blue-200/80",
    metricValueClass: "text-blue-700",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-[#f0f5fc] pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-x-clip">
      {/* Top curved divider directly matching the white background of the section above */}
      <CurvedSectionDivider
        variant="wave"
        position="top"
        fillColor="fill-white"
        showBorderLine={false}
        showAccentGlow={false}
      />

      {/* Decorative ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-300/20 blur-[140px] rounded-full pointer-events-none" />

      <div className="fresh-container relative z-10 px-4 md:px-8 max-w-[1240px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <StitchBadge tone="brand">
            Why Choose Dolancer
          </StitchBadge>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight font-display">
            Made for people who want{" "}
            <span className="text-slate-900 fresh-underline fresh-underline-mint">
              clear work and fair pay.
            </span>
          </h2>
        </div>

        {/* Stacking Cards Experience */}
        <div className="flex flex-col gap-4 max-w-3xl mx-auto pb-8">
          {STACKING_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;

            return (
              <div
                key={feat.title}
                className={cn(
                  "sticky rounded-3xl p-6 sm:p-8 bg-white/95 backdrop-blur-xl border transition-all duration-500 overflow-hidden",
                  feat.cardBorder
                )}
                style={{
                  top: `calc(84px + ${idx * 14}px)`,
                }}
              >
                {/* Subtle internal spotlight within the card */}
                <div 
                  className="pointer-events-none absolute -inset-px rounded-3xl overflow-hidden" 
                  aria-hidden="true"
                >
                  <div
                    className="absolute -right-16 -top-16 w-80 h-80 rounded-full blur-[70px] transition-all duration-700 ease-out"
                    style={{
                      background: feat.glowColor,
                      opacity: 0.85,
                    }}
                  />

                  {/* Top-edge Vibrant Accent Light Beam */}
                  <div
                    className="absolute top-0 left-12 right-12 h-[2px] transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${feat.glowAccent}, transparent)`,
                      opacity: 0.85,
                    }}
                  />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left Column: Number, Title, Body */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${feat.accentBg}`}>
                        Pillar {feat.number}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {feat.tagline}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${feat.accentBg} ${feat.color}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {feat.title}
                    </h3>

                    <p className="text-base sm:text-lg font-medium leading-relaxed max-w-xl text-slate-600">
                      {feat.body}
                    </p>

                    {/* Chips */}
                    <div className="pt-2 flex flex-nowrap overflow-x-auto sm:overflow-visible gap-2 items-center">
                      {feat.chips.map((chip) => (
                        <span
                          key={chip}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300",
                            feat.chipClass
                          )}
                        >
                          <CheckCircle2 className={`h-3.5 w-3.5 ${feat.color}`} />
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Metric Highlight Badge */}
                  <div className={cn(
                    "flex md:flex-col items-center md:items-end justify-between md:justify-center p-4 rounded-2xl border shrink-0 min-w-[140px] text-right transition-all duration-500 shadow-xs",
                    feat.metricBoxClass
                  )}>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      {feat.metricLabel}
                    </p>
                    <p className={`text-xl sm:text-2xl font-black mt-1 font-display ${feat.metricValueClass}`}>
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

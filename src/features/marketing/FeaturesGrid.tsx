import {
  Calendar,
  Wallet,
  Clock,
  ShieldCheck,
  CheckCircle2
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
  cardBgActive: string;
  cardBgInactive: string;
  glowColor: string;
  glowAccent: string;
  borderActive: string;
  chips: string[];
  metricLabel: string;
  metricValue: string;
}

const STACKING_FEATURES: StackingFeature[] = [
  {
    number: "01",
    icon: Wallet,
    title: "Pay fixed first",
    tagline: "You know your pay before you start",
    body: "Your pay is fixed before you start work. No bidding, no price cuts and no arguments about money later.",
    color: "text-cyan-400",
    accentBg: "bg-cyan-500/10 border-cyan-500/30",
    cardBgActive: "bg-[#111d3d]",
    cardBgInactive: "bg-[#091124]",
    glowColor: "rgba(34, 211, 238, 0.4)",
    glowAccent: "#22d3ee",
    borderActive: "border-cyan-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(34,211,238,0.22)]",
    chips: ["Fixed pay", "No price cuts", "No bidding"],
    metricLabel: "Your pay",
    metricValue: "Fixed first",
  },
  {
    number: "02",
    icon: ShieldCheck,
    title: "A supervisor on your side",
    tagline: "Your name stays private",
    body: "Your supervisor checks your work, stops extra unpaid changes and talks to the client for you. The client never learns who you are.",
    color: "text-emerald-400",
    accentBg: "bg-emerald-500/10 border-emerald-500/30",
    cardBgActive: "bg-[#0e273a]",
    cardBgInactive: "bg-[#071722]",
    glowColor: "rgba(52, 211, 153, 0.4)",
    glowAccent: "#34d399",
    borderActive: "border-emerald-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(52,211,153,0.22)]",
    chips: ["Name kept private", "One guide", "No client calls"],
    metricLabel: "Client talks",
    metricValue: "Handled for you",
  },
  {
    number: "03",
    icon: Clock,
    title: "Paid after approval",
    tagline: "Straight to your bank or UPI",
    body: "When your work is approved, the money is sent to your bank account. No invoices and no chasing.",
    color: "text-purple-400",
    accentBg: "bg-purple-500/10 border-purple-500/30",
    cardBgActive: "bg-[#1d1b45]",
    cardBgInactive: "bg-[#0f0e26]",
    glowColor: "rgba(192, 132, 252, 0.4)",
    glowAccent: "#c084fc",
    borderActive: "border-purple-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(192,132,252,0.22)]",
    chips: ["Straight to bank", "No invoices", "No chasing"],
    metricLabel: "Payout time",
    metricValue: "Within 48h",
  },
  {
    number: "04",
    icon: Calendar,
    title: "Clear work and deadlines",
    tagline: "No extra work added later",
    body: "Every project tells you what to do and when it is due. You always know the next step.",
    color: "text-blue-400",
    accentBg: "bg-blue-500/10 border-blue-500/30",
    cardBgActive: "bg-[#13244d]",
    cardBgInactive: "bg-[#09132b]",
    glowColor: "rgba(96, 165, 250, 0.4)",
    glowAccent: "#60a5fa",
    borderActive: "border-blue-400/50 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_40px_rgba(96,165,250,0.22)]",
    chips: ["Clear brief", "Quick feedback", "No surprise changes"],
    metricLabel: "The brief",
    metricValue: "Clear from day one",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-[#050914] pt-16 sm:pt-20 pb-20 sm:pb-24 overflow-x-clip">
      {/* Top curved divider directly matching the white background of the section above */}
      <CurvedSectionDivider variant="wave" position="top" fillColor="fill-white" showBorderLine={false} showAccentGlow={false} />

      {/* Decorative ambient lights */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />

      <div className="fresh-container relative z-10 px-4 md:px-8 max-w-[1240px]">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <StitchBadge tone="light">
            Why Choose Dolancer
          </StitchBadge>
          <h2 className="mt-2 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight font-display">
            Made for people who want{" "}
            <span className="text-white fresh-underline fresh-underline-mint">
              clear work and fair pay.
            </span>
          </h2>
        </div>

        {/* Stacking Cards Experience */}
        <div className="flex flex-col gap-4 max-w-3xl mx-auto pb-8">
          {STACKING_FEATURES.map((feat, idx) => {
            const Icon = feat.icon;
            // Every pillar stays lit. The deck still stacks on scroll, but no
            // card ever fades: glow, border and text are always at full strength.
            const isActive = true;

            return (
              <div
                key={feat.title}
                className={cn(
                  // NOTE: no `relative` here. tailwind-merge treats position
                  // utilities as conflicting and keeps the last one, so `relative`
                  // would silently drop `sticky` and kill the stacking deck.
                  // `sticky` already creates the positioning context the glow needs.
                  "sticky rounded-3xl p-6 sm:p-8 backdrop-blur-2xl transition-all duration-500 overflow-hidden",
                  isActive
                    ? `opacity-100 scale-100 border ${feat.borderActive} ${feat.cardBgActive}`
                    : `opacity-35 scale-[0.985] border border-white/10 ${feat.cardBgInactive} hover:opacity-80`
                )}
                style={{
                  top: `calc(84px + ${idx * 14}px)`,
                }}
              >
                {/* Automated Colorful Spotlight Glow Effect within the card */}
                <div 
                  className="pointer-events-none absolute -inset-px rounded-3xl overflow-hidden" 
                  aria-hidden="true"
                >
                  {/* Primary Breathing Spotlight */}
                  <div
                    className="absolute -right-16 -top-16 w-88 h-88 rounded-full blur-[70px] transition-all duration-700 ease-out"
                    style={{
                      background: feat.glowColor,
                      opacity: isActive ? 0.45 : 0,
                      transform: isActive ? "scale(1.2)" : "scale(0.7)",
                    }}
                  />

                  {/* Secondary Ambient Sweeping Glow */}
                  <div
                    className="absolute -left-12 -bottom-12 w-72 h-72 rounded-full blur-[65px] transition-all duration-700 ease-out"
                    style={{
                      background: feat.glowColor,
                      opacity: isActive ? 0.3 : 0,
                      transform: isActive ? "scale(1.15)" : "scale(0.7)",
                    }}
                  />

                  {/* Top-edge Vibrant Accent Light Beam */}
                  <div
                    className="absolute top-0 left-12 right-12 h-[2px] transition-opacity duration-500"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${feat.glowAccent}, transparent)`,
                      opacity: isActive ? 1 : 0,
                    }}
                  />
                </div>

                <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
                  {/* Left Column: Number, Title, Body */}
                  <div className="space-y-4 flex-1">
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-black tracking-widest uppercase px-2.5 py-1 rounded-full border transition-colors duration-300 ${feat.accentBg} ${feat.color}`}>
                        Pillar {feat.number}
                      </span>
                      <span className={cn(
                        "text-xs font-semibold transition-colors duration-300",
                        isActive ? "text-slate-300" : "text-slate-500"
                      )}>
                        {feat.tagline}
                      </span>
                    </div>

                    <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display flex items-center gap-3">
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${feat.accentBg} ${feat.color} ${isActive ? "shadow-[0_0_16px_rgba(255,255,255,0.15)]" : ""}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      {feat.title}
                    </h3>

                    <p className={cn(
                      "text-base sm:text-lg font-medium leading-relaxed max-w-xl transition-colors duration-300",
                      isActive ? "text-slate-200" : "text-slate-400"
                    )}>
                      {feat.body}
                    </p>

                    {/* Chips */}
                    <div className="pt-2 flex flex-nowrap overflow-x-auto sm:overflow-visible gap-2 items-center">
                      {feat.chips.map((chip) => (
                        <span
                          key={chip}
                          className={cn(
                            "inline-flex items-center gap-1.5 rounded-lg border px-2.5 sm:px-3 py-1 text-xs font-semibold whitespace-nowrap shrink-0 transition-all duration-300",
                            isActive
                              ? "bg-white/10 border-white/20 text-slate-200"
                              : "bg-white/[0.03] border-white/5 text-slate-400"
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
                    "flex md:flex-col items-center md:items-end justify-between md:justify-center p-4 rounded-2xl border shrink-0 min-w-[140px] text-right transition-all duration-500",
                    isActive
                      ? "bg-white/[0.08] border-white/25 shadow-inner"
                      : "bg-white/[0.02] border-white/5 opacity-70"
                  )}>
                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {feat.metricLabel}
                    </p>
                    <p className={`text-xl sm:text-2xl font-black mt-1 ${feat.color} font-display transition-transform duration-300 ${isActive ? "scale-105" : ""}`}>
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

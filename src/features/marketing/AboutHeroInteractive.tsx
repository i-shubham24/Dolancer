import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
  Zap,
  Check,
  TrendingUp,
  AlertTriangle,
} from "lucide-react";
import { StitchBadge, StitchButton } from "@/components/stitch/StitchPrimitives";
import { cn } from "@/lib/cn";

export function AboutHeroInteractive() {
  const [activeTab, setActiveTab] = useState<"dolancer" | "traditional">("dolancer");

  const dolancerSteps = [
    {
      title: "Pre-funded briefs on your board",
      desc: "Client funds secured upfront. You see exact payout and scope before claiming.",
      icon: CheckCircle2,
    },
    {
      title: "1-Click claim, zero proposals",
      desc: "Matched strictly by verified discipline. No pitching, bidding wars or free spec tests.",
      icon: Zap,
    },
    {
      title: "Dedicated supervisor buffer",
      desc: "Your supervisor manages client relations, reviews quality and halts scope creep.",
      icon: Shield,
    },
    {
      title: "Instant direct bank deposit",
      desc: "Supervisor sign-off triggers release via NEFT/IMPS. No invoicing or 60-day chasing.",
      icon: TrendingUp,
    },
  ];

  const traditionalSteps = [
    {
      title: "The proposal treadmill",
      desc: "Writing 40 to 50 custom pitches just to get a single reply.",
      icon: AlertTriangle,
    },
    {
      title: "Race-to-the-bottom bidding",
      desc: "Undercutting your rates to compete with automated bots and mass spam.",
      icon: XCircle,
    },
    {
      title: "Late-night scope creep",
      desc: "Dealing with direct client disputes, endless revisions and awkward friction.",
      icon: AlertTriangle,
    },
    {
      title: "Chasing unpaid invoices",
      desc: "Waiting 30 to 60 days, absorbing platform fees and payment dispute risks.",
      icon: XCircle,
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-6 sm:py-10">
      {/* Left Column: Editorial & Narrative */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <StitchBadge tone="brand">
            <Sparkles className="h-3.5 w-3.5" />
            Our Origin and Charter
          </StitchBadge>
          <h1 className="fresh-about-title mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink font-display leading-[1.1]">
            Skilled work should feel
            <br />
            <span className="fresh-highlight fresh-underline fresh-underline-yellow">
              simpler than this.
            </span>
          </h1>
        </div>

        <div className="space-y-4 text-base sm:text-lg text-ink-2 font-medium leading-relaxed">
          <p>
            Most freelance platforms put the entire operational burden on the creator: drafting dozens of unpaid proposals, discounting against race-to-the-bottom bids, and absorbing angry client messages.
          </p>
          <p>
            <strong className="text-ink font-extrabold">Dolancer was built to flip this upside down.</strong> We secure the enterprise clients, lock in pre-funded budgets, and pair you with a human supervisor who shields you from scope creep and dispute friction.
          </p>
          <p>
            You focus 100% on craft: delivering exceptional work, and receiving prompt, guaranteed payouts directly to your bank account.
          </p>
        </div>

        {/* 3 Value Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3.5 rounded-2xl bg-surface border border-line-card shadow-soft-xs">
            <span className="text-coral font-bold text-xs flex items-center gap-1.5 mb-1">
              <ShieldCheck className="h-4 w-4" /> Shield Buffer
            </span>
            <p className="text-xs text-ink-2 font-medium">
              Supervisors handle all client friction and revisions.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-line-card shadow-soft-xs">
            <span className="text-success-ink font-bold text-xs flex items-center gap-1.5 mb-1">
              <Check className="h-4 w-4" /> Pre-funded
            </span>
            <p className="text-xs text-ink-2 font-medium">
              Every brief is pre-funded before work begins.
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-surface border border-line-card shadow-soft-xs">
            <span className="text-blue font-bold text-xs flex items-center gap-1.5 mb-1">
              <Zap className="h-4 w-4" /> 0 Cold Bids
            </span>
            <p className="text-xs text-ink-2 font-medium">
              Work arrives matched to your verified discipline.
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <StitchButton asChild>
            <Link to="/sign-up">
              Start earning <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </StitchButton>
          <StitchButton asChild variant="secondary">
            <Link to="/how-it-works">See how work flows</Link>
          </StitchButton>
        </div>
      </div>

      {/* Right Column: Interactive Model Comparison Sandbox */}
      <div className="lg:col-span-6">
        <div className="rounded-3xl border border-line-card bg-surface p-6 sm:p-7 shadow-soft-md relative overflow-hidden">
          {/* Header Switcher */}
          <div className="flex items-center justify-between pb-5 border-b border-line-card/70">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-ink-muted block">
                Interactive Comparison
              </span>
              <h3 className="text-lg font-extrabold text-ink font-display">
                The Freelancing Reality
              </h3>
            </div>

            {/* Model Toggle Tabs */}
            <div className="flex items-center rounded-xl bg-hover p-1 border border-line-card/60">
              <button
                type="button"
                onClick={() => setActiveTab("dolancer")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all select-none",
                  activeTab === "dolancer"
                    ? "bg-coral text-white shadow-soft-xs"
                    : "text-ink-2 hover:text-ink"
                )}
              >
                The Dolancer Way
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("traditional")}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all select-none",
                  activeTab === "traditional"
                    ? "bg-ink text-white shadow-soft-xs"
                    : "text-ink-2 hover:text-ink"
                )}
              >
                Traditional Platforms
              </button>
            </div>
          </div>

          {/* Dynamic Content */}
          <div className="mt-5 min-h-[290px]">
            <AnimatePresence mode="wait">
              {activeTab === "dolancer" ? (
                <motion.div
                  key="dolancer-flow"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-[11px] font-extrabold text-success-ink mb-1">
                    <Check className="h-3.5 w-3.5" /> High Agency, Low Friction
                  </div>

                  {dolancerSteps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="p-3.5 rounded-2xl bg-[#faf8f5] border border-line-card/70 flex items-start gap-3.5 transition-all hover:bg-surface hover:shadow-soft-xs"
                      >
                        <div className="h-8 w-8 rounded-xl bg-coral/15 text-coral flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-coral">
                              0{idx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-extrabold text-ink">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-ink-2 mt-0.5 font-medium leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              ) : (
                <motion.div
                  key="traditional-flow"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-extrabold text-red-600 mb-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> The Broken Status Quo
                  </div>

                  {traditionalSteps.map((step, idx) => {
                    const Icon = step.icon;
                    return (
                      <div
                        key={step.title}
                        className="p-3.5 rounded-2xl bg-surface border border-line-card/70 opacity-90 flex items-start gap-3.5 line-through-container"
                      >
                        <div className="h-8 w-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono font-bold text-ink-muted">
                              0{idx + 1}
                            </span>
                            <h4 className="text-xs sm:text-sm font-bold text-ink-2">
                              {step.title}
                            </h4>
                          </div>
                          <p className="text-xs text-ink-muted mt-0.5 font-medium leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Trust Stat */}
          <div className="mt-5 pt-4 border-t border-line-card/60 flex items-center justify-between text-xs font-semibold text-ink-2">
            <span>Platform Philosophy:</span>
            <span className="text-coral font-bold flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> Fair pay, direct briefs, zero fluff
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

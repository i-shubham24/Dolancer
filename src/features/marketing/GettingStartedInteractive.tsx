import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Wallet,
  ArrowRight,
  Check,
  RotateCcw,
  Zap,
  Lock,
  Building2,
  FileCheck2,
  Clock,
  Play,
  Pause,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface Moment {
  id: number;
  stepNumber: string;
  tabTitle: string;
  tabSubtitle: string;
  badge: string;
  title: string;
  description: string;
  highlight: string;
}

const MOMENTS: Moment[] = [
  {
    id: 1,
    stepNumber: "01",
    tabTitle: "Join in 60s",
    tabSubtitle: "Pick your core skills",
    badge: "Zero Resume Friction",
    title: "Select what you excel at, nothing more",
    description:
      "Enter your basic details and select your verified disciplines. Your private dashboard activates instantly with no unpaid portfolio tests or cold outreach.",
    highlight: "Matching begins the second you select your first discipline.",
  },
  {
    id: 2,
    stepNumber: "02",
    tabTitle: "Get Verified",
    tabSubtitle: "ID and payout setup",
    badge: "Protected Status",
    title: "One-time check unlocks pre-funded work",
    description:
      "A quick identity confirmation and your direct bank account or UPI handle. A dedicated supervisor reviews your credentials and becomes your buffer against client friction.",
    highlight: "Clients never see your personal details or contact information.",
  },
  {
    id: 3,
    stepNumber: "03",
    tabTitle: "Claim Without Bidding",
    tabSubtitle: "No proposal treadmill",
    badge: "Guaranteed Rates",
    title: "Real briefs with transparent payouts",
    description:
      "Projects matched strictly to your verified skills appear with fixed rates and clear deadlines. One click claims the brief. No competing on price or bidding against bots.",
    highlight: "Every single brief is pre-funded before it hits your board.",
  },
  {
    id: 4,
    stepNumber: "04",
    tabTitle: "Deliver & Auto-Payout",
    tabSubtitle: "Direct to your bank",
    badge: "Instant Transfer",
    title: "Supervisor sign-off triggers release",
    description:
      "Submit your deliverables to your supervisor. Once reviewed and approved, your full agreed payout transfers directly to your bank account via NEFT, IMPS or UPI with zero surprises.",
    highlight: "No invoicing, no 60-day waits, and no client chasing.",
  },
];

const SKILL_OPTIONS = [
  { id: "design", label: "Graphic Design & Branding", briefs: 14, pay: "₹2,600" },
  { id: "web", label: "Web Dev (WordPress & Shopify)", briefs: 18, pay: "₹4,200" },
  { id: "copy", label: "Sales Copy & Product Listings", briefs: 11, pay: "₹2,400" },
  { id: "marketing", label: "Digital Marketing & SEO", briefs: 9, pay: "₹3,100" },
  { id: "ecom", label: "Amazon & E-Commerce", briefs: 8, pay: "₹2,700" },
  { id: "support", label: "Customer Service & Chat", briefs: 12, pay: "₹2,000" },
];

export function GettingStartedInteractive() {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  // Step 1 interactive state
  const [selectedSkills, setSelectedSkills] = useState<string[]>(["design", "web"]);

  // Step 3 interactive state
  const [claimedBrief, setClaimedBrief] = useState<boolean>(false);

  // Step 4 interactive state
  const [simulatedPayout, setSimulatedPayout] = useState<boolean>(false);

  // Auto-cycle timer if playing
  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev % 4) + 1);
    }, 6000);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const toggleSkill = (id: string) => {
    setSelectedSkills((prev) =>
      prev.includes(id) ? (prev.length > 1 ? prev.filter((s) => s !== id) : prev) : [...prev, id]
    );
  };

  const totalBriefsCount = selectedSkills.reduce((acc, skillId) => {
    const found = SKILL_OPTIONS.find((s) => s.id === skillId);
    return acc + (found ? found.briefs : 0);
  }, 0);

  const currentMoment = MOMENTS.find((m) => m.id === activeStep) ?? MOMENTS[0]!;

  return (
    <div className="w-full">
      {/* Header & Subtitle */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-coral-light px-3 py-1 text-xs font-bold text-coral border border-coral/20">
            <Sparkles className="h-3.5 w-3.5" />
            The route is simple
          </div>
          <h2 id="steps" className="mt-3 text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-ink">
            Getting started in four clear moments
          </h2>
          <p className="mt-2 text-base text-ink-2 max-w-2xl font-medium">
            No proposal treadmill, no mystery invoices, and no disappearing clients. See exactly how each stage protects your time and income.
          </p>
        </div>

        {/* Auto-play toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className="inline-flex items-center gap-2 rounded-full border border-line-card bg-surface px-3.5 py-1.5 text-xs font-bold text-ink-2 hover:bg-hover hover:text-ink transition-colors shadow-soft-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="h-3.5 w-3.5 text-coral" />
                <span>Pause tour</span>
              </>
            ) : (
              <>
                <Play className="h-3.5 w-3.5 text-coral" />
                <span>Auto-play tour</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Step Selector Tabs (The 4 Clear Moments) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {MOMENTS.map((m) => {
          const isActive = m.id === activeStep;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setActiveStep(m.id);
                setIsPlaying(false);
              }}
              className={cn(
                "relative text-left p-4 rounded-2xl border transition-all duration-300 select-none group",
                isActive
                  ? "bg-surface border-coral shadow-soft-md ring-2 ring-coral/20"
                  : "bg-surface/60 border-line-card hover:bg-surface hover:border-line-card/80 shadow-soft-xs"
              )}
            >
              {/* Step indicator top line */}
              <div className="flex items-center justify-between mb-2">
                <span
                  className={cn(
                    "text-xs font-black tracking-widest font-mono",
                    isActive ? "text-coral" : "text-ink-muted group-hover:text-ink-2"
                  )}
                >
                  {m.stepNumber}
                </span>
                {isActive && (
                  <span className="h-2 w-2 rounded-full bg-coral animate-pulse" />
                )}
              </div>

              <h3 className={cn("text-sm sm:text-base font-extrabold leading-snug", isActive ? "text-ink" : "text-ink-2")}>
                {m.tabTitle}
              </h3>
              <p className="text-xs text-ink-muted mt-0.5 font-medium line-clamp-1">
                {m.tabSubtitle}
              </p>

              {/* Active progress bar */}
              {isActive && (
                <motion.div
                  layoutId="step-highlight-bar"
                  className="absolute bottom-0 left-3 right-3 h-1 bg-coral rounded-full"
                  transition={{ duration: 0.3 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Dynamic Stage Canvas (Two Column Interactive Workbench) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Context, Highlights & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between rounded-3xl border border-line-card bg-surface p-6 sm:p-8 shadow-soft-sm relative overflow-hidden">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-coral-light/60 px-3 py-1 text-xs font-extrabold text-coral mb-4">
              <Zap className="h-3 w-3" />
              {currentMoment.badge}
            </div>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-ink font-display tracking-tight leading-tight">
              {currentMoment.title}
            </h3>

            <p className="mt-4 text-sm sm:text-base text-ink-2 font-medium leading-relaxed">
              {currentMoment.description}
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-[#fbf9f6] border border-line-card/70 flex items-start gap-3">
              <CheckCircle2 className="h-5 w-5 text-success-dot shrink-0 mt-0.5" />
              <p className="text-xs sm:text-sm font-semibold text-ink leading-relaxed">
                {currentMoment.highlight}
              </p>
            </div>
          </div>

          {/* Quick step navigation button */}
          <div className="mt-8 pt-6 border-t border-line-card/60 flex items-center justify-between">
            <span className="text-xs font-bold text-ink-muted">
              Step {currentMoment.id} of 4
            </span>
            <div className="flex items-center gap-2">
              {activeStep > 1 && (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep - 1)}
                  className="px-3 py-1.5 rounded-full border border-line-card text-xs font-bold text-ink-2 hover:bg-hover hover:text-ink transition-colors"
                >
                  Previous
                </button>
              )}
              {activeStep < 4 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep(activeStep + 1)}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-coral text-white text-xs font-bold shadow-soft-xs hover:bg-coral-hover transition-colors"
                >
                  Next Moment
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <Button asChild size="sm" className="rounded-full">
                  <Link to="/sign-up">Start Earning Now</Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: High-Craft Live Interactive Simulator */}
        <div className="lg:col-span-7 rounded-3xl border border-line-card bg-[#faf8f5] p-6 sm:p-8 shadow-soft-sm flex flex-col justify-center min-h-[380px] relative overflow-hidden">
          <AnimatePresence mode="wait">
            {/* STAGE 1 SIMULATOR: Interactive Skill Matching */}
            {activeStep === 1 && (
              <motion.div
                key="step-1-sim"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line-card/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-coral animate-pulse" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink font-display">
                      Interactive Discipline Selector
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-ink-muted">
                    Tap disciplines to test matching
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SKILL_OPTIONS.map((skill) => {
                    const isSelected = selectedSkills.includes(skill.id);
                    return (
                      <button
                        key={skill.id}
                        type="button"
                        onClick={() => toggleSkill(skill.id)}
                        className={cn(
                          "p-3 rounded-xl border text-left transition-all flex items-center justify-between gap-2 select-none",
                          isSelected
                            ? "bg-surface border-coral shadow-soft-xs text-ink"
                            : "bg-surface/50 border-line-card text-ink-2 hover:bg-surface"
                        )}
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold truncate">{skill.label}</p>
                          <p className="text-[11px] text-ink-muted font-medium">
                            Avg {skill.pay} · {skill.briefs} briefs active
                          </p>
                        </div>
                        <div
                          className={cn(
                            "h-5 w-5 rounded-md flex items-center justify-center shrink-0 border text-xs",
                            isSelected
                              ? "bg-coral border-coral text-white"
                              : "border-line-card bg-surface"
                          )}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Real-time Match Indicator */}
                <div className="p-4 rounded-2xl bg-surface border border-line-card flex items-center justify-between gap-4">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coral block">
                      Live Matching Engine
                    </span>
                    <p className="text-sm font-extrabold text-ink mt-0.5">
                      {selectedSkills.length} disciplines selected · {totalBriefsCount} matching briefs unlocked
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2.5 py-1 text-xs font-extrabold text-success-ink">
                      <Check className="h-3 w-3" /> Ready to Claim
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 2 SIMULATOR: Instant Verification & Shield */}
            {activeStep === 2 && (
              <motion.div
                key="step-2-sim"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line-card/70">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-coral" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink font-display">
                      Security & Payout Shield Check
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full bg-success-bg px-2 py-0.5 text-[11px] font-bold text-success-ink">
                    100% Encrypted
                  </span>
                </div>

                {/* Verification Cards */}
                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-surface border border-line-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-blue-light text-blue flex items-center justify-center font-bold">
                        <FileCheck2 className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">Government ID Verification</p>
                        <p className="text-[11px] text-ink-muted">Aadhar / PAN verified · Stored offline</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-success-ink flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Verified
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface border border-line-card flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-coral-light text-coral flex items-center justify-center font-bold">
                        <Building2 className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">Direct Deposit (NEFT / UPI)</p>
                        <p className="text-[11px] text-ink-muted">HDFC Bank ****4910 · Verified</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-success-ink flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> Linked
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-surface border border-coral/30 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-9 w-9 rounded-xl bg-coral text-white flex items-center justify-center font-bold">
                        <ShieldCheck className="h-4.5 w-4.5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-ink">Supervisor Buffer Active</p>
                        <p className="text-[11px] text-ink-muted">R. Kapoor (Lead QA) allocated to your queue</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-coral">
                      Shield Active
                    </span>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 3 SIMULATOR: Live Brief Claiming */}
            {activeStep === 3 && (
              <motion.div
                key="step-3-sim"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line-card/70">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success-dot" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink font-display">
                      Live Brief Simulator
                    </span>
                  </div>
                  <span className="text-xs font-semibold text-coral">
                    Fixed Rate · Pre-funded
                  </span>
                </div>

                {/* Brief card */}
                <div className="p-5 rounded-2xl bg-surface border border-line-card shadow-soft-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-coral">
                      Web Development · WordPress
                    </span>
                    <span className="text-lg font-extrabold text-ink font-display">
                      ₹4,200
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-extrabold text-ink">
                      Responsive Landing Page & Booking Setup
                    </h4>
                    <p className="text-xs text-ink-muted mt-1 font-medium">
                      Brief duration: 48 hours · Supervisor review allocated
                    </p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-ink-2 font-medium pt-2 border-t border-line-card/60">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-ink-muted" /> Due in 2 days
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-success-ink" /> Funds pre-funded
                    </span>
                  </div>

                  <div className="pt-2">
                    {!claimedBrief ? (
                      <button
                        type="button"
                        onClick={() => setClaimedBrief(true)}
                        className="w-full py-2.5 rounded-xl bg-coral hover:bg-coral-hover text-white text-xs font-bold transition-all shadow-soft-xs flex items-center justify-center gap-2"
                      >
                        <Zap className="h-3.5 w-3.5" />
                        Claim Brief (Simulate 1-Click Action)
                      </button>
                    ) : (
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-success-bg border border-success-ink/20">
                        <div className="flex items-center gap-2">
                          <Check className="h-4 w-4 text-success-ink" />
                          <span className="text-xs font-extrabold text-success-ink">
                            Brief Claimed! Moved to Your Private Workroom
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setClaimedBrief(false)}
                          className="text-[11px] text-ink-muted hover:text-ink font-bold flex items-center gap-1"
                        >
                          <RotateCcw className="h-3 w-3" /> Reset
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* STAGE 4 SIMULATOR: Instant Auto-Payout Receipt */}
            {activeStep === 4 && (
              <motion.div
                key="step-4-sim"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-line-card/70">
                  <div className="flex items-center gap-2">
                    <Wallet className="h-4 w-4 text-success-ink" />
                    <span className="text-xs font-extrabold uppercase tracking-wider text-ink font-display">
                      Instant Payout Terminal
                    </span>
                  </div>
                  <span className="text-xs font-bold text-success-ink">
                    100% Transparent
                  </span>
                </div>

                {/* Receipt Card */}
                <div className="p-5 rounded-2xl bg-surface border border-line-card shadow-soft-xs space-y-3 font-mono">
                  <div className="flex items-center justify-between text-xs text-ink-muted border-b border-line-card/60 pb-2">
                    <span>TRANSACTION VOUCHER</span>
                    <span>#DOL-94102</span>
                  </div>

                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-medium text-ink-2">
                      <span>Agreed Deliverable Payout:</span>
                      <span className="font-bold text-ink">₹18,400.00</span>
                    </div>
                    <div className="flex justify-between font-medium text-ink-2">
                      <span>Client Deposit Status:</span>
                      <span className="text-success-ink font-bold">100% Pre-funded</span>
                    </div>
                    <div className="flex justify-between font-medium text-ink-2">
                      <span>Platform Deduction from You:</span>
                      <span className="text-success-ink font-bold">₹0.00 (Zero cut)</span>
                    </div>
                    <div className="pt-2 border-t border-line-card/60 flex justify-between text-sm font-extrabold text-ink">
                      <span>Net Direct Deposit:</span>
                      <span className="text-coral text-base">₹18,400.00</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {!simulatedPayout ? (
                      <button
                        type="button"
                        onClick={() => setSimulatedPayout(true)}
                        className="w-full py-2.5 rounded-xl bg-success-ink hover:bg-success-ink/90 text-white text-xs font-bold transition-all shadow-soft-xs flex items-center justify-center gap-2 font-sans"
                      >
                        <Wallet className="h-3.5 w-3.5" />
                        Simulate Instant Bank Release
                      </button>
                    ) : (
                      <div className="p-3 rounded-xl bg-success-bg border border-success-ink/20 font-sans space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-success-ink flex items-center gap-1.5">
                            <Check className="h-4 w-4" /> Transfer Successful
                          </span>
                          <button
                            type="button"
                            onClick={() => setSimulatedPayout(false)}
                            className="text-[11px] text-ink-muted hover:text-ink font-bold flex items-center gap-1"
                          >
                            <RotateCcw className="h-3 w-3" /> Test Again
                          </button>
                        </div>
                        <p className="text-[11px] text-ink-2">
                          Credited to HDFC Bank (****4910) via IMPS in 1.4s · Ref #TXN-88214
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

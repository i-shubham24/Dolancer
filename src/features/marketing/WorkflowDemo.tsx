import { useState, useRef } from "react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import {
  ShieldCheck,
  RotateCcw,
  Check,
  Zap,
  Lock,
  Calendar,
  Link2,
  Banknote,
  Copy,
  UserCheck
} from "lucide-react";
import { cn } from "@/lib/cn";

const STEPS = [
  {
    stepNum: "01",
    title: "An offer arrives",
    subtitle: "Matched brief with fixed pay upfront"
  },
  {
    stepNum: "02",
    title: "You add your link",
    subtitle: "Paste Figma, GitHub or Drive link"
  },
  {
    stepNum: "03",
    title: "You do the work",
    subtitle: "Milestones & supervisor support"
  },
  {
    stepNum: "04",
    title: "It gets reviewed",
    subtitle: "Supervisor QA & client clearance"
  },
  {
    stepNum: "05",
    title: "You get paid",
    subtitle: "Instant direct bank / UPI payout"
  }
];

export function WorkflowDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([0, 1]);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStep = STEPS[currentStepIndex] ?? STEPS[0]!;

  // Smooth Scroll Progress Binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    let nextStep = 0;
    if (latest >= 0.80) nextStep = 4;
    else if (latest >= 0.60) nextStep = 3;
    else if (latest >= 0.40) nextStep = 2;
    else if (latest >= 0.20) nextStep = 1;
    else nextStep = 0;

    if (nextStep !== currentStepIndex) {
      setCurrentStepIndex(nextStep);
    }
  });

  // Smooth scroll to a target step when clicked
  const scrollToStep = (targetIndex: number) => {
    if (!containerRef.current) {
      setCurrentStepIndex(targetIndex);
      return;
    }
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    const scrollTop = window.scrollY + rect.top;
    const scrollableDistance = container.offsetHeight - window.innerHeight;
    
    const stepCenterRatio = (targetIndex + 0.5) / STEPS.length;
    const targetScrollY = scrollTop + stepCenterRatio * Math.max(0, scrollableDistance);

    window.scrollTo({
      top: targetScrollY,
      behavior: "smooth"
    });
    setCurrentStepIndex(targetIndex);
  };

  const toggleMilestone = (idx: number) => {
    setCompletedMilestones((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const handleCopyProjectId = () => {
    navigator.clipboard?.writeText("DL-9482");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div ref={containerRef} className="relative h-[360vh] w-full">
      {/* Sticky higher up with stable layout */}
      <div className="sticky top-6 md:top-8 z-10 w-full min-h-[calc(100vh-3rem)] flex flex-col justify-center py-2 sm:py-4">
        
        {/* Section Header */}
        <div className="pb-4 border-b border-line-card/80">
          <h2 id="walkthrough" className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#0A1A44] font-display">
            What a project <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">actually looks like</span>
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-ink-2 font-medium">
            Scroll to follow a project from assigned offer to instant bank payout.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left Column: 5 Clean Steps */}
          <div className="lg:col-span-4 flex flex-col justify-between gap-2" role="tablist" aria-label="Project lifecycle steps">
            <div className="flex flex-col gap-2">
              {STEPS.map((step, idx) => {
                const isActive = idx === currentStepIndex;
                const isPassed = idx < currentStepIndex;

                return (
                  <button
                    key={step.stepNum}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => scrollToStep(idx)}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-2xl p-3 sm:p-3.5 text-left transition-all duration-200 cursor-pointer border",
                      isActive
                        ? "bg-white border-primary/40 shadow-md ring-2 ring-primary/10"
                        : "bg-surface/60 border-line-card/60 hover:bg-white hover:border-line-card"
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute left-0 top-3 bottom-3 w-1.5 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    {/* Step Number Circle */}
                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all",
                        isActive
                          ? "bg-primary text-white shadow-xs"
                          : isPassed
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : "bg-surface-2 text-ink-muted border border-line-card group-hover:text-ink"
                      )}
                    >
                      {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" /> : step.stepNum}
                    </div>

                    {/* Text */}
                    <div className="flex-1 min-w-0">
                      <h3 className={cn("text-xs sm:text-sm font-extrabold tracking-tight", isActive ? "text-primary" : "text-[#0A1A44]")}>
                        {step.title}
                      </h3>
                      <p className="text-[11px] text-ink-muted font-medium truncate">
                        {step.subtitle}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Simple Bottom Protected Note */}
            <div className="rounded-xl border border-line-card bg-surface-2/60 p-2.5 flex items-center gap-2.5">
              <ShieldCheck className="h-4 w-4 text-blue-600 shrink-0" />
              <p className="text-[11px] text-ink-2 font-medium">
                Supervisor protects your scope & guarantees payout.
              </p>
            </div>
          </div>

          {/* Right Column: Live Specialist Workbench (Consistent Fixed Height) */}
          <div className="lg:col-span-8">
            <div className="rounded-2xl sm:rounded-3xl border border-line-card bg-white shadow-xl shadow-slate-200/50 overflow-hidden flex flex-col h-full">
              
              {/* Window Header */}
              <div className="bg-[#0A1A44] px-4 py-2.5 sm:px-5 flex items-center justify-between text-white border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-400/80 inline-block"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80 inline-block"></span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80 inline-block"></span>
                  </div>
                  
                  <div className="h-3.5 w-px bg-white/20 mx-0.5" />
                  
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold text-cyan-300 bg-white/10 px-2 py-0.5 rounded border border-white/10 flex items-center gap-1.5">
                      <span>#DL-9482</span>
                      <button
                        type="button"
                        onClick={handleCopyProjectId}
                        className="text-white/60 hover:text-white transition-colors cursor-pointer"
                        title="Copy ID"
                      >
                        {copiedLink ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                      </button>
                    </span>
                    <span className="text-xs text-white/70 font-medium hidden sm:inline">
                      UI/UX Design
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-400/30 text-emerald-300 px-2.5 py-0.5 rounded-full text-[11px] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Supervisor Online</span>
                </div>
              </div>

              {/* Window Content Body with Unified Fixed Height */}
              <div className="p-5 sm:p-6 flex flex-col justify-between h-[390px] overflow-hidden">
                
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex-1 flex flex-col justify-between"
                  >
                    
                    {/* STEP 1: AN OFFER ARRIVES */}
                    {currentStepIndex === 0 && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Top Header */}
                        <div className="flex items-center justify-between bg-blue-50 border border-blue-200/80 rounded-xl px-3.5 py-2 text-xs text-blue-900 font-bold">
                          <span className="flex items-center gap-1.5">
                            <Zap className="h-3.5 w-3.5 text-blue-600 fill-blue-600" />
                            Direct Assigned Offer • No Proposal Needed
                          </span>
                          <span className="text-blue-700 font-mono text-[11px] bg-blue-100 px-2 py-0.5 rounded">
                            Fixed Budget
                          </span>
                        </div>

                        {/* Middle Content */}
                        <div className="rounded-2xl border border-line-card bg-surface-2/60 p-3.5 my-auto">
                          <div className="flex items-center justify-between gap-3 pb-2.5 border-b border-line-card/60">
                            <div>
                              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                                Project Brief
                              </span>
                              <h4 className="text-base font-extrabold text-[#0A1A44]">
                                Fintech Mobile App UI & Design System
                              </h4>
                            </div>
                            <div className="text-right">
                              <span className="text-2xs uppercase text-ink-muted font-bold block">Payout</span>
                              <span className="text-2xl font-black text-emerald-600 font-mono">₹18,500</span>
                            </div>
                          </div>

                          <div className="mt-2.5 space-y-1.5 text-xs">
                            <div className="flex items-center gap-2 text-ink">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>8 interactive mobile screens in Figma</span>
                            </div>
                            <div className="flex items-center gap-2 text-ink">
                              <Check className="h-3.5 w-3.5 text-primary shrink-0" />
                              <span>Design tokens (Typography, Colors & Spacing)</span>
                            </div>
                            <div className="flex items-center gap-2 text-ink">
                              <Calendar className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>Delivery Deadline: 4 Days</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="rounded-xl bg-amber-50 border border-amber-200/80 p-2.5 text-xs flex items-center gap-2.5">
                          <div className="h-6 w-6 rounded-full bg-amber-200 text-amber-900 font-bold flex items-center justify-center text-[10px] shrink-0">
                            AM
                          </div>
                          <p className="text-amber-800 text-[11px] leading-tight">
                            <span className="font-bold text-amber-900">Supervisor: </span>
                            Client scope is validated and payout is pre-funded in pool.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 2: YOU ADD YOUR LINK */}
                    {currentStepIndex === 1 && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Top Header */}
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                            Step 2: Workspace
                          </span>
                          <h4 className="text-base font-extrabold text-[#0A1A44]">
                            Connect your working file
                          </h4>
                        </div>

                        {/* Middle Content */}
                        <div className="rounded-2xl border border-line-card bg-surface-2/60 p-3.5 my-auto space-y-2.5">
                          <div className="flex items-center rounded-xl border-2 border-primary/40 bg-white p-2 shadow-xs">
                            <Link2 className="h-4 w-4 text-primary ml-1 shrink-0" />
                            <span className="w-full bg-transparent px-2.5 text-xs font-mono text-ink">
                              https://figma.com/file/dl-9482/fintech-app-system
                            </span>
                            <span className="rounded-lg bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[10px] font-bold border border-emerald-200 shrink-0">
                              ✓ Connected
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-2xs text-ink-muted font-medium">
                            <span>Compatible tools:</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-line-card text-ink">Figma</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-line-card text-ink">GitHub</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-line-card text-ink">Notion</span>
                            <span className="rounded bg-white px-2 py-0.5 border border-line-card text-ink">Drive</span>
                          </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="grid grid-cols-2 gap-2.5">
                          <div className="rounded-xl border border-line-card bg-white p-2.5 flex items-center gap-2">
                            <Lock className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                            <span className="text-[11px] text-ink font-medium">Private Identity Protected</span>
                          </div>
                          <div className="rounded-xl border border-line-card bg-white p-2.5 flex items-center gap-2">
                            <UserCheck className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span className="text-[11px] text-ink font-medium">Supervisor Sync Ready</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* STEP 3: YOU DO THE WORK */}
                    {currentStepIndex === 2 && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Top Header */}
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                              Step 3: Execution
                            </span>
                            <h4 className="text-base font-extrabold text-[#0A1A44]">
                              Check off milestones as you build
                            </h4>
                          </div>
                          <span className="rounded-full bg-primary/10 border border-primary/20 px-2.5 py-0.5 text-xs font-mono font-bold text-primary">
                            {Math.round((completedMilestones.length / 3) * 100)}% Done
                          </span>
                        </div>

                        {/* Middle Content */}
                        <div className="rounded-2xl border border-line-card bg-surface-2/60 p-2.5 my-auto space-y-1.5">
                          {[
                            "Color Palette & Typography Tokens",
                            "8 High-Fidelity UI Screens",
                            "Interactive Prototype & Export Assets"
                          ].map((milestone, idx) => {
                            const isDone = completedMilestones.includes(idx);
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => toggleMilestone(idx)}
                                className={cn(
                                  "w-full flex items-center justify-between p-2 rounded-xl border text-left text-xs transition-all cursor-pointer",
                                  isDone
                                    ? "bg-white border-emerald-300 text-ink shadow-xs"
                                    : "bg-white/70 border-line-card text-ink-2 hover:bg-white"
                                )}
                              >
                                <div className="flex items-center gap-2">
                                  <div
                                    className={cn(
                                      "h-3.5 w-3.5 rounded flex items-center justify-center border transition-colors",
                                      isDone
                                        ? "bg-emerald-500 border-emerald-600 text-white"
                                        : "bg-surface-2 border-line-card text-transparent"
                                    )}
                                  >
                                    <Check className="h-2.5 w-2.5 stroke-[3]" />
                                  </div>
                                  <span className={cn("font-medium", isDone && "line-through text-ink-muted")}>
                                    {milestone}
                                  </span>
                                </div>
                                <span className="text-[10px] font-bold text-ink-muted uppercase">
                                  {isDone ? "Done" : "Mark done"}
                                </span>
                              </button>
                            );
                          })}
                        </div>

                        {/* Bottom Note */}
                        <div className="rounded-xl border border-blue-200 bg-blue-50/80 p-2.5 text-xs flex items-center gap-2">
                          <div className="h-5 w-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-[10px] shrink-0">
                            AM
                          </div>
                          <p className="text-blue-900 text-[11px] leading-tight">
                            <span className="font-bold">Aarav (Supervisor): </span>
                            Wireframes look great! Keep 44px tap targets on checkout actions.
                          </p>
                        </div>
                      </div>
                    )}

                    {/* STEP 4: IT GETS REVIEWED */}
                    {currentStepIndex === 3 && (
                      <div className="flex flex-col justify-between h-full">
                        {/* Top Header */}
                        <div>
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">
                            Step 4: Quality Gate
                          </span>
                          <h4 className="text-base font-extrabold text-[#0A1A44]">
                            Supervisor QA & Client Clearance
                          </h4>
                        </div>

                        {/* Middle Content */}
                        <div className="rounded-2xl border border-line-card bg-surface-2/60 p-3.5 my-auto space-y-2">
                          <div className="flex items-center gap-2.5 text-xs text-emerald-950 font-medium bg-white p-2.5 rounded-xl border border-emerald-200">
                            <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>Deliverables matched to locked brief scope</span>
                          </div>

                          <div className="flex items-center gap-2.5 text-xs text-emerald-950 font-medium bg-white p-2.5 rounded-xl border border-emerald-200">
                            <div className="h-4 w-4 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                              <Check className="h-2.5 w-2.5 stroke-[3]" />
                            </div>
                            <span>Supervisor handles client sign-off (Zero client friction)</span>
                          </div>
                        </div>

                        {/* Bottom Note */}
                        <div className="rounded-xl border border-slate-200 bg-slate-900 p-2.5 text-white flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold block">Supervisor Sign-Off Complete</span>
                            <span className="text-[10px] text-white/70">Approved by Aarav Mehta</span>
                          </div>
                          <span className="text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded">
                            APPROVED
                          </span>
                        </div>
                      </div>
                    )}

                    {/* STEP 5: YOU GET PAID */}
                    {currentStepIndex === 4 && (
                      <div className="flex flex-col justify-between h-full text-center">
                        {/* Top Badge */}
                        <div>
                          <span className="text-xs font-black uppercase text-emerald-700 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded-full inline-block">
                            ⚡ Instant Bank Transfer Released
                          </span>
                        </div>

                        {/* Middle Content */}
                        <div className="rounded-2xl border-2 border-emerald-400/50 bg-emerald-50/40 p-3.5 my-auto">
                          <div className="flex items-center justify-center gap-2">
                            <Banknote className="h-5 w-5 text-emerald-600" />
                            <span className="text-2xl sm:text-3xl font-black text-[#0A1A44] font-mono">
                              ₹18,500.00
                            </span>
                          </div>
                          <span className="text-[11px] font-bold text-emerald-700 block mt-1">
                            Credited via UPI / IMPS • 0% Platform Cut
                          </span>

                          <div className="mt-2.5 rounded-xl border border-line-card bg-white p-2.5 text-xs space-y-1 text-left">
                            <div className="flex justify-between text-ink-2 text-[11px]">
                              <span>Agreed Brief Pay:</span>
                              <span className="font-mono font-bold text-ink">₹18,500</span>
                            </div>
                            <div className="flex justify-between text-emerald-600 font-medium text-[11px]">
                              <span>Dolancer Platform Fee:</span>
                              <span className="font-mono font-bold">₹0.00 (FREE)</span>
                            </div>
                            <div className="pt-1 border-t border-line-card flex justify-between font-extrabold text-xs text-[#0A1A44]">
                              <span>Net Credited to Bank:</span>
                              <span className="font-mono text-emerald-600 font-black">₹18,500</span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Action */}
                        <div>
                          <button
                            type="button"
                            onClick={() => scrollToStep(0)}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:text-primary-hover transition-colors cursor-pointer"
                          >
                            <RotateCcw className="h-3 w-3" />
                            <span>Replay walkthrough from Step 1</span>
                          </button>
                        </div>
                      </div>
                    )}

                  </motion.div>
                </AnimatePresence>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-line-card flex items-center justify-between gap-3 shrink-0">
                  <div className="text-xs text-ink-muted font-medium">
                    <span className="font-bold text-ink">Step {currentStepIndex + 1} of 5</span>
                    <span className="mx-1.5">•</span>
                    <span>{currentStep.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => scrollToStep(currentStepIndex - 1)}
                        className="rounded-xl border border-line-card bg-surface-2 px-3 py-1.5 text-xs font-bold text-ink hover:bg-surface transition-all cursor-pointer"
                      >
                        ← Back
                      </button>
                    )}

                    {currentStepIndex < 4 ? (
                      <button
                        type="button"
                        onClick={() => scrollToStep(currentStepIndex + 1)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-[#0A1A44] hover:bg-primary px-4 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <span>
                          {currentStepIndex === 0
                            ? "Accept Brief & Attach Link →"
                            : currentStepIndex === 1
                              ? "Save Link & Start Work →"
                              : currentStepIndex === 2
                                ? "Submit for Review →"
                                : "Release Bank Payout →"}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scrollToStep(0)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-1.5 text-xs font-bold text-white transition-all shadow-sm active:scale-95 cursor-pointer"
                      >
                        <RotateCcw className="h-3 w-3" />
                        <span>Restart</span>
                      </button>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

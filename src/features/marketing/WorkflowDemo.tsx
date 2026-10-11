import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { Banknote, Calendar, Check, Link2, Lock, RotateCcw, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * One example project, followed from offer to payout.
 *
 * This is the only place on the page that tells the project story, so every panel
 * has to match what the product really does: the status names are the ones a doer
 * sees in the app, the working file is a company workspace the supervisor shares,
 * the supervisor is a role and never a named person, and the last
 * step promises no speed and no "nothing deducted", because payout waits on the
 * approval gate and tax is withheld where the law requires it.
 *
 * On large screens the panel pins and scrolling walks the steps. Below that the
 * pinned panel is taller than a phone screen, so the steps are laid out one under
 * another instead.
 */
const STEPS = [
  {
    stepNum: "01",
    title: "An offer arrives",
    subtitle: "A brief with fixed pay, sent only to you",
    status: "New offer",
    dot: "bg-info-dot",
    action: "Accept offer",
  },
  {
    stepNum: "02",
    title: "You get your workspace",
    subtitle: "Your supervisor shares the file",
    status: "In progress",
    dot: "bg-info-dot",
    action: "Open workspace",
  },
  {
    stepNum: "03",
    title: "You do the work",
    subtitle: "Update progress, ask your supervisor",
    status: "In progress",
    dot: "bg-info-dot",
    action: "Submit for review",
  },
  {
    stepNum: "04",
    title: "It gets reviewed",
    subtitle: "Supervisor first, then the client",
    status: "Submitted",
    dot: "bg-warning-dot",
    action: "See the payout",
  },
  {
    stepNum: "05",
    title: "You get paid",
    subtitle: "To your bank or UPI, with a receipt",
    status: "Paid",
    dot: "bg-success-dot",
    action: null,
  },
] as const;

const PARTS = ["Colour and type tokens", "8 finished screens", "Clickable prototype and export"];

function SupervisorNote({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl border border-line-card bg-surface-2/70 p-2.5">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-white">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <p className="text-xs leading-snug text-ink-2">
        <span className="font-bold text-ink">Supervisor: </span>
        {children}
      </p>
    </div>
  );
}

function PanelHeading({ label, title, aside }: { label: string; title: string; aside?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">{label}</span>
        <h4 className="text-base font-extrabold leading-snug text-ink">{title}</h4>
      </div>
      {aside}
    </div>
  );
}

function StepPanel({
  index,
  doneParts,
  onTogglePart,
  className,
}: {
  index: number;
  doneParts: number[];
  onTogglePart: (part: number) => void;
  className?: string;
}) {
  const wrap = cn("flex flex-col gap-3", className);

  if (index === 0) {
    return (
      <div className={wrap}>
        <div className="flex items-center justify-between gap-2 rounded-xl border border-primary/20 bg-primary-light px-3.5 py-2 text-xs font-bold text-info-ink">
          <span className="flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5" aria-hidden="true" />
            Private offer, sent only to you
          </span>
          <span className="shrink-0 rounded bg-white px-2 py-0.5 text-[11px]">No bidding</span>
        </div>

        <div className="rounded-2xl border border-line-card bg-surface-2/60 p-3.5">
          <div className="flex items-start justify-between gap-3 border-b border-line-card/60 pb-2.5">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-primary">Brief</span>
              <h4 className="text-base font-extrabold leading-snug text-ink">
                Fintech mobile app UI and design system
              </h4>
            </div>
            <div className="shrink-0 text-right">
              <span className="block text-2xs font-bold uppercase text-ink-muted">Your payout</span>
              <span className="block text-2xl font-black tabular-nums text-success-ink">₹18,500</span>
              <span className="block text-2xs font-medium text-ink-muted">before tax</span>
            </div>
          </div>
          <ul className="mt-2.5 space-y-1.5 text-xs text-ink">
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />8 mobile screens in Figma
            </li>
            <li className="flex items-center gap-2">
              <Check className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
              Colour, type and spacing tokens
            </li>
            <li className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-warning-dot" aria-hidden="true" />
              Due in 4 days
            </li>
          </ul>
        </div>

        <SupervisorNote>The scope is confirmed. Accept it only if the deadline works for you.</SupervisorNote>
      </div>
    );
  }

  if (index === 1) {
    return (
      <div className={wrap}>
        <PanelHeading label="Company workspace" title="Your supervisor shares the file you work in" />

        <div className="space-y-2.5 rounded-2xl border border-line-card bg-surface-2/60 p-3.5">
          <div className="flex items-center gap-2 rounded-xl border-2 border-primary/40 bg-white p-2">
            <Link2 className="ml-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate font-mono text-xs text-ink">
              figma.com/file/dl-9482/fintech-app
            </span>
            <span className="flex shrink-0 items-center gap-1 rounded-lg bg-success-bg px-2 py-0.5 text-[10px] font-bold text-success-ink">
              <Check className="h-3 w-3" aria-hidden="true" />
              Ready
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-2xs font-medium text-ink-muted">
            <span>Could be a file in</span>
            {["Figma", "GitHub", "Notion", "Drive"].map((tool) => (
              <span key={tool} className="rounded border border-line-card bg-white px-2 py-0.5 text-ink">
                {tool}
              </span>
            ))}
          </div>
        </div>

        <div className="grid gap-2.5 sm:grid-cols-2">
          <div className="flex items-center gap-2 rounded-xl border border-line-card bg-white p-2.5 text-[11px] font-medium text-ink">
            <Lock className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            Your name is never shown to the client
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-line-card bg-white p-2.5 text-[11px] font-medium text-ink">
            <Check className="h-3.5 w-3.5 shrink-0 text-success-dot" aria-hidden="true" />
            Work starts as soon as the link appears
          </div>
        </div>
      </div>
    );
  }

  if (index === 2) {
    return (
      <div className={wrap}>
        <PanelHeading
          label="In progress"
          title="Tick off each part as you finish it"
          aside={
            <span className="shrink-0 rounded-full border border-primary/20 bg-primary-light px-2.5 py-0.5 text-xs font-bold tabular-nums text-info-ink">
              {Math.round((doneParts.length / PARTS.length) * 100)}% done
            </span>
          }
        />

        <div className="space-y-1.5 rounded-2xl border border-line-card bg-surface-2/60 p-2.5">
          {PARTS.map((part, partIndex) => {
            const isDone = doneParts.includes(partIndex);
            return (
              <button
                key={part}
                type="button"
                aria-pressed={isDone}
                onClick={() => onTogglePart(partIndex)}
                className={cn(
                  "flex w-full cursor-pointer items-center justify-between rounded-xl border p-2 text-left text-xs transition-colors",
                  isDone ? "border-success-dot/50 bg-white text-ink" : "border-line-card bg-white/70 text-ink-2 hover:bg-white",
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex h-3.5 w-3.5 items-center justify-center rounded border",
                      isDone ? "border-success-dot bg-success-dot text-white" : "border-line-card bg-surface-2 text-transparent",
                    )}
                  >
                    <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
                  </span>
                  <span className={cn("font-medium", isDone && "text-ink-muted line-through")}>{part}</span>
                </span>
                <span className="text-[10px] font-bold uppercase text-ink-muted">{isDone ? "Done" : "Mark done"}</span>
              </button>
            );
          })}
        </div>

        <SupervisorNote>Screens look good. Keep the pay button easy to reach with one thumb.</SupervisorNote>
      </div>
    );
  }

  if (index === 3) {
    return (
      <div className={wrap}>
        <PanelHeading label="Review" title="Two checks. You deal with one person." />

        <div className="space-y-2 rounded-2xl border border-line-card bg-surface-2/60 p-3.5">
          {[
            ["Supervisor review", "It matches the brief"],
            ["Client approval", "Your supervisor handles it for you"],
          ].map(([check, detail]) => (
            <div key={check} className="flex items-center gap-2.5 rounded-xl border border-success-dot/40 bg-white p-2.5 text-xs">
              <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-success-dot text-white">
                <Check className="h-2.5 w-2.5 stroke-[3]" aria-hidden="true" />
              </span>
              <span className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                <span className="font-bold text-ink">{check}</span>
                <span className="text-ink-muted">{detail}</span>
              </span>
            </div>
          ))}
          <p className="px-1 text-[11px] leading-snug text-ink-muted">
            If something needs changing, your supervisor tells you exactly what.
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 rounded-xl bg-ink p-2.5 text-white">
          <div>
            <span className="block text-xs font-bold">Approved</span>
            <span className="block text-[10px] text-white/70">Your payout is being released</span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-0.5 text-[10px] font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-success-dot" />
            Both checks passed
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={wrap}>
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-0.5 text-xs font-extrabold text-success-ink">
          <Check className="h-3.5 w-3.5" aria-hidden="true" />
          Paid to your bank
        </span>
      </div>

      <div className="rounded-2xl border-2 border-success-dot/40 bg-success-bg/40 p-3.5">
        <div className="flex items-center justify-center gap-2">
          <Banknote className="h-5 w-5 text-success-ink" aria-hidden="true" />
          <span className="text-2xl font-black tabular-nums text-ink sm:text-3xl">₹18,500</span>
        </div>
        <span className="mt-0.5 block text-center text-[11px] font-bold text-success-ink">
          The pay you agreed to in step 1
        </span>

        <dl className="mt-2.5 space-y-1 rounded-xl border border-line-card bg-white p-2.5 text-[11px]">
          <div className="flex justify-between gap-3">
            <dt className="text-ink-2">Sent to</dt>
            <dd className="font-mono font-bold text-ink">UPI •••• 4910</dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink-2">Receipt</dt>
            <dd className="font-bold text-ink">On your earnings page</dd>
          </div>
        </dl>
      </div>

      <p className="text-center text-[11px] leading-snug text-ink-muted">
        Nothing is cut from your agreed pay except tax the law requires. Your receipt shows gross, tax
        and net.
      </p>
    </div>
  );
}

function StatusPill({ index, onDark = false }: { index: number; onDark?: boolean }) {
  const step = STEPS[index] ?? STEPS[0];
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
        onDark ? "bg-white/10 text-white" : "bg-surface-2 text-ink-2",
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", step.dot)} />
      {step.status}
    </span>
  );
}

export function WorkflowDemo() {
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [doneParts, setDoneParts] = useState<number[]>([0, 1]);

  const containerRef = useRef<HTMLDivElement>(null);
  const currentStep = STEPS[currentStepIndex] ?? STEPS[0];
  const lastIndex = STEPS.length - 1;

  // Smooth Scroll Progress Binding
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const nextStep = Math.min(lastIndex, Math.max(0, Math.floor(latest * STEPS.length)));
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
      behavior: "smooth",
    });
    setCurrentStepIndex(targetIndex);
  };

  const togglePart = (part: number) => {
    setDoneParts((prev) => (prev.includes(part) ? prev.filter((i) => i !== part) : [...prev, part]));
  };

  return (
    <div ref={containerRef} className="relative w-full lg:h-[300vh]">
      {/* Pinned under the site header, which is 72px tall and sticky itself */}
      <div className="py-14 lg:sticky lg:top-[84px] lg:z-10 lg:flex lg:min-h-[calc(100vh-96px)] lg:flex-col lg:justify-center lg:py-2">
        {/* Section Header */}
        <div className="border-b border-line-card/80 pb-4">
          <h2 id="walkthrough" className="scroll-mt-24 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-4xl">
            What a project <span className="text-primary">actually looks like</span>
          </h2>
          <p className="mt-1.5 text-xs font-medium text-ink-2 sm:text-sm">
            Follow one example project from offer to payout.
          </p>
        </div>

        {/* Large screens: steps on the left, the project window on the right */}
        <div className="mt-5 hidden grid-cols-12 items-stretch gap-5 lg:grid">
          <div className="col-span-4 flex flex-col justify-between gap-2" role="tablist" aria-label="Project steps">
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
                    aria-controls="walkthrough-panel"
                    onClick={() => scrollToStep(idx)}
                    className={cn(
                      "group relative flex cursor-pointer items-center gap-3 rounded-2xl border p-3.5 text-left transition-all duration-200",
                      isActive
                        ? "border-primary/40 bg-white shadow-md ring-2 ring-primary/10"
                        : "border-line-card/60 bg-surface/60 hover:border-line-card hover:bg-white",
                    )}
                  >
                    {/* Active Left Indicator Bar */}
                    {isActive && (
                      <motion.div
                        layoutId="activeStepIndicator"
                        className="absolute bottom-3 left-0 top-3 w-1.5 rounded-r-full bg-primary"
                        transition={{ type: "spring", stiffness: 350, damping: 30 }}
                      />
                    )}

                    <div
                      className={cn(
                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-xl text-xs font-black transition-all",
                        isActive
                          ? "bg-primary text-white"
                          : isPassed
                            ? "bg-success-bg text-success-ink"
                            : "border border-line-card bg-surface-2 text-ink-muted group-hover:text-ink",
                      )}
                    >
                      {isPassed ? <Check className="h-3.5 w-3.5 stroke-[3]" aria-hidden="true" /> : step.stepNum}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className={cn("text-sm font-extrabold tracking-tight", isActive ? "text-primary" : "text-ink")}>
                        {step.title}
                      </h3>
                      <p className="truncate text-[11px] font-medium text-ink-muted">{step.subtitle}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2.5 rounded-xl border border-line-card bg-surface-2/60 p-2.5">
              <ShieldCheck className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <p className="text-[11px] font-medium text-ink-2">One supervisor stays with you from offer to payout.</p>
            </div>
          </div>

          <div className="col-span-8">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border border-line-card bg-white shadow-xl shadow-slate-200/50">
              {/* Window Header */}
              <div className="flex shrink-0 items-center justify-between gap-3 bg-ink px-5 py-2.5 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="rounded border border-white/10 bg-white/10 px-2 py-0.5 font-mono text-[11px] font-bold">
                    #DL-9482
                  </span>
                  <span className="text-xs font-medium text-white/70">UI/UX Design</span>
                </div>
                <StatusPill index={currentStepIndex} onDark />
              </div>

              {/* Window Content Body with Unified Fixed Height */}
              <div id="walkthrough-panel" role="tabpanel" className="flex h-[390px] flex-col justify-between overflow-hidden p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStepIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="flex flex-1 flex-col pb-4"
                  >
                    <StepPanel
                      index={currentStepIndex}
                      doneParts={doneParts}
                      onTogglePart={togglePart}
                      className="h-full justify-between"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Bottom Action Footer */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line-card pt-3">
                  <div className="text-xs font-medium text-ink-muted">
                    <span className="font-bold text-ink">
                      Step {currentStepIndex + 1} of {STEPS.length}
                    </span>
                    <span className="mx-1.5">•</span>
                    <span>{currentStep.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {currentStepIndex > 0 && (
                      <button
                        type="button"
                        onClick={() => scrollToStep(currentStepIndex - 1)}
                        className="cursor-pointer rounded-xl border border-line-card bg-surface-2 px-3 py-1.5 text-xs font-bold text-ink transition-all hover:bg-surface"
                      >
                        Back
                      </button>
                    )}

                    {currentStep.action ? (
                      <button
                        type="button"
                        onClick={() => scrollToStep(currentStepIndex + 1)}
                        className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
                      >
                        {currentStep.action}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => scrollToStep(0)}
                        className="inline-flex cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-primary px-4 py-1.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
                      >
                        <RotateCcw className="h-3 w-3" aria-hidden="true" />
                        Start again
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Phones and tablets: every step in order, nothing pinned */}
        <ol className="mt-6 space-y-4 lg:hidden">
          {STEPS.map((step, idx) => (
            <li key={step.stepNum} className="overflow-hidden rounded-2xl border border-line-card bg-white shadow-soft-sm">
              <div className="flex items-center gap-3 border-b border-line-card bg-surface-2/60 px-4 py-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-xl bg-primary text-xs font-black text-white">
                  {step.stepNum}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-extrabold tracking-tight text-ink">{step.title}</h3>
                  <p className="text-[11px] font-medium text-ink-muted">{step.subtitle}</p>
                </div>
                <StatusPill index={idx} />
              </div>
              <div className="p-4">
                <StepPanel index={idx} doneParts={doneParts} onTogglePart={togglePart} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

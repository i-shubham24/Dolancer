import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, Clock, FileText, Link2Off } from "lucide-react";
import { cn } from "@/lib/cn";
import { countdownParts, deadlineUrgency, timeAgo } from "@/lib/datetime";
import { taskTitle } from "@/lib/task-title";
import { statusDisplay } from "@/lib/status";
import { isHttpsUrl } from "@/lib/validations";
import { preloadWorkbench } from "@/lib/preload";
import { Button } from "@/components/ui/button";
import { CountUp } from "@/components/common/CountUp";
import type { DoerProject, StatusTone } from "@/types/domain";
import { formatDayShort, formatTime } from "@/features/calendar/dates";
import { Panel } from "@/components/app/ui";

function Label() {
  return (
    <span id="up-next" className="flex items-center gap-2 text-[13px] font-bold tracking-tight text-ink-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-info-bg text-primary" aria-hidden="true">
        <Clock className="h-4 w-4" />
      </span>
      Next to submit
    </span>
  );
}

/** One unit of the countdown. A changed number rolls up into place. */
function Unit({ value, label }: { value: number; label: string }) {
  const reduceMotion = useReducedMotion();
  const text = String(value).padStart(2, "0");
  return (
    <span className="flex w-[60px] flex-col items-center rounded-2xl bg-panel/70 py-2.5 @md:w-[56px] @lg:w-[64px] @xl:w-[72px] @xl:py-3">
      <span className="relative h-[30px] w-full overflow-hidden text-center text-[24px] font-extrabold leading-[30px] tabular-nums tracking-[-0.02em] @md:text-[22px] @lg:text-[25px] @xl:h-[34px] @xl:text-[28px] @xl:leading-[34px]">
        <AnimatePresence initial={false} mode="popLayout">
          <motion.span
            key={text}
            className="absolute inset-0"
            initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            exit={reduceMotion ? undefined : { y: "-100%", opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {text}
          </motion.span>
        </AnimatePresence>
      </span>
      <span className="mt-1 text-[10px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">{label}</span>
    </span>
  );
}

/** Days, hours, minutes and seconds to the deadline, ticking every second. */
function Countdown({ deliveryAt }: { deliveryAt: string | null }) {
  const [parts, setParts] = useState(() => countdownParts(deliveryAt));
  useEffect(() => {
    const tick = () => setParts(countdownParts(deliveryAt));
    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [deliveryAt]);

  if (!deliveryAt) return null;
  if (!parts) {
    return (
      <p className="flex items-center gap-2 text-sm font-extrabold text-danger-ink">
        <span className="h-2 w-2 animate-pulse rounded-full bg-danger-dot" aria-hidden="true" />
        {deadlineUrgency(deliveryAt) === "overdue" ? "Past the deadline. Tell your supervisor where it stands." : "Due now"}
      </p>
    );
  }
  const urgent = parts.days === 0 && parts.hours < 24;
  return (
    <div role="timer" aria-label={`${parts.days} days, ${parts.hours} hours and ${parts.minutes} minutes left`}>
      <div className={cn("flex gap-2", urgent && "[&>span]:bg-danger-bg [&>span]:text-danger-ink")}>
        <Unit value={parts.days} label="days" />
        <Unit value={parts.hours} label="hrs" />
        <Unit value={parts.minutes} label="min" />
        <Unit value={parts.seconds} label="sec" />
      </div>
    </div>
  );
}

/** A full ring that draws itself to the share done, with the number in the middle. */
function ProgressRing({ value, label, tone }: { value: number; label: string; tone: string }) {
  const reduceMotion = useReducedMotion();
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div
      className="relative h-[150px] w-[150px] shrink-0 @md:h-[120px] @md:w-[120px] @lg:h-[150px] @lg:w-[150px] @xl:h-[170px] @xl:w-[170px] @2xl:h-[190px] @2xl:w-[190px]"
      role="img"
      aria-label={`${Math.round(clamped)}% ${label}`}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="60" cy="60" r="51" fill="none" stroke="var(--color-panel)" strokeWidth="11" />
        <motion.circle
          cx="60"
          cy="60"
          r="51"
          fill="none"
          stroke={tone}
          strokeWidth="11"
          strokeLinecap="round"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: clamped / 100 }}
          transition={{ duration: 1.2, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-[30px] font-extrabold leading-none tracking-[-0.04em] tabular-nums @md:text-[24px] @lg:text-[30px] @xl:text-[34px]">
          <CountUp value={clamped} format={(n) => `${Math.round(n)}%`} delay={0.45} duration={1.2} />
        </span>
        <span className="mt-1 text-xs font-bold text-ink-muted">{label}</span>
      </span>
    </div>
  );
}

/** One dot colour per status tone, the same signals the work list uses. */
const TONE_DOT: Record<StatusTone, string> = {
  assigned: "bg-ink-3",
  progress: "bg-warning-dot",
  review: "bg-primary",
  approved: "bg-success-dot",
  changes: "bg-danger-dot",
};
const TONE_TEXT: Record<StatusTone, string> = {
  assigned: "text-ink-2",
  progress: "text-warning-ink",
  review: "text-primary",
  approved: "text-success-ink",
  changes: "text-danger-ink",
};

const STEPS = ["Accepted", "Working", "With supervisor", "Approved", "Paid"] as const;

/** Where a task stands in its life, as an index into STEPS. */
function stepFor(status: DoerProject["status"]): number {
  if (status === "claimed" || status === "quoted") return 0;
  if (status === "paid" || status === "in_progress") return 1;
  if (status === "in_review" || status === "delivered") return 2;
  if (status === "approved") return 3;
  return 0;
}

/** The five steps of a task, the line filling up to where this one is. */
function TaskSteps({ current }: { current: number }) {
  const reduceMotion = useReducedMotion();
  const share = current / (STEPS.length - 1);
  return (
    <ol className="relative grid grid-cols-5" aria-label={`Step ${current + 1} of ${STEPS.length}: ${STEPS[current]}`}>
      <span className="absolute left-[10%] right-[10%] top-[7px] h-[3px] rounded-full bg-panel" aria-hidden="true" />
      <motion.span
        className="absolute left-[10%] top-[7px] h-[3px] origin-left rounded-full bg-primary"
        style={{ width: "80%" }}
        initial={reduceMotion ? false : { scaleX: 0 }}
        animate={{ scaleX: share }}
        transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        aria-hidden="true"
      />
      {STEPS.map((step, index) => (
        <li key={step} className="relative flex flex-col items-center gap-2 text-center">
          <span
            className={cn(
              "h-[17px] w-[17px] rounded-full border-[3px]",
              index < current && "border-primary bg-primary",
              index === current && "border-primary bg-white ring-4 ring-primary/15",
              index > current && "border-line-card bg-white",
            )}
            aria-hidden="true"
          />
          <span className={cn("text-[11px] font-bold leading-tight", index <= current ? "text-ink" : "text-ink-muted")}>{step}</span>
        </li>
      ))}
    </ol>
  );
}

/**
 * The next task to finish and submit, and only the work: how far along it is, how long is left,
 * and where it stands. The ring sits beside the countdown when there is room and
 * above it when there is not. Pay lives on the Earnings tab, not here.
 */
export function UpNextCard({
  project,
  loading,
  unlocked,
  withSupervisor = 0,
}: {
  project: DoerProject | null;
  loading: boolean;
  unlocked: boolean;
  /** Tasks already submitted and waiting on the supervisor. */
  withSupervisor?: number;
}) {
  if (loading) {
    return (
      <Panel className="[grid-area:next]" aria-busy="true">
        <div className="skeleton h-8 w-28 rounded-xl" />
        <div className="skeleton mt-4 h-6 w-3/4" />
        <div className="mt-4 flex gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="skeleton h-[68px] w-[60px] rounded-2xl" />
          ))}
        </div>
        <div className="min-h-4 flex-1" />
        <div className="skeleton h-11 w-36 rounded-full" />
      </Panel>
    );
  }

  if (!project) {
    return (
      <Panel className="[grid-area:next]" aria-labelledby="up-next">
        <Label />
        {/* Centred in the spare height, so a tall row reads as calm rather than empty. */}
        <div className="flex flex-1 flex-col items-center justify-center py-8 text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-success-bg text-success-ink" aria-hidden="true">
            <CheckCircle2 className="h-8 w-8" />
          </span>
          <p className="mt-4 text-xl font-extrabold leading-snug tracking-[-0.025em]">Nothing left to submit</p>
          <p className="mt-1.5 max-w-sm text-sm text-ink-2">
          {withSupervisor > 0
            ? `${withSupervisor === 1 ? "Your task is" : `${withSupervisor} tasks are`} with your supervisor. You will hear back here.`
            : unlocked
              ? "Accept an offer and it shows here with its deadline."
              : "Finish verification and your first offers can arrive."}
          </p>
        </div>
        <Button asChild className="self-center">
          <Link to={withSupervisor > 0 ? "/work" : unlocked ? "/pool" : "/verification"}>
            {withSupervisor > 0 ? "See your work" : unlocked ? "See offers" : "Get verified"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </Panel>
    );
  }

  const due = project.deliveryAt ? new Date(project.deliveryAt) : null;
  const review = project.status === "in_review" || project.status === "delivered";
  const progress = review ? 100 : Math.max(0, Math.min(100, project.progressPct));
  const status = statusDisplay(project.status, project.workingDocUrl);
  const needsLink = status.label === "Link needed";
  const docUrl = isHttpsUrl(project.workingDocUrl) ? project.workingDocUrl : null;
  // At 100% the next move is sending it in, so the button says so and lands on the form.
  const readyToSubmit = project.status === "in_progress" && progress >= 100 && !needsLink;

  return (
    <Panel className="@container [grid-area:next]" aria-labelledby="up-next">
      <div className="flex items-start justify-between gap-3">
        <Label />
        <span className="pt-2 text-xs font-semibold text-ink-muted">Updated {timeAgo(project.updatedAt)}</span>
      </div>
      <h3 className="mt-4 line-clamp-2 text-xl font-extrabold leading-[1.2] tracking-[-0.03em] @lg:text-[24px]">{taskTitle(project)}</h3>
      <p className="mt-2 flex flex-wrap items-center gap-x-3.5 gap-y-1 text-[12.5px]">
        <span className={cn("inline-flex items-center gap-1.5 font-extrabold", TONE_TEXT[status.tone])}>
          <span className={cn("h-2 w-2 rounded-full", TONE_DOT[status.tone])} aria-hidden="true" />
          {status.label}
        </span>
        <span className="font-semibold text-ink-muted">{project.category}</span>
      </p>

      {/* The middle takes the spare height, so a tall row reads as room, not a gap. */}
      {/* Ring and countdown share a row from a mid-size card up; only phones stack them. */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 py-6 @md:flex-row @md:justify-start @md:gap-6 @xl:gap-8">
        <ProgressRing value={progress} label={review ? "sent" : "done"} tone={review ? "var(--color-highlight)" : "var(--color-primary)"} />
        <div className="flex min-w-0 flex-col items-center gap-3 @md:items-start">
          {review ? (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">Now</p>
              <p className="max-w-xs text-center text-[15px] font-bold text-ink @md:text-left">
                Your supervisor is checking it. You will hear back here.
              </p>
            </>
          ) : (
            <>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.08em] text-ink-muted">Time left</p>
              <Countdown deliveryAt={project.deliveryAt} />
            </>
          )}
          <p className="text-[13px] font-bold">{due ? `Due ${formatDayShort(due)}, ${formatTime(due)}` : "No deadline set"}</p>
          {needsLink ? (
            <p className="flex items-start gap-2 rounded-xl bg-warning-bg px-3 py-2 text-xs font-bold text-warning-ink">
              <Link2Off className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              Waiting for your supervisor to add the working link.
            </p>
          ) : null}
        </div>
      </div>

      <div className="mb-5 rounded-2xl bg-panel/50 px-2 pb-3 pt-3.5">
        <TaskSteps current={stepFor(project.status)} />
      </div>

      <div className="flex flex-wrap gap-2.5">
        <Button asChild>
          <Link
            to={readyToSubmit ? `/work/${project.id}#submit` : `/work/${project.id}`}
            onMouseEnter={preloadWorkbench}
            onFocus={preloadWorkbench}
          >
            {readyToSubmit ? "Submit work" : project.status === "in_progress" ? "Continue task" : "Open task"}
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
        {docUrl ? (
          <Button asChild variant="outline">
            <a href={docUrl} target="_blank" rel="noopener noreferrer">
              <FileText className="h-4 w-4" aria-hidden="true" />
              Working doc
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Button>
        ) : null}
      </div>
    </Panel>
  );
}

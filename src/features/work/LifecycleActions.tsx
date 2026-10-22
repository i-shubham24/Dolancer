import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Check, CheckCircle2, Hourglass, Info, Play, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Gauge } from "@/components/app/Gauge";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { cn } from "@/lib/cn";
import { workbenchGates } from "@/lib/status";
import type { DoerProject } from "@/types/domain";
import { useStartWork, useSubmitForReview, useSetProgress } from "./queries";

/**
 * Progress: a gauge for where the work is, and a slider to record a new figure.
 * Before work starts it holds the Start button instead; after submission it just
 * shows the work as sent.
 */
export function ProgressCard({ project }: { project: DoerProject }) {
  const gates = workbenchGates(project);
  const [pct, setPct] = useState(project.progressPct);
  const start = useStartWork(project.id);
  const progress = useSetProgress(project.id);
  const review = project.status === "in_review" || project.status === "delivered";
  const approved = project.status === "approved";
  const busy = start.isPending || progress.isPending;

  return (
    <motion.section variants={cardMotion} className={cn(CARD, "gap-4")} aria-labelledby="progress-title">
      <div className="flex items-center justify-between gap-3">
        <h2 id="progress-title" className="text-[15px] font-extrabold tracking-[-0.02em]">
          Progress
        </h2>
        {project.status === "in_progress" && pct !== project.progressPct ? (
          <span className="rounded-full bg-warning-bg px-2.5 py-1 text-[11px] font-bold text-warning-ink">Not saved</span>
        ) : null}
      </div>

      <Gauge
        value={review || approved ? 100 : project.status === "in_progress" ? pct : project.progressPct}
        tone={approved ? "var(--color-success-dot)" : review ? "var(--color-highlight)" : "var(--color-primary)"}
        label={approved ? "Approved" : review ? "Sent for review" : "Done so far"}
        delay={0.35}
      />

      {project.status === "in_progress" ? (
        <div className="space-y-3">
          <label htmlFor="progress" className="sr-only">
            Progress percent
          </label>
          <input
            id="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={pct}
            disabled={!gates.canSetProgress || busy}
            onChange={(event) => setPct(Number(event.target.value))}
            className="range-input"
            style={{ "--fill": `${pct}%` } as React.CSSProperties}
          />
          <div className="flex justify-between text-[11px] font-bold text-ink-3" aria-hidden="true">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
          <Button
            variant="outline"
            className="w-full"
            disabled={!gates.canSetProgress || busy || pct === project.progressPct}
            onClick={() => void progress.mutateAsync(pct)}
          >
            {progress.isPending ? "Saving..." : `Save ${pct}%`}
          </Button>
        </div>
      ) : gates.canStart ? (
        <Button size="lg" className="w-full" onClick={() => void start.mutateAsync()} disabled={busy}>
          <Play className="h-4 w-4" aria-hidden="true" />
          {start.isPending ? "Starting..." : "Start work"}
        </Button>
      ) : project.status === "paid" && !gates.hasWorkingDoc ? (
        <p className="flex items-start gap-2 rounded-xl bg-warning-bg px-3 py-2.5 text-xs font-bold text-warning-ink">
          <Hourglass className="mt-px h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          You can start once the workspace link is added.
        </p>
      ) : null}
    </motion.section>
  );
}

function CheckRow({
  done,
  label,
  onToggle,
}: {
  done: boolean;
  label: string;
  /** Present only for the item the doer ticks themselves. */
  onToggle?: () => void;
}) {
  const box = (
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center rounded-lg transition-colors",
        done ? "bg-success-dot text-white" : "bg-white ring-2 ring-line-subtle",
      )}
      aria-hidden="true"
    >
      {done ? (
        <motion.span initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 500, damping: 20 }}>
          <Check className="h-3.5 w-3.5" strokeWidth={3} />
        </motion.span>
      ) : null}
    </span>
  );
  if (onToggle) {
    return (
      <li>
        <button
          type="button"
          role="checkbox"
          aria-checked={done}
          onClick={onToggle}
          className="flex w-full items-center gap-3 rounded-xl bg-panel/60 px-3 py-2.5 text-left text-[13px] font-bold text-ink transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
        >
          {box}
          {label}
        </button>
      </li>
    );
  }
  return (
    <li className={cn("flex items-center gap-3 rounded-xl bg-panel/60 px-3 py-2.5 text-[13px] font-bold", done ? "text-ink" : "text-ink-muted")}>
      {box}
      {label}
    </li>
  );
}

/**
 * Before you submit: two checks the app fills in from the real state, one the doer
 * ticks themselves, then Submit. Only the doer's own tick and the existing gates
 * decide the button.
 */
export function SubmitCard({ project }: { project: DoerProject }) {
  const gates = workbenchGates(project);
  const [checked, setChecked] = useState(false);
  const submit = useSubmitForReview(project.id);
  const review = project.status === "in_review" || project.status === "delivered";
  const formRef = useRef<HTMLElement>(null);

  // "Submit work" on the dashboard links here with #submit; the page loads after the
  // link is followed, so the scroll happens once this card is on screen.
  useEffect(() => {
    if (window.location.hash !== "#submit" || !formRef.current) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    formRef.current.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
  }, []);

  if (project.status === "approved") {
    return (
      <StatusCard
        tone="success"
        title="Approved"
        body="This one is done. Your payout shows in Earnings once it is released."
      />
    );
  }
  if (review) {
    return (
      <StatusCard
        tone="review"
        title={project.status === "in_review" ? "With your supervisor" : "Checked, awaiting approval"}
        body="They will reply in the chat if anything needs changing."
        checks={["Working link in", "Work submitted", ...(project.status === "delivered" ? ["Supervisor check done"] : [])]}
      />
    );
  }
  if (project.status !== "in_progress") return null;

  return (
    <motion.section ref={formRef} id="submit" variants={cardMotion} className={cn(CARD, "gap-3")} aria-labelledby="submit-title">
      <h2 id="submit-title" className="text-[15px] font-extrabold tracking-[-0.02em]">
        Before you submit
      </h2>
      <ul className="space-y-2">
        <CheckRow done={gates.hasWorkingDoc} label={gates.hasWorkingDoc ? "Working link is in" : "Working link still missing"} />
        <CheckRow done label={`Progress saved at ${project.progressPct}%`} />
        <CheckRow done={checked} label="I checked my work against the brief" onToggle={() => setChecked((value) => !value)} />
      </ul>
      <Button size="lg" className="w-full" disabled={!gates.canSubmit || !checked || submit.isPending} onClick={() => void submit.mutateAsync()}>
        <Send className="h-4 w-4" aria-hidden="true" />
        {submit.isPending ? "Submitting..." : "Submit for review"}
      </Button>
      {gates.blockedReason ? (
        <p className="flex items-start gap-1.5 text-[11.5px] font-semibold leading-snug text-warning-ink">
          <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {gates.blockedReason}
        </p>
      ) : (
        // The mistake this setup invites: sending files in chat and thinking that counted.
        <p className="text-[11.5px] font-medium text-ink-muted">Files sent in chat do not count as a submission.</p>
      )}
    </motion.section>
  );
}

function StatusCard({
  tone,
  title,
  body,
  checks = [],
}: {
  tone: "success" | "review";
  title: string;
  body: string;
  checks?: string[];
}) {
  return (
    <motion.section
      variants={cardMotion}
      className={cn(CARD, "gap-3", tone === "success" ? "bg-success-bg ring-success-dot/20" : "bg-highlight-light ring-highlight/15")}
    >
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white",
            tone === "success" ? "text-success-ink" : "text-highlight",
          )}
          aria-hidden="true"
        >
          <CheckCircle2 className="h-5 w-5" />
        </span>
        <div>
          <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">{title}</h2>
          <p className="text-xs font-medium text-ink-2">{body}</p>
        </div>
      </div>
      {checks.length > 0 ? (
        <ul className="space-y-1.5">
          {checks.map((label) => (
            <li key={label} className="flex items-center gap-2 text-xs font-bold text-success-ink">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              {label}
            </li>
          ))}
        </ul>
      ) : null}
    </motion.section>
  );
}

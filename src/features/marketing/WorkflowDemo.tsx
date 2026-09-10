import { useState } from "react";
import { useCursorTilt } from "@/lib/useCursorTilt";
import { Link2, Play, Send, Check, Wallet } from "lucide-react";
import { cn } from "@/lib/cn";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { CategoryPill } from "@/components/brutal/Pill";
import type { StatusTone } from "@/types/domain";

/**
 * An interactive walk through what actually happens to a project.
 *
 * This renders the real StatusBadge and pill components in the real states, so a
 * visitor is looking at the product rather than at a drawing of it. Clicking a step
 * moves the panel; nothing here talks to the backend.
 *
 * The figures are marked as an example on the panel itself. There is deliberately
 * no per-discipline rate anywhere: pay reflects the individual brief, and
 * publishing category rates would let anyone work backwards to client pricing.
 */

interface Stage {
  id: string;
  nav: string;
  tone: StatusTone;
  badge: string;
  heading: string;
  body: string;
  action: { icon: typeof Play; label: string; enabled: boolean };
  note?: string;
  progress: number;
}

const STAGES: Stage[] = [
  {
    id: "claim",
    nav: "You claim it",
    tone: "assigned",
    badge: "Ready to start",
    heading: "The pay is on the brief before you commit",
    body: "You see the discipline, the deadline, and exactly what you earn. No bidding against anyone, no proposal to write. If it suits you, take it.",
    action: { icon: Play, label: "Start work", enabled: true },
    progress: 0,
  },
  {
    id: "link",
    nav: "You add your link",
    tone: "changes",
    badge: "Link needed",
    heading: "You work wherever you already work",
    body: "Paste a link to where the work is happening so your supervisor can follow along. Until that is in, progress and submission stay locked.",
    action: { icon: Send, label: "Submit for review", enabled: false },
    note: "Nothing moves until your working link is in.",
    progress: 0,
  },
  {
    id: "progress",
    nav: "You do the work",
    tone: "progress",
    badge: "In progress",
    heading: "Your supervisor can see where things stand",
    body: "Move the progress along as you go. Questions go to your supervisor in one thread, and you never deal with the client.",
    action: { icon: Send, label: "Submit for review", enabled: true },
    progress: 60,
  },
  {
    id: "review",
    nav: "It gets reviewed",
    tone: "review",
    badge: "With your supervisor",
    heading: "Someone checks it before a client sees it",
    body: "Your supervisor reviews the work and handles the client conversation. If something needs changing they tell you exactly what.",
    action: { icon: Check, label: "Waiting on review", enabled: false },
    progress: 100,
  },
  {
    id: "paid",
    nav: "You get paid",
    tone: "approved",
    badge: "Approved",
    heading: "Approved means released",
    body: "Once it is approved the payout is released to the account you registered. You are not invoicing anyone or chasing anyone.",
    action: { icon: Wallet, label: "Payout released", enabled: true },
    progress: 100,
  },
];

export function WorkflowDemo() {
  const [index, setIndex] = useState(0);
  const tilt = useCursorTilt(3);
  const stage = STAGES[index] ?? STAGES[0]!;
  const ActionIcon = stage.action.icon;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start">
      <div>
        <h2 id="walkthrough" className="text-4xl font-extrabold tracking-[-0.04em]">
          What a project actually looks like
        </h2>
        <p className="mt-3 max-w-md text-md text-ink-2">
          Click through it. This is the real interface, not a mockup of one.
        </p>

        <ol className="mt-8 space-y-2" role="tablist" aria-label="Project stages">
          {STAGES.map((entry, entryIndex) => {
            const active = entryIndex === index;
            return (
              <li key={entry.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls="workflow-panel"
                  onClick={() => setIndex(entryIndex)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3 text-left",
                    "transition-all duration-[150ms] ease-spring",
                    active
                      ? "-translate-x-[2px] -translate-y-[2px] border-ink bg-surface shadow-offset-md"
                      : "border-transparent bg-transparent hover:border-ink hover:bg-surface",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink text-sm font-extrabold",
                      active ? "bg-coral" : "bg-subtle",
                    )}
                  >
                    {entryIndex + 1}
                  </span>
                  <span className="text-md font-extrabold tracking-[-0.02em]">{entry.nav}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      {/* The live panel. Same components the app uses. */}
      <div
        id="workflow-panel"
        role="tabpanel"
        aria-live="polite"
        ref={tilt.ref}
        onPointerMove={tilt.onPointerMove}
        onPointerLeave={tilt.onPointerLeave}
        className="cursor-tilt rounded-3xl border-2 border-ink bg-surface p-6 shadow-offset-xl"
      >
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill>Writing and content</CategoryPill>
          <StatusBadge tone={stage.tone} label={stage.badge} />
        </div>

        <h3 className="mt-4 text-xl font-extrabold leading-tight tracking-[-0.03em]">
          {stage.heading}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink-2">{stage.body}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 rounded-xl border-[1.5px] border-line-card bg-[#f8f8fb] px-4 py-3">
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.04em] text-ink-muted">
              You earn
            </div>
            <div className="text-lg font-extrabold tracking-[-0.02em]">Set on the brief</div>
          </div>
          <div>
            <div className="text-2xs font-bold uppercase tracking-[0.04em] text-ink-muted">
              Work for
            </div>
            <div className="text-lg font-extrabold tracking-[-0.02em]">Client</div>
          </div>
        </div>

        {stage.id === "link" ? (
          <div className="mt-4 flex items-center gap-2 rounded-md border-2 border-ink bg-surface px-3.5 py-2.5 shadow-offset-xs">
            <Link2 className="h-3.5 w-3.5 shrink-0 text-ink-muted" aria-hidden="true" />
            <span className="text-sm text-ink-3">https://</span>
            <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-ink" aria-hidden="true" />
          </div>
        ) : null}

        {stage.progress > 0 ? (
          <div className="mt-4">
            <div className="mb-1.5 flex items-center justify-between text-2xs font-bold uppercase tracking-[0.04em] text-ink-muted">
              <span>Progress</span>
              <span>{stage.progress}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full border-[1.5px] border-ink bg-surface">
              <div
                className="h-full rounded-full bg-gradient-to-r from-coral to-[#ffa07a] transition-[width] duration-500 ease-spring"
                style={{ width: `${stage.progress}%` }}
              />
            </div>
          </div>
        ) : null}

        <div className="mt-5">
          <div
            aria-hidden="true"
            className={cn(
              "flex items-center justify-center gap-2 rounded-md border-2 border-ink px-5 py-3 text-sm font-bold",
              stage.action.enabled
                ? "bg-coral text-ink shadow-offset-md"
                : "bg-muted text-ink-3 opacity-60",
            )}
          >
            <ActionIcon className="h-4 w-4" />
            {stage.action.label}
          </div>
          {stage.note ? (
            <p className="mt-2 text-[11px] font-semibold leading-snug text-warning-ink">
              {stage.note}
            </p>
          ) : null}
        </div>

        <p className="mt-5 border-t border-line-subtle pt-3 text-[11px] text-ink-muted">
          An example project. Real briefs carry their own pay and deadline.
        </p>
      </div>
    </div>
  );
}

import { Link } from "react-router-dom";
import { Layers, ArrowUpRight, ShieldCheck, Sparkles, GraduationCap, Check } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { cn } from "@/lib/cn";
import { MAX_ACTIVE_PROJECTS, CLIENT_LABEL } from "@/lib/constants";
import type { DoerGateState } from "@/types/domain";

/**
 * The right rail: capacity, then next steps, then how the work actually runs.
 *
 * There is deliberately no pending-earnings figure anywhere in this app. The doer
 * cannot read payout status: ledger_doer exposes only released legs and
 * razorpay_payouts has no doer read policy, so a "pending" number would be
 * invented. Showing a made-up figure about someone's money is worse than showing
 * none, so that gap sits on the backend handoff list instead.
 */
export function CapacityRail({
  activeCount,
  gate,
}: {
  activeCount: number;
  gate: DoerGateState | undefined;
}) {
  const atCap = activeCount >= MAX_ACTIVE_PROJECTS;

  const steps = gate
    ? [
        { id: "kyc", label: "Verified", done: gate.kycDone, icon: ShieldCheck, to: "/verification" },
        { id: "skills", label: "Skills picked", done: gate.skillsDone, icon: Sparkles, to: "/skills" },
        {
          id: "training",
          label: "Training done",
          done: gate.trainingDone,
          icon: GraduationCap,
          to: "/training",
        },
      ]
    : [];

  return (
    <aside className="space-y-4" aria-label="Capacity and next steps">
      <Card>
        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.05em] text-ink-muted">
            <Layers className="h-3.5 w-3.5" aria-hidden="true" />
            Capacity
          </span>
          <span
            className={cn(
              "rounded-full border-[1.5px] border-ink px-2.5 py-0.5 text-2xs font-extrabold",
              atCap ? "bg-warning-bg text-warning-ink" : "bg-lime",
            )}
          >
            {activeCount} of {MAX_ACTIVE_PROJECTS}
          </span>
        </div>

        <div className="mt-4 flex gap-1.5" aria-hidden="true">
          {Array.from({ length: MAX_ACTIVE_PROJECTS }, (_, index) => (
            <div
              key={index}
              className={cn(
                "h-2.5 flex-1 rounded-full border-[1.5px] border-ink transition-colors",
                index < activeCount ? (atCap ? "bg-coral" : "bg-lime") : "bg-surface",
              )}
            />
          ))}
        </div>
        <span className="sr-only">
          {activeCount} of {MAX_ACTIVE_PROJECTS} project slots in use.
        </span>

        <p className="mt-3 text-xs leading-snug text-ink-2">
          {atCap
            ? "You are at capacity, so the board is hidden. Finish something to free a slot. This does not affect your standing or your rating."
            : "Pausing hides the board without affecting work you already hold."}
        </p>
      </Card>

      {gate && !gate.unlocked ? (
        <Card>
          <h3 className="text-sm font-extrabold uppercase tracking-[0.05em] text-ink-muted">
            To unlock earning
          </h3>
          <ul className="mt-3 space-y-2">
            {steps.map((step) => (
              <li key={step.id}>
                <Link
                  to={step.to}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg border-[1.5px] px-3 py-2 text-sm font-bold transition-colors",
                    step.done
                      ? "border-line-card bg-surface-2 text-ink-muted"
                      : "border-ink bg-surface shadow-offset-xs hover:bg-hover",
                  )}
                >
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink",
                      step.done ? "bg-success-bg text-success-ink" : "bg-lime",
                    )}
                  >
                    {step.done ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <step.icon className="h-3 w-3" aria-hidden="true" />
                    )}
                  </span>
                  <span className={cn("flex-1", step.done && "line-through")}>{step.label}</span>
                  {!step.done ? (
                    <ArrowUpRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  ) : null}
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}

      <Card className="bg-surface-2">
        <h3 className="text-sm font-extrabold uppercase tracking-[0.05em] text-ink-muted">
          How work runs here
        </h3>
        <ul className="mt-3 space-y-2.5 text-xs leading-relaxed text-ink-2">
          <li>
            <strong className="font-extrabold text-ink">The pay is fixed.</strong> Every brief
            shows exactly what you earn before you claim it. No bidding.
          </li>
          <li>
            <strong className="font-extrabold text-ink">One point of contact.</strong> You speak
            to your supervisor, never to the {CLIENT_LABEL.toLowerCase()}.
          </li>
          <li>
            <strong className="font-extrabold text-ink">Add your working link</strong> on a
            project before you update progress or submit it.
          </li>
        </ul>
      </Card>
    </aside>
  );
}

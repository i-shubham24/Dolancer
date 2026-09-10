import { Link } from "react-router-dom";
import { Check, ShieldCheck, Sparkles, GraduationCap, FileText } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import type { DoerGateState } from "@/types/domain";

/**
 * Readiness is a card, never a route.
 *
 * A fresh account has profiles.role = "user" and only becomes a doer once an
 * application is approved, so there is a real gate here. But the rule is explicit:
 * a doer must never hit a screen whose only content is that their account is
 * pending. Every one of these steps renders inside a working dashboard as a prompt
 * toward earning. Nothing here blocks navigation.
 */

interface Step {
  id: string;
  label: string;
  description: string;
  done: boolean;
  href: string;
  cta: string;
  icon: React.ReactNode;
  /** Waiting on someone else, so there is no action to take. */
  waiting?: boolean;
}

function buildSteps(gate: DoerGateState): Step[] {
  const applicationWaiting = gate.applicationStatus === "pending";
  return [
    {
      id: "apply",
      label: applicationWaiting ? "Application under review" : "Apply to join",
      description: applicationWaiting
        ? "A supervisor is looking at your application. You can keep exploring meanwhile."
        : "Tell us what you do. It takes a minute.",
      done: gate.isDoer,
      waiting: applicationWaiting,
      href: "/profile",
      cta: applicationWaiting ? "View application" : "Apply now",
      icon: <FileText className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: "kyc",
      label: "Get verified",
      description: "PAN, a government photo ID, and where you want to be paid.",
      done: gate.kycDone,
      href: "/verification",
      cta: "Start verification",
      icon: <ShieldCheck className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: "skills",
      label: "Pick your skills",
      description: "This is how work finds you. Only matching projects appear on your board.",
      done: gate.skillsDone,
      href: "/skills",
      cta: "Choose skills",
      icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: "training",
      label: "Finish training",
      description: "Short modules on how work is briefed, reviewed and delivered here.",
      done: gate.trainingDone,
      href: "/training",
      cta: "Open training",
      icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />,
    },
  ];
}

export function ReadinessCard({ gate }: { gate: DoerGateState }) {
  if (gate.unlocked) return null;

  const steps = buildSteps(gate);
  const next = steps.find((step) => !step.done && !step.waiting);
  const pct = Math.round((gate.stepsDone / gate.totalSteps) * 100);

  return (
    <Card className="border-2 bg-gradient-to-br from-lime-light to-surface shadow-offset-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold tracking-[-0.03em]">
            Want to start earning? Get verified.
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-ink-2">
            You have full access already. Finishing these unlocks project offers and payouts.
          </p>
        </div>
        <div className="shrink-0 rounded-full border-[1.5px] border-ink bg-surface px-3 py-1 text-xs font-extrabold shadow-offset-xs">
          {gate.stepsDone} of {gate.totalSteps} done
        </div>
      </div>

      <div
        className="mt-4 h-2.5 w-full overflow-hidden rounded-full border-[1.5px] border-ink bg-surface"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Readiness progress"
      >
        <div
          className="h-full rounded-full bg-lime transition-[width] duration-500 ease-spring"
          style={{ width: `${pct}%` }}
        />
      </div>

      <ul className="mt-5 space-y-2.5">
        {steps.map((step) => (
          <li
            key={step.id}
            className={cn(
              "flex flex-wrap items-center gap-3 rounded-lg border-[1.5px] px-3.5 py-3 transition-colors",
              step.done
                ? "border-line-card bg-surface-2"
                : step.waiting
                  ? "border-line-card bg-warning-bg"
                  : "border-ink bg-surface shadow-offset-xs",
            )}
          >
            <span
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink",
                step.done ? "bg-success-bg text-success-ink" : "bg-surface text-ink",
              )}
            >
              {step.done ? <Check className="h-4 w-4" aria-hidden="true" /> : step.icon}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "text-sm font-extrabold tracking-[-0.01em]",
                    step.done && "text-ink-muted line-through",
                  )}
                >
                  {step.label}
                </span>
                {step.waiting ? (
                  <span className="rounded-full border border-ink bg-warning-bg px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-warning-ink">
                    Waiting on us
                  </span>
                ) : null}
              </div>
              {!step.done ? (
                <p className="mt-0.5 text-xs text-ink-2">{step.description}</p>
              ) : null}
            </div>

            {!step.done && !step.waiting ? (
              <Button asChild size="sm" variant={step.id === next?.id ? "primary" : "secondary"}>
                <Link to={step.href}>{step.cta}</Link>
              </Button>
            ) : null}
          </li>
        ))}
      </ul>
    </Card>
  );
}

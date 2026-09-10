import { useState } from "react";
import { Play, Send, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/brutal/Card";
import { cn } from "@/lib/cn";
import { workbenchGates } from "@/lib/status";
import type { DoerProject } from "@/types/domain";
import { useStartWork, useSubmitForReview, useSetProgress } from "./queries";

/**
 * The primary action rail.
 *
 * Only two actions live here at any time, and a disabled one carries its reason
 * directly beneath it rather than in a tooltip, so the blocker is readable without
 * hovering and survives on touch. The fix is always the nearest thing to hand.
 */
export function LifecycleActions({ project }: { project: DoerProject }) {
  const gates = workbenchGates(project);
  const [pct, setPct] = useState(project.progressPct);

  const start = useStartWork(project.id);
  const submit = useSubmitForReview(project.id);
  const progress = useSetProgress(project.id);

  const busy = start.isPending || submit.isPending || progress.isPending;

  if (project.status === "in_review" || project.status === "delivered") {
    return (
      <Card className="bg-purple-light">
        <h3 className="text-sm font-extrabold tracking-[-0.01em]">
          {project.status === "in_review" ? "With your supervisor" : "Awaiting approval"}
        </h3>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
          {project.status === "in_review"
            ? "Your supervisor is reviewing this. They will come back to you here if anything needs changing."
            : "Your supervisor has delivered this. Payment follows approval."}
        </p>
      </Card>
    );
  }

  if (project.status === "approved") {
    return (
      <Card className="bg-success-bg">
        <h3 className="text-sm font-extrabold tracking-[-0.01em]">Approved</h3>
        <p className="mt-1.5 text-xs leading-relaxed text-ink-2">
          This one is done. Your payout appears in earnings once it is released.
        </p>
      </Card>
    );
  }

  return (
    <Card className="space-y-4">
      {gates.canStart ? (
        <div>
          <Button
            size="lg"
            className="w-full"
            onClick={() => void start.mutateAsync()}
            disabled={busy}
          >
            <Play className="h-4 w-4" aria-hidden="true" />
            {start.isPending ? "Starting..." : "Start work"}
          </Button>
          {!gates.hasWorkingDoc ? (
            <p className="mt-2 text-[11px] leading-snug text-ink-2">
              You can start now, but add your working link before you can update progress or
              submit.
            </p>
          ) : null}
        </div>
      ) : null}

      {project.status === "in_progress" ? (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="progress" className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                Progress
              </label>
              <span className="text-sm font-extrabold">{pct}%</span>
            </div>
            <input
              id="progress"
              type="range"
              min={0}
              max={100}
              step={5}
              value={pct}
              disabled={!gates.canSetProgress || busy}
              onChange={(event) => setPct(Number(event.target.value))}
              className={cn(
                "w-full accent-coral",
                !gates.canSetProgress && "cursor-not-allowed opacity-45",
              )}
            />
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={!gates.canSetProgress || busy || pct === project.progressPct}
              onClick={() => void progress.mutateAsync(pct)}
            >
              {progress.isPending ? "Saving..." : "Update progress"}
            </Button>
          </div>

          <div>
            <Button
              size="lg"
              className="w-full"
              disabled={!gates.canSubmit || busy}
              onClick={() => void submit.mutateAsync()}
            >
              <Send className="h-4 w-4" aria-hidden="true" />
              {submit.isPending ? "Submitting..." : "Submit for review"}
            </Button>

            {gates.blockedReason ? (
              <p className="mt-2 flex items-start gap-1.5 text-[11px] font-semibold leading-snug text-warning-ink">
                <Info className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
                {gates.blockedReason}
              </p>
            ) : (
              /*
               * The failure mode this app invites: a doer sends files in chat and
               * assumes that counted. Say so at the point of submission.
               */
              <p className="mt-2 text-[11px] leading-snug text-ink-2">
                Submitting is what hands the work over. Sending files in chat does not.
              </p>
            )}
          </div>
        </>
      ) : null}
    </Card>
  );
}

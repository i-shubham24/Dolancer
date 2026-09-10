import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, AlertTriangle, RotateCcw } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { CategoryPill } from "@/components/brutal/Pill";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { DeadlineBadge } from "@/components/brutal/DeadlineBadge";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { Button } from "@/components/ui/button";
import { formatPaise } from "@/lib/paise";
import { formatDateTime } from "@/lib/datetime";
import { statusDisplay, workbenchGates } from "@/lib/status";
import { CLIENT_LABEL } from "@/lib/constants";
import { qk } from "@/lib/query-keys";
import { useProjectChanges } from "@/lib/realtime";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { useProject } from "./queries";
import { WorkingLinkCard } from "./WorkingLinkCard";
import { LifecycleActions } from "./LifecycleActions";

/**
 * The workbench.
 *
 * Content on the left, a properties rail on the right, with the working link pinned
 * to the top of the rail because it gates everything below it. The rail is visually
 * part of the page rather than a walled-off panel.
 *
 * The counterparty is rendered as CLIENT_LABEL throughout. projects_doer carries no
 * client identity, so there is nothing else available to render even by accident.
 */
export function WorkbenchPage() {
  const { id = "" } = useParams();
  const project = useProject(id);
  const queryClient = useQueryClient();

  // The project broadcast is content free: it carries only the id, so a change
  // means "refetch", never "here is the new value". A supervisor bouncing the work
  // back or the status advancing shows up without a reload.
  const onProjectChange = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: qk.work.detail(id) });
  }, [queryClient, id]);

  useProjectChanges(id || null, onProjectChange);

  if (project.isLoading) {
    return (
      <div className="space-y-6">
        <LoadingAnnounce label="Loading this project" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-12 w-3/4" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      </div>
    );
  }

  if (project.isError) {
    return (
      <ErrorState
        description="This project did not load."
        onRetry={() => void project.refetch()}
      />
    );
  }

  if (!project.data) {
    return (
      <EmptyState
        title="Project not found"
        description="This project either does not exist or is not assigned to you."
        action={
          <Button asChild>
            <Link to="/work">Back to my work</Link>
          </Button>
        }
      />
    );
  }

  const data = project.data;
  const status = statusDisplay(data.status, data.workingDocUrl);
  const gates = workbenchGates(data);
  const editable = gates.canSetWorkingDoc;

  return (
    <div className="space-y-6">
      <Link
        to="/work"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        My work
      </Link>

      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <CategoryPill>{data.category}</CategoryPill>
          <StatusBadge tone={status.tone} label={status.label} />
          <DeadlineBadge deadline={data.deliveryAt} />
        </div>
        <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.035em]">
          {data.brief?.trim().split("\n")[0] || `${data.category} task`}
        </h1>
      </header>

      {/* Rework notice sits above everything: it is the reason the work reopened. */}
      {data.lastBounceReason ? (
        <Card className="border-2 bg-danger-bg">
          <div className="flex items-start gap-2.5">
            <RotateCcw className="mt-0.5 h-4 w-4 shrink-0 text-danger-ink" aria-hidden="true" />
            <div>
              <h2 className="text-sm font-extrabold text-danger-ink">Changes requested</h2>
              <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed text-danger-ink/85">
                {data.lastBounceReason}
              </p>
            </div>
          </div>
        </Card>
      ) : null}

      {data.qcBounceCount >= 2 ? (
        <div className="flex items-start gap-2.5 rounded-xl border-2 border-ink bg-warning-bg px-4 py-3 shadow-offset-xs">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
          <p className="text-xs font-semibold leading-snug text-warning-ink">
            This work has come back {data.qcBounceCount} times. Talk to your supervisor before
            resubmitting so the next round lands.
          </p>
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-5">
          <Card>
            <h2 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
              The brief
            </h2>
            <div className="mt-3 whitespace-pre-wrap text-sm leading-relaxed">
              {data.brief?.trim() || "Your supervisor will share the detail here."}
            </div>
          </Card>

          {data.revisionCount > 0 && data.revisionReason ? (
            <Card>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                Revision requested ({data.revisionCount})
              </h2>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                {data.revisionReason}
              </p>
            </Card>
          ) : null}

          <ChatPanel projectId={data.id} />
        </div>

        <aside className="space-y-4" aria-label="Project details">
          {/* Pinned first: it gates progress and submission. */}
          <WorkingLinkCard
            projectId={data.id}
            workingDocUrl={data.workingDocUrl}
            editable={editable}
          />

          <LifecycleActions project={data} />

          <Card>
            <dl className="space-y-3 text-sm">
              <div className="flex items-center justify-between gap-3">
                <dt className="text-ink-muted">You earn</dt>
                <dd className="text-lg font-extrabold tracking-[-0.02em]">
                  {formatPaise(data.payoutPaise)}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-3">
                <dt className="text-ink-muted">Due</dt>
                <dd className="text-right text-xs font-bold">
                  {data.deliveryAt ? formatDateTime(data.deliveryAt) : "Not set"}
                </dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-3">
                <dt className="text-ink-muted">Work for</dt>
                <dd className="text-xs font-bold">{CLIENT_LABEL}</dd>
              </div>
              <div className="flex items-center justify-between gap-3 border-t border-line-subtle pt-3">
                <dt className="text-ink-muted">Task ID</dt>
                <dd className="font-mono text-xs font-bold" title={data.id}>
                  {data.id.slice(0, 8)}
                </dd>
              </div>
            </dl>
            <p className="mt-3 border-t border-line-subtle pt-3 text-[11px] leading-snug text-ink-muted">
              Payout is before tax. What was withheld appears on your earnings record.
            </p>
          </Card>
        </aside>
      </div>
    </div>
  );
}

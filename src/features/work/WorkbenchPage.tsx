import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CalendarClock, ChevronDown, Copy, FileSearch, IndianRupee, MessagesSquare, ListChecks, RotateCcw } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { CategoryTile, Segments } from "@/components/app/ui";
import { Timeline } from "@/components/app/Timeline";
import { cn } from "@/lib/cn";
import { formatPaise } from "@/lib/paise";
import { deadlineUrgency, relativeDeadline } from "@/lib/datetime";
import { statusDisplay, timelineStep } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { qk } from "@/lib/query-keys";
import { useProjectChanges } from "@/lib/realtime";
import { formatDayShort, formatTime } from "@/features/calendar/dates";
import { ChatPanel } from "@/features/chat/ChatPanel";
import { useProject } from "./queries";
import { WorkingLinkCard } from "./WorkingLinkCard";
import { ProgressCard, SubmitCard } from "./LifecycleActions";

const URGENCY_TEXT = {
  overdue: "text-danger-ink",
  urgent: "text-danger-ink",
  soon: "text-warning-ink",
  comfortable: "text-ink-muted",
  none: "text-ink-muted",
} as const;

/** The brief without its headline, which is already the page title. */
function briefBody(brief: string | null): string {
  const lines = brief?.trim().split("\n") ?? [];
  return lines.slice(1).join("\n").trim();
}

/**
 * The task page.
 *
 * Everything needed to do the work sits on the left: pay and deadline, the
 * timeline, the company workspace, progress, the checks before submitting, and
 * the brief. The supervisor chat is fixed on the right so it stays in reach while
 * scrolling. On a phone the two halves become tabs.
 *
 * The counterparty is the supervisor throughout. projects_doer carries no client
 * identity, so there is nothing else available to render even by accident.
 */
export function WorkbenchPage() {
  const { id = "" } = useParams();
  const project = useProject(id);
  const queryClient = useQueryClient();
  const [tab, setTab] = useState<"details" | "chat">("details");
  const [briefOpen, setBriefOpen] = useState(false);

  // The project broadcast is content free: it carries only the id, so a change
  // means "refetch", never "here is the new value". A supervisor bouncing the work
  // back or the status advancing shows up without a reload.
  const onProjectChange = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: qk.work.detail(id) });
  }, [queryClient, id]);

  useProjectChanges(id || null, onProjectChange);

  if (project.isLoading) {
    return (
      <div className="space-y-4">
        <LoadingAnnounce label="Loading this task" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-2/3" />
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_380px]">
          <Skeleton className="h-96 w-full rounded-[20px]" />
          <Skeleton className="h-96 w-full rounded-[20px]" />
        </div>
      </div>
    );
  }

  if (project.isError) {
    return (
      <EmptyPanel
        tone="danger"
        icon={<AlertTriangle />}
        title="This task did not load"
        action={
          <Button variant="outline" onClick={() => void project.refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!project.data) {
    return (
      <EmptyPanel
        icon={<FileSearch />}
        title="Task not found"
        body="It does not exist, or it is not assigned to you."
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
  const due = data.deliveryAt ? new Date(data.deliveryAt) : null;
  const urgency = deadlineUrgency(data.deliveryAt);
  const body = briefBody(data.brief);
  const paragraphs = body.split(/\n{2,}/).filter((part) => part.trim());
  const changes = data.lastBounceReason || (data.revisionCount > 0 ? data.revisionReason : null);

  async function copyId() {
    try {
      await navigator.clipboard.writeText(data.id);
      toast.success("Task ID copied");
    } catch {
      toast.error("Could not copy. Select it and copy by hand.");
    }
  }

  return (
    <div>
      <PageHeader
        back={{ to: "/work", label: "My work" }}
        title={taskTitle(data)}
        sub={
          <span className="mt-1.5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 text-xs font-bold text-ink-muted">
              <CategoryTile category={data.category} className="h-6 w-6 rounded-md text-[9.5px]" />
              {data.category}
            </span>
            <StatusBadge tone={status.tone} label={status.label} />
          </span>
        }
      />

      {/* On a phone the page splits into two tabs; side by side from large screens. */}
      <Segments
        label="Task view"
        value={tab}
        onChange={setTab}
        className="mb-4 w-full lg:hidden [&>button]:flex-1"
        options={[
          { id: "details", label: "Details" },
          { id: "chat", label: "Chat" },
        ]}
      />

      <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(340px,400px)]">
        <CardGrid className={cn("min-w-0", tab === "chat" && "hidden lg:grid")}>
          {changes ? (
            <motion.section variants={cardMotion} className={cn(CARD, "gap-2 bg-danger-bg ring-danger-dot/20")}>
              <h2 className="flex items-center gap-2 text-[15px] font-extrabold text-danger-ink">
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                Changes asked for{data.revisionCount > 1 ? ` (${data.revisionCount} times)` : ""}
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-danger-ink/90">{changes}</p>
              {data.qcBounceCount >= 2 ? (
                <p className="text-xs font-bold text-danger-ink">
                  This has come back {data.qcBounceCount} times. Talk to your supervisor before sending it again.
                </p>
              ) : null}
            </motion.section>
          ) : null}

          {/* The three facts a doer checks first. */}
          <motion.section variants={cardMotion} className={cn(CARD, "grid grid-cols-1 gap-3 min-[460px]:grid-cols-3")} aria-label="Key facts">
            <div className="flex items-center gap-3 rounded-2xl bg-panel/60 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success-bg text-success-ink" aria-hidden="true">
                <IndianRupee className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-ink-muted">You earn</p>
                <p className="text-lg font-extrabold leading-tight tracking-[-0.02em] tabular-nums">{formatPaise(data.payoutPaise)}</p>
                <p className="text-[10.5px] font-semibold text-ink-3">before tax</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl bg-panel/60 p-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-info-bg text-primary" aria-hidden="true">
                <CalendarClock className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-ink-muted">Due</p>
                <p className="truncate text-[15px] font-extrabold leading-tight">{due ? formatDayShort(due) : "Not set"}</p>
                <p className={cn("text-[10.5px] font-bold", URGENCY_TEXT[urgency])}>
                  {due ? `${formatTime(due)}, ${relativeDeadline(data.deliveryAt).toLowerCase()}` : "Ask your supervisor"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => void copyId()}
              className="group flex items-center gap-3 rounded-2xl bg-panel/60 p-3 text-left transition-colors hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary"
              aria-label={`Copy task ID ${data.id.slice(0, 8)}`}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-light text-violet" aria-hidden="true">
                <Copy className="h-[18px] w-[18px]" />
              </span>
              <div className="min-w-0">
                <p className="text-[11px] font-bold text-ink-muted">Task ID</p>
                <p className="font-mono text-[15px] font-extrabold leading-tight">{data.id.slice(0, 8)}</p>
                <p className="text-[10.5px] font-semibold text-ink-3 group-hover:text-primary">Tap to copy</p>
              </div>
            </button>
          </motion.section>

          <motion.section variants={cardMotion} className={cn(CARD, "gap-4")} aria-labelledby="timeline-title">
            <h2 id="timeline-title" className="text-[15px] font-extrabold tracking-[-0.02em]">
              Timeline
            </h2>
            {data.status === "cancelled" ? (
              <p className="rounded-xl bg-neutral-bg px-3 py-2.5 text-sm font-bold text-neutral-ink">This task was cancelled.</p>
            ) : (
              <Timeline current={timelineStep(data.status)} />
            )}
          </motion.section>

          <div className="grid gap-4 md:grid-cols-2">
            <WorkingLinkCard workingDocUrl={data.workingDocUrl} />
            <ProgressCard key={`${data.id}-${data.progressPct}`} project={data} />
          </div>

          <SubmitCard project={data} />

          <motion.section variants={cardMotion} className={cn(CARD, "gap-3")} aria-labelledby="brief-title">
            <h2 id="brief-title" className="flex items-center gap-2 text-[15px] font-extrabold tracking-[-0.02em]">
              <ListChecks className="h-4 w-4 text-ink-muted" aria-hidden="true" />
              The brief
            </h2>
            {paragraphs.length === 0 ? (
              <p className="text-sm text-ink-2">Your supervisor will share the detail here.</p>
            ) : (
              <>
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-2">{paragraphs[0]}</p>
                <AnimatePresence initial={false}>
                  {briefOpen && paragraphs.length > 1 ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="space-y-3 overflow-hidden"
                    >
                      {paragraphs.slice(1).map((part, index) => (
                        <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-ink-2">
                          {part}
                        </p>
                      ))}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
                {paragraphs.length > 1 ? (
                  <button
                    type="button"
                    onClick={() => setBriefOpen((open) => !open)}
                    aria-expanded={briefOpen}
                    className="inline-flex items-center gap-1 self-start rounded-md text-xs font-bold text-primary focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {briefOpen ? "Show less" : "Read the full brief"}
                    <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", briefOpen && "rotate-180")} aria-hidden="true" />
                  </button>
                ) : null}
              </>
            )}
          </motion.section>
        </CardGrid>

        {/* Fixed on the right while the details scroll. */}
        <div className={cn("lg:sticky lg:top-6 lg:h-[calc(100dvh-3rem)]", tab === "details" && "hidden lg:block")}>
          <ChatPanel projectId={data.id} fill className="h-[72dvh] lg:h-full" />
        </div>
      </div>

      {tab === "details" ? (
        <button
          type="button"
          onClick={() => setTab("chat")}
          className="fixed bottom-5 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-white shadow-[0_12px_28px_-8px_rgba(10,101,192,0.7)] lg:hidden"
          aria-label="Open chat with your supervisor"
        >
          <MessagesSquare className="h-6 w-6" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { CARD } from "@/components/app/card-styles";
import { SupervisorAvatar } from "@/components/app/SupervisorAvatar";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { fetchThreadId } from "./api";
import { Conversation } from "./Conversation";

/** The project workspace chat header visible to supervisor and client. */
export function SupervisorHeader({ category }: { category?: string } = {}) {
  return (
    <div className="flex items-center gap-3 border-b border-line-subtle px-4 py-3.5">
      <SupervisorAvatar category={category} size="sm" />
      <div className="min-w-0">
        <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">Project Discussion</h2>
        <p className="text-[11.5px] font-semibold text-ink-muted">Accessible by client & supervisor</p>
      </div>
    </div>
  );
}

/**
 * The supervisor thread for one task.
 *
 * The user_supervisor thread exists for the same project but is unreadable to the
 * doer, and there is no UI here that could reach it, because there is no query
 * that would return anything if there were.
 */
export function ChatPanel({
  projectId,
  category,
  fill = false,
  className,
}: {
  projectId: string;
  category?: string;
  /** Fill the parent's height, with the messages scrolling inside. */
  fill?: boolean;
  className?: string;
}) {
  const thread = useQuery({
    queryKey: qk.work.thread(projectId),
    queryFn: () => fetchThreadId(projectId),
    enabled: Boolean(projectId),
  });

  if (thread.isLoading) {
    return (
      <div className={cn(CARD, "gap-3", fill && "h-full", className)}>
        <LoadingAnnounce label="Loading your conversation" />
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-16 w-3/4 rounded-2xl" />
        <Skeleton className="ml-auto h-16 w-2/3 rounded-2xl" />
      </div>
    );
  }

  if (thread.isError || !thread.data) {
    return (
      <div className={cn(CARD, "items-center justify-center gap-3 py-10 text-center", fill && "h-full", className)}>
        <p className="text-sm font-bold">{thread.isError ? "The conversation did not load." : "There is no conversation for this task yet."}</p>
        {thread.isError ? (
          <Button variant="outline" size="sm" onClick={() => void thread.refetch()}>
            Try again
          </Button>
        ) : null}
      </div>
    );
  }

  return (
    <Conversation
      key={thread.data}
      threadId={thread.data}
      header={<SupervisorHeader category={category} />}
      label="Project discussion"
      fill={fill}
      className={className}
      placeholder="Message project workspace (supervisor & client)..."
      emptyText="No messages yet. Send project updates here (accessible by supervisor & client)."
    />
  );
}

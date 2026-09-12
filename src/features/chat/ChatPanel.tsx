import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Paperclip, MessagesSquare } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { formatDateTime } from "@/lib/datetime";
import { MAX_MESSAGE_LENGTH, CLIENT_LABEL } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useThreadStream } from "@/lib/realtime";
import { fetchThreadId, fetchMessages, sendMessage, fetchAttachments, signedUrlFor } from "./api";

/**
 * The supervisor thread.
 *
 * This is the only conversation a doer has. The user_supervisor thread exists for
 * the same project but is unreadable to them, and there is no UI here that could
 * reach it, because there is no query that would return anything if there were.
 *
 * Messages arrive over a private realtime channel using broadcast-from-database.
 * Delivery is gated by the same predicate as the table read, so a doer only ever
 * receives broadcasts for threads they participate in.
 */
export function ChatPanel({ projectId }: { projectId: string }) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  const thread = useQuery({
    queryKey: qk.work.thread(projectId),
    queryFn: () => fetchThreadId(projectId),
    enabled: Boolean(projectId),
  });

  const threadId = thread.data ?? null;

  // Drafts survive a reload or a trip to another page. Keyed per thread so two
  // projects never share half-written words. Cleared on successful send.
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);
  useEffect(() => {
    if (!threadId || hydratedFor === threadId) return;
    try {
      const saved = localStorage.getItem(`dolancer.chat.draft.${threadId}`);
      if (saved) setDraft(saved);
    } catch {
      // Private mode. Typing still works, it just will not persist.
    }
    setHydratedFor(threadId);
  }, [threadId, hydratedFor]);
  useEffect(() => {
    if (!threadId) return;
    try {
      if (draft) localStorage.setItem(`dolancer.chat.draft.${threadId}`, draft);
      else localStorage.removeItem(`dolancer.chat.draft.${threadId}`);
    } catch {
      // Private mode. Ignore.
    }
  }, [threadId, draft]);

  const messages = useQuery({
    queryKey: qk.work.messages(threadId ?? "none"),
    queryFn: () => fetchMessages(threadId as string),
    enabled: Boolean(threadId),
  });

  const attachments = useQuery({
    queryKey: qk.work.attachments(threadId ?? "none"),
    queryFn: () => fetchAttachments(threadId as string),
    enabled: Boolean(threadId),
  });

  // The broadcast payload carries the row, but refetching keeps one shape of truth
  // rather than merging two, and the thread is small enough that it is cheap.
  const onIncoming = useCallback(() => {
    if (!threadId) return;
    void queryClient.invalidateQueries({ queryKey: qk.work.messages(threadId) });
  }, [queryClient, threadId]);

  useThreadStream(threadId, onIncoming);

  const items = messages.data ?? [];

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "nearest" });
  }, [items.length]);

  const send = useMutation({
    mutationFn: (body: string) => sendMessage(threadId as string, body),
    onSuccess: () => {
      setDraft("");
      try {
        if (threadId) localStorage.removeItem(`dolancer.chat.draft.${threadId}`);
      } catch {
        // Private mode. Ignore.
      }
      onIncoming();
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not send the message. Try again.")),
  });

  async function openAttachment(bucket: string, objectPath: string) {
    try {
      const url = await signedUrlFor(bucket, objectPath);
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (error) {
      toast.error(toUserError(error, "Could not open that file."));
    }
  }

  const overLimit = draft.length > MAX_MESSAGE_LENGTH;
  const canSend = Boolean(threadId) && draft.trim().length > 0 && !overLimit && !send.isPending;

  if (thread.isLoading) {
    return (
      <Card className="space-y-3">
        <LoadingAnnounce label="Loading your conversation" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-full" />
        <Skeleton className="h-16 w-3/4" />
      </Card>
    );
  }

  if (thread.isError) {
    return (
      <ErrorState
        description="The conversation did not load."
        onRetry={() => void thread.refetch()}
      />
    );
  }

  return (
    <Card className="flex flex-col p-0">
      <div className="flex items-center gap-2 border-b-2 border-ink px-5 py-3.5">
        <MessagesSquare className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        <h2 className="text-sm font-extrabold tracking-[-0.01em]">Your supervisor</h2>
        <span className="ml-auto text-[11px] text-ink-muted">
          Never the {CLIENT_LABEL.toLowerCase()}
        </span>
      </div>

      <div className="max-h-[26rem] min-h-[12rem] flex-1 space-y-3 overflow-y-auto px-5 py-4">
        {messages.isLoading ? (
          <>
            <Skeleton className="h-14 w-3/4" />
            <Skeleton className="ml-auto h-14 w-2/3" />
          </>
        ) : items.length === 0 ? (
          <p className="py-6 text-center text-sm text-ink-2">
            No messages yet. Your supervisor will be in touch, and you can reach them here
            whenever you need to.
          </p>
        ) : (
          items.map((message) => {
            const mine = message.authorId === user?.id;
            const files = (attachments.data ?? []).filter(
              (file) => file.messageId === message.id,
            );
            return (
              <div key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl border-[1.5px] border-ink px-3.5 py-2.5 shadow-offset-xs",
                    mine ? "bg-lime" : "bg-surface-2",
                  )}
                >
                  <div className="text-2xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                    {mine ? "You" : "Supervisor"}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.body}
                  </p>

                  {files.map((file) => (
                    <button
                      key={file.id}
                      type="button"
                      onClick={() => void openAttachment(file.bucket, file.objectPath)}
                      className="mt-2 flex w-full items-center gap-1.5 rounded-md border border-ink bg-surface px-2.5 py-1.5 text-left text-xs font-bold hover:bg-hover"
                    >
                      <Paperclip className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{file.filename}</span>
                    </button>
                  ))}

                  <div className="mt-1 text-[11px] text-ink-muted">
                    {formatDateTime(message.createdAt)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>

      <div className="space-y-2 border-t-2 border-ink px-5 py-4">
        <Textarea
          rows={2}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Enter sends on a pointer device; Shift+Enter makes a newline. On touch
            // the on-screen keyboard's Enter should insert a newline, so this only
            // applies where a real keyboard is present.
            if (event.key === "Enter" && !event.shiftKey && window.matchMedia("(pointer: fine)").matches) {
              event.preventDefault();
              if (canSend) send.mutate(draft);
            }
          }}
          placeholder="Message your supervisor..."
          aria-label="Message your supervisor"
          maxLength={MAX_MESSAGE_LENGTH + 100}
        />
        <div className="flex items-center justify-between gap-3">
          <span
            className={cn(
              "text-[11px]",
              overLimit ? "font-bold text-danger-ink" : "text-ink-muted",
            )}
          >
            {overLimit
              ? `${draft.length - MAX_MESSAGE_LENGTH} characters over the limit`
              : "Enter to send, Shift and Enter for a new line"}
          </span>
          <Button size="sm" disabled={!canSend} onClick={() => send.mutate(draft)}>
            <Send className="h-3.5 w-3.5" aria-hidden="true" />
            {send.isPending ? "Sending..." : "Send"}
          </Button>
        </div>
      </div>
    </Card>
  );
}

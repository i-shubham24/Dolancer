import { useCallback, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Paperclip, MessagesSquare } from "lucide-react";
import { Skeleton } from "@/components/brutal/Skeleton";
import { CARD } from "@/components/app/card-styles";
import { formatDayRelative, formatTime } from "@/features/calendar/dates";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { MAX_MESSAGE_LENGTH } from "@/lib/constants";
import { useAuth } from "@/providers/AuthProvider";
import { useThreadStream } from "@/lib/realtime";
import { useChatReadStore } from "@/stores/useChatReadStore";
import { fetchMessages, sendMessage, fetchAttachments, signedUrlFor } from "./api";

/**
 * One conversation: a header, the messages, and the composer. The task page and the
 * inbox both use it, so a thread looks and behaves the same wherever it is opened.
 *
 * Messages arrive over a private realtime channel using broadcast-from-database.
 * Delivery is gated by the same predicate as the table read, so a doer only ever
 * receives broadcasts for threads they participate in.
 */
export function Conversation({
  threadId,
  header,
  label,
  fill = false,
  className,
  placeholder = "Message your supervisor",
  emptyText = "No messages yet. Ask your supervisor anything here.",
  renderOffer,
}: {
  threadId: string;
  header: React.ReactNode;
  /** Accessible name for the whole conversation. */
  label: string;
  /** Fill the parent's height, with the messages scrolling inside. */
  fill?: boolean;
  className?: string;
  placeholder?: string;
  emptyText?: string;
  /** Draws an offer the supervisor shared, under the message that shared it. */
  renderOffer?: (offerId: string) => React.ReactNode;
}) {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const markRead = useChatReadStore((state) => state.markRead);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drafts survive a reload or a trip to another page. Keyed per thread so two
  // conversations never share half-written words. Cleared on successful send.
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);
  useEffect(() => {
    if (hydratedFor === threadId) return;
    let saved = "";
    try {
      saved = localStorage.getItem(`dolancer.chat.draft.${threadId}`) ?? "";
    } catch {
      // Private mode. Typing still works, it just will not persist.
    }
    setDraft(saved);
    setHydratedFor(threadId);
  }, [threadId, hydratedFor]);
  useEffect(() => {
    if (hydratedFor !== threadId) return;
    try {
      if (draft) localStorage.setItem(`dolancer.chat.draft.${threadId}`, draft);
      else localStorage.removeItem(`dolancer.chat.draft.${threadId}`);
    } catch {
      // Private mode. Ignore.
    }
  }, [threadId, draft, hydratedFor]);

  const messages = useQuery({
    queryKey: qk.work.messages(threadId),
    queryFn: () => fetchMessages(threadId),
  });

  const attachments = useQuery({
    queryKey: qk.work.attachments(threadId),
    queryFn: () => fetchAttachments(threadId),
  });

  // The broadcast payload carries the row, but refetching keeps one shape of truth
  // rather than merging two, and the thread is small enough that it is cheap.
  const onIncoming = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: qk.work.messages(threadId) });
    void queryClient.invalidateQueries({ queryKey: qk.work.inbox() });
  }, [queryClient, threadId]);

  useThreadStream(threadId, onIncoming);

  const items = messages.data ?? [];

  useEffect(() => {
    // Scroll the message list itself, never the page around it.
    const scrollToBottom = () => {
      const list = scrollRef.current;
      if (list) list.scrollTop = list.scrollHeight;
    };
    scrollToBottom();
    const frame = requestAnimationFrame(scrollToBottom);
    if (items.length > 0) markRead(threadId);
    return () => cancelAnimationFrame(frame);
  }, [items.length, threadId, markRead]);

  const send = useMutation({
    mutationFn: (body: string) => sendMessage(threadId, body),
    onSuccess: () => {
      setDraft("");
      try {
        localStorage.removeItem(`dolancer.chat.draft.${threadId}`);
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
  const canSend = draft.trim().length > 0 && !overLimit && !send.isPending;

  let lastDay = "";

  return (
    <section aria-label={label} className={cn(CARD, "overflow-hidden p-0", fill ? "h-full min-h-[420px]" : "", className)}>
      {header}

      <div
        ref={scrollRef}
        className={cn("@container flex-1 space-y-2.5 overflow-y-auto bg-panel/40 px-4 py-4", fill ? "min-h-0" : "max-h-[26rem] min-h-[12rem]")}
      >
        {messages.isLoading ? (
          <>
            <Skeleton className="h-14 w-3/4 rounded-2xl" />
            <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
          </>
        ) : messages.isError ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
            <p className="text-sm font-bold">Messages did not load.</p>
            <button type="button" onClick={() => void messages.refetch()} className="text-xs font-bold text-primary">
              Try again
            </button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 py-8 text-center">
            <MessagesSquare className="h-6 w-6 text-ink-3" aria-hidden="true" />
            <p className="max-w-[16rem] text-xs font-semibold text-ink-muted">{emptyText}</p>
          </div>
        ) : (
          items.map((message) => {
            const mine = message.authorId === user?.id;
            const files = (attachments.data ?? []).filter((file) => file.messageId === message.id);
            const day = formatDayRelative(new Date(message.createdAt));
            const showDay = day !== lastDay;
            lastDay = day;
            return (
              <div key={message.id}>
                {showDay ? (
                  <p className="my-3 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-3">{day}</p>
                ) : null}
                <div className={cn("flex flex-col gap-2", mine ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 @xl:max-w-[70%]",
                      mine ? "rounded-br-md bg-primary text-inverse" : "rounded-bl-md bg-white text-ink ring-1 ring-ink/[0.05]",
                    )}
                  >
                    <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed">{message.body}</p>
                    {files.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        onClick={() => void openAttachment(file.bucket, file.objectPath)}
                        className={cn(
                          "mt-2 flex w-full items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-left text-xs font-bold",
                          mine ? "bg-white/15 hover:bg-white/25" : "bg-panel hover:bg-hover",
                        )}
                      >
                        <Paperclip className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span className="truncate">{file.filename}</span>
                      </button>
                    ))}
                    <p className={cn("mt-1 text-right text-[10.5px] font-semibold", mine ? "text-inverse/70" : "text-ink-3")}>
                      {formatTime(new Date(message.createdAt))}
                    </p>
                  </div>
                  {message.offerId && renderOffer ? renderOffer(message.offerId) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="border-t border-line-subtle bg-white p-3">
        <div className="flex items-end gap-2 rounded-2xl bg-panel/70 p-1.5 pl-3.5 ring-1 ring-transparent focus-within:ring-primary/30">
          <textarea
            rows={1}
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
            placeholder={placeholder}
            aria-label={placeholder}
            maxLength={MAX_MESSAGE_LENGTH + 100}
            className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[13.5px] font-medium text-ink outline-none [field-sizing:content] placeholder:text-ink-3"
          />
          <button
            type="button"
            disabled={!canSend}
            onClick={() => send.mutate(draft)}
            aria-label={send.isPending ? "Sending" : "Send message"}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:bg-ink/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        {overLimit ? (
          <p className="mt-1.5 px-1 text-[11px] font-bold text-danger-ink">
            {draft.length - MAX_MESSAGE_LENGTH} characters over the limit
          </p>
        ) : null}
      </div>
    </section>
  );
}

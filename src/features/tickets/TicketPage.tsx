import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertTriangle, LifeBuoy, Lock, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { CARD } from "@/components/app/card-styles";
import { EmptyPanel, PageHeader } from "@/components/app/page";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { formatDate } from "@/lib/datetime";
import { formatDayRelative, formatTime } from "@/features/calendar/dates";
import { useAuth } from "@/providers/AuthProvider";
import { fetchTicket, fetchTicketMessages, replyToTicket } from "./api";
import { STATUS_TONE, topicOf } from "./topics";

/** One support ticket, as a conversation with the support team. */
export function TicketPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const ticket = useQuery({ queryKey: qk.tickets.detail(id), queryFn: () => fetchTicket(id) });
  const messages = useQuery({
    queryKey: qk.tickets.messages(id),
    queryFn: () => fetchTicketMessages(id),
    enabled: Boolean(id),
  });

  const reply = useMutation({
    mutationFn: (body: string) => replyToTicket(id, body),
    onSuccess: () => {
      setDraft("");
      void queryClient.invalidateQueries({ queryKey: qk.tickets.messages(id) });
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not send the reply. Try again.")),
  });

  const items = messages.data ?? [];
  useEffect(() => {
    // Scroll the message list itself, never the page around it.
    const list = scrollRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [items.length]);

  if (ticket.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <LoadingAnnounce label="Loading this ticket" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-80 w-full rounded-[20px]" />
      </div>
    );
  }

  if (ticket.isError) {
    return (
      <EmptyPanel
        tone="danger"
        icon={<AlertTriangle />}
        title="This ticket did not load"
        action={
          <Button variant="outline" onClick={() => void ticket.refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!ticket.data) {
    return (
      <EmptyPanel
        icon={<LifeBuoy />}
        title="Ticket not found"
        body="It does not exist, or it is not yours."
        action={
          <Button asChild>
            <Link to="/tickets">Back to support</Link>
          </Button>
        }
      />
    );
  }

  const spec = STATUS_TONE[ticket.data.status];
  const topic = topicOf(ticket.data.category);
  const closed = ticket.data.status === "closed";
  const canSend = draft.trim().length >= 2 && !reply.isPending;
  let lastDay = "";

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        back={{ to: "/tickets", label: "Support" }}
        title={ticket.data.subject}
        sub={
          <span className="mt-1 flex flex-wrap items-center gap-2">
            <StatusBadge tone={spec.tone} label={spec.label} />
            <span className="text-xs font-semibold text-ink-muted">
              {topic.short} · Opened {formatDate(ticket.data.createdAt)}
            </span>
          </span>
        }
      />

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={cn(CARD, "overflow-hidden p-0")}
        aria-label="Conversation with support"
      >
        <div className="flex items-center gap-3 border-b border-line-subtle px-4 py-3.5">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-info-bg text-primary" aria-hidden="true">
            <LifeBuoy className="h-5 w-5" />
          </span>
          <div>
            <h2 className="text-[15px] font-extrabold tracking-[-0.02em]">Dolancer support</h2>
            <p className="text-[11.5px] font-semibold text-ink-muted">Someone answers every ticket</p>
          </div>
        </div>

        <div ref={scrollRef} className="max-h-[min(60dvh,560px)] min-h-[14rem] space-y-2.5 overflow-y-auto bg-panel/40 px-4 py-4">
          {messages.isLoading ? (
            <>
              <Skeleton className="h-14 w-3/4 rounded-2xl" />
              <Skeleton className="ml-auto h-14 w-2/3 rounded-2xl" />
            </>
          ) : (
            items.map((message) => {
              const mine = message.authorId === user?.id;
              const day = formatDayRelative(new Date(message.createdAt));
              const showDay = day !== lastDay;
              lastDay = day;
              return (
                <div key={message.id}>
                  {showDay ? (
                    <p className="my-3 text-center text-[10.5px] font-bold uppercase tracking-[0.08em] text-ink-3">{day}</p>
                  ) : null}
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className={cn("flex", mine ? "justify-end" : "justify-start")}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-2xl px-3.5 py-2.5",
                        mine ? "rounded-br-md bg-primary text-inverse" : "rounded-bl-md bg-white text-ink ring-1 ring-ink/[0.05]",
                      )}
                    >
                      <p className="whitespace-pre-wrap break-words text-[13.5px] leading-relaxed">{message.body}</p>
                      <p className={cn("mt-1 text-right text-[10.5px] font-semibold", mine ? "text-inverse/70" : "text-ink-3")}>
                        {formatTime(new Date(message.createdAt))}
                      </p>
                    </div>
                  </motion.div>
                </div>
              );
            })
          )}
        </div>

        {closed ? (
          <p className="flex items-center gap-2 border-t border-line-subtle bg-white px-4 py-3.5 text-[13px] font-semibold text-ink-muted">
            <Lock className="h-4 w-4 shrink-0" aria-hidden="true" />
            This ticket is closed. Open a new one if you need anything else.
          </p>
        ) : (
          <div className="border-t border-line-subtle bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl bg-panel/70 p-1.5 pl-3.5 ring-1 ring-transparent focus-within:ring-primary/30">
              <textarea
                rows={1}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey && window.matchMedia("(pointer: fine)").matches) {
                    event.preventDefault();
                    if (canSend) reply.mutate(draft);
                  }
                }}
                placeholder="Write a reply"
                aria-label="Your reply"
                maxLength={4000}
                className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 text-[13.5px] font-medium text-ink outline-none [field-sizing:content] placeholder:text-ink-3"
              />
              <button
                type="button"
                disabled={!canSend}
                onClick={() => reply.mutate(draft)}
                aria-label={reply.isPending ? "Sending" : "Send reply"}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-white transition-all hover:bg-primary-hover disabled:bg-ink/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

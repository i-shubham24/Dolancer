import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { formatDateTime } from "@/lib/datetime";
import { useAuth } from "@/providers/AuthProvider";
import type { TicketStatus } from "@/types/database";
import { fetchTicket, fetchTicketMessages, replyToTicket } from "./api";

const STATUS_TONE: Record<TicketStatus, { tone: "progress" | "review" | "approved" | "changes"; label: string }> = {
  open: { tone: "progress", label: "Open" },
  pending: { tone: "review", label: "Waiting on you" },
  resolved: { tone: "approved", label: "Resolved" },
  closed: { tone: "changes", label: "Closed" },
};

export function TicketPage() {
  const { id = "" } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState("");

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
    onError: (error: Error) => toast.error(error.message),
  });

  if (ticket.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <LoadingAnnounce label="Loading this ticket" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-40 w-full rounded-xl" />
      </div>
    );
  }

  if (ticket.isError) {
    return (
      <ErrorState description="This ticket did not load." onRetry={() => void ticket.refetch()} />
    );
  }

  if (!ticket.data) {
    return (
      <EmptyState
        title="Ticket not found"
        description="This ticket does not exist, or it is not yours."
        action={
          <Button asChild>
            <Link to="/tickets">Back to support</Link>
          </Button>
        }
      />
    );
  }

  const spec = STATUS_TONE[ticket.data.status];
  const closed = ticket.data.status === "closed";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/tickets"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Support
      </Link>

      <header className="space-y-2">
        <StatusBadge tone={spec.tone} label={spec.label} />
        <h1 className="text-3xl font-extrabold tracking-[-0.035em]">{ticket.data.subject}</h1>
        <p className="text-sm text-ink-muted">Opened {formatDateTime(ticket.data.createdAt)}</p>
      </header>

      {messages.isLoading ? (
        <Skeleton className="h-32 w-full rounded-xl" />
      ) : (
        <ul className="space-y-3">
          {(messages.data ?? []).map((message) => {
            const mine = message.authorId === user?.id;
            return (
              <li key={message.id} className={cn("flex", mine ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl border-[1.5px] border-ink px-4 py-3 shadow-offset-xs",
                    mine ? "bg-lime" : "bg-surface",
                  )}
                >
                  <div className="text-2xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                    {mine ? "You" : "Support"}
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm leading-relaxed">{message.body}</p>
                  <div className="mt-1.5 text-[11px] text-ink-muted">
                    {formatDateTime(message.createdAt)}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {closed ? (
        <Card className="bg-surface-2">
          <p className="text-sm text-ink-2">
            This ticket is closed. Open a new one if you need anything else.
          </p>
        </Card>
      ) : (
        <Card className="space-y-3">
          <Textarea
            rows={4}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add to this ticket..."
            aria-label="Your reply"
          />
          <Button
            className="w-full"
            disabled={draft.trim().length < 2 || reply.isPending}
            onClick={() => reply.mutate(draft)}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {reply.isPending ? "Sending..." : "Send reply"}
          </Button>
        </Card>
      )}
    </div>
  );
}

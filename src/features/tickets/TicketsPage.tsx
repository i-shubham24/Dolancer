import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { LifeBuoy, Plus, ArrowRight } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Turnstile, turnstileConfigured } from "@/components/Turnstile";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { formatDate } from "@/lib/datetime";
import type { TicketStatus } from "@/types/database";
import { fetchTickets, openTicket, TICKET_CATEGORIES } from "./api";

const STATUS_TONE: Record<TicketStatus, { tone: "progress" | "review" | "approved" | "changes"; label: string }> = {
  open: { tone: "progress", label: "Open" },
  pending: { tone: "review", label: "Waiting on you" },
  resolved: { tone: "approved", label: "Resolved" },
  closed: { tone: "changes", label: "Closed" },
};

export function TicketsPage() {
  const [composing, setComposing] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<string>(TICKET_CATEGORIES[0].id);
  const [body, setBody] = useState("");
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  // Honeypot. Humans never see it; bots fill it, and a filled field gets a
  // fake success with no network call, so spam burns time for nothing.
  const [website, setWebsite] = useState("");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const tickets = useQuery({ queryKey: qk.tickets.list(), queryFn: fetchTickets });

  const create = useMutation({
    mutationFn: openTicket,
    onSuccess: (ticketId) => {
      toast.success("Sent. Support will pick it up.");
      void queryClient.invalidateQueries({ queryKey: qk.tickets.all() });
      setComposing(false);
      setSubject("");
      setBody("");
      navigate(`/tickets/${ticketId}`);
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not open the ticket. Try again.")),
  });

  const items = tickets.data ?? [];
  const ready =
    subject.trim().length > 3 &&
    body.trim().length > 10 &&
    (!turnstileConfigured() || captchaToken !== null);

  function handleSend() {
    if (!ready || create.isPending) return;
    if (website.trim()) {
      // Bot trap tripped. Mirror a real success so there is nothing to learn.
      toast.success("Sent. Support will pick it up.");
      setComposing(false);
      setSubject("");
      setBody("");
      setWebsite("");
      return;
    }
    create.mutate({ subject, category, body });
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Support</h1>
          <p className="mt-2 text-md text-ink-2">
            Anything about payments, a project, or your account. Someone answers every one.
          </p>
        </div>
        {!composing ? (
          <Button onClick={() => setComposing(true)}>
            <Plus className="h-4 w-4" aria-hidden="true" />
            New ticket
          </Button>
        ) : null}
      </header>

      {composing ? (
        <Card className="space-y-4">
          <h2 className="text-lg font-extrabold tracking-[-0.025em]">What is going on?</h2>

          <div className="space-y-2">
            <Label htmlFor="category">What is it about?</Label>
            <select
              id="category"
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-md border-2 border-ink bg-surface px-4 py-[11px] text-sm font-medium shadow-offset-xs outline-none transition-all focus:-translate-x-px focus:-translate-y-px focus:shadow-offset-sm"
            >
              {TICKET_CATEGORIES.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              maxLength={120}
              onChange={(event) => setSubject(event.target.value)}
              placeholder="A short summary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="body">Details</Label>
            <Textarea
              id="body"
              rows={5}
              value={body}
              maxLength={4000}
              onChange={(event) => setBody(event.target.value)}
              placeholder="What happened, and what you expected instead."
            />
          </div>

          <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="secondary"
              className="flex-1"
              onClick={() => setComposing(false)}
              disabled={create.isPending}
            >
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!ready || create.isPending}
              onClick={handleSend}
            >
              {create.isPending ? "Sending..." : "Send ticket"}
            </Button>
          </div>
          <Turnstile onVerify={setCaptchaToken} />
        </Card>
      ) : null}

      {tickets.isLoading ? (
        <div className="space-y-3">
          <LoadingAnnounce label="Loading your tickets" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : tickets.isError ? (
        <ErrorState
          description="Your tickets did not load."
          onRetry={() => void tickets.refetch()}
        />
      ) : items.length === 0 && !composing ? (
        <EmptyState
          icon={<LifeBuoy className="h-6 w-6" aria-hidden="true" />}
          title="No tickets"
          description="If something is wrong with a payment, a project, or your account, open a ticket and someone will pick it up."
          action={<Button onClick={() => setComposing(true)}>Open a ticket</Button>}
        />
      ) : (
        <ul className="space-y-3">
          {items.map((ticket) => {
            const spec = STATUS_TONE[ticket.status];
            return (
              <li key={ticket.id}>
                <Link to={`/tickets/${ticket.id}`}>
                  <Card hoverable className="flex items-center gap-4">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-extrabold tracking-[-0.01em]">
                        {ticket.subject}
                      </span>
                      <span className="mt-1 block text-xs text-ink-muted">
                        {formatDate(ticket.createdAt)}
                      </span>
                    </span>
                    <StatusBadge tone={spec.tone} label={spec.label} />
                    <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
                  </Card>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

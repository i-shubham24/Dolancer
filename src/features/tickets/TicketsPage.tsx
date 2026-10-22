import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, LifeBuoy, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { Turnstile, turnstileConfigured } from "@/components/Turnstile";
import { StatusBadge } from "@/components/brutal/StatusBadge";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { formatDate } from "@/lib/datetime";
import { fetchTickets, openTicket, TICKET_CATEGORIES } from "./api";
import { STATUS_TONE, topicOf } from "./topics";
import { cleanText } from "@/lib/input-safety";

export function TicketsPage() {
  const reduceMotion = useReducedMotion();
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

  const reset = () => {
    setComposing(false);
    setSubject("");
    setBody("");
    setWebsite("");
  };

  const create = useMutation({
    mutationFn: openTicket,
    onSuccess: (ticketId) => {
      toast.success("Sent. Support will pick it up.");
      void queryClient.invalidateQueries({ queryKey: qk.tickets.all() });
      reset();
      navigate(`/tickets/${ticketId}`);
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not open the ticket. Try again.")),
  });

  const items = tickets.data ?? [];
  const ready = subject.trim().length > 3 && body.trim().length > 10 && (!turnstileConfigured() || captchaToken !== null);

  function handleSend() {
    if (!ready || create.isPending) return;
    if (website.trim()) {
      // Bot trap tripped. Mirror a real success so there is nothing to learn.
      toast.success("Sent. Support will pick it up.");
      reset();
      return;
    }
    create.mutate({ subject, category, body });
  }

  function startWith(topic: string) {
    setCategory(topic);
    setComposing(true);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <PageHeader
        title="Support"
        sub="Payments, a task, or your account. Someone answers every ticket."
        actions={
          composing ? null : (
            <Button onClick={() => setComposing(true)}>
              <Plus className="h-4 w-4" aria-hidden="true" />
              New ticket
            </Button>
          )
        }
      />

      <CardGrid>
        <AnimatePresence initial={false}>
          {composing ? (
            <motion.section
              key="compose"
              initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -10, scale: 0.98, transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className={cn(CARD, "gap-4 p-5 sm:p-6")}
              aria-labelledby="compose"
            >
              <div className="flex items-center justify-between gap-3">
                <h2 id="compose" className="text-lg font-extrabold tracking-[-0.025em]">New ticket</h2>
                <button
                  type="button"
                  onClick={reset}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted hover:bg-panel hover:text-ink"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div role="radiogroup" aria-label="What is it about?" className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {TICKET_CATEGORIES.map((option) => {
                  const topic = topicOf(option.id);
                  const on = option.id === category;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => setCategory(option.id)}
                      className={cn(
                        "flex flex-col items-start gap-2 rounded-2xl p-3 text-left transition-all focus-visible:outline-2 focus-visible:outline-primary",
                        on ? "bg-info-bg ring-2 ring-primary" : "bg-panel/60 hover:bg-panel",
                      )}
                    >
                      <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", topic.tone)} aria-hidden="true">
                        <topic.icon className="h-4 w-4" />
                      </span>
                      <span className="text-[12.5px] font-bold leading-snug">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="subject" className="text-xs text-ink-2">Subject</Label>
                <Input id="subject" value={subject} maxLength={120} onChange={(event) => setSubject(cleanText(event.target.value, 120))} placeholder="A short summary" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="body" className="text-xs text-ink-2">Details</Label>
                <Textarea
                  id="body"
                  rows={5}
                  value={body}
                  maxLength={4000}
                  onChange={(event) => setBody(cleanText(event.target.value, 4000))}
                  placeholder="What happened, and what you expected instead."
                />
              </div>

              <div aria-hidden="true" className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(event) => setWebsite(event.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <Button variant="outline" onClick={reset} disabled={create.isPending}>
                  Cancel
                </Button>
                <Button disabled={!ready || create.isPending} onClick={handleSend}>
                  {create.isPending ? "Sending..." : "Send ticket"}
                </Button>
              </div>
              <Turnstile onVerify={setCaptchaToken} />
            </motion.section>
          ) : null}
        </AnimatePresence>

        {!composing ? (
          <motion.div variants={cardMotion} className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TICKET_CATEGORIES.map((option) => {
              const topic = topicOf(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => startWith(option.id)}
                  className={cn(
                    CARD,
                    "group items-start gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  )}
                >
                  <span className={cn("flex h-11 w-11 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", topic.tone)} aria-hidden="true">
                    <topic.icon className="h-5 w-5" />
                  </span>
                  <span className="text-[13.5px] font-extrabold leading-snug tracking-[-0.01em]">{option.label}</span>
                </button>
              );
            })}
          </motion.div>
        ) : null}

        {tickets.isLoading ? (
          <div className="space-y-3">
            <LoadingAnnounce label="Loading your tickets" />
            {Array.from({ length: 2 }, (_, index) => (
              <Skeleton key={index} className="h-[72px] w-full rounded-[20px]" />
            ))}
          </div>
        ) : tickets.isError ? (
          <EmptyPanel
            tone="danger"
            icon={<AlertTriangle />}
            title="Your tickets did not load"
            action={
              <Button variant="outline" onClick={() => void tickets.refetch()}>
                Try again
              </Button>
            }
          />
        ) : items.length === 0 ? (
          composing ? null : <EmptyPanel icon={<LifeBuoy />} title="No tickets" body="Pick a topic above if something needs a look." />
        ) : (
          <motion.section variants={cardMotion} className={cn(CARD, "gap-1 p-2.5")} aria-labelledby="yours">
            <h2 id="yours" className="px-2.5 pb-1.5 pt-1.5 text-[15px] font-extrabold tracking-[-0.02em]">Your tickets</h2>
            <ul className="flex flex-col gap-1">
              {items.map((ticket) => {
                const spec = STATUS_TONE[ticket.status];
                const topic = topicOf(ticket.category);
                return (
                  <li key={ticket.id}>
                    <Link
                      to={`/tickets/${ticket.id}`}
                      className="group flex items-center gap-3 rounded-2xl p-2.5 transition-colors hover:bg-panel/70 focus-visible:outline-2 focus-visible:outline-primary"
                    >
                      <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", topic.tone)} aria-hidden="true">
                        <topic.icon className="h-[18px] w-[18px]" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13.5px] font-bold">{ticket.subject}</span>
                        <span className="block text-xs font-semibold text-ink-muted">
                          {topic.short} · {formatDate(ticket.createdAt)}
                        </span>
                      </span>
                      <StatusBadge tone={spec.tone} label={spec.label} className="hidden shrink-0 min-[420px]:inline-flex" />
                      <ArrowRight className="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.section>
        )}
      </CardGrid>
    </div>
  );
}

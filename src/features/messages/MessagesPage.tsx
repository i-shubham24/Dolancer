import { memo, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertTriangle, ArrowLeft, ArrowRight, Briefcase, Inbox, MessagesSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD } from "@/components/app/card-styles";
import { SupervisorAvatar } from "@/components/app/SupervisorAvatar";
import { cn } from "@/lib/cn";
import { isActiveStatus, statusDisplay } from "@/lib/status";
import { useAuth } from "@/providers/AuthProvider";
import { isUnread, useChatReadStore } from "@/stores/useChatReadStore";
import { formatDayShort } from "@/features/calendar/dates";
import { Conversation } from "@/features/chat/Conversation";
import type { InboxThread } from "@/features/chat/api";
import { OfferBubble } from "./OfferBubble";
import { useInbox } from "./queries";

type Tab = "project" | "invite";

const TABS: { id: Tab; label: string; icon: typeof Briefcase }[] = [
  { id: "project", label: "Projects", icon: Briefcase },
  { id: "invite", label: "New work", icon: Inbox },
];

/** "now", "5m", "3h", "2d", "1w", then a date: the short times a chat list uses. */
function shortAgo(iso: string): string {
  const minutes = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (minutes < 1) return "now";
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d`;
  const weeks = Math.floor(days / 7);
  if (weeks < 5) return `${weeks}w`;
  return formatDayShort(new Date(iso));
}

/** Every chat displays the colorful category logo (WC, MA, etc.) so projects are distinguished at a glance. */
function Avatar({ thread, unread, size = "md" }: { thread: InboxThread; unread?: boolean; size?: "md" | "sm" }) {
  if (thread.kind === "invite") {
    const box = size === "sm" ? "h-9 w-9" : "h-12 w-12";
    return (
      <span
        className={cn(
          "relative inline-flex shrink-0 rounded-full p-[2px]",
          unread ? "bg-gradient-to-tr from-primary to-secondary" : "bg-transparent",
        )}
        aria-hidden="true"
      >
        <span className={cn("flex items-center justify-center rounded-full bg-emerald-500 text-white ring-2 ring-white shadow-xs", box)}>
          <Inbox className={size === "sm" ? "h-4 w-4" : "h-5 w-5"} />
        </span>
      </span>
    );
  }

  return (
    <SupervisorAvatar
      category={thread.category}
      size={size}
      ring={unread}
    />
  );
}

const ThreadRow = memo(function ThreadRow({
  thread,
  unread,
  selected,
  mine,
}: {
  thread: InboxThread;
  unread: boolean;
  selected: boolean;
  mine: boolean;
}) {
  return (
    <Link
      to={`/messages/${thread.id}`}
      aria-current={selected ? "true" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-primary",
        selected ? "bg-info-bg" : "hover:bg-panel/70",
      )}
    >
      <Avatar thread={thread} unread={unread} />
      <span className="min-w-0 flex-1">
        <span className={cn("block truncate text-[13.5px]", unread ? "font-extrabold text-ink" : "font-bold text-ink")}>{thread.title}</span>
        <span className={cn("flex min-w-0 gap-1 text-[12.5px]", unread ? "font-bold text-ink" : "font-medium text-ink-muted")}>
          <span className="truncate">
            {thread.last ? `${mine ? "You: " : ""}${thread.last.body}` : "No messages yet"}
          </span>
          {thread.last ? <span className="shrink-0 text-ink-3">· {shortAgo(thread.last.createdAt)}</span> : null}
        </span>
      </span>
      {unread ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" /> : null}
    </Link>
  );
});

function ThreadHeader({ thread }: { thread: InboxThread }) {
  const status = thread.status ? statusDisplay(thread.status, thread.workingDocUrl) : null;
  return (
    <div className="flex items-center gap-3 border-b border-line-subtle px-3 py-3 sm:px-4">
      <Link
        to="/messages"
        aria-label="Back to all messages"
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-ink-2 hover:bg-panel md:hidden"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <Avatar thread={thread} size="sm" />
      <div className="min-w-0 flex-1">
        <h2 className="truncate text-[15px] font-extrabold tracking-[-0.02em]">{thread.title}</h2>
        <p className="truncate text-[11.5px] font-semibold text-ink-muted">
          Supervisor · {thread.kind === "invite" ? "New work for you" : status?.label ?? "Task"}
        </p>
      </div>
      {thread.kind === "project" && thread.projectId ? (
        <Button asChild variant="outline" size="sm" className="shrink-0">
          <Link to={`/work/${thread.projectId}`}>
            <span className="hidden sm:inline">Open task</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      ) : null}
    </div>
  );
}

/**
 * Messages, set out like a direct-message inbox: every conversation on the left,
 * the open one on the right. Two kinds of chat, in two tabs: the supervisor thread
 * on each task, and supervisors reaching out about new work.
 *
 * On a phone it is one or the other: the list, or the open chat with a back arrow.
 */
export function MessagesPage() {
  const { threadId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const inbox = useInbox();
  const since = useChatReadStore((state) => state.since);
  const readAt = useChatReadStore((state) => state.readAt);
  const [query, setQuery] = useState("");
  const [tabChoice, setTabChoice] = useState<Tab | null>(null);

  const threads = useMemo(() => inbox.data ?? [], [inbox.data]);
  const selected = threads.find((thread) => thread.id === threadId) ?? null;
  const tab: Tab = tabChoice ?? selected?.kind ?? "project";
  const unread = (thread: InboxThread) => isUnread(thread, user?.id, { since, readAt });

  // On a wide screen, open the newest conversation rather than an empty pane.
  useEffect(() => {
    if (threadId || threads.length === 0) return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    const first = threads.find((thread) => thread.kind === tab) ?? threads[0];
    if (first) navigate(`/messages/${first.id}`, { replace: true });
  }, [threadId, threads, tab, navigate]);

  const q = query.trim().toLowerCase();
  const visible = threads.filter(
    (thread) =>
      thread.kind === tab &&
      (!q || thread.title.toLowerCase().includes(q) || thread.last?.body.toLowerCase().includes(q)),
  );
  const ongoing = visible.filter((thread) => thread.kind === "invite" || (thread.status && isActiveStatus(thread.status)));
  const finished = visible.filter((thread) => thread.kind === "project" && thread.status && !isActiveStatus(thread.status));
  const counts = {
    project: threads.filter((thread) => thread.kind === "project" && unread(thread)).length,
    invite: threads.filter((thread) => thread.kind === "invite" && unread(thread)).length,
  };

  return (
    <div
      className={cn(
        CARD,
        "grid h-[calc(100dvh-6.5rem)] min-h-[480px] grid-cols-[minmax(0,1fr)] overflow-hidden p-0 md:grid-cols-[300px_minmax(0,1fr)] lg:h-[calc(100dvh-8.25rem)] xl:grid-cols-[360px_minmax(0,1fr)]",
      )}
    >
      <aside className={cn("min-h-0 min-w-0 flex-col border-line-subtle md:flex md:border-r", selected ? "hidden" : "flex")} aria-label="Conversations">
        <div className="px-4 pb-3 pt-4">
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-[22px] font-extrabold tracking-[-0.035em]">Messages</h1>
            {counts.project + counts.invite > 0 ? (
              <span className="rounded-full bg-primary px-2.5 py-1 text-[11px] font-extrabold text-white">{counts.project + counts.invite} new</span>
            ) : null}
          </div>
          <label className="mt-3 flex h-10 items-center gap-2 rounded-xl bg-panel/70 px-3 ring-1 ring-transparent focus-within:bg-white focus-within:ring-primary/30">
            <Search className="h-4 w-4 shrink-0 text-ink-3" aria-hidden="true" />
            <span className="sr-only">Search messages</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              className="h-full min-w-0 flex-1 bg-transparent text-[13.5px] font-medium outline-none placeholder:text-ink-3"
            />
          </label>
          <div role="tablist" aria-label="Kind of chat" className="mt-3 flex gap-1 rounded-full bg-panel p-1">
            {TABS.map((option) => {
              const active = option.id === tab;
              return (
                <button
                  key={option.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTabChoice(option.id)}
                  className={cn(
                    "relative flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[12.5px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    active ? "text-ink" : "text-ink-muted hover:text-ink",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="inbox-tab"
                      className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                      transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    />
                  ) : null}
                  <option.icon className="relative h-3.5 w-3.5" aria-hidden="true" />
                  <span className="relative">{option.label}</span>
                  {counts[option.id] > 0 ? (
                    <span className="relative rounded-full bg-primary px-1.5 text-[10.5px] font-extrabold text-white">{counts[option.id]}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-2 pb-3">
          {inbox.isLoading ? (
            <div className="space-y-2 px-2">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="flex items-center gap-3 py-1.5">
                  <span className="skeleton h-12 w-12 rounded-full" />
                  <span className="flex-1 space-y-2">
                    <span className="skeleton block h-3 w-3/4 rounded" />
                    <span className="skeleton block h-3 w-1/2 rounded" />
                  </span>
                </div>
              ))}
            </div>
          ) : inbox.isError ? (
            <div className="flex flex-col items-center gap-3 px-4 py-10 text-center">
              <AlertTriangle className="h-5 w-5 text-danger-ink" aria-hidden="true" />
              <p className="text-sm font-bold">Messages did not load.</p>
              <Button variant="outline" size="sm" onClick={() => void inbox.refetch()}>
                Try again
              </Button>
            </div>
          ) : visible.length === 0 ? (
            <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-info-bg text-primary" aria-hidden="true">
                {tab === "invite" ? <Inbox className="h-5 w-5" /> : <MessagesSquare className="h-5 w-5" />}
              </span>
              <p className="text-[14px] font-extrabold">{q ? "No matches" : tab === "invite" ? "No new work chats" : "No project chats yet"}</p>
              <p className="text-xs font-medium text-ink-muted">
                {q ? "Try another word." : tab === "invite" ? "Supervisors write here when they have work for you." : "Each task you accept gets a chat with its supervisor."}
              </p>
            </div>
          ) : (
            <ul className="space-y-0.5">
              {ongoing.map((thread) => (
                <li key={thread.id}>
                  <ThreadRow thread={thread} unread={unread(thread)} selected={thread.id === threadId} mine={thread.last?.authorId === user?.id} />
                </li>
              ))}
              {finished.length > 0 ? (
                <li className="px-3 pb-1 pt-4 text-[10.5px] font-bold uppercase tracking-[0.1em] text-ink-3" aria-hidden="true">
                  Finished
                </li>
              ) : null}
              {finished.map((thread) => (
                <li key={thread.id}>
                  <ThreadRow thread={thread} unread={unread(thread)} selected={thread.id === threadId} mine={thread.last?.authorId === user?.id} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <div className={cn("min-h-0 min-w-0 flex-col", selected ? "flex" : "hidden md:flex")}>
        {selected ? (
          <div className="flex h-full min-h-0 flex-col">
            <Conversation
              threadId={selected.id}
              header={<ThreadHeader thread={selected} />}
              label={`Chat about ${selected.title}`}
              fill
              className="h-full min-h-0 rounded-none shadow-none ring-0 hover:shadow-none"
              emptyText={selected.kind === "invite" ? "Ask your supervisor anything about this work." : undefined}
              renderOffer={(offerId) => <OfferBubble offerId={offerId} />}
            />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-8 text-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full ring-2 ring-ink/80" aria-hidden="true">
              <MessagesSquare className="h-7 w-7" />
            </span>
            <p className="text-lg font-extrabold tracking-[-0.02em]">{threadId && !inbox.isLoading ? "Chat not found" : "Your messages"}</p>
            <p className="max-w-xs text-sm text-ink-muted">Talk to your supervisors about tasks and new work.</p>
          </div>
        )}
      </div>
    </div>
  );
}

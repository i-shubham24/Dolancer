import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, BellOff, CheckCheck, ChevronRight } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { Segments } from "@/components/app/ui";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { timeAgo } from "@/lib/datetime";
import { popupKindFor } from "@/stores/usePopupStore";
import { formatDayRelative } from "@/features/calendar/dates";
import { markAllRead, markRead, useNotifications, type Notification } from "./api";
import { KIND_STYLE } from "./kinds";

function dayGroup(iso: string): string {
  const label = formatDayRelative(new Date(iso));
  return label === "Today" || label === "Yesterday" ? label : "Earlier";
}

/**
 * Alerts, newest first, grouped by day. Each has one icon and colour for its kind,
 * a line of text and when it happened. Opening one marks it read.
 */
export function NotificationsPage() {
  const reduceMotion = useReducedMotion();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const notifications = useNotifications();
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const refresh = () => void queryClient.invalidateQueries({ queryKey: qk.notifications.all() });
  const markAll = useMutation({ mutationFn: markAllRead, onSuccess: refresh });
  const markOne = useMutation({ mutationFn: markRead, onSuccess: refresh });

  const items = notifications.data ?? [];
  const unread = items.filter((item) => !item.readAt).length;
  const visible = filter === "unread" ? items.filter((item) => !item.readAt) : items;

  const groups = useMemo(() => {
    const map = new Map<string, Notification[]>();
    for (const item of visible) {
      const key = dayGroup(item.createdAt);
      const list = map.get(key);
      if (list) list.push(item);
      else map.set(key, [item]);
    }
    return [...map.entries()];
  }, [visible]);

  function open(item: Notification) {
    if (!item.readAt) markOne.mutate(item.id);
    if (item.deepLink) navigate(item.deepLink);
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        eyebrow="Updates"
        title="Alerts"
        sub={unread > 0 ? `${unread} new` : "You are all caught up."}
        actions={
          unread > 0 ? (
            <Button variant="outline" onClick={() => markAll.mutate()} disabled={markAll.isPending}>
              <CheckCheck className="h-4 w-4" aria-hidden="true" />
              {markAll.isPending ? "Marking..." : "Mark all read"}
            </Button>
          ) : null
        }
      />

      {items.length > 0 ? (
        <Segments
          label="Show alerts"
          value={filter}
          onChange={setFilter}
          className="mb-4 w-fit"
          options={[
            { id: "all", label: `All ${items.length}` },
            { id: "unread", label: `Unread ${unread}` },
          ]}
        />
      ) : null}

      {notifications.isLoading ? (
        <div className="space-y-2.5">
          <LoadingAnnounce label="Loading your alerts" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-[72px] w-full rounded-[20px]" />
          ))}
        </div>
      ) : notifications.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Alerts did not load"
          action={
            <Button variant="outline" onClick={() => void notifications.refetch()}>
              Try again
            </Button>
          }
        />
      ) : visible.length === 0 ? (
        <EmptyPanel
          icon={<BellOff />}
          title={filter === "unread" ? "No unread alerts" : "Nothing yet"}
          body={filter === "unread" ? undefined : "New work, supervisor replies and payouts show up here."}
        />
      ) : (
        <CardGrid className="gap-5">
          {groups.map(([label, list]) => (
            <motion.section key={label} variants={cardMotion} aria-label={label}>
              <h2 className="mb-2 px-1 text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{label}</h2>
              <ul className={cn(CARD, "gap-1 p-2")}>
                <AnimatePresence initial={false}>
                  {list.map((item, index) => {
                    const style = KIND_STYLE[popupKindFor(item.type)];
                    return (
                      <motion.li
                        key={item.id}
                        layout={!reduceMotion}
                        initial={reduceMotion ? false : { opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, delay: reduceMotion ? 0 : 0.15 + index * 0.05 }}
                      >
                        <button
                          type="button"
                          onClick={() => open(item)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-2xl p-2.5 text-left transition-colors",
                            "hover:bg-panel/70 focus-visible:outline-2 focus-visible:outline-primary",
                            !item.readAt && "bg-info-bg/50",
                          )}
                        >
                          <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl", style.tile)} aria-hidden="true">
                            <style.icon className="h-[18px] w-[18px]" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className={cn("block truncate text-[14px] text-ink", item.readAt ? "font-semibold" : "font-extrabold")}>
                              {item.title}
                            </span>
                            <span className="mt-0.5 block text-xs font-semibold text-ink-muted">
                              {style.label} · {timeAgo(item.createdAt)}
                            </span>
                          </span>
                          {!item.readAt ? <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-primary" aria-label="Unread" /> : null}
                          {item.deepLink ? (
                            <ChevronRight className="h-4 w-4 shrink-0 text-ink-3 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                          ) : null}
                        </button>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </motion.section>
          ))}
        </CardGrid>
      )}
    </div>
  );
}

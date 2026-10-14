import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { qk } from "@/lib/query-keys";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { useNotificationStream } from "@/lib/realtime";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { markAllRead, useNotifications } from "./api";

export function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notifications = useNotifications();

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: qk.notifications.all() });
  }, [queryClient]);

  useNotificationStream(user?.id ?? null, refresh);

  const markRead = useMutation({
    mutationFn: markAllRead,
    onSuccess: refresh,
  });

  const items = notifications.data ?? [];
  const unread = items.filter((item) => !item.readAt).length;

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Alerts</h1>
          <p className="mt-2 text-md text-ink-2">
            {unread > 0 ? `${unread} unread` : "You are up to date."}
          </p>
        </div>
        {unread > 0 ? (
          <Button variant="outline" onClick={() => markRead.mutate()} disabled={markRead.isPending}>
            <CheckCheck className="h-4 w-4" aria-hidden="true" />
            {markRead.isPending ? "Marking..." : "Mark all read"}
          </Button>
        ) : null}
      </header>

      {notifications.isLoading ? (
        <div className="space-y-3">
          <LoadingAnnounce label="Loading your alerts" />
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      ) : notifications.isError ? (
        <ErrorState
          description="Your alerts did not load."
          onRetry={() => void notifications.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<BellOff className="h-6 w-6" aria-hidden="true" />}
          title="Nothing yet"
          description="We will tell you here when work is assigned, when your supervisor replies, and when a payout goes out."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const body = (
              <Card
                hoverable={Boolean(item.deepLink)}
                className={cn(
                  "flex items-center gap-3.5",
                  !item.readAt && "border bg-[color-mix(in_srgb,var(--dl-card-yellow)_25%,white)]",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-line-card",
                    item.readAt ? "bg-subtle text-ink-muted" : "bg-[var(--dl-card-yellow)]",
                  )}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold tracking-[-0.01em]">
                    {item.title}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {formatDateTime(item.createdAt)}
                  </span>
                </span>
                {!item.readAt ? (
                  <span className="h-2 w-2 shrink-0 rounded-full bg-primary" aria-label="Unread" />
                ) : null}
              </Card>
            );

            return (
              <li key={item.id}>
                {item.deepLink ? (
                  <Link to={item.deepLink} className="block">
                    {body}
                  </Link>
                ) : (
                  body
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

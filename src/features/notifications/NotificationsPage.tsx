import { useCallback } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell, BellOff, CheckCheck } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { demo, demoRespond, isDemo } from "@/lib/demo-data";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
import { formatDateTime } from "@/lib/datetime";
import { cn } from "@/lib/cn";
import { useAuth } from "@/providers/AuthProvider";
import { useNotificationStream } from "@/lib/realtime";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import type { NotificationRow } from "@/types/database";

/**
 * Notification copy lives here, not in the database.
 *
 * Rows are content free by construction: they carry a template key, entity ids and
 * a deep link, and there is no body column for a message, a name, or anything
 * doer-identifying to be stored in. So the client renders fixed copy per template,
 * and an unknown key degrades to something neutral rather than exposing the raw key.
 */
const TEMPLATES: Record<string, string> = {
  quote_ready: "A quote is ready",
  payment_held: "Payment confirmed, work can start",
  project_delivered: "Work delivered",
  project_approved: "Your work was approved",
  revision_requested: "Changes requested",
  payout_released: "A payout was released",
  message_posted: "New message from your supervisor",
  verification_approved: "You are verified",
  verification_rejected: "Verification needs another look",
};

interface Notification {
  id: string;
  title: string;
  deepLink: string | null;
  readAt: string | null;
  createdAt: string;
}

async function fetchNotificationRows(): Promise<NotificationRow[]> {
  if (isDemo()) return demoRespond(() => demo.notifications);

  const { data, error } = await supabase
    .from("notifications")
    .select(selectColumns("id", "template_type", "deep_link", "read_at", "created_at"))
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);
  return (data as unknown as NotificationRow[] | null) ?? [];
}

async function fetchNotifications(): Promise<Notification[]> {
  return (await fetchNotificationRows()).map((row) => ({
    id: row.id,
    title: TEMPLATES[row.template_type] ?? "Something happened on your work",
    deepLink: row.deep_link,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));
}

async function markAllRead(): Promise<void> {
  if (isDemo()) {
    return demoRespond(() => {
      const readAt = new Date().toISOString();
      for (const row of demo.notifications) row.read_at ??= readAt;
    });
  }

  // read_at is the only column granted for update on this table.
  const { error } = await supabase
    .from("notifications")
    .update({ read_at: new Date().toISOString() })
    .is("read_at", null);
  if (error) throw new Error(error.message);
}

export function NotificationsPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const notifications = useQuery({
    queryKey: qk.notifications.list(),
    queryFn: fetchNotifications,
  });

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
          <Button variant="secondary" onClick={() => markRead.mutate()} disabled={markRead.isPending}>
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
                  !item.readAt && "border-2 bg-lime-light",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink",
                    item.readAt ? "bg-subtle text-ink-muted" : "bg-lime",
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
                  <span className="h-2 w-2 shrink-0 rounded-full bg-coral" aria-label="Unread" />
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

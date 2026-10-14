import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { demo, demoRespond, isDemo } from "@/lib/demo-data";
import { selectColumns } from "@/lib/select";
import { qk } from "@/lib/query-keys";
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

export interface Notification {
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

export async function fetchNotifications(): Promise<Notification[]> {
  return (await fetchNotificationRows()).map((row) => ({
    id: row.id,
    title: TEMPLATES[row.template_type] ?? "Something happened on your work",
    deepLink: row.deep_link,
    readAt: row.read_at,
    createdAt: row.created_at,
  }));
}

export async function markAllRead(): Promise<void> {
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

/** The alert list, shared by the Alerts page and the bell in the app shell. */
export function useNotifications() {
  return useQuery({ queryKey: qk.notifications.list(), queryFn: fetchNotifications });
}

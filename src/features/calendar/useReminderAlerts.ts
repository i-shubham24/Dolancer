import { useEffect, useRef } from "react";
import { useReminders } from "@/stores/useReminderStore";
import { usePopupStore } from "@/stores/usePopupStore";

const CHECK_EVERY_MS = 30_000;
/** A reminder missed by more than this is marked seen quietly instead of popping up. */
const STALE_AFTER_MS = 12 * 60 * 60 * 1000;

/**
 * Shows a reminder once its time comes, while the app is open.
 *
 * This is an in-app alert only. Browser notifications would need a permission
 * prompt and a service worker, and a reminder that silently fails to fire on a
 * closed tab is worse than one that is honest about where it appears.
 */
export function useReminderAlerts() {
  const { reminders, markAlerted } = useReminders();
  const latest = useRef({ reminders, markAlerted });
  latest.current = { reminders, markAlerted };

  useEffect(() => {
    function check() {
      const now = Date.now();
      const due = latest.current.reminders.filter(
        (reminder) => !reminder.alerted && new Date(reminder.at).getTime() <= now,
      );
      if (due.length === 0) return;
      for (const reminder of due) {
        if (now - new Date(reminder.at).getTime() > STALE_AFTER_MS) continue;
        usePopupStore.getState().push({
          id: `reminder-${reminder.id}`,
          kind: "reminder",
          title: reminder.title,
          body: "Your reminder",
          href: reminder.projectId ? `/work/${reminder.projectId}` : "/calendar",
        });
      }
      latest.current.markAlerted(due.map((reminder) => reminder.id));
    }

    check();
    const timer = window.setInterval(check, CHECK_EVERY_MS);
    return () => window.clearInterval(timer);
  }, []);
}

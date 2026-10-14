import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { useNotificationStream } from "@/lib/realtime";
import { demoSimulateEvent, demoSimulateInvite, isDemo } from "@/lib/demo-data";
import { useAuth } from "@/providers/AuthProvider";
import { popupKindFor, usePopupStore } from "@/stores/usePopupStore";
import { useNotifications } from "./api";

const DEMO_EVENT_AFTER_MS = 25_000;
const DEMO_INVITE_AFTER_MS = 60_000;
const DEMO_FLAG = "dolancer.demo.eventShown";
const DEMO_INVITE_FLAG = "dolancer.demo.inviteShown";

/**
 * Turns new alerts into pop-ups, wherever the doer is in the app.
 *
 * The first list that loads is treated as already seen, so opening the app never
 * replays old alerts; only ones that arrive afterwards pop up. New ones come in
 * over the private realtime channel, with a light poll behind it.
 */
export function useNotificationPopups() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const notifications = useNotifications();
  const push = usePopupStore((state) => state.push);
  const seen = useRef<Set<string> | null>(null);

  const refresh = useCallback(() => {
    void queryClient.invalidateQueries({ queryKey: qk.notifications.all() });
  }, [queryClient]);
  useNotificationStream(user?.id ?? null, refresh);

  useEffect(() => {
    const items = notifications.data;
    if (!items) return;
    if (seen.current === null) {
      seen.current = new Set(items.map((item) => item.id));
      return;
    }
    for (const item of [...items].reverse()) {
      if (seen.current.has(item.id)) continue;
      seen.current.add(item.id);
      if (item.readAt) continue;
      push({ id: item.id, kind: popupKindFor(item.type), title: item.title, href: item.deepLink });
    }
  }, [notifications.data, push]);

  // The demo has no server to send anything, so once per visit it plays one
  // supervisor message, to show what a live alert looks like.
  useEffect(() => {
    if (!isDemo()) return;
    try {
      if (sessionStorage.getItem(DEMO_FLAG)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(DEMO_FLAG, "1");
      } catch {
        // Storage blocked: it may play again next visit, which is harmless.
      }
      demoSimulateEvent();
      refresh();
      // The new message is in the thread too, so an open chat picks it up.
      void queryClient.invalidateQueries({ queryKey: qk.work.all() });
    }, DEMO_EVENT_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [refresh, queryClient]);

  // And once, a little later, a supervisor starts a chat about new work.
  useEffect(() => {
    if (!isDemo()) return;
    try {
      if (sessionStorage.getItem(DEMO_INVITE_FLAG)) return;
    } catch {
      return;
    }
    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(DEMO_INVITE_FLAG, "1");
      } catch {
        // Storage blocked: harmless, it may play again next visit.
      }
      if (!demoSimulateInvite()) return;
      refresh();
      void queryClient.invalidateQueries({ queryKey: qk.work.inbox() });
    }, DEMO_INVITE_AFTER_MS);
    return () => window.clearTimeout(timer);
  }, [refresh, queryClient]);
}

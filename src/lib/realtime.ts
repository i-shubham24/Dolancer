import { useEffect } from "react";
import { supabase } from "./supabase";
import { isDemo } from "./demo-data";

/**
 * Realtime subscriptions.
 *
 * Three rules, all load bearing:
 *
 * 1. Every channel is PRIVATE. Realtime authorization is a separate policy layer
 *    from table RLS, evaluated at channel join, and a public channel bypasses it
 *    entirely. A public channel here would hand out doer messages to anyone who
 *    guessed the topic.
 * 2. setAuth() is called with no argument, so the client reads the current session
 *    itself rather than being handed a token that can go stale.
 * 3. Delivery is broadcast-from-database, never postgres_changes, which skips RLS
 *    on DELETE and does not scale.
 *
 * The topic format is not cosmetic: the realtime.messages policy parses the uuid
 * back out of the topic string and re-derives the same canRead predicate the tables
 * use, so a malformed topic simply fails to join.
 */

export const topics = {
  thread: (threadId: string) => `thread:${threadId}`,
  project: (projectId: string) => `project:${projectId}`,
  notifications: (userId: string) => `notifications:${userId}`,
} as const;

type BroadcastHandler = (payload: unknown) => void;

function subscribe(topic: string, event: string, handler: BroadcastHandler): () => void {
  if (isDemo()) return () => {};

  let disposed = false;
  let cleanup: (() => void) | null = null;

  void (async () => {
    await supabase.realtime.setAuth();
    // The component may have unmounted during the await; joining now would leak a
    // channel nobody removes.
    if (disposed) return;

    const channel = supabase.channel(topic, { config: { private: true } });
    channel.on("broadcast", { event }, (message) => handler(message));
    channel.subscribe();

    cleanup = () => {
      void supabase.removeChannel(channel);
    };
  })();

  return () => {
    disposed = true;
    cleanup?.();
  };
}

/** New messages in a thread. The payload carries the full message row. */
export function useThreadStream(threadId: string | null, onMessage: (payload: unknown) => void) {
  useEffect(() => {
    if (!threadId) return;
    return subscribe(topics.thread(threadId), "INSERT", onMessage);
  }, [threadId, onMessage]);
}

/** Project changes. Content free: the payload is only the project id. */
export function useProjectChanges(projectId: string | null, onChange: () => void) {
  useEffect(() => {
    if (!projectId) return;
    return subscribe(topics.project(projectId), "change", onChange);
  }, [projectId, onChange]);
}

/** New notifications. Content free: the payload is only the notification id. */
export function useNotificationStream(userId: string | null, onNew: () => void) {
  useEffect(() => {
    if (!userId) return;
    return subscribe(topics.notifications(userId), "new", onNew);
  }, [userId, onNew]);
}

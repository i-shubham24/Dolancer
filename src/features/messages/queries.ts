import { useQuery } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/providers/AuthProvider";
import { isUnread, useChatReadStore } from "@/stores/useChatReadStore";
import { fetchInbox } from "@/features/chat/api";

export function useInbox() {
  return useQuery({ queryKey: qk.work.inbox(), queryFn: fetchInbox, refetchInterval: 60_000 });
}

/** How many conversations have something the doer has not seen, for the nav badge. */
export function useUnreadChats(): number {
  const { user } = useAuth();
  const inbox = useInbox();
  const since = useChatReadStore((state) => state.since);
  const readAt = useChatReadStore((state) => state.readAt);
  return (inbox.data ?? []).filter((thread) => isUnread(thread, user?.id, { since, readAt })).length;
}

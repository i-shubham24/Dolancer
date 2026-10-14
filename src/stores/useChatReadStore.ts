import { create } from "zustand";
import { persist } from "zustand/middleware";

const TWO_DAYS_MS = 2 * 86_400_000;

/**
 * When the doer last looked at each conversation, so the inbox can show what is new.
 *
 * Messages have no read receipts on the server, so this lives on the device. A
 * thread never opened here counts as read up to `since`, which keeps old history
 * from all showing as unread the first time the inbox loads.
 */
interface ChatReadState {
  since: string;
  readAt: Record<string, string>;
  markRead: (threadId: string) => void;
}

export const useChatReadStore = create<ChatReadState>()(
  persist(
    (set) => ({
      since: new Date(Date.now() - TWO_DAYS_MS).toISOString(),
      readAt: {},
      markRead: (threadId) => set((state) => ({ readAt: { ...state.readAt, [threadId]: new Date().toISOString() } })),
    }),
    { name: "dolancer.chat.read" },
  ),
);

/** True when the newest message is from someone else and arrived after the last look. */
export function isUnread(
  thread: { id: string; last: { authorId: string; createdAt: string } | null },
  userId: string | undefined,
  read: { since: string; readAt: Record<string, string> },
): boolean {
  const last = thread.last;
  if (!last || last.authorId === userId) return false;
  return last.createdAt > (read.readAt[thread.id] ?? read.since);
}

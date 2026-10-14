import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "@/providers/AuthProvider";

/**
 * Personal reminders.
 *
 * There is no reminders table on the backend yet, so these live in this browser
 * only and the UI says so wherever a reminder is created. They are keyed by user id
 * so two people sharing a laptop never see each other's notes. Nothing here is a
 * source of truth about the platform; it is the doer's own notepad with dates.
 */
export interface Reminder {
  id: string;
  title: string;
  /** ISO timestamp of when to remind. */
  at: string;
  /** Optional link to one of the doer's own tasks. */
  projectId: string | null;
  createdAt: string;
  /** Set once the in-app alert has been shown, so it fires only once. */
  alerted: boolean;
}

export type NewReminder = Pick<Reminder, "title" | "at" | "projectId">;

interface ReminderState {
  byUser: Record<string, Reminder[]>;
  add: (userId: string, input: NewReminder) => Reminder;
  remove: (userId: string, id: string) => void;
  markAlerted: (userId: string, ids: string[]) => void;
}

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }
}

export const useReminderStore = create<ReminderState>()(
  persist(
    (set) => ({
      byUser: {},
      add: (userId, input) => {
        const reminder: Reminder = {
          id: newId(),
          title: input.title.trim(),
          at: input.at,
          projectId: input.projectId,
          createdAt: new Date().toISOString(),
          alerted: false,
        };
        set((state) => ({
          byUser: { ...state.byUser, [userId]: [...(state.byUser[userId] ?? []), reminder] },
        }));
        return reminder;
      },
      remove: (userId, id) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: (state.byUser[userId] ?? []).filter((reminder) => reminder.id !== id),
          },
        })),
      markAlerted: (userId, ids) =>
        set((state) => ({
          byUser: {
            ...state.byUser,
            [userId]: (state.byUser[userId] ?? []).map((reminder) =>
              ids.includes(reminder.id) ? { ...reminder, alerted: true } : reminder,
            ),
          },
        })),
    }),
    { name: "dolancer.reminders", version: 1 },
  ),
);

/** A stable empty list, so selectors do not hand React a new array on every render. */
const NONE: Reminder[] = [];

/** The signed-in doer's reminders, oldest first, plus actions bound to them. */
export function useReminders() {
  const { user } = useAuth();
  const userId = user?.id ?? "signed-out";
  const reminders = useReminderStore((state) => state.byUser[userId] ?? NONE);
  const add = useReminderStore((state) => state.add);
  const remove = useReminderStore((state) => state.remove);
  const markAlerted = useReminderStore((state) => state.markAlerted);

  return {
    reminders,
    add: (input: NewReminder) => add(userId, input),
    remove: (id: string) => remove(userId, id),
    markAlerted: (ids: string[]) => markAlerted(userId, ids),
  };
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useAuth } from "@/providers/AuthProvider";

/**
 * The work timer.
 *
 * A private stopwatch per task, so a doer can see roughly what a fixed-pay task
 * earned them per hour. It is stored in this browser only: the supervisor never
 * sees it and it plays no part in pay or review, and the card says so.
 *
 * A session holds the time banked by earlier play/pause cycles plus the moment the
 * current run started, so a running timer survives a reload or a closed tab and
 * picks up where the clock really is.
 */
export interface TimerSession {
  projectId: string;
  /** Time banked by earlier runs in this session. */
  bankedMs: number;
  /** Epoch ms of the current run, or null while paused. */
  startedAt: number | null;
}

interface UserTimer {
  /** Time already saved per task by stopped sessions. */
  totals: Record<string, number>;
  session: TimerSession | null;
  selected: string | null;
}

interface TimerState {
  byUser: Record<string, UserTimer>;
  select: (userId: string, projectId: string) => void;
  play: (userId: string) => void;
  pause: (userId: string) => void;
  /** Ends the session, saves its time to the task total, and returns it in ms. */
  stop: (userId: string) => number;
}

const EMPTY: UserTimer = { totals: {}, session: null, selected: null };

export function sessionElapsed(session: TimerSession | null, now: number): number {
  if (!session) return 0;
  return session.bankedMs + (session.startedAt ? Math.max(0, now - session.startedAt) : 0);
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => {
      const patch = (userId: string, next: (current: UserTimer) => UserTimer) =>
        set((state) => ({
          byUser: { ...state.byUser, [userId]: next(state.byUser[userId] ?? EMPTY) },
        }));

      return {
        byUser: {},
        select: (userId, projectId) =>
          patch(userId, (current) =>
            // Switching task mid-session would split one run across two tasks.
            current.session ? current : { ...current, selected: projectId },
          ),
        play: (userId) =>
          patch(userId, (current) => {
            const projectId = current.session?.projectId ?? current.selected;
            if (!projectId) return current;
            if (current.session?.startedAt) return current;
            return {
              ...current,
              session: {
                projectId,
                bankedMs: current.session?.bankedMs ?? 0,
                startedAt: Date.now(),
              },
            };
          }),
        pause: (userId) =>
          patch(userId, (current) => {
            if (!current.session?.startedAt) return current;
            return {
              ...current,
              session: {
                ...current.session,
                bankedMs: sessionElapsed(current.session, Date.now()),
                startedAt: null,
              },
            };
          }),
        stop: (userId) => {
          const current = get().byUser[userId] ?? EMPTY;
          const session = current.session;
          if (!session) return 0;
          const elapsed = sessionElapsed(session, Date.now());
          patch(userId, (latest) => ({
            ...latest,
            session: null,
            totals: {
              ...latest.totals,
              [session.projectId]: (latest.totals[session.projectId] ?? 0) + elapsed,
            },
          }));
          return elapsed;
        },
      };
    },
    { name: "dolancer.timer", version: 1 },
  ),
);

/** The signed-in doer's timer state, plus actions bound to them. */
export function useWorkTimer() {
  const { user } = useAuth();
  const userId = user?.id ?? "signed-out";
  const timer = useTimerStore((state) => state.byUser[userId] ?? EMPTY);
  const select = useTimerStore((state) => state.select);
  const play = useTimerStore((state) => state.play);
  const pause = useTimerStore((state) => state.pause);
  const stop = useTimerStore((state) => state.stop);

  return {
    ...timer,
    select: (projectId: string) => select(userId, projectId),
    play: () => play(userId),
    pause: () => pause(userId),
    stop: () => stop(userId),
  };
}

import { useEffect, useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/providers/AuthProvider";
import { MAX_ACTIVE_PROJECTS } from "@/lib/constants";
import { useAvailabilityStore, isAtCap } from "@/stores/useAvailabilityStore";
import { usePopupStore } from "@/stores/usePopupStore";
import {
  fetchActiveProjects,
  fetchEarningsSummary,
  fetchGateState,
  fetchPoolPreview,
  fetchProfile,
  setAvailability,
} from "./api";

export function useProfile() {
  return useQuery({ queryKey: qk.profile(), queryFn: fetchProfile });
}

export function useGateState() {
  const { role } = useAuth();
  return useQuery({
    queryKey: [...qk.gate(), role],
    queryFn: () => fetchGateState(role),
  });
}

export function useActiveProjects() {
  return useQuery({ queryKey: qk.work.list("active"), queryFn: fetchActiveProjects });
}

export function useEarningsSummary() {
  return useQuery({ queryKey: qk.earnings.summary(), queryFn: fetchEarningsSummary });
}

export function usePoolPreview() {
  return useQuery({ queryKey: qk.pool.list(), queryFn: () => fetchPoolPreview(3) });
}

/**
 * Availability, the concurrency cap, and the link between them.
 *
 * Query owns the server truth; the Zustand store holds the optimistic value so the
 * toggle responds instantly. Reaching the cap flips availability off (see
 * useAvailabilityAutopilot), which is a real effect rather than a cosmetic one:
 * doer_pool requires profiles.available, so the board genuinely empties.
 *
 * The cap itself is only a UI guardrail. claim_project_as_doer has no such
 * predicate and is directly callable, so this stops the button, not the claim.
 */
export function useAvailability() {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const projects = useActiveProjects();

  const available = useAvailabilityStore((state) => state.available);
  const activeCount = useAvailabilityStore((state) => state.activeCount);
  const hydrate = useAvailabilityStore((state) => state.hydrate);
  const setAvailableLocal = useAvailabilityStore((state) => state.setAvailable);

  const serverAvailable = profile.data?.available;
  const serverCount = projects.data?.length;

  useEffect(() => {
    if (serverAvailable === undefined || serverCount === undefined) return;
    hydrate({ available: serverAvailable, activeCount: serverCount });
  }, [serverAvailable, serverCount, hydrate]);

  const mutation = useMutation({
    mutationFn: setAvailability,
    onMutate: (next: boolean) => {
      const previous = useAvailabilityStore.getState().available;
      setAvailableLocal(next);
      return { previous };
    },
    onError: (_error, _next, context) => {
      if (context) setAvailableLocal(context.previous);
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: qk.profile() });
      void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
    },
  });

  const atCap = isAtCap(activeCount);

  return {
    available,
    activeCount,
    atCap,
    isLoading: profile.isLoading || projects.isLoading,
    isSaving: mutation.isPending,
    setAvailable: (next: boolean) => {
      // At the cap the doer cannot mark themselves Available; the cap is the reason.
      if (next && atCap) return;
      // A choice the doer makes by hand always wins over the automatic one.
      writeAutoOff(false);
      mutation.mutate(next);
    },
  };
}

const AUTO_OFF_KEY = "dolancer.availability.autoOff";

function readAutoOff(): boolean {
  try {
    return localStorage.getItem(AUTO_OFF_KEY) === "1";
  } catch {
    return false;
  }
}

function writeAutoOff(on: boolean): void {
  try {
    if (on) localStorage.setItem(AUTO_OFF_KEY, "1");
    else localStorage.removeItem(AUTO_OFF_KEY);
  } catch {
    // Storage blocked: the switch still flips, it just will not flip back by itself.
  }
}

/**
 * Turns availability off when the third task lands, and back on when a slot frees
 * up, but only if it was this that turned it off. A doer who switched off by hand
 * stays off. Mounted once, in the app shell, so two toggles on screen never race.
 */
export function useAvailabilityAutopilot() {
  const queryClient = useQueryClient();
  const profile = useProfile();
  const projects = useActiveProjects();
  const push = usePopupStore((state) => state.push);
  const busy = useRef(false);

  const serverAvailable = profile.data?.available;
  const count = projects.data?.length;

  useEffect(() => {
    if (serverAvailable === undefined || count === undefined || busy.current) return;
    const full = isAtCap(count);
    let next: boolean | null = null;
    if (full && serverAvailable) next = false;
    else if (!full && !serverAvailable && readAutoOff()) next = true;
    else if (!full && serverAvailable) writeAutoOff(false);
    if (next === null) return;

    busy.current = true;
    useAvailabilityStore.getState().setAvailable(next);
    writeAutoOff(!next);
    setAvailability(next)
      .then(() => {
        push(
          next
            ? { kind: "availability", title: "You are available again", body: "A slot is free, so new offers can reach you.", href: "/pool" }
            : {
                kind: "availability",
                title: "Set to Not available",
                body: `You have ${MAX_ACTIVE_PROJECTS} tasks. It turns back on when one is done.`,
                href: "/work",
              },
        );
      })
      .catch(() => {
        useAvailabilityStore.getState().setAvailable(!next);
        writeAutoOff(false);
      })
      .finally(() => {
        busy.current = false;
        void queryClient.invalidateQueries({ queryKey: qk.profile() });
        void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
      });
  }, [serverAvailable, count, push, queryClient]);
}

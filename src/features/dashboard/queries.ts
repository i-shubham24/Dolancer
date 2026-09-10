import { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { qk } from "@/lib/query-keys";
import { useAuth } from "@/providers/AuthProvider";
import { useAvailabilityStore, isAtCap } from "@/stores/useAvailabilityStore";
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
 * toggle responds instantly. When the doer reaches the cap we flip availability to
 * unavailable, which is a real effect rather than a cosmetic one: doer_pool
 * requires profiles.available, so the board genuinely empties. The doer sees this
 * as "At capacity" rather than "Paused", because the system set it, not them.
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

  // Auto-flip to unavailable on reaching the cap. Guarded on the server value so this
  // fires once rather than on every render, and never fights a manual toggle.
  useEffect(() => {
    if (!atCap) return;
    if (serverAvailable !== true) return;
    if (mutation.isPending) return;
    mutation.mutate(false);
  }, [atCap, serverAvailable, mutation]);

  return {
    available,
    activeCount,
    atCap,
    isLoading: profile.isLoading || projects.isLoading,
    isSaving: mutation.isPending,
    setAvailable: (next: boolean) => {
      // At the cap the doer cannot mark themselves Available; the cap is the reason.
      if (next && atCap) return;
      mutation.mutate(next);
    },
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/lib/query-keys";
import { fetchPool, claimProject, type PoolSort } from "./api";

export function usePool(sort: PoolSort) {
  return useQuery({
    queryKey: [...qk.pool.list(), sort],
    queryFn: () => fetchPool({ sort }),
  });
}

/**
 * Accepting an assigned offer.
 *
 * On success the offer list and the work list are invalidated, because acceptance
 * changes both: the offer leaves the assigned list and appears in active work, which also
 * moves the concurrency count and can trigger the auto-flip to At capacity.
 */
export function useClaimProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimProject,
    onSuccess: (result) => {
      if (!result.ok) {
        // A rejection is a legitimate outcome, not a failure. The offer is no longer available.
        toast.warning(result.message);
      } else {
        toast.success("Accepted. It is in your work now.");
      }
      void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
      void queryClient.invalidateQueries({ queryKey: qk.work.all() });
      void queryClient.invalidateQueries({ queryKey: qk.profile() });
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });
}

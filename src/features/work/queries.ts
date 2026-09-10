import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { qk } from "@/lib/query-keys";
import type { WorkBucket } from "@/types/domain";
import type { RpcResult } from "@/lib/rpc";
import {
  fetchProject,
  fetchProjects,
  setProgress,
  setWorkingDoc,
  startWork,
  submitForReview,
} from "./api";

export function useProjects(bucket: WorkBucket) {
  return useQuery({
    queryKey: qk.work.list(bucket),
    queryFn: () => fetchProjects(bucket),
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: qk.work.detail(projectId),
    queryFn: () => fetchProject(projectId),
    enabled: Boolean(projectId),
  });
}

/**
 * One shape for every lifecycle mutation.
 *
 * The important part is that a `rejected` result is surfaced as a warning with the
 * database's own reason and still refetches, rather than being swallowed as success
 * or thrown as an error. That is the difference between "someone else got there
 * first" and "something broke", and the doer deserves to be told which.
 */
function useLifecycleMutation<TArgs>(
  mutationFn: (args: TArgs) => Promise<RpcResult<true>>,
  successMessage: string,
  projectId: string,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (result) => {
      if (result.ok) toast.success(successMessage);
      else toast.warning(result.message);

      void queryClient.invalidateQueries({ queryKey: qk.work.detail(projectId) });
      void queryClient.invalidateQueries({ queryKey: qk.work.all() });
    },
    onError: (error: Error) => toast.error(error.message),
  });
}

export function useStartWork(projectId: string) {
  return useLifecycleMutation(
    () => startWork(projectId),
    "Work started. Good luck.",
    projectId,
  );
}

export function useSubmitForReview(projectId: string) {
  return useLifecycleMutation(
    () => submitForReview(projectId),
    "Submitted. Your supervisor will review it.",
    projectId,
  );
}

export function useSetWorkingDoc(projectId: string) {
  return useLifecycleMutation(
    (url: string) => setWorkingDoc(projectId, url),
    "Working link saved.",
    projectId,
  );
}

export function useSetProgress(projectId: string) {
  return useLifecycleMutation(
    (pct: number) => setProgress(projectId, pct),
    "Progress updated.",
    projectId,
  );
}

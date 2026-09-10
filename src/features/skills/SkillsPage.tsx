import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Check, Plus, Sparkles } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { fetchSkills, addSkill, removeSkill, type SkillOption } from "./api";

export function SkillsPage() {
  const queryClient = useQueryClient();
  const skills = useQuery({ queryKey: qk.skills.catalogue(), queryFn: fetchSkills });

  const toggle = useMutation({
    mutationFn: ({ id, selected }: { id: string; selected: boolean }) =>
      selected ? removeSkill(id) : addSkill(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: qk.skills.all() });
      // Picking a skill changes what the board can show and can complete the
      // readiness gate, so both have to be refetched, not just this list.
      void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
      void queryClient.invalidateQueries({ queryKey: qk.gate() });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, SkillOption[]>();
    for (const skill of skills.data ?? []) {
      const bucket = map.get(skill.category);
      if (bucket) bucket.push(skill);
      else map.set(skill.category, [skill]);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [skills.data]);

  const chosenCount = (skills.data ?? []).filter((skill) => skill.selected).length;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Your skills</h1>
        <p className="mt-2 max-w-2xl text-md text-ink-2">
          This is how work finds you. Only projects in a category you have picked appear on
          your board, so if the board looks empty, start here.
        </p>
      </header>

      {!skills.isLoading && chosenCount === 0 ? (
        <div className="rounded-xl border-2 border-ink bg-warning-bg px-4 py-3 shadow-offset-sm">
          <p className="text-sm font-semibold text-warning-ink">
            You have not picked any skills yet, so no work can reach you. Choose at least one.
          </p>
        </div>
      ) : null}

      {skills.isLoading ? (
        <div className="space-y-4">
          <LoadingAnnounce label="Loading skills" />
          <Skeleton className="h-4 w-32" />
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 12 }, (_, index) => (
              <Skeleton key={index} className="h-9 w-28 rounded-full" />
            ))}
          </div>
        </div>
      ) : skills.isError ? (
        <ErrorState
          description="The skill list did not load."
          onRetry={() => void skills.refetch()}
        />
      ) : grouped.length === 0 ? (
        <EmptyState
          icon={<Sparkles className="h-6 w-6" aria-hidden="true" />}
          title="No skills to choose from yet"
          description="The catalogue is empty. Once categories are published they will appear here."
        />
      ) : (
        <div className="space-y-6">
          <p className="text-sm font-bold text-ink-2">
            {chosenCount} picked
          </p>

          {grouped.map(([category, options]) => (
            <Card key={category}>
              <h2 className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
                {category}
              </h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {options.map((skill) => (
                  <button
                    key={skill.id}
                    type="button"
                    aria-pressed={skill.selected}
                    disabled={toggle.isPending}
                    onClick={() => toggle.mutate({ id: skill.id, selected: skill.selected })}
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink px-3.5 py-2",
                      "text-xs font-extrabold tracking-[-0.01em] transition-all duration-[120ms]",
                      "disabled:opacity-60",
                      skill.selected
                        ? "bg-lime shadow-offset-xs"
                        : "bg-surface hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-xs",
                    )}
                  >
                    {skill.selected ? (
                      <Check className="h-3 w-3" aria-hidden="true" />
                    ) : (
                      <Plus className="h-3 w-3" aria-hidden="true" />
                    )}
                    {skill.name}
                  </button>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Check, GraduationCap, ArrowRight } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { fetchLessons } from "./api";

export function TrainingPage() {
  const lessons = useQuery({ queryKey: qk.training.lessons(), queryFn: fetchLessons });

  const items = lessons.data ?? [];
  const done = items.filter((lesson) => lesson.completed).length;
  const pct = items.length === 0 ? 100 : Math.round((done / items.length) * 100);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-4xl font-extrabold tracking-[-0.035em]">Training</h1>
        <p className="mt-2 max-w-2xl text-md text-ink-2">
          Short modules on how work is briefed, reviewed and delivered here. Finishing them
          is one of the steps that unlocks claiming.
        </p>
      </header>

      {items.length > 0 ? (
        <Card>
          <div className="flex items-center justify-between gap-3">
            <span className="text-xs font-extrabold uppercase tracking-[0.05em] text-ink-muted">
              Progress
            </span>
            <span className="rounded-full border-[1.5px] border-ink bg-lime px-2.5 py-0.5 text-2xs font-extrabold">
              {done} of {items.length}
            </span>
          </div>
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-full border-[1.5px] border-ink bg-surface"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Training progress"
          >
            <div
              className="h-full rounded-full bg-lime transition-[width] duration-500 ease-spring"
              style={{ width: `${pct}%` }}
            />
          </div>
        </Card>
      ) : null}

      {lessons.isLoading ? (
        <div className="space-y-3">
          <LoadingAnnounce label="Loading training modules" />
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : lessons.isError ? (
        <ErrorState
          description="Training modules did not load."
          onRetry={() => void lessons.refetch()}
        />
      ) : items.length === 0 ? (
        <EmptyState
          icon={<GraduationCap className="h-6 w-6" aria-hidden="true" />}
          title="No modules published yet"
          description="There is nothing to complete right now, so this step is already met. Modules appear here when they are published."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((lesson, index) => (
            <li key={lesson.id}>
              <Link
                to={`/training/${lesson.id}`}
                className={cn(
                  "flex items-center gap-4 rounded-xl border-[1.5px] border-ink bg-surface p-4",
                  "shadow-offset-xs transition-all duration-[120ms]",
                  "hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-sm",
                  lesson.completed && "bg-surface-2",
                )}
              >
                <span
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink text-sm font-extrabold",
                    lesson.completed ? "bg-success-bg text-success-ink" : "bg-lime",
                  )}
                >
                  {lesson.completed ? (
                    <Check className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    (lesson.moduleOrder ?? index + 1)
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span
                    className={cn(
                      "block text-sm font-extrabold tracking-[-0.01em]",
                      lesson.completed && "text-ink-muted",
                    )}
                  >
                    {lesson.title}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {lesson.completed ? "Completed" : "Not started"}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 shrink-0 text-ink-muted" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

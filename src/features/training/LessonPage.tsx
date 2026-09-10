import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Check, X } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { EmptyState, ErrorState } from "@/components/brutal/EmptyState";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { fetchLesson, fetchQuestions, gradeLesson, markComplete } from "./api";

export function LessonPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<{ score: number; passed: boolean } | null>(null);

  const lesson = useQuery({ queryKey: qk.training.lesson(id), queryFn: () => fetchLesson(id) });
  const questions = useQuery({
    queryKey: qk.training.questions(id),
    queryFn: () => fetchQuestions(id),
    enabled: Boolean(id),
  });

  function invalidate() {
    void queryClient.invalidateQueries({ queryKey: qk.training.all() });
    // Finishing a module can complete the readiness gate and unlock the board.
    void queryClient.invalidateQueries({ queryKey: qk.gate() });
    void queryClient.invalidateQueries({ queryKey: qk.pool.all() });
  }

  const complete = useMutation({
    mutationFn: () => markComplete(id),
    onSuccess: () => {
      toast.success("Module complete.");
      invalidate();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const grade = useMutation({
    mutationFn: (ordered: number[]) => gradeLesson(id, ordered),
    onSuccess: async (outcome) => {
      setResult(outcome);
      if (outcome.passed) {
        // The database owns the answer key and the pass mark; completion is only
        // recorded once it says so.
        await markComplete(id);
        toast.success(`Passed with ${outcome.score}%.`);
        invalidate();
      } else {
        toast.warning(`Scored ${outcome.score}%. Review and try again.`);
      }
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (lesson.isLoading) {
    return (
      <div className="space-y-4">
        <LoadingAnnounce label="Loading this module" />
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  if (lesson.isError) {
    return (
      <ErrorState description="This module did not load." onRetry={() => void lesson.refetch()} />
    );
  }

  if (!lesson.data) {
    return (
      <EmptyState
        title="Module not found"
        description="This module does not exist or is no longer published."
        action={
          <Button asChild>
            <Link to="/training">Back to training</Link>
          </Button>
        }
      />
    );
  }

  const data = lesson.data;
  const quiz = questions.data ?? [];
  const allAnswered = quiz.length > 0 && quiz.every((question) => answers[question.id] !== undefined);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        to="/training"
        className="inline-flex items-center gap-1.5 text-sm font-bold text-ink-2 hover:text-ink"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Training
      </Link>

      <header className="space-y-2">
        {data.completed ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border-[1.5px] border-ink bg-success-bg px-2.5 py-0.5 text-2xs font-extrabold text-success-ink">
            <Check className="h-3 w-3" aria-hidden="true" />
            Completed
          </span>
        ) : null}
        <h1 className="text-3xl font-extrabold tracking-[-0.035em]">{data.title}</h1>
      </header>

      <Card>
        <div className="space-y-4 text-sm leading-relaxed">
          {(data.body ?? "").split(/\n{2,}/).map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="whitespace-pre-wrap">
                {paragraph.trim()}
              </p>
            ) : null,
          )}
          {!data.body?.trim() ? (
            <p className="text-ink-muted">This module has no written content.</p>
          ) : null}
        </div>
      </Card>

      {quiz.length > 0 ? (
        <Card className="space-y-5">
          <div>
            <h2 className="text-lg font-extrabold tracking-[-0.025em]">Quick check</h2>
            <p className="mt-1 text-sm text-ink-2">
              Answer these to complete the module. You can retake it as many times as you need.
            </p>
          </div>

          {quiz.map((question, questionIndex) => (
            <fieldset key={question.id} className="space-y-2">
              <legend className="mb-2 text-sm font-extrabold">
                {questionIndex + 1}. {question.prompt}
              </legend>
              {question.options.map((option, optionIndex) => {
                // The RPC expects 1-based indexes into the options array.
                const value = optionIndex + 1;
                const checked = answers[question.id] === value;
                return (
                  <label
                    key={optionIndex}
                    className={cn(
                      "flex cursor-pointer items-center gap-2.5 rounded-lg border-[1.5px] px-3 py-2.5 text-sm font-semibold transition-colors",
                      checked
                        ? "border-ink bg-lime shadow-offset-xs"
                        : "border-line-card bg-surface hover:border-ink",
                    )}
                  >
                    <input
                      type="radio"
                      name={question.id}
                      value={value}
                      checked={checked}
                      onChange={() => {
                        setAnswers((prev) => ({ ...prev, [question.id]: value }));
                        setResult(null);
                      }}
                      className="accent-coral"
                    />
                    {option}
                  </label>
                );
              })}
            </fieldset>
          ))}

          {result ? (
            <div
              role="status"
              className={cn(
                "flex items-start gap-2.5 rounded-lg border-2 border-ink px-4 py-3",
                result.passed ? "bg-success-bg" : "bg-warning-bg",
              )}
            >
              {result.passed ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
              ) : (
                <X className="mt-0.5 h-4 w-4 shrink-0 text-warning-ink" aria-hidden="true" />
              )}
              <p
                className={cn(
                  "text-sm font-semibold",
                  result.passed ? "text-success-ink" : "text-warning-ink",
                )}
              >
                {result.passed
                  ? `Passed with ${result.score}%. This module is complete.`
                  : `You scored ${result.score}%, which is below the pass mark. Have another read and try again.`}
              </p>
            </div>
          ) : null}

          <Button
            className="w-full"
            disabled={!allAnswered || grade.isPending}
            onClick={() =>
              grade.mutate(quiz.map((question) => answers[question.id] ?? 0))
            }
          >
            {grade.isPending ? "Checking..." : result && !result.passed ? "Try again" : "Submit answers"}
          </Button>
        </Card>
      ) : !data.completed ? (
        <Button
          size="lg"
          className="w-full"
          disabled={complete.isPending}
          onClick={() => complete.mutate()}
        >
          {complete.isPending ? "Saving..." : "Mark as complete"}
        </Button>
      ) : null}
    </div>
  );
}

import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { AlertTriangle, Check, GraduationCap, X } from "lucide-react";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { CardGrid, EmptyPanel, PageHeader } from "@/components/app/page";
import { Button } from "@/components/ui/button";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { toUserError } from "@/lib/user-error";
import { fetchLesson, fetchQuestions, gradeLesson, markComplete, readingMinutes } from "./api";
import { CourseCover } from "./CourseCard";

export function LessonPage() {
  const { id = "" } = useParams();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
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
      navigate("/training");
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not mark complete. Try again.")),
  });

  const grade = useMutation({
    mutationFn: (ordered: number[]) => gradeLesson(id, ordered),
    onSuccess: async (outcome) => {
      setResult(outcome);
      if (outcome.passed) {
        // The database owns the answer key and the pass mark; completion is only
        // recorded once it says so.
        await markComplete(id);
        toast.success(`Passed with ${outcome.score}%. Module complete.`);
        invalidate();
        // Back to the list of modules, where the next one is waiting.
        navigate("/training");
      } else {
        toast.warning(`Scored ${outcome.score}%. Review and try again.`);
      }
    },
    onError: (error: Error) => toast.error(toUserError(error, "Could not grade. Try again.")),
  });

  if (lesson.isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4">
        <LoadingAnnounce label="Loading this module" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-9 w-2/3" />
        <Skeleton className="h-48 w-full rounded-[20px]" />
      </div>
    );
  }

  if (lesson.isError) {
    return (
      <EmptyPanel
        tone="danger"
        icon={<AlertTriangle />}
        title="This module did not load"
        action={
          <Button variant="outline" onClick={() => void lesson.refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!lesson.data) {
    return (
      <EmptyPanel
        icon={<GraduationCap />}
        title="Module not found"
        body="It does not exist or is no longer published."
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
  const answered = quiz.filter((question) => answers[question.id] !== undefined).length;
  const allAnswered = quiz.length > 0 && answered === quiz.length;

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        back={{ to: "/training", label: "Training" }}
        title={data.title}
        sub={
          data.completed ? (
            <span className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-success-bg px-2.5 py-1 text-xs font-bold text-success-ink">
              <Check className="h-3.5 w-3.5" aria-hidden="true" />
              Completed
            </span>
          ) : undefined
        }
      />

      <CardGrid>
        <motion.article variants={cardMotion} className={cn(CARD, "gap-4 p-3 pb-5 sm:p-3 sm:pb-6")}>
          <CourseCover lesson={data} className="aspect-[16/6] sm:aspect-[16/4]" />
          <div className="flex flex-wrap gap-1.5 px-2 sm:px-3">
            <span className={cn("rounded-md px-2 py-1 text-[11.5px] font-bold", data.category ? "bg-success-bg text-success-ink" : "bg-info-bg text-primary")}>
              {data.category ?? "Required"}
            </span>
            {readingMinutes(data.body) ? (
              <span className="rounded-md px-2 py-1 text-[11.5px] font-bold text-ink-2 ring-1 ring-line-card">{readingMinutes(data.body)} min read</span>
            ) : null}
            <span className="rounded-md px-2 py-1 text-[11.5px] font-bold text-ink-2 ring-1 ring-line-card">Free</span>
          </div>
          {(data.body ?? "").split(/\n{2,}/).map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index} className="whitespace-pre-wrap px-2 text-[15px] leading-relaxed text-ink-2 sm:px-3">
                {paragraph.trim()}
              </p>
            ) : null,
          )}
          {!data.body?.trim() ? <p className="px-2 text-ink-muted sm:px-3">This module has no written content.</p> : null}
        </motion.article>

        {quiz.length > 0 ? (
          <motion.section variants={cardMotion} className={cn(CARD, "gap-5 p-5 sm:p-6")} aria-labelledby="quiz">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 id="quiz" className="text-lg font-extrabold tracking-[-0.025em]">Quick check</h2>
                <p className="text-sm text-ink-2">Retake it as often as you like.</p>
              </div>
              <span className="rounded-full bg-panel px-3 py-1.5 text-xs font-bold text-ink-2">
                {answered} of {quiz.length} answered
              </span>
            </div>

            {quiz.map((question, questionIndex) => (
              <fieldset key={question.id} className="space-y-2">
                <legend className="mb-2 flex gap-2 text-[15px] font-extrabold">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-info-bg text-xs text-primary">
                    {questionIndex + 1}
                  </span>
                  {question.prompt}
                </legend>
                {question.options.map((option, optionIndex) => {
                  // The RPC expects 1-based indexes into the options array.
                  const value = optionIndex + 1;
                  const checked = answers[question.id] === value;
                  return (
                    <label
                      key={optionIndex}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-semibold transition-all",
                        "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-primary",
                        checked ? "bg-info-bg text-ink ring-2 ring-primary" : "bg-panel/60 text-ink-2 hover:bg-panel",
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
                        className="sr-only"
                      />
                      <span
                        className={cn(
                          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full transition-colors",
                          checked ? "bg-primary" : "bg-white ring-2 ring-line-subtle",
                        )}
                        aria-hidden="true"
                      >
                        {checked ? <span className="h-2 w-2 rounded-full bg-white" /> : null}
                      </span>
                      {option}
                    </label>
                  );
                })}
              </fieldset>
            ))}

            {result ? (
              <motion.div
                role="status"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3",
                  result.passed ? "bg-success-bg text-success-ink" : "bg-warning-bg text-warning-ink",
                )}
              >
                {result.passed ? <Check className="h-5 w-5 shrink-0" aria-hidden="true" /> : <X className="h-5 w-5 shrink-0" aria-hidden="true" />}
                <p className="text-sm font-bold">
                  {result.passed ? `Passed with ${result.score}%. Module complete.` : `You scored ${result.score}%. Read it again and retry.`}
                </p>
              </motion.div>
            ) : null}

            <Button
              size="lg"
              className="w-full"
              disabled={!allAnswered || grade.isPending}
              onClick={() => grade.mutate(quiz.map((question) => answers[question.id] ?? 0))}
            >
              {grade.isPending ? "Checking..." : result && !result.passed ? "Try again" : "Submit answers"}
            </Button>
          </motion.section>
        ) : !data.completed ? (
          <motion.div variants={cardMotion}>
            <Button size="lg" className="w-full" disabled={complete.isPending} onClick={() => complete.mutate()}>
              {complete.isPending ? "Saving..." : "Mark as complete"}
            </Button>
          </motion.div>
        ) : null}
      </CardGrid>
    </div>
  );
}

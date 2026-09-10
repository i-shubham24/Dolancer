import { supabase } from "@/lib/supabase";
import { callRowRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import type { LessonRow } from "@/types/database";

export interface Lesson {
  id: string;
  title: string;
  moduleOrder: number | null;
  completed: boolean;
}

export interface LessonDetail {
  id: string;
  title: string;
  body: string | null;
  moduleOrder: number | null;
  completed: boolean;
}

export interface LessonQuestion {
  id: string;
  prompt: string;
  options: string[];
  sortOrder: number | null;
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) throw new Error("Not signed in");
  return id;
}

async function completedLessonIds(): Promise<Set<string>> {
  const { data, error } = await supabase
    .from("lesson_progress")
    .select(selectColumns("lesson_id"))
    .limit(500);
  if (error) throw new Error(error.message);
  return new Set(
    ((data as unknown as { lesson_id: string }[] | null) ?? []).map((row) => row.lesson_id),
  );
}

export async function fetchLessons(): Promise<Lesson[]> {
  const [lessons, done] = await Promise.all([
    supabase
      .from("lessons")
      .select(selectColumns("id", "title", "module_order"))
      .order("module_order", { ascending: true, nullsFirst: false })
      .limit(200),
    completedLessonIds(),
  ]);

  if (lessons.error) throw new Error(lessons.error.message);

  return ((lessons.data as unknown as LessonRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.title,
    moduleOrder: row.module_order,
    completed: done.has(row.id),
  }));
}

export async function fetchLesson(lessonId: string): Promise<LessonDetail | null> {
  const [lesson, done] = await Promise.all([
    supabase
      .from("lessons")
      .select(selectColumns("id", "title", "body", "module_order"))
      .eq("id", lessonId)
      .limit(1),
    completedLessonIds(),
  ]);

  if (lesson.error) throw new Error(lesson.error.message);
  const row = (lesson.data as unknown as (LessonRow & { body: string | null })[] | null)?.[0];
  if (!row) return null;

  return {
    id: row.id,
    title: row.title,
    body: row.body,
    moduleOrder: row.module_order,
    completed: done.has(row.id),
  };
}

/**
 * Quiz questions come from lesson_questions_public, never the base table.
 * correct_index is admin-only and is not exposed by the view, so the answer key
 * cannot leak to a client that simply asks for it.
 */
export async function fetchQuestions(lessonId: string): Promise<LessonQuestion[]> {
  const { data, error } = await supabase
    .from("lesson_questions_public")
    .select(selectColumns("id", "prompt", "options", "sort_order"))
    .eq("lesson_id", lessonId)
    .order("sort_order", { ascending: true })
    .limit(100);
  if (error) throw new Error(error.message);

  return (
    (data as unknown as { id: string; prompt: string; options: string[]; sort_order: number | null }[] | null) ?? []
  ).map((row) => ({
    id: row.id,
    prompt: row.prompt,
    options: row.options ?? [],
    sortOrder: row.sort_order,
  }));
}

/** Grading happens in the database, which is the only place the answer key exists. */
export async function gradeLesson(
  lessonId: string,
  answers: number[],
): Promise<{ score: number; passed: boolean }> {
  const row = unwrap(
    await callRowRpc<{ score: number; passed: boolean }>("grade_lesson", {
      p_lesson: lessonId,
      p_answers: answers,
    }),
  );
  return { score: row?.score ?? 0, passed: Boolean(row?.passed) };
}

export async function markComplete(lessonId: string): Promise<void> {
  const userId = await currentUserId();
  const { error } = await supabase
    .from("lesson_progress")
    .upsert(
      { user_id: userId, lesson_id: lessonId },
      { onConflict: "user_id,lesson_id", ignoreDuplicates: true },
    );
  if (error) throw new Error(error.message);
}

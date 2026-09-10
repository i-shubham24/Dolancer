import { supabase } from "@/lib/supabase";
import { selectColumns } from "@/lib/select";
import type { SkillRow } from "@/types/database";

export interface SkillOption {
  id: string;
  name: string;
  category: string;
  selected: boolean;
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) throw new Error("Not signed in");
  return id;
}

/**
 * The skill catalogue, marked with what this doer has picked.
 *
 * Skills are not decoration: doer_pool joins doer_skills to the project category,
 * so an unpicked category means that work is invisible, and picking nothing means
 * an empty board. The UI has to say that plainly or a doer will assume the platform
 * has no work.
 */
export async function fetchSkills(): Promise<SkillOption[]> {
  const [catalogue, mine] = await Promise.all([
    supabase
      .from("skills")
      .select(selectColumns("id", "name", "category"))
      .order("name", { ascending: true })
      .limit(500),
    supabase.from("doer_skills").select(selectColumns("skill_id")).limit(500),
  ]);

  if (catalogue.error) throw new Error(catalogue.error.message);
  if (mine.error) throw new Error(mine.error.message);

  const chosen = new Set(
    ((mine.data as unknown as { skill_id: string }[] | null) ?? []).map((row) => row.skill_id),
  );

  return ((catalogue.data as unknown as SkillRow[] | null) ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    category: row.category,
    selected: chosen.has(row.id),
  }));
}

export async function addSkill(skillId: string): Promise<void> {
  const doerId = await currentUserId();
  const { error } = await supabase
    .from("doer_skills")
    .upsert(
      { doer_id: doerId, skill_id: skillId },
      { onConflict: "doer_id,skill_id", ignoreDuplicates: true },
    );
  if (error) throw new Error(error.message);
}

export async function removeSkill(skillId: string): Promise<void> {
  const doerId = await currentUserId();
  const { error } = await supabase
    .from("doer_skills")
    .delete()
    .eq("doer_id", doerId)
    .eq("skill_id", skillId);
  if (error) throw new Error(error.message);
}

import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CustomSkill {
  id: string;
  name: string;
  category: string;
}

/**
 * Skills of the doer's own that the skill list does not have, each filed under an
 * area so it sits with the skills it belongs to.
 *
 * Offers match on listed skills only (doer_pool joins doer_skills), so these add
 * detail without changing what work arrives. The database has no table for them
 * yet, so they are kept on this device until one exists.
 */
interface SkillExtrasState {
  custom: CustomSkill[];
  addCustom: (name: string, category: string) => void;
  removeCustom: (id: string) => void;
}

export const useSkillExtrasStore = create<SkillExtrasState>()(
  persist(
    (set) => ({
      custom: [],
      addCustom: (name, category) =>
        set((state) => {
          const clean = name.trim().replace(/\s+/g, " ").slice(0, 60);
          if (!clean) return state;
          if (state.custom.some((skill) => skill.name.toLowerCase() === clean.toLowerCase())) return state;
          return { custom: [...state.custom, { id: `own-${Date.now().toString(36)}`, name: clean, category }] };
        }),
      removeCustom: (id) => set((state) => ({ custom: state.custom.filter((skill) => skill.id !== id) })),
    }),
    {
      name: "dolancer.skills.extras",
      version: 2,
      // Version 1 also kept a level per skill, which was dropped to keep the page simple.
      migrate: (persisted) => ({ custom: (persisted as { custom?: CustomSkill[] } | null)?.custom ?? [] }),
    },
  ),
);

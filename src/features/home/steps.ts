import { useQuery } from "@tanstack/react-query";
import { GraduationCap, PencilRuler, ScrollText, ShieldCheck, UserPen, type LucideIcon } from "lucide-react";
import { qk } from "@/lib/query-keys";
import { useActiveProjects, useGateState } from "@/features/dashboard/queries";
import { useProjects } from "@/features/work/queries";
import { fetchKycStatus } from "@/features/verification/api";
import { fetchLessons } from "@/features/training/api";
import { useOnboardingStore } from "@/stores/useOnboardingStore";

/**
 * done: finished. waiting: sent, now with our team, and it does not hold up the next
 * step. current: the one to do now. locked: opens once the steps before it are done.
 */
export type StepState = "done" | "waiting" | "current" | "locked";

export interface SetupStep {
  id: string;
  title: string;
  detail: string;
  href: string;
  action: string;
  icon: LucideIcon;
  state: StepState;
}

/**
 * The steps between signing up and taking a first task, in order. Each one opens
 * after the one before it, and Start earning opens when every one is done.
 */
export function useSetupSteps() {
  const gate = useGateState();
  const kyc = useQuery({ queryKey: qk.kyc(), queryFn: fetchKycStatus });
  const lessons = useQuery({ queryKey: qk.training.lessons(), queryFn: fetchLessons });
  const guidelinesAt = useOnboardingStore((state) => state.guidelinesAt);

  const required = (lessons.data ?? []).filter((lesson) => !lesson.category);
  const lessonsDone = required.filter((lesson) => lesson.completed).length;
  const applicationPending = gate.data?.applicationStatus === "pending";

  const raw: (Omit<SetupStep, "state"> & { done: boolean; waiting?: boolean })[] = [
    {
      id: "guidelines",
      title: "Read the guidelines",
      detail: "How work, pay and conduct work here. Five minutes.",
      href: "/guidelines",
      action: "Read now",
      icon: ScrollText,
      done: Boolean(guidelinesAt),
    },
    {
      id: "join",
      title: applicationPending ? "Application being checked" : "Join as a doer",
      detail: applicationPending ? "A supervisor is looking at it." : "Tell us what you do. It takes a minute.",
      href: "/profile",
      action: "Apply",
      icon: UserPen,
      done: Boolean(gate.data?.isDoer),
      waiting: applicationPending,
    },
    {
      id: "verify",
      title: kyc.data === "submitted" ? "Verification being checked" : "Verify your PAN and bank",
      detail: kyc.data === "submitted" ? "We will tell you as soon as it is done." : "So your payouts can reach you.",
      href: "/verification",
      action: "Verify now",
      icon: ShieldCheck,
      done: Boolean(gate.data?.kycDone),
      waiting: kyc.data === "submitted",
    },
    {
      id: "skills",
      title: "Pick your skills",
      detail: "Offers match the skills you pick.",
      href: "/skills",
      action: "Pick skills",
      icon: PencilRuler,
      done: Boolean(gate.data?.skillsDone),
    },
    {
      id: "training",
      title: "Finish the training",
      detail: required.length > 0 ? `${lessonsDone} of ${required.length} short modules done.` : "A few short modules.",
      href: "/training",
      action: lessonsDone > 0 ? "Continue" : "Start",
      icon: GraduationCap,
      done: Boolean(gate.data?.trainingDone),
    },
  ];

  let blocked = false;
  const steps: SetupStep[] = raw.map(({ done, waiting, ...step }) => {
    let state: StepState;
    if (done) state = "done";
    else if (blocked) state = "locked";
    else if (waiting) state = "waiting";
    else {
      state = "current";
      blocked = true;
    }
    return { ...step, state };
  });

  const doneCount = steps.filter((step) => step.state === "done").length;
  return {
    steps,
    doneCount,
    total: steps.length,
    allDone: doneCount === steps.length,
    next: steps.find((step) => step.state === "current") ?? null,
    loading: gate.isLoading || kyc.isLoading || lessons.isLoading,
  };
}

/**
 * Home is for getting started. It stays in the menu until setup is finished, Start
 * earning has been pressed, and a first task has been taken; after that the doer
 * lives on the dashboard.
 */
export function useHomeVisible(): { visible: boolean; remaining: number; loading: boolean } {
  const setup = useSetupSteps();
  const active = useActiveProjects();
  const closed = useProjects("closed");
  const started = useOnboardingStore((state) => state.started);
  const hasProject = (active.data?.length ?? 0) + (closed.data?.length ?? 0) > 0;
  const loading = setup.loading || active.isLoading || closed.isLoading;
  return {
    visible: loading || !(setup.allDone && started && hasProject),
    remaining: setup.total - setup.doneCount,
    loading,
  };
}

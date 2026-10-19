import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { AlertTriangle, ArrowRight, GraduationCap } from "lucide-react";
import { Skeleton, LoadingAnnounce } from "@/components/brutal/Skeleton";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion, gridMotion } from "@/components/app/card-styles";
import { EmptyPanel, PageHeader } from "@/components/app/page";
import { CountUp } from "@/components/common/CountUp";
import { cn } from "@/lib/cn";
import { qk } from "@/lib/query-keys";
import { useProjects } from "@/features/work/queries";
import { useActiveProjects } from "@/features/dashboard/queries";
import { fetchSkills } from "@/features/skills/api";
import { fetchLessons, type Lesson } from "./api";
import { CourseCard, CourseRow } from "./CourseCard";

const pct = (value: number) => `${Math.round(value)}%`;

/** Progress as a ring, with the share done counting up in the middle. */
function ProgressRing({ done, total }: { done: number; total: number }) {
  const reduceMotion = useReducedMotion();
  const share = total === 0 ? 100 : (done / total) * 100;
  const radius = 40;
  return (
    <span className="relative flex h-[96px] w-[96px] shrink-0 items-center justify-center" role="img" aria-label={`${done} of ${total} required modules done`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.22)" strokeWidth="11" />
        {share > 0 ? (
          <motion.circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="white"
            strokeWidth="11"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: share / 100 }}
            transition={{ duration: 1.1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </svg>
      <CountUp value={share} format={pct} delay={0.3} className="text-xl font-extrabold tabular-nums text-white" />
    </span>
  );
}

interface Row {
  key: string;
  title: string;
  sub?: string;
  items: Lesson[];
  match?: boolean;
}

/**
 * Training, laid out like a course store: rows of course cards, each one free.
 *
 * The required modules come first. After them, skill courses are ordered by what
 * the doer actually works on: the categories of their tasks first, then the
 * categories of the skills they picked, then everything else.
 */
export function TrainingPage() {
  const lessons = useQuery({ queryKey: qk.training.lessons(), queryFn: fetchLessons });
  const skills = useQuery({ queryKey: qk.skills.catalogue(), queryFn: fetchSkills });
  const active = useActiveProjects();
  const closed = useProjects("closed");
  const reduceMotion = useReducedMotion();

  const items = useMemo(() => lessons.data ?? [], [lessons.data]);
  const required = items.filter((lesson) => !lesson.category);
  const done = required.filter((lesson) => lesson.completed).length;
  const next = required.find((lesson) => !lesson.completed) ?? items.find((lesson) => !lesson.completed);

  const rows = useMemo<Row[]>(() => {
    const courses = items.filter((lesson) => lesson.category);
    const shown = new Set<string>();
    const out: Row[] = [];

    // Categories of work done or under way, busiest first.
    const counts = new Map<string, number>();
    for (const project of [...(active.data ?? []), ...(closed.data ?? [])]) {
      counts.set(project.category, (counts.get(project.category) ?? 0) + 1);
    }
    const workAreas = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([category]) => category);
    const picked = [...new Set((skills.data ?? []).filter((skill) => skill.selected).map((skill) => skill.category))];
    const areas = [...workAreas, ...picked.filter((category) => !workAreas.includes(category))];
    const fit = areas.flatMap((area) => courses.filter((course) => course.category === area));
    if (fit.length > 0) {
      fit.forEach((course) => shown.add(course.id));
      const named = workAreas.length > 0 ? workAreas.slice(0, 2) : areas.slice(0, 2);
      out.push({
        key: "for-you",
        title: "Recommended for you",
        sub: `Because you work on ${named.join(" and ")}.`,
        items: fit,
        match: true,
      });
    }

    const rest = courses.filter((course) => !shown.has(course.id));
    if (rest.length > 0) out.push({ key: "more", title: "More to explore", sub: "Learn something new and pick up new kinds of work.", items: rest });
    return out;
  }, [items, active.data, closed.data, skills.data]);

  const allDone = required.length > 0 && done === required.length;

  return (
    <div>
      <PageHeader title="Training" sub="Free short courses, picked for the work you do." />

      {lessons.isLoading ? (
        <div className="space-y-4">
          <LoadingAnnounce label="Loading training" />
          <Skeleton className="h-36 w-full rounded-[20px]" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }, (_, index) => (
              <Skeleton key={index} className="h-72 w-[262px] shrink-0 rounded-[20px]" />
            ))}
          </div>
        </div>
      ) : lessons.isError ? (
        <EmptyPanel
          tone="danger"
          icon={<AlertTriangle />}
          title="Training did not load"
          action={
            <Button variant="outline" onClick={() => void lessons.refetch()}>
              Try again
            </Button>
          }
        />
      ) : items.length === 0 ? (
        <EmptyPanel icon={<GraduationCap />} title="Nothing to complete" body="New courses show up here." />
      ) : (
        <motion.div className="space-y-7" variants={gridMotion} initial={reduceMotion ? false : "hidden"} animate="show">
          <motion.section
            variants={cardMotion}
            className={cn(
              CARD,
              "flex-row flex-wrap items-center gap-5 bg-gradient-to-br from-primary to-primary-hover text-white ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)] sm:flex-nowrap",
            )}
          >
            <ProgressRing done={done} total={required.length} />
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-white/80">Required to get offers</p>
              <h2 className="mt-0.5 text-xl font-extrabold tracking-[-0.03em]">
                {allDone ? "All required modules done" : `${required.length - done} of ${required.length} left`}
              </h2>
              <p className="mt-1 text-sm text-white/85">{allDone ? "Pick a free course below to sharpen your skills." : "Finish these to unlock assigned offers."}</p>
            </div>
            {next ? (
              <Button asChild variant="outline" className="w-full shrink-0 border-white/0 bg-white text-primary hover:bg-white/90 sm:w-auto">
                <Link to={`/training/${next.id}`}>
                  {allDone ? "Next course" : done === 0 ? "Start" : "Continue"}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            ) : null}
          </motion.section>

          {required.length > 0 ? (
            <CourseRow title="Start here" sub="The basics of how work runs on Dolancer.">
              {required.map((lesson, index) => (
                <CourseCard key={lesson.id} lesson={lesson} index={index} />
              ))}
            </CourseRow>
          ) : null}

          {rows.map((row) => (
            <CourseRow key={row.key} title={row.title} sub={row.sub}>
              {row.items.map((lesson, index) => (
                <CourseCard key={lesson.id} lesson={lesson} index={index} match={row.match} />
              ))}
            </CourseRow>
          ))}
        </motion.div>
      )}
    </div>
  );
}

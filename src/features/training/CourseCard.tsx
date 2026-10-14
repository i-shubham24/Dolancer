import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Compass,
  Megaphone,
  MessagesSquare,
  Palette,
  PenLine,
  type LucideIcon,
} from "lucide-react";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { cn } from "@/lib/cn";
import type { Lesson } from "./api";

/** One look per work area, so a course is recognisable before its title is read. */
const AREA: Record<string, { icon: LucideIcon; from: string; to: string; ink: string }> = {
  "Writing & Content": { icon: PenLine, from: "#4f46e5", to: "#8b7cf8", ink: "#4f46e5" },
  Marketing: { icon: Megaphone, from: "#0e8a82", to: "#2bbfae", ink: "#0e8a82" },
  Design: { icon: Palette, from: "#b4467a", to: "#e488ab", ink: "#b4467a" },
  "Research & Business": { icon: BarChart3, from: "#b26b12", to: "#e7a940", ink: "#b26b12" },
};

/** The required modules share the brand blue, each with its own icon. */
const BASICS: LucideIcon[] = [Compass, BadgeCheck, MessagesSquare];
const BASICS_LOOK = { from: "#0a65c0", to: "#4d9cf0", ink: "#0a65c0" };

type CoverInput = Pick<Lesson, "category" | "moduleOrder">;

function lookFor(lesson: CoverInput, index: number) {
  if (!lesson.category) {
    return { ...BASICS_LOOK, icon: BASICS[((lesson.moduleOrder ?? index + 1) - 1) % BASICS.length] ?? Compass };
  }
  return AREA[lesson.category] ?? { icon: PenLine, from: "#334e8c", to: "#6b86c4", ink: "#334e8c" };
}

/** The picture at the top of a course card: the area's colour, its icon, and a page. */
export function CourseCover({ lesson, index = 0, className }: { lesson: CoverInput; index?: number; className?: string }) {
  const look = lookFor(lesson, index);
  const Icon = look.icon;
  return (
    <div
      className={cn("relative aspect-[16/9] overflow-hidden rounded-[14px]", className)}
      style={{ background: `linear-gradient(135deg, ${look.from}, ${look.to})` }}
      aria-hidden="true"
    >
      <span className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-white/10" />
      <span className="absolute -bottom-14 -left-10 h-40 w-40 rounded-full bg-white/[0.07]" />
      <span className="absolute left-4 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-2xl bg-white/20 text-white ring-1 ring-white/30 transition-transform duration-300 group-hover:scale-110">
        <Icon className="h-7 w-7" />
      </span>
      <span className="absolute bottom-0 right-4 w-[46%] translate-y-2 rounded-t-xl bg-white/95 px-3 pb-5 pt-3 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:translate-y-0">
        <span className="block h-1.5 w-3/4 rounded-full" style={{ background: look.ink, opacity: 0.55 }} />
        <span className="mt-2 block h-1.5 w-full rounded-full bg-ink/10" />
        <span className="mt-1.5 block h-1.5 w-5/6 rounded-full bg-ink/10" />
        <span className="mt-1.5 block h-1.5 w-2/3 rounded-full bg-ink/10" />
      </span>
    </div>
  );
}

function Chip({ children, tone = "plain" }: { children: React.ReactNode; tone?: "plain" | "required" | "match" }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-1 text-[11.5px] font-bold",
        tone === "required" && "bg-info-bg text-primary",
        tone === "match" && "bg-success-bg text-success-ink",
        tone === "plain" && "text-ink-2 ring-1 ring-line-card",
      )}
    >
      {children}
    </span>
  );
}

/**
 * A course, laid out like a course store's card, except every one is free and the
 * ones that fit the doer's work are marked as such.
 */
export function CourseCard({ lesson, index, match }: { lesson: Lesson; index: number; match?: boolean }) {
  const reduceMotion = useReducedMotion();
  const required = !lesson.category;
  return (
    <motion.div
      variants={cardMotion}
      whileHover={reduceMotion ? undefined : { y: -4 }}
      className="w-[262px] shrink-0 snap-start sm:w-[280px]"
    >
      <Link
        to={`/training/${lesson.id}`}
        className={cn(
          CARD,
          "group h-full gap-3 p-3 pb-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        )}
      >
        <div className="relative">
          <CourseCover lesson={lesson} index={index} />
          {lesson.completed ? (
            <span className="absolute right-2.5 top-2.5 flex items-center gap-1 rounded-full bg-white px-2 py-1 text-[11px] font-extrabold text-success-ink">
              <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
              Done
            </span>
          ) : null}
        </div>
        <div className="flex flex-1 flex-col gap-2 px-1.5">
          <h3 className="line-clamp-2 text-[15.5px] font-extrabold leading-snug tracking-[-0.02em] transition-colors group-hover:text-primary">
            {lesson.title}
          </h3>
          <p className="text-xs font-semibold text-ink-muted">{lesson.category ?? "Dolancer basics"}</p>
          <div className="flex flex-wrap gap-1.5">
            {required ? <Chip tone="required">Required</Chip> : match ? <Chip tone="match">Fits your work</Chip> : null}
            {lesson.minutes ? (
              <Chip>
                <Clock className="h-3 w-3" aria-hidden="true" />
                {lesson.minutes} min
              </Chip>
            ) : null}
            {lesson.questionCount ? <Chip>Quiz</Chip> : null}
          </div>
          <div className="mt-auto flex items-center justify-between gap-3 pt-2">
            <span className={cn("text-lg font-extrabold tracking-[-0.02em]", lesson.completed && "text-success-ink")}>
              {lesson.completed ? "Completed" : "Free"}
            </span>
            <span className="rounded-xl px-4 py-2 text-[13px] font-extrabold text-primary ring-[1.5px] ring-primary transition-colors group-hover:bg-primary group-hover:text-white">
              {lesson.completed ? "Read again" : "Start"}
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/** A titled row of course cards that scrolls sideways, with arrows on wide screens. */
export function CourseRow({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  const track = useRef<HTMLDivElement>(null);
  const [edges, setEdges] = useState({ start: true, end: true });

  useEffect(() => {
    const element = track.current;
    if (!element) return;
    const measure = () =>
      setEdges({
        start: element.scrollLeft <= 4,
        end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 4,
      });
    measure();
    element.addEventListener("scroll", measure, { passive: true });
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    return () => {
      element.removeEventListener("scroll", measure);
      observer.disconnect();
    };
  }, []);

  const nudge = (direction: 1 | -1) => {
    const element = track.current;
    if (element) element.scrollBy({ left: direction * element.clientWidth * 0.85, behavior: "smooth" });
  };

  return (
    <section className="min-w-0" aria-label={title}>
      <div className="mb-3 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-[19px] font-extrabold tracking-[-0.03em]">{title}</h2>
          {sub ? <p className="text-xs font-semibold text-ink-muted">{sub}</p> : null}
        </div>
        {edges.start && edges.end ? null : (
          <div className="hidden shrink-0 gap-2 sm:flex">
            {([-1, 1] as const).map((direction) => (
              <button
                key={direction}
                type="button"
                onClick={() => nudge(direction)}
                disabled={direction < 0 ? edges.start : edges.end}
                aria-label={direction < 0 ? "Scroll back" : "Scroll on"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink shadow-[0_2px_8px_-2px_rgba(15,23,42,0.18)] ring-1 ring-ink/[0.05] transition-opacity hover:text-primary disabled:opacity-35 focus-visible:outline-2 focus-visible:outline-primary"
              >
                {direction < 0 ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </button>
            ))}
          </div>
        )}
      </div>
      <div
        ref={track}
        className="-mx-1 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-3 pt-1 scrollbar-hide"
      >
        {children}
      </div>
    </section>
  );
}

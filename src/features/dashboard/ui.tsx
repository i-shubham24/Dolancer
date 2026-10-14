import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { preloadRoute } from "@/lib/preload";
import { CARD, cardMotion } from "./card-styles";

/** The dashboard's building blocks: one card shape, one header, one way to enter. */

export function Panel({
  className,
  children,
  as = "section",
  ...rest
}: {
  className?: string;
  children: React.ReactNode;
  as?: "section" | "article" | "div";
} & React.AriaAttributes) {
  const Component = motion[as];
  return (
    <Component variants={cardMotion} className={cn(CARD, className)} {...rest}>
      {children}
    </Component>
  );
}

export function PanelHeader({
  id,
  title,
  sub,
  right,
  className,
}: {
  id?: string;
  title: string;
  sub?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("mb-3.5 flex items-start justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 id={id} className="text-[15px] font-extrabold leading-tight tracking-[-0.02em]">
          {title}
        </h2>
        {sub ? <p className="mt-0.5 text-xs font-medium text-ink-muted">{sub}</p> : null}
      </div>
      {right}
    </div>
  );
}

/** A small text link with an arrow, for "See all" style moves. */
export function MoreLink({ to, children, className }: { to: string; children: React.ReactNode; className?: string }) {
  return (
    <Link
      to={to}
      onMouseEnter={() => preloadRoute(to)}
      onFocus={() => preloadRoute(to)}
      className={cn(
        "group -my-1.5 inline-flex shrink-0 items-center gap-1 rounded-md py-1.5 text-[12.5px] font-bold text-primary",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        className,
      )}
    >
      {children}
      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

/** The round arrow in a stat card's corner. */
export function CornerArrow({ inverse = false }: { inverse?: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-transform duration-200 group-hover:rotate-45",
        inverse ? "border-white/80 text-white" : "border-ink/70 text-ink",
      )}
    >
      <ArrowUpRight className="h-3.5 w-3.5" />
    </span>
  );
}

/** A segmented filter in the dashboard's pill style. */
export function Segments<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: { id: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn("flex gap-1 rounded-full bg-panel p-1", className)}>
      {options.map((option) => {
        const active = option.id === value;
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition-colors",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-primary",
              active ? "text-ink" : "text-ink-muted hover:text-ink",
            )}
          >
            {active ? (
              <motion.span
                layoutId={`seg-${label}`}
                className="absolute inset-0 rounded-full bg-white shadow-[0_1px_3px_rgba(15,23,42,0.12)]"
                transition={{ type: "spring", stiffness: 420, damping: 34 }}
              />
            ) : null}
            <span className="relative">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

const TILE_TONES = [
  "bg-info-bg text-info-ink",
  "bg-violet-light text-violet",
  "bg-secondary-light text-secondary-hover",
  "bg-warning-bg text-warning-ink",
  "bg-danger-bg text-danger-ink",
];

/** Two letters and a soft colour for a category, the same every time. */
export function CategoryTile({ category, className }: { category: string; className?: string }) {
  const words = category.split(/[^A-Za-z]+/).filter(Boolean);
  const letters =
    words.length >= 2 ? `${words[0]![0]}${words[1]![0]}` : (words[0] ?? "Task").slice(0, 2);
  let hash = 0;
  for (const char of category) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-[12.5px] font-extrabold uppercase",
        TILE_TONES[hash % TILE_TONES.length],
        className,
      )}
    >
      {letters}
    </span>
  );
}

import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { preloadRoute } from "@/lib/preload";
import { CountUp } from "@/components/common/CountUp";
import { CARD, cardMotion, gridMotion } from "./card-styles";

/**
 * The page-level pieces every signed-in screen shares, so each page reads like the
 * dashboard: a short header, then cards that ease in one after another.
 */

/** Eyebrow, title, one short line, and actions on the right. Nothing more. */
export function PageHeader({
  eyebrow,
  title,
  sub,
  actions,
  back,
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  actions?: React.ReactNode;
  /** A small link back to the parent page, shown above the title. */
  back?: { to: string; label: string };
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.header
      className={cn("mb-5 flex flex-wrap items-end justify-between gap-4", className)}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="min-w-0">
        {back ? (
          <Link
            to={back.to}
            onMouseEnter={() => preloadRoute(back.to)}
            className="group -my-2 mb-1 inline-flex items-center gap-1.5 py-2 text-xs font-bold text-ink-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" aria-hidden="true" />
            {back.label}
          </Link>
        ) : eyebrow ? (
          <p className="text-xs font-bold uppercase tracking-[0.08em] text-ink-muted">{eyebrow}</p>
        ) : null}
        <h1 className="mt-1 break-words text-[26px] font-extrabold leading-tight tracking-[-0.04em] sm:text-[30px]">{title}</h1>
        {sub ? <p className="mt-1 text-sm font-medium text-ink-2 sm:text-md">{sub}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-wrap gap-2.5 sm:w-auto">{actions}</div> : null}
    </motion.header>
  );
}

/** A grid whose cards stagger in. Pass layout classes for the columns. */
export function CardGrid({ className, children }: { className?: string; children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={cn("grid gap-4", className)}
      variants={gridMotion}
      initial={reduceMotion ? false : "hidden"}
      animate="show"
    >
      {children}
    </motion.div>
  );
}

/** A friendly empty or error state inside a card: icon, a line or two, one action. */
export function EmptyPanel({
  icon,
  title,
  body,
  action,
  className,
  tone = "neutral",
}: {
  icon?: React.ReactNode;
  title: string;
  body?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  tone?: "neutral" | "warning" | "danger";
}) {
  return (
    <motion.div
      variants={cardMotion}
      initial="hidden"
      animate="show"
      className={cn(CARD, "items-center justify-center px-6 py-10 text-center", className)}
    >
      {icon ? (
        <span
          className={cn(
            "mb-4 flex h-14 w-14 items-center justify-center rounded-2xl [&>svg]:h-6 [&>svg]:w-6",
            tone === "warning" ? "bg-warning-bg text-warning-ink" : tone === "danger" ? "bg-danger-bg text-danger-ink" : "bg-info-bg text-primary",
          )}
          aria-hidden="true"
        >
          {icon}
        </span>
      ) : null}
      <p className="text-[17px] font-extrabold tracking-[-0.02em]">{title}</p>
      {body ? <div className="mt-1.5 max-w-sm text-sm leading-relaxed text-ink-2">{body}</div> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2.5">{action}</div> : null}
    </motion.div>
  );
}

/**
 * A figure in a card. Money and counts count up when they arrive. `hero` is the
 * one filled blue card a page may have; every other figure stays quiet.
 */
export function StatTile({
  label,
  value,
  format = (v) => String(Math.round(v)),
  display,
  foot,
  to,
  hero = false,
  icon,
  loading = false,
  className,
  delay = 0.3,
}: {
  label: string;
  value?: number;
  format?: (value: number) => string;
  /** Shown instead of a counted number, for text values. */
  display?: React.ReactNode;
  foot?: React.ReactNode;
  to?: string;
  hero?: boolean;
  icon?: React.ReactNode;
  loading?: boolean;
  className?: string;
  delay?: number;
}) {
  const body = (
    <>
      <div className="flex items-start justify-between gap-3">
        <span className={cn("text-[13px] font-bold", hero ? "text-white/85" : "text-ink-2")}>{label}</span>
        {to ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-[1.5px] transition-transform duration-200 group-hover:rotate-45",
              hero ? "border-white/80 text-white" : "border-ink/70 text-ink",
            )}
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        ) : icon ? (
          <span
            aria-hidden="true"
            className={cn(
              "flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-xl [&>svg]:h-4 [&>svg]:w-4",
              hero ? "bg-white/15 text-white" : "bg-panel text-ink-2",
            )}
          >
            {icon}
          </span>
        ) : null}
      </div>
      <div className="mb-1 mt-2.5 text-[26px] font-extrabold leading-none tracking-[-0.035em] tabular-nums min-[420px]:text-[30px]">
        {loading ? (
          <span className={cn("inline-block h-8 w-24 rounded-lg align-middle", hero ? "bg-white/20" : "skeleton")} aria-hidden="true" />
        ) : display !== undefined ? (
          display
        ) : (
          <CountUp value={value ?? 0} format={format} delay={delay} />
        )}
      </div>
      {foot ? <div className={cn("text-xs font-semibold", hero ? "text-white/85" : "text-ink-muted")}>{foot}</div> : null}
    </>
  );
  const shell = cn(
    CARD,
    "group h-full",
    hero && "bg-gradient-to-br from-primary to-primary-hover text-inverse ring-0 shadow-[0_14px_30px_-14px_rgba(10,101,192,0.75)]",
    className,
  );
  return (
    <motion.div variants={cardMotion} className="min-w-0">
      {to ? (
        <Link
          to={to}
          onMouseEnter={() => preloadRoute(to)}
          onFocus={() => preloadRoute(to)}
          className={cn(shell, "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary")}
        >
          {body}
        </Link>
      ) : (
        <div className={shell}>{body}</div>
      )}
    </motion.div>
  );
}

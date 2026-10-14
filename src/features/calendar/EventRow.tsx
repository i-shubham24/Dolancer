import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";
import { KIND_META, type CalendarEvent } from "./events";
import { formatDayShort } from "./dates";

/** One dated item as a row: a coloured bar for its kind, a title and a note. */
export function EventRow({ event, showDay = true }: { event: CalendarEvent; showDay?: boolean }) {
  const body = (
    <>
      <span className={cn("w-1 self-stretch rounded-full", KIND_META[event.kind].bar)} aria-hidden="true" />
      <span className="min-w-0">
        <span className="block truncate text-[12.5px] font-bold leading-tight text-ink">
          {event.kind === "deadline" ? `Due: ${event.title}` : event.title}
        </span>
        <span className="mt-0.5 block truncate text-[11.5px] font-semibold text-ink-muted">
          {showDay ? `${formatDayShort(event.at)}. ` : ""}
          {event.note}
        </span>
      </span>
    </>
  );
  const className = "flex items-center gap-2.5 rounded-xl bg-panel/60 px-2.5 py-2 transition-colors";
  const row = event.href ? (
    <Link to={event.href} className={cn(className, "hover:bg-panel focus-visible:outline-2 focus-visible:outline-primary")}>
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
  const fresh = event.addedAt !== undefined && Date.now() - event.addedAt < 6000;
  return fresh ? <FreshGlow>{row}</FreshGlow> : row;
}

/** A violet ring that fades out, so a just-added item is easy to spot. */
function FreshGlow({ children }: { children: React.ReactNode }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <>{children}</>;
  return (
    <motion.div
      className="rounded-xl"
      initial={{ scale: 0.96, boxShadow: "0 0 0 3px rgba(109, 92, 231, 0.5)" }}
      animate={{ scale: 1, boxShadow: "0 0 0 0px rgba(109, 92, 231, 0)" }}
      transition={{ scale: { type: "spring", stiffness: 400, damping: 22 }, boxShadow: { duration: 2.4, ease: "easeOut" } }}
    >
      {children}
    </motion.div>
  );
}

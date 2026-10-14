import { useEffect, useId, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CountUp } from "@/components/common/CountUp";

const pct = (value: number) => `${Math.round(value)}%`;

/**
 * A half-circle progress meter: the done part sweeps in as a solid arc over a
 * striped track for what is left, with the figure counting up in the middle.
 */
export function Gauge({
  value,
  tone = "var(--color-primary)",
  label,
  delay = 0.4,
}: {
  value: number;
  tone?: string;
  label: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const hatch = useId();
  const clamped = Math.max(0, Math.min(100, value));
  // Only the first sweep waits for the card to land; later changes follow at once.
  const first = useRef(true);
  useEffect(() => {
    first.current = false;
  }, []);
  const arc = "M 16 92 A 74 74 0 0 1 164 92";

  return (
    <div className="relative mx-auto w-full max-w-[200px]" role="img" aria-label={`${label}: ${Math.round(clamped)}%`}>
      <svg viewBox="0 0 180 100" className="block w-full overflow-visible" aria-hidden="true">
        <defs>
          <pattern id={hatch} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="2.2" height="6" fill="#cdd7e4" />
          </pattern>
        </defs>
        <path d={arc} fill="none" stroke={`url(#${hatch})`} strokeWidth="20" strokeLinecap="round" />
        {clamped > 0 ? (
          <motion.path
            d={arc}
            fill="none"
            stroke={tone}
            strokeWidth="20"
            strokeLinecap="round"
            initial={reduceMotion ? false : { pathLength: 0 }}
            animate={{ pathLength: clamped / 100 }}
            transition={{ duration: first.current ? 1.1 : 0.45, delay: first.current ? delay : 0, ease: [0.16, 1, 0.3, 1] }}
          />
        ) : null}
      </svg>
      <div className="absolute inset-x-0 bottom-0 text-center">
        <CountUp
          value={clamped}
          format={pct}
          delay={delay}
          duration={1.1}
          className="block text-[28px] font-extrabold leading-none tracking-[-0.03em] tabular-nums"
        />
        <span className="mt-1 block text-[11px] font-semibold text-ink-muted">{label}</span>
      </div>
    </div>
  );
}

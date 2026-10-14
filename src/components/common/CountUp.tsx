import { useEffect, useRef } from "react";
import { animate, useReducedMotion } from "framer-motion";

/**
 * A number that counts to its value, and counts again from the old value when the
 * value changes, so an accepted task or a new payout visibly ticks the figure.
 *
 * The text is written straight to the node on each frame rather than through state,
 * so a dashboard full of these does not re-render React sixty times a second. With
 * reduced motion the final value is shown at once.
 */
export function CountUp({
  value,
  format,
  duration = 0.9,
  delay = 0,
  className,
}: {
  value: number;
  format: (value: number) => string;
  duration?: number;
  /** Seconds to wait before the first count, so it starts once its card is visible. */
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(reduceMotion ? value : 0);
  const started = useRef(false);
  const formatRef = useRef(format);
  formatRef.current = format;

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (reduceMotion) {
      shown.current = value;
      node.textContent = formatRef.current(value);
      return;
    }
    const controls = animate(shown.current, value, {
      duration,
      // Only the first count waits; later changes tick straight away.
      delay: started.current ? 0 : delay,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        started.current = true;
        shown.current = latest;
        node.textContent = formatRef.current(latest);
      },
    });
    return () => controls.stop();
  }, [value, duration, delay, reduceMotion]);

  return (
    <span ref={ref} className={className}>
      {format(shown.current)}
    </span>
  );
}

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

/**
 * Text whose digits roll like a counter when they change, the way a stopwatch
 * ticks over. Each position animates on its own, so only the digits that change
 * move. Screen readers get the plain value from the parent's label.
 */
export function RollingDigits({ text, className }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return <span className={className}>{text}</span>;

  return (
    <span className={className} aria-hidden="true">
      {text.split("").map((char, index) =>
        /\d/.test(char) ? (
          <span key={index} className="relative inline-block overflow-hidden align-bottom tabular-nums">
            <AnimatePresence mode="popLayout" initial={false}>
              <motion.span
                key={char}
                className="inline-block"
                initial={{ y: "-70%", opacity: 0 }}
                animate={{ y: "0%", opacity: 1 }}
                exit={{ y: "70%", opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
              >
                {char}
              </motion.span>
            </AnimatePresence>
          </span>
        ) : (
          <span key={index} className="inline-block">
            {char}
          </span>
        ),
      )}
    </span>
  );
}

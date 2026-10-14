import { motion, useReducedMotion } from "framer-motion";

/**
 * The faint contour lines the reel puts behind its dark cards. Purely visual, kept
 * very light so text contrast is untouched, and it drifts slowly only when motion
 * is allowed.
 */
export function LineTexture({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.svg
      aria-hidden="true"
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={className ?? "pointer-events-none absolute inset-0 h-full w-full"}
      initial={false}
      animate={reduceMotion ? undefined : { x: [0, -10, 0], y: [0, 6, 0] }}
      transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
    >
      {Array.from({ length: 9 }, (_, index) => (
        <ellipse
          key={index}
          cx="390"
          cy="20"
          rx={70 + index * 34}
          ry={46 + index * 26}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.1"
          transform="rotate(-18 390 20)"
        />
      ))}
    </motion.svg>
  );
}

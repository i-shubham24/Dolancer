import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Logo } from "@/components/ui/Logo";

/**
 * LOCAL-ONLY experiment - do not push. Blob loader referencing
 * https://www.aardvarkbookclub.com/
 *
 * - ONE colour only: the current palette's primary (blobs are the same hue
 *   at low opacity, no second hue anywhere).
 * - Oversized logo on its own, no circular ring/border around it.
 * - No curtain slide: first paint is already fully covered (no grow-in that
 *   flashes the site), short hold, then a quick iris-out onto the logo.
 * - Logo renders at final size immediately - no scale-in pop.
 */
const IRIS_OPEN = "circle(142% at 50% 50%)";
const IRIS_CLOSED = "circle(0% at 50% 50%)";

export function SplashLoader() {
  const [isLoading, setIsLoading] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, reduceMotion ? 200 : 1000);
    return () => clearTimeout(timer);
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash"
            role="status"
            aria-label="Loading Dolancer"
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-primary"
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            <Logo size="xl" className="h-28 w-28 md:h-40 md:w-40" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="splash"
          role="status"
          aria-label="Loading Dolancer"
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-primary"
          initial={{ clipPath: IRIS_OPEN }}
          animate={{ clipPath: IRIS_OPEN }}
          transition={{ duration: 0 }}
          exit={{
            clipPath: IRIS_CLOSED,
            transition: { duration: 1.0, ease: [0.76, 0, 0.24, 1] },
          }}
        >
          {/* Morphing organic blobs - same hue only, echoing the reference's
              drifting corner shapes. */}
          <motion.div
            aria-hidden="true"
            className="absolute -top-36 -right-28 h-[30rem] w-[30rem] bg-white/10"
            initial={{ borderRadius: "42% 58% 63% 37% / 45% 42% 58% 55%" }}
            animate={{
              borderRadius: [
                "42% 58% 63% 37% / 45% 42% 58% 55%",
                "60% 40% 38% 62% / 55% 60% 40% 45%",
                "42% 58% 63% 37% / 45% 42% 58% 55%",
              ],
              x: [0, -40, 0],
              y: [0, 30, 0],
              rotate: [0, 40, 0],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden="true"
            className="absolute -bottom-44 -left-28 h-[34rem] w-[34rem] bg-black/10"
            initial={{ borderRadius: "58% 42% 37% 63% / 52% 58% 42% 48%" }}
            animate={{
              borderRadius: [
                "58% 42% 37% 63% / 52% 58% 42% 48%",
                "38% 62% 60% 40% / 45% 38% 62% 55%",
                "58% 42% 37% 63% / 52% 58% 42% 48%",
              ],
              x: [0, 40, 0],
              y: [0, -30, 0],
              rotate: [0, -40, 0],
            }}
            transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Oversized logo, floating - no ring or circular border.
              Final size from the first frame: fade only, never a scale pop. */}
          <motion.div
            className="relative z-10 flex flex-col items-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            exit={{ opacity: 0, transition: { duration: 0.25 } }}
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 1.8, delay: 0.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Logo
                size="xl"
                className="h-28 w-28 rounded-[1.75rem] shadow-2xl md:h-40 md:w-40"
              />
            </motion.div>

            <div className="flex items-center gap-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <motion.span
                  key={i}
                  className="h-2.5 w-2.5 rounded-full bg-white"
                  animate={{ opacity: [0.3, 1, 0.3], y: [0, -5, 0] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    delay: i * 0.18,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

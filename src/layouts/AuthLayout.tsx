import { Outlet } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Split auth screen with double sliding window entrance animation:
 * Both panels start centered in the viewport with the right brand showcase
 * on top (in front). After a brief pause, they slide apart to their respective
 * sides like a double sliding window parting.
 */
export function AuthLayout() {
  const [isDesktop, setIsDesktop] = useState(() => 
    typeof window !== "undefined" && window.innerWidth >= 1024
  );
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const shouldAnimate = isDesktop && !reduceMotion;

  return (
    <div className="relative grid min-h-dvh lg:h-dvh lg:overflow-hidden lg:grid-cols-2 bg-[#fafbfe]">
      {/* Left Form Column (starts centered underneath, then slides to the left) */}
      <motion.div
        initial={shouldAnimate ? { x: "50%", opacity: 0.85 } : false}
        animate={shouldAnimate ? { x: 0, opacity: 1 } : false}
        transition={{
          duration: 0.85,
          delay: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="auth-form-column flex min-w-0 items-center justify-center px-5 py-6 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:py-4 z-10"
      >
        <Outlet />
      </motion.div>

      {/* Right Brand Showcase Column (starts centered in front, then slides to the right) */}
      <motion.div
        initial={shouldAnimate ? { x: "-50%" } : false}
        animate={shouldAnimate ? { x: 0 } : false}
        transition={{
          duration: 0.85,
          delay: 0.22,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="relative hidden min-w-0 overflow-hidden bg-primary text-inverse lg:block z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.18)]"
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.22)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:linear-gradient(to_bottom,black,transparent_82%)]"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-16 -right-8 font-display text-[22rem] leading-none font-extrabold tracking-tight text-white/10 select-none"
        >
          D
        </div>
        <div
          aria-hidden="true"
          className="absolute -left-24 top-1/4 h-72 w-72 rounded-full border-2 border-white/20"
        />
        <div
          aria-hidden="true"
          className="absolute right-16 top-16 h-4 w-4 rounded-full bg-white/40"
        />

        <div className="relative flex h-full flex-col justify-end p-10 xl:p-12">
          <span className="inline-flex w-fit items-center gap-2 border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-bold tracking-wide backdrop-blur-sm">
            <ShieldCheck className="h-3.5 w-3.5" />
            Supervisor-backed work
          </span>
          <blockquote className="mt-5 max-w-md">
            <p className="text-3xl xl:text-4xl font-extrabold leading-[1.15] tracking-[-0.03em]">
              Zero bidding. Locked upfront pay. A supervisor in your corner.
            </p>
            <footer className="mt-4 text-sm font-bold text-inverse/70">
              How work runs on Dolancer
            </footer>
          </blockquote>

          <div className="mt-8 grid max-w-md grid-cols-3 gap-3">
            {[
              { value: "₹8Cr+", label: "Paid out" },
              { value: "48h", label: "Avg. release" },
              { value: "4.9/5", label: "Doer rating" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="border border-white/20 bg-white/10 px-3 py-3 backdrop-blur-sm"
              >
                <p className="font-display text-xl font-extrabold tracking-tight">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-[11px] font-bold uppercase tracking-wider text-inverse/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

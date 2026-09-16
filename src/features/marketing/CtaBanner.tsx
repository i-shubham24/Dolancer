import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Clock, Sparkles } from "lucide-react";
import { StitchBadge, StitchButton } from "@/components/stitch/StitchPrimitives";
import { useMagneticHover } from "@/hooks/useMagneticHover";

export function CtaBanner() {
  const reduceMotion = useReducedMotion();
  const magneticRef = useMagneticHover<HTMLButtonElement>();

  return (
    <section className="fresh-section pt-20 pb-10">
      <div className="fresh-container">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="fresh-final-card mx-auto max-w-5xl rounded-[2.5rem] p-8 sm:p-14"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="text-center lg:text-left min-w-0 flex-1">
              <StitchBadge tone="neutral">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Fair Pay for Real Expertise
              </StitchBadge>

              <h2 className="mt-4 text-3xl sm:text-5xl font-extrabold tracking-[-0.04em] text-ink leading-[1.08] font-display">
                Ready to turn skill into{" "}
                <span className="fresh-highlight fresh-underline fresh-underline-mint">reliable earnings?</span>
              </h2>

              <p className="mt-4 max-w-xl text-base sm:text-lg text-ink-2 font-medium">
                Your expertise is in high demand. Create an account, get verified in minutes, and accept assigned offers with fixed upfront rates.
              </p>

              <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs sm:text-sm font-bold text-ink-2">
                <span className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-primary" /> Set up in minutes
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary" /> Direct payout
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-success-dot" /> Payout protected
                </span>
              </div>
            </div>

            {/* Buttons stacked vertically */}
            <div className="flex flex-col justify-center gap-3 w-full sm:w-auto min-w-[200px] shrink-0">
              <StitchButton asChild variant="primary" ref={magneticRef}
                className="!w-full !mt-0 px-6 sm:px-7 py-3.5 sm:py-4 text-sm sm:text-base justify-center whitespace-nowrap shadow-soft-sm relative overflow-hidden group">
                <Link to="/sign-up" className="inline-flex items-center justify-center w-full">
                  Start Earning
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Link>
              </StitchButton>
              <StitchButton asChild variant="outline" className="!w-full !mt-0 px-5 sm:px-6 py-3.5 sm:py-4 text-sm sm:text-base justify-center whitespace-nowrap bg-surface/95 hover:bg-surface border border-line-card text-ink shadow-soft-xs">
                <Link to="/contact" className="inline-flex items-center justify-center w-full">
                  Ask a question
                </Link>
              </StitchButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

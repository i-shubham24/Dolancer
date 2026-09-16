import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Sparkles, MoreHorizontal, Wallet, ArrowUpRight } from "lucide-react";

export function HowItWorksHeroGraphic() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-[420px] mx-auto z-10 pt-4 pb-8 sm:pt-8 sm:pb-12">
      {/* Main Card */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 20 }}
        animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
        className="rounded-[2.5rem] border border-line-card bg-surface p-7 sm:p-9 shadow-soft-xl relative z-10 rotate-[2deg] hover:rotate-[1deg] transition-transform duration-300"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="h-2 w-2 rounded-full bg-success-dot shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
          <span className="text-[13px] font-semibold text-ink-2">
            Matched for you
          </span>
          <MoreHorizontal className="h-5 w-5 text-ink-muted" />
        </div>

        {/* Sparkle Icon */}
        <div className="mb-6">
          <Sparkles className="h-6 w-6 text-ink fill-ink" />
        </div>

        {/* Category */}
        <div className="text-[10px] font-extrabold text-ink-2 uppercase tracking-widest mb-2.5">
          DESIGN SYSTEM / PRODUCT
        </div>

        {/* Title */}
        <h3 className="text-[26px] sm:text-3xl font-extrabold text-ink leading-[1.15] tracking-[-0.03em] font-display mb-3">
          Build a calm, clear onboarding experience
        </h3>

        {/* Description */}
        <p className="text-[15px] font-medium text-ink-muted mb-8">
          A focused brief with room for your best thinking.
        </p>

        {/* Payout & Deadline */}
        <div className="flex items-end justify-between border-b border-line-card/50 pb-5 mb-5">
          <span className="text-3xl font-extrabold text-ink tracking-tight font-display">
            ₹24,000
          </span>
          <span className="text-xs font-bold text-ink-2">
            7 days
          </span>
        </div>

        {/* Action Button */}
        <Link 
          to="/sign-up"
          className="w-full flex items-center justify-between rounded-full bg-highlight text-inverse px-6 py-4 cursor-pointer hover:bg-highlight-hover hover:scale-[1.02] active:scale-[0.98] transition-all shadow-soft-sm group"
        >
          <span className="font-bold text-[15px]">View brief</span>
          <ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </motion.div>

      {/* Floating Success Card (Bottom Right) */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9, x: -10 }}
        animate={reduceMotion ? undefined : { opacity: 1, scale: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute -bottom-2 -right-4 sm:-bottom-4 sm:-right-8 z-20 rounded-[1.25rem] border border-success-dot/30 bg-success-bg p-4 pr-6 shadow-soft-lg flex items-center gap-3 rotate-[5deg] hover:rotate-[7deg] transition-transform duration-300"
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-success-dot/20 bg-success-dot/10 text-success-ink">
          <Wallet className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <div>
          <div className="text-[10px] font-bold text-success-ink uppercase tracking-widest mb-0.5">
            PAYOUT RELEASED
          </div>
          <div className="text-xl font-extrabold text-ink tracking-tight flex items-baseline gap-1.5 font-display">
            ₹18,600 <span className="text-xs font-medium text-ink-muted tracking-normal">today</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

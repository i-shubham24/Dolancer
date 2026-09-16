import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Check, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { StitchBadge, StitchButton } from "@/components/stitch/StitchPrimitives";
import { motion, useReducedMotion } from "framer-motion";
import { BorderBeam } from "@/components/ui/BorderBeam";

export function AboutHeroInteractive() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-6 sm:py-10">
      {/* Left Column: Editorial & Narrative */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <StitchBadge tone="brand">
            <Sparkles className="h-3.5 w-3.5" />
            Our Origin and Charter
          </StitchBadge>
          <h1 className="fresh-about-title mt-4 text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-ink font-display leading-[1.1]">
            Skilled work should feel
            <br />
            <span className="fresh-highlight fresh-underline fresh-underline-yellow">
              simpler than this.
            </span>
          </h1>
        </div>

        <div className="space-y-4 text-base sm:text-lg text-ink-2 font-medium leading-relaxed">
          <p>
            Most freelance platforms put the entire operational burden on the creator: drafting dozens of unpaid proposals, discounting against race-to-the-bottom bids, and absorbing angry client messages.
          </p>
          <p>
            <strong className="text-ink font-extrabold">Dolancer was built to flip this upside down.</strong> We secure the enterprise clients, lock in pre-funded budgets, and pair you with a human supervisor who shields you from scope creep and dispute friction.
          </p>
          <p>
            You focus 100% on craft: delivering exceptional work, and receiving prompt, fixed payouts directly to your bank account.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <StitchButton asChild>
            <Link to="/sign-up">
              Start earning <ArrowRight className="h-4 w-4 ml-1.5" />
            </Link>
          </StitchButton>
          <StitchButton asChild variant="outline">
            <Link to="/how-it-works">See how work flows</Link>
          </StitchButton>
        </div>
      </div>

      {/* Right Column: Custom Meaningful Graphic (Flipping it upside down) */}
      <div className="lg:col-span-6 flex justify-center lg:justify-end">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 2 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[450px]"
        >
          {/* The messy "old way" background card - rotated, faded, grayscale */}
          <div className="absolute inset-0 bg-white border-2 border-red-200/60 rounded-3xl shadow-soft-sm transform rotate-[-6deg] opacity-50 flex flex-col p-6 grayscale">
            <div className="h-4 w-1/2 bg-red-200/60 rounded-full mb-4"></div>
            <div className="h-2 w-3/4 bg-red-100 rounded-full mb-2"></div>
            <div className="h-2 w-full bg-red-100 rounded-full mb-2"></div>
            <div className="h-2 w-5/6 bg-red-100 rounded-full mb-6"></div>
            <div className="mt-auto flex justify-between">
              <div className="h-8 w-8 bg-red-200/60 rounded-full"></div>
              <div className="h-8 w-20 bg-red-100 rounded-full"></div>
            </div>
          </div>
          
          {/* The clean "Dolancer way" foreground card */}
          <div className="relative bg-surface border-2 border-line-card rounded-3xl shadow-soft-xl z-10 overflow-hidden pointer-events-auto">
            {!reduceMotion && <BorderBeam className="opacity-70" />}
            
            <div className="relative z-20 p-7 h-full flex flex-col pointer-events-none">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/15 rounded-full blur-2xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-secondary/15 rounded-full blur-2xl z-0"></div>
              
              <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="h-10 w-10 rounded-2xl bg-primary flex items-center justify-center shadow-soft-sm">
                <Check className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-extrabold text-ink font-display text-lg tracking-tight">The Dolancer Way</h3>
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Simplicity</p>
              </div>
            </div>

            <div className="space-y-4 relative z-10">
              <div className="flex items-center gap-3 bg-secondary/8 p-3 rounded-xl border border-secondary/20 shadow-soft-xs transition-transform hover:scale-[1.02]">
                <div className="h-8 w-8 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
                  <ShieldCheck className="h-4 w-4 text-secondary" />
                </div>
                <div className="text-sm font-bold text-ink">Shield Buffer</div>
              </div>
              <div className="flex items-center gap-3 bg-success-bg/40 p-3 rounded-xl border border-success-ink/15 shadow-soft-xs transition-transform hover:scale-[1.02]">
                <div className="h-8 w-8 rounded-full bg-success-bg flex items-center justify-center shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-success-ink" />
                </div>
                <div className="text-sm font-bold text-ink">Pre-funded</div>
              </div>
              <div className="flex items-center gap-3 bg-primary/8 p-3 rounded-xl border border-primary/20 shadow-soft-xs transition-transform hover:scale-[1.02]">
                <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                  <Zap className="h-4 w-4 text-primary" />
                </div>
                <div className="text-sm font-bold text-ink">0 Cold Bids</div>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-line-card/60 flex items-center justify-between text-xs relative z-10">
              <span className="font-bold text-ink-3">Platform Overhead</span>
              <span className="font-extrabold text-ink px-2 py-1 bg-accent-light rounded-md border border-accent/30">0%</span>
            </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

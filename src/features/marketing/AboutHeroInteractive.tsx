import { Link } from "react-router-dom";
import { Sparkles, ShieldCheck, Check, Zap, ArrowRight, CheckCircle2 } from "lucide-react";
import { StitchBadge } from "@/components/stitch/StitchPrimitives";
import { motion, useReducedMotion } from "framer-motion";
import { BorderBeam } from "@/components/ui/BorderBeam";

export function AboutHeroInteractive() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center py-6 sm:py-10">
      {/* Left Column: Editorial & Narrative */}
      <div className="lg:col-span-6 space-y-6">
        <div>
          <StitchBadge tone="light">
            <Sparkles className="h-3.5 w-3.5" />
            Our Origin and Charter
          </StitchBadge>
          <h1 className="mt-4 text-white text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] font-extrabold tracking-tight font-display leading-[1.05]">
            Skilled work should feel
            <br />
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-primary pb-2">
              simpler than this.
              <svg className="absolute -bottom-1 left-0 w-full h-4 text-cyan-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M 2 8 L 98 4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </h1>
        </div>

        <div className="space-y-4 text-base sm:text-lg text-slate-300 font-medium leading-relaxed max-w-lg">
          <p>
            Traditional platforms force you to draft unpaid proposals, race to the bottom on price, and manage endless client friction.
          </p>
          <p>
            <strong className="text-white font-extrabold">Dolancer flips this upside down.</strong> We secure pre-funded enterprise work and pair you with a supervisor who handles all client communication.
          </p>
          <p>
            You focus 100% on craft. Deliver exceptional work, get paid instantly.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center gap-4 pt-4">
          <Link 
            to="/sign-up"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_40px_rgba(90,124,255,0.4)]"
          >
            Start earning <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
          <Link
            to="/how-it-works"
            className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md"
          >
            See how work flows
          </Link>
        </div>
      </div>

      {/* Right Column: Custom Meaningful Graphic (Redesigned for Dark Mode) */}
      <div className="lg:col-span-6 flex justify-center lg:justify-end">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 2 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[500px]"
        >
          {/* The messy "old way" background card - floating & faded */}
          <div className="absolute inset-0 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm transform rotate-[-6deg] opacity-50 flex flex-col p-6 translate-x-[-15px] translate-y-[15px]">
            <div className="h-4 w-1/2 bg-white/20 rounded-full mb-4"></div>
            <div className="h-2 w-3/4 bg-white/10 rounded-full mb-2"></div>
            <div className="h-2 w-full bg-white/10 rounded-full mb-2"></div>
            <div className="h-2 w-5/6 bg-white/10 rounded-full mb-6"></div>
            <div className="mt-auto flex justify-between">
              <div className="h-8 w-8 bg-white/20 rounded-full"></div>
              <div className="h-8 w-20 bg-white/10 rounded-full"></div>
            </div>
          </div>
          
          {/* The clean "Dolancer way" foreground card */}
          <div className="relative bg-[#0A0D1A]/80 backdrop-blur-xl border border-white/15 rounded-3xl shadow-2xl z-10 overflow-hidden pointer-events-auto group">
            {!reduceMotion && <BorderBeam className="opacity-70 group-hover:opacity-100 transition-opacity duration-500" />}
            
            <div className="relative z-20 p-8 h-full flex flex-col pointer-events-none">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl z-0"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-3xl z-0"></div>
              
              <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(90,124,255,0.4)]">
                  <Check className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white font-display text-xl tracking-tight">The Dolancer Way</h3>
                  <p className="text-xs font-bold text-cyan-400 uppercase tracking-widest mt-1">Simplicity First</p>
                </div>
              </div>

              <div className="space-y-4 relative z-10">
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 transition-transform hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
                  <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
                    <ShieldCheck className="h-5 w-5 text-blue-400" />
                  </div>
                  <div className="text-[15px] font-bold text-white">Shield Buffer from clients</div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 transition-transform hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
                  <div className="h-10 w-10 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="text-[15px] font-bold text-white">Pre-funded security</div>
                </div>
                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-xl border border-white/10 transition-transform hover:scale-[1.02] hover:bg-white/10 hover:border-white/20">
                  <div className="h-10 w-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                    <Zap className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-[15px] font-bold text-white">0 unpaid cold bids</div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between relative z-10">
                <span className="font-bold text-slate-400 text-sm">Platform Overhead</span>
                <span className="font-extrabold text-white px-3 py-1.5 bg-white/10 rounded-lg border border-white/20">0%</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

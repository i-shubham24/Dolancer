import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Play, CheckCircle2 } from "lucide-react";
import { useMagneticHover } from "@/hooks/useMagneticHover";
import { HeroCardStack } from "./HeroCardStack";

export function HeroSpectacular() {
  const reduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  
  const ctaRef1 = useMagneticHover<HTMLAnchorElement>(0.2, 30);
  const ctaRef2 = useMagneticHover<HTMLButtonElement>(0.2, 30);

  // Animation variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  return (
    <section 
      ref={containerRef}
      className="relative pt-[140px] pb-16 lg:pt-[170px] lg:pb-24 bg-[#050914] z-10"
    >
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-b-[2rem] lg:rounded-b-[4rem]">
        {/* Deep mesh grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_40%,#000_20%,transparent_100%)] opacity-20" />
        
        {/* Glowing orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen" />
        <div className="absolute top-[20%] right-[-10%] w-[40%] h-[60%] rounded-full bg-cyan-500/10 blur-[100px] mix-blend-screen" />
        <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[50%] rounded-full bg-blue-600/15 blur-[120px] mix-blend-screen" />
      </div>

      <div className="max-w-[1320px] mx-auto px-5 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-16 lg:gap-8 items-center">
          
          {/* Left Side: Typography & CTA */}
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate="show"
            className="flex flex-col items-start max-w-2xl"
          >
            <motion.div variants={fadeUp} className="mb-6 flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-cyan-400">12,000+ Professionals Ready To Work</span>
            </motion.div>

            <motion.h1 
              variants={fadeUp}
              className="text-[3.5rem] leading-[1.05] sm:text-[4.5rem] lg:text-[5.5rem] font-extrabold text-white tracking-[-0.03em] font-display"
            >
              Get paid for{" "}
              <br className="hidden sm:block" />
              what you're{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-primary">
                good at.
                <svg className="absolute -bottom-1 left-0 w-full h-4 text-cyan-400 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M 2 8 L 98 4" stroke="currentColor" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </motion.h1>

            <motion.p 
              variants={fadeUp}
              className="mt-8 text-lg sm:text-xl text-slate-300 font-medium leading-relaxed max-w-xl"
            >
              Skip the bidding wars. Join our verified doer network to find scoped work, collaborate with a supervisor, and earn according to clear upfront terms.
            </motion.p>

            <motion.div variants={fadeUp} className="mt-10 flex flex-wrap items-center gap-4">
              <Link 
                ref={ctaRef1 as any}
                to="/sign-up"
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-primary text-white font-bold text-lg hover:bg-primary-hover hover:scale-105 transition-all shadow-[0_0_40px_rgba(90,124,255,0.4)]"
              >
                Join the network
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/how-it-works"
                ref={ctaRef2 as any}
                className="inline-flex items-center justify-center h-14 px-8 rounded-full bg-white/5 text-white font-bold text-lg border border-white/10 hover:bg-white/10 transition-all backdrop-blur-md"
              >
                <Play className="mr-2 h-5 w-5 fill-white" />
                See how it works
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 flex flex-wrap items-center gap-6 text-sm font-medium text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> Pay agreed upfront</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-cyan-400" /> Supervisor reviewed</span>
            </motion.div>
          </motion.div>

          {/* Right Hero Visual Stack */}
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.96 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:-mt-20 w-full max-w-[620px] mx-auto"
          >
            <HeroCardStack />
          </motion.div>

        </div>
      </div>
      
      {/* Curved upward bottom separator that smoothly transitions into the white sections below without cutting them */}
      <div className="absolute -bottom-px left-0 w-full overflow-hidden leading-none z-20 pointer-events-none">
        <svg className="relative block w-full h-[40px] lg:h-[70px]" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,120 C400,120 400,0 600,0 C800,0 800,120 1200,120 Z" className="fill-canvas" />
        </svg>
      </div>
    </section>
  );
}

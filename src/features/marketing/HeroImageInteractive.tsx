import { motion, useReducedMotion } from "framer-motion";
import { ShieldCheck, Star } from "lucide-react";

export function HeroImageInteractive() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative w-full max-w-[500px] mx-auto min-h-[440px] flex items-center justify-center p-4">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-primary/5 rounded-[3rem] transform rotate-3" />
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent rounded-[3rem] -rotate-2" />

      {/* Main Image Container */}
      <div className="relative z-10 w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
        <img 
          src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
          alt="Professionals working together"
          className="w-full h-full object-cover"
        />
        {/* Subtle overlay for contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Floating Badge 1 - Escrow Protected */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="absolute top-12 -left-6 sm:-left-12 z-20"
      >
        <motion.div 
          animate={reduceMotion ? false : { y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="flex items-center gap-3 rounded-2xl border border-line-card bg-surface p-3 shadow-soft-lg backdrop-blur-md"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink leading-tight">Escrow Protected</span>
            <span className="text-xs text-ink-2 font-medium">Funds held safely</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating Badge 2 - Recent Earnings */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="absolute bottom-16 -right-4 sm:-right-8 z-20"
      >
        <motion.div 
          animate={reduceMotion ? false : { y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="flex items-center gap-3 rounded-2xl border border-line-card bg-surface p-3 shadow-soft-lg backdrop-blur-md"
        >
          <div className="h-10 w-10 shrink-0 rounded-full overflow-hidden border border-line-card bg-surface-2">
            <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80" alt="Sarah" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-ink leading-tight">Sarah just earned ₹2,400</span>
            <div className="flex items-center gap-0.5 mt-0.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-500" />
              ))}
              <span className="text-[10px] font-bold text-ink-2 ml-1">5.0</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

    </div>
  );
}

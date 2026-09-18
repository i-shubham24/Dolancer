import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ShieldCheck, Zap, Clock } from "lucide-react";
import { StitchButton } from "@/components/stitch/StitchPrimitives";

export function CtaBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative overflow-hidden bg-[#fafbfe] py-24 sm:py-32">
      {/* Vahan-style Dot Pattern at Top Right */}
      <div 
        className="absolute right-[5%] top-12 w-64 h-64 opacity-30 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#94a3b8 2.5px, transparent 2.5px)',
          backgroundSize: '20px 20px'
        }}
      />

      <div className="fresh-container relative z-10 px-4 sm:px-6">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col lg:flex-row items-center justify-between gap-16 lg:gap-12 max-w-[1200px] mx-auto"
        >
          {/* Left Content */}
          <div className="w-full lg:w-[45%] text-center lg:text-left flex-shrink-0 pt-4">
            <h2 className="text-[2.75rem] leading-[1.1] sm:text-5xl lg:text-6xl font-extrabold text-[#1e293b] tracking-tight font-display">
              Ready to turn skill into <br className="hidden lg:block" /> reliable earnings?
            </h2>
            <p className="mt-6 text-lg text-slate-600 font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
              Your expertise is in high demand. Create an account, get verified in minutes, and accept assigned offers with fixed upfront rates.
            </p>
          </div>

          {/* Right Side: Graphic Art & Floating Card */}
          <div className="w-full lg:w-[55%] relative flex justify-center lg:justify-end min-h-[460px]">
            
            {/* The Graphics (Yellow circle + Blue lines) */}
            <div className="absolute left-[10%] lg:left-[5%] top-[55%] -translate-y-1/2 pointer-events-none select-none z-0">
              {/* Yellow Circle */}
              <div className="absolute -left-12 top-0 w-[240px] h-[240px] bg-[#f5b82e] rounded-full mix-blend-multiply" />
              
              {/* Blue Diagonal Lines */}
              <div className="absolute -left-8 -top-24 flex gap-5 -rotate-[40deg]">
                <div className="w-2.5 h-[280px] bg-[#2563eb] rounded-full" />
                <div className="w-2.5 h-[280px] bg-[#2563eb] rounded-full" />
                <div className="w-2.5 h-[280px] bg-[#2563eb] rounded-full" />
              </div>
            </div>

            {/* The Floating White Card */}
            <div className="relative z-10 bg-white rounded-[1.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-10 w-full max-w-[480px] border border-slate-100 self-center">
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Set up in minutes</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-blue-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Direct payout</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  </div>
                  <span className="font-bold text-slate-800 text-lg">Payout protected</span>
                </div>
              </div>
              
              <div className="mt-12 space-y-4">
                <StitchButton asChild className="w-full !bg-[#f5b82e] hover:!bg-[#e0a21d] text-slate-900 border-transparent !py-4 rounded-xl font-extrabold text-base shadow-md transition-transform active:scale-95">
                  <Link to="/sign-up" className="flex items-center justify-center">
                    Start Earning
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Link>
                </StitchButton>
                
                <StitchButton asChild variant="outline" className="w-full !py-4 rounded-xl font-bold border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors">
                  <Link to="/contact" className="flex items-center justify-center">
                    Ask a question
                  </Link>
                </StitchButton>
              </div>

            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

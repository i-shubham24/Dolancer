import { motion } from "framer-motion";
import { CheckCircle2, TrendingUp, Search, Bell, FileText, Code2 } from "lucide-react";

export function HeroCreativeVisual() {
  return (
    <div className="relative w-full h-[500px] md:h-[600px] flex items-center justify-center perspective-[2000px]">
      
      {/* Background ambient glows */}
      <div className="absolute inset-0 top-1/2 -translate-y-1/2 right-0 w-full h-[400px] bg-gradient-to-tr from-primary/20 via-cyan-300/10 to-transparent blur-[80px] -z-10" />

      {/* 
        MAIN 3D DASHBOARD 
        We use framer-motion to create a gentle hovering isometric effect 
      */}
      <motion.div
        initial={{ rotateY: -15, rotateX: 10, rotateZ: 2 }}
        animate={{ 
          y: [0, -15, 0],
          rotateY: [-15, -12, -15],
          rotateX: [10, 8, 10]
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-[380px] md:w-[460px] bg-white rounded-2xl shadow-[0_30px_60px_-20px_rgba(10,26,68,0.2)] border border-line-card/60 overflow-hidden transform-gpu"
        style={{ transformStyle: "preserve-3d" }}
      >
        
        {/* Fake Browser/App Header */}
        <div className="h-14 bg-surface border-b border-line-card/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Search className="h-4 w-4 text-ink-muted" />
            <Bell className="h-4 w-4 text-ink-muted" />
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-cyan-400 border-2 border-white shadow-sm" />
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="p-5 bg-white h-[320px]">
          <div className="flex justify-between items-end mb-5">
            <div>
              <p className="text-xs font-bold text-ink-muted uppercase tracking-wider mb-1">Available Briefs</p>
              <h4 className="text-lg font-extrabold text-[#0A1A44]">Matched for you</h4>
            </div>
            <span className="text-xs font-bold text-primary bg-primary-light/30 px-2 py-1 rounded-md">
              View all
            </span>
          </div>

          <div className="space-y-3">
            {/* Mock Job 1 */}
            <div className="p-3 rounded-xl border border-line-card bg-surface flex items-start gap-3 hover:border-primary/30 transition-colors">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg shrink-0">
                <Code2 className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-extrabold text-[#0A1A44] mb-0.5">React Native Bug Fix</h5>
                <p className="text-[10px] font-bold text-ink-muted">Fintech Client • 2 days</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-primary">₹12,500</p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
                  Escrowed
                </p>
              </div>
            </div>

            {/* Mock Job 2 */}
            <div className="p-3 rounded-xl border border-line-card bg-surface flex items-start gap-3 hover:border-primary/30 transition-colors">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg shrink-0">
                <FileText className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-extrabold text-[#0A1A44] mb-0.5">SEO Blog Series</h5>
                <p className="text-[10px] font-bold text-ink-muted">Marketing Tech • 5 days</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-extrabold text-primary">₹8,000</p>
                <p className="text-[10px] font-bold text-emerald-600 flex items-center justify-end gap-1 mt-0.5">
                  Escrowed
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex items-center justify-center p-3 border border-dashed border-line-card rounded-xl bg-surface/50 text-xs font-bold text-ink-muted">
            + 14 more briefs waiting
          </div>

        </div>

        {/* 
          FLOATING WIDGET 1 (Top Right)
          Using absolute positioning inside the preserve-3d container to pop out in Z-space 
        */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -right-8 top-12 md:-right-16 md:top-16 bg-white p-3 rounded-xl shadow-2xl border border-line-card flex items-center gap-3 z-50 transform-gpu"
          style={{ transform: "translateZ(60px)" }}
        >
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="pr-2">
            <p className="text-[10px] font-bold text-ink-muted uppercase">Supervisor Approved</p>
            <p className="text-sm font-extrabold text-[#0A1A44]">₹15,000 Released</p>
          </div>
        </motion.div>

        {/* 
          FLOATING WIDGET 2 (Bottom Left)
        */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute -left-6 bottom-16 md:-left-12 md:bottom-20 bg-[#0A1A44] p-3 rounded-xl shadow-2xl border border-[#0A1A44] flex items-center gap-3 z-50 transform-gpu"
          style={{ transform: "translateZ(80px)" }}
        >
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-[#ccff00]" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-white/60 uppercase">This Month</p>
            <p className="text-sm font-extrabold text-white">₹42,500 Earned</p>
          </div>
        </motion.div>

      </motion.div>
    </div>
  );
}

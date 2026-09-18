import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Code2, PenTool, Palette, CheckCircle2 } from "lucide-react";

const BRIEFS = [
  { id: 1, title: "Next.js Dashboard UI", tag: "IT & Software", pay: "₹5,000", icon: Code2 },
  { id: 2, title: "Brand Identity Design", tag: "Design", pay: "₹3,500", icon: Palette },
  { id: 3, title: "1500-word SEO Article", tag: "Writing", pay: "₹1,200", icon: PenTool },
  { id: 4, title: "API Integration Script", tag: "IT & Software", pay: "₹2,000", icon: Code2 },
];

export function HeroLiveBriefs() {
  const [items, setItems] = useState(BRIEFS.slice(0, 3));
  const [counter, setCounter] = useState(3);

  useEffect(() => {
    const interval = setInterval(() => {
      setCounter((prev) => prev + 1);
      setItems((currentItems) => {
        const nextBrief = BRIEFS[counter % BRIEFS.length]!;
        return [
          { ...nextBrief, id: counter + 1 },
          ...currentItems.slice(0, 2),
        ];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [counter]);

  return (
    <div className="relative w-full max-w-[420px] mx-auto h-[480px] flex flex-col justify-center perspective-[1000px]">
      
      {/* Vibrant Neon Backglow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-primary via-blue-500 to-indigo-500 rounded-[2.5rem] blur-[40px] opacity-40 mix-blend-multiply transform rotate-3" />
      <div className="absolute inset-0 bg-gradient-to-bl from-cyan-400 to-blue-600 rounded-[2.5rem] blur-[30px] opacity-30 animate-pulse" />

      {/* Dark Glass Frame */}
      <div className="relative z-10 h-[420px] w-full bg-[#0b0f19]/90 backdrop-blur-2xl rounded-[2.5rem] border-[1.5px] border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.4)] overflow-hidden flex flex-col p-6 -rotate-2 transform-gpu transition-transform duration-700 hover:rotate-0 hover:scale-[1.02]">
        
        {/* Neon Header */}
        <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-400 shadow-[0_0_8px_#22d3ee]"></span>
            </span>
            <span className="text-sm font-extrabold text-white uppercase tracking-wider">Live Briefs</span>
          </div>
          <Zap className="h-4 w-4 text-cyan-400" />
        </div>

        {/* Dynamic List */}
        <div className="flex-1 relative overflow-hidden">
          <AnimatePresence mode="popLayout">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: -40, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, filter: "blur(8px)" }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.2 }}
                className="mb-4 bg-white/5 hover:bg-white/10 transition-colors rounded-2xl p-4 shadow-lg border border-white/10 flex gap-4 items-center backdrop-blur-md"
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-cyan-500 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(14,165,233,0.3)]">
                  <item.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate">{item.title}</h4>
                  <span className="text-xs font-medium text-blue-200">{item.tag}</span>
                </div>
                <div className="text-right shrink-0">
                  <span className="block text-sm font-extrabold text-cyan-400 drop-shadow-[0_0_4px_rgba(34,211,238,0.4)]">{item.pay}</span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-white/60 uppercase mt-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Ready
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-[#0b0f19] to-transparent pointer-events-none" />
      </div>
    </div>
  );
}

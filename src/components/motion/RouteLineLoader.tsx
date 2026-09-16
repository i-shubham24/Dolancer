import { motion, type Variants } from "framer-motion";
import { FileText, ShieldCheck, User, CheckCircle2, Wallet } from "lucide-react";

/**
 * A Dolancer-specific route-line visual system for loading/empty states.
 * Represents the core model: Brief -> Supervisor -> Doer -> Review -> Payout
 */
export function RouteLineLoader({ label = "Loading route..." }: { label?: string }) {
  const nodeVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: i * 0.3,
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  const lineVariants: Variants = {
    hidden: { scaleX: 0 },
    visible: (i: number) => ({
      scaleX: 1,
      transition: {
        delay: (i * 0.3) + 0.15,
        duration: 0.3,
        ease: "easeInOut",
      },
    }),
  };

  const nodes = [
    { icon: FileText, color: "text-primary", bg: "bg-primary-light" },
    { icon: ShieldCheck, color: "text-secondary", bg: "bg-secondary-light" },
    { icon: User, color: "text-ink", bg: "bg-subtle" },
    { icon: CheckCircle2, color: "text-success-ink", bg: "bg-success-bg" },
    { icon: Wallet, color: "text-accent", bg: "bg-accent-light" },
  ];

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative flex items-center justify-between w-full max-w-sm" aria-hidden="true">
        {/* Background track */}
        <div className="absolute left-0 top-1/2 -mt-[1px] h-[2px] w-full bg-line-subtle -z-10" />

        {nodes.map((node, i) => (
          <div key={i} className="relative flex flex-col items-center">
            {/* The active connecting line segment (draws from previous node to this one) */}
            {i > 0 && (
              <motion.div
                custom={i - 1}
                variants={lineVariants}
                initial="hidden"
                animate="visible"
                className="absolute right-1/2 top-1/2 -mt-[1px] h-[2px] w-[100px] origin-left bg-line -z-10"
                style={{ width: "calc(100vw / 5 - 20px)", maxWidth: "80px" }}
              />
            )}
            
            {/* The node itself */}
            <motion.div
              custom={i}
              variants={nodeVariants}
              initial="hidden"
              animate="visible"
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 border-surface ${node.bg} shadow-soft-sm`}
            >
              <node.icon className={`h-4 w-4 ${node.color}`} />
            </motion.div>
          </div>
        ))}
      </div>
      <p className="mt-8 text-sm font-bold text-ink-muted animate-pulse">{label}</p>
    </div>
  );
}

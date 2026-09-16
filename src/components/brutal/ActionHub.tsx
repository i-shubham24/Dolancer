import { motion } from "framer-motion";
import { AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionHubProps {
  title: string;
  description: string;
  actionLabel: string;
  onAction?: () => void;
  tone?: "primary" | "warning" | "danger";
}

export function ActionHub({ title, description, actionLabel, onAction, tone = "primary" }: ActionHubProps) {
  const bg = tone === "primary" ? "bg-accent/10" : tone === "warning" ? "bg-warning-bg" : "bg-danger-bg";
  const border = tone === "primary" ? "border-accent/30" : tone === "warning" ? "border-warning-ink/30" : "border-danger-ink/30";
  const iconColor = tone === "primary" ? "text-accent" : tone === "warning" ? "text-warning-ink" : "text-danger-ink";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border ${border} ${bg} p-5 shadow-soft-sm`}
    >
      <div className="flex items-start gap-4">
        <div className={`mt-0.5 rounded-full p-1.5 ${tone === "primary" ? "bg-accent/20" : "bg-white/20"}`}>
          <AlertCircle className={`h-5 w-5 ${iconColor}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-extrabold text-ink">{title}</h3>
          <p className="mt-1 text-sm font-medium text-ink-2">
            {description}
          </p>
        </div>
        <div className="shrink-0">
          <Button onClick={onAction} variant="primary" className="h-10 px-4 text-xs">
            {actionLabel} <ArrowRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

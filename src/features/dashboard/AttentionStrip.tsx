import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, ArrowRight, Link2Off, RotateCcw } from "lucide-react";
import { cn } from "@/lib/cn";
import { deadlineUrgency } from "@/lib/datetime";
import { statusDisplay } from "@/lib/status";
import { taskTitle } from "@/lib/task-title";
import { preloadWorkbench } from "@/lib/preload";
import type { DoerProject } from "@/types/domain";

interface Item {
  id: string;
  tone: "danger" | "warning";
  icon: typeof AlertTriangle;
  text: string;
  action: string;
  to: string;
}

/**
 * Anything blocking a task, said once and plainly, above everything else. A blocker
 * is a state the doer can see while scanning, not an error they trip over later.
 */
function attentionItems(projects: DoerProject[]): Item[] {
  const items: Item[] = [];
  for (const project of projects) {
    const title = taskTitle(project);
    const to = `/work/${project.id}`;
    if (project.status === "in_progress" && project.revisionCount > 0) {
      items.push({ id: `rev-${project.id}`, tone: "danger", icon: RotateCcw, text: `Changes asked for on ${title}.`, action: "See changes", to });
    } else if (statusDisplay(project.status, project.workingDocUrl).label === "Link needed") {
      items.push({
        id: `link-${project.id}`,
        tone: "warning",
        icon: Link2Off,
        text: `${title} is waiting for its working link from your supervisor.`,
        action: "Open task",
        to,
      });
    } else if (
      deadlineUrgency(project.deliveryAt) === "overdue" &&
      (project.status === "in_progress" || project.status === "paid")
    ) {
      items.push({ id: `late-${project.id}`, tone: "danger", icon: AlertTriangle, text: `${title} is past its deadline.`, action: "Open task", to });
    }
  }
  return items;
}

export function AttentionStrip({ projects }: { projects: DoerProject[] }) {
  const items = attentionItems(projects);
  return (
    <AnimatePresence initial={false}>
      {items.length > 0 ? (
        <motion.section
          aria-label="Needs your attention"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <ul className="mb-4 flex flex-col gap-2">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.to}
                  onMouseEnter={preloadWorkbench}
                  onFocus={preloadWorkbench}
                  className={cn(
                    "group flex items-center gap-3 rounded-2xl px-4 py-3 text-[13px] font-bold transition-colors focus-visible:outline-2 focus-visible:outline-primary",
                    item.tone === "danger" ? "bg-danger-bg text-danger-ink hover:bg-danger-bg/70" : "bg-warning-bg text-warning-ink hover:bg-warning-bg/70",
                  )}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 flex-1">{item.text}</span>
                  <span className="hidden shrink-0 items-center gap-1 sm:inline-flex">
                    {item.action}
                    <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </motion.section>
      ) : null}
    </AnimatePresence>
  );
}

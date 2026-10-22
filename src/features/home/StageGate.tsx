import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CARD, cardMotion } from "@/components/app/card-styles";
import { cn } from "@/lib/cn";
import { useDoerStage } from "./steps";

/**
 * Wraps a page that stays locked until its setup step or a later stage. A link or
 * bookmark to it before then shows when it opens instead of the page.
 */
export function StageGate({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { lockFor, loading } = useDoerStage();

  if (loading) return <div className="skeleton h-40 w-full rounded-[20px]" aria-busy="true" />;
  const page = lockFor(pathname);
  if (!page) return <>{children}</>;

  return (
    <motion.section
      variants={cardMotion}
      initial="hidden"
      animate="show"
      className={cn(CARD, "mx-auto mt-6 max-w-lg items-center gap-4 px-6 py-10 text-center sm:px-10")}
      aria-labelledby="locked-title"
    >
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-info-bg text-primary" aria-hidden="true">
        <Lock className="h-7 w-7" />
      </span>
      <div>
        <h1 id="locked-title" className="text-[22px] font-extrabold tracking-[-0.03em]">
          {page.label} is not open yet
        </h1>
        <p className="mt-1.5 text-[14.5px] font-medium text-ink-2">{page.when}.</p>
      </div>
      <Button asChild>
        <Link to="/dashboard">
          Back to your steps
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </Button>
    </motion.section>
  );
}

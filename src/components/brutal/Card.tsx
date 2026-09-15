import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/cn";

/** The workhorse surface: 1.5px border and a small offset shadow. */
export function Card({
  className,
  hoverable = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-line-card bg-surface p-5 shadow-soft-md",
        "transition-all duration-200 ease-spring",
        hoverable && "hover:-translate-y-1 hover:shadow-soft-lg",
        className,
      )}
      {...props}
    />
  );
}

export function MotionCard({
  className,
  hoverable = true,
  ...props
}: HTMLMotionProps<"div"> & { hoverable?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hoverable ? { y: -4, transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] } } : undefined}
      whileTap={hoverable ? { scale: 0.99 } : undefined}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "rounded-2xl border border-line-card bg-surface p-5 shadow-soft-md",
        hoverable && "hover:shadow-soft-lg transition-shadow",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("text-lg font-extrabold tracking-[-0.025em]", className)} {...props} />;
}

export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm leading-relaxed text-ink-2", className)} {...props} />;
}

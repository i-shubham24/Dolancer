import * as React from "react";
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
        "rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-offset-sm",
        "transition-all duration-[120ms]",
        hoverable && "hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-md",
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

import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Inputs use calm surfaces and a clear semantic focus ring.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border border-line-card bg-surface px-4 py-[11px]",
          "font-sans text-sm font-medium text-ink placeholder:text-ink-3",
          "shadow-soft-sm outline-none transition-all duration-200",
          "focus:border-blue focus:ring-4 focus:ring-blue/15",
          "disabled:opacity-50",
          className,
        )}
        {...props}
      />
    );
  },
);

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-line-card bg-surface px-4 py-[11px]",
        "font-sans text-sm font-medium text-ink placeholder:text-ink-3",
        "shadow-soft-sm outline-none transition-all duration-200 resize-y",
        "focus:border-blue focus:ring-4 focus:ring-blue/15",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn("block text-sm font-bold tracking-[-0.01em] text-ink", className)}
      {...props}
    />
  );
}

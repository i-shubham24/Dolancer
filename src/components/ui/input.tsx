import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Focus thickens the shadow and lifts the field rather than drawing a ring. That is
 * the system's idiom: depth, not outline.
 */
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-md border-2 border-ink bg-surface px-4 py-[11px]",
          "font-sans text-sm font-medium text-ink placeholder:text-ink-3",
          "shadow-offset-xs outline-none transition-all duration-[120ms]",
          "focus:-translate-x-px focus:-translate-y-px focus:shadow-offset-sm",
          "disabled:opacity-50 disabled:shadow-none",
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
        "w-full rounded-md border-2 border-ink bg-surface px-4 py-[11px]",
        "font-sans text-sm font-medium text-ink placeholder:text-ink-3",
        "shadow-offset-xs outline-none transition-all duration-[120ms] resize-y",
        "focus:-translate-x-px focus:-translate-y-px focus:shadow-offset-sm",
        "disabled:opacity-50 disabled:shadow-none",
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

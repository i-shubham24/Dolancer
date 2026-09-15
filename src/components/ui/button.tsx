import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * Shared tactile control. Shape and motion stay consistent while the palette
 * supplies the color language.
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-sans font-bold leading-none tracking-[-0.01em]",
    "rounded-full border border-transparent transition-all duration-200 ease-spring",
    "disabled:pointer-events-none disabled:opacity-45",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-coral text-inverse shadow-soft-md hover:bg-coral-hover hover:-translate-y-0.5 hover:shadow-soft-lg active:translate-y-0",
        secondary:
          "border-line-card bg-surface text-ink shadow-soft-sm hover:-translate-y-0.5 hover:bg-hover hover:shadow-soft-md active:translate-y-0",
        blue:
          "bg-blue text-inverse shadow-soft-md hover:bg-blue-hover hover:-translate-y-0.5 hover:shadow-soft-lg active:translate-y-0",
        neutral:
          "bg-surface-2 text-ink border border-line-card shadow-soft-sm hover:bg-hover hover:-translate-y-0.5 hover:shadow-soft-md active:translate-y-0",
        dark:
          "bg-ink text-inverse shadow-soft-md hover:-translate-y-0.5 hover:shadow-soft-lg active:translate-y-0",
        ghost:
          "border-transparent bg-transparent text-ink shadow-none hover:bg-surface hover:shadow-soft-sm",
        danger:
          "bg-danger-bg text-danger-ink shadow-soft-sm hover:-translate-y-0.5 hover:shadow-soft-md active:translate-y-0",
      },
      size: {
        sm: "min-h-[44px] px-4 py-2 text-xs",
        md: "min-h-[44px] px-5 py-2.5 text-sm",
        lg: "min-h-[48px] px-7 py-3 text-md",
        icon: "h-11 w-11 rounded-full p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

// The variant recipe is exported alongside the component so other surfaces can
// style a link or a Slot child as a button. This is the standard shadcn shape.
// eslint-disable-next-line react-refresh/only-export-components
export { buttonVariants };

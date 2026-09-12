import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

/**
 * The system's loudest control. Three moves define it: a 2px near-black border, a
 * hard offset shadow, and a translate that lifts on hover and presses in on active.
 * Keep the shadow and the translate in step or the button stops feeling physical.
 */
const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none",
    "font-sans font-bold leading-none tracking-[-0.01em]",
    "border-2 border-ink transition-all duration-[120ms] ease-out",
    "disabled:pointer-events-none disabled:opacity-45 disabled:shadow-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink",
  ),
  {
    variants: {
      variant: {
        primary:
          "bg-coral text-ink shadow-offset-md hover:bg-coral-hover hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
        secondary:
          "bg-surface text-ink shadow-offset-sm hover:bg-hover hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
        blue:
          "bg-blue text-inverse shadow-offset-md hover:bg-blue-hover hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
        lime:
          "bg-lime text-ink shadow-offset-md hover:bg-lime-hover hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
        dark:
          "bg-ink text-inverse shadow-offset-md hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-lg active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
        ghost:
          "border-transparent bg-transparent text-ink shadow-none hover:border-ink hover:bg-surface",
        danger:
          "bg-danger-bg text-danger-ink shadow-offset-sm hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-md active:translate-x-[2px] active:translate-y-[2px] active:shadow-offset-xs",
      },
      size: {
        sm: "px-3.5 py-[7px] text-xs rounded-sm",
        md: "px-5 py-[11px] text-sm rounded-md",
        lg: "px-[26px] py-[13px] text-md rounded-md",
        icon: "h-11 w-11 rounded-md p-0",
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

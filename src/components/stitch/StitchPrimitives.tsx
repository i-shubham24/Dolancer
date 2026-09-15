import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/cn";

export function StitchBadge({
  children,
  tone = "brand",
  className,
}: {
  children: ReactNode;
  tone?: "brand" | "success" | "neutral";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-bold tracking-wide shadow-soft-sm",
        tone === "brand" && "bg-coral-light text-coral border border-coral/20",
        tone === "success" && "bg-success-bg text-success-ink border border-success-ink/20",
        tone === "neutral" && "bg-subtle text-ink-2 border border-line-card",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StitchButton({
  children,
  className,
  variant = "primary",
  asChild = false,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(
        "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-bold transition-all duration-200 ease-spring select-none",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        variant === "primary" &&
          "bg-coral text-inverse shadow-soft-md hover:-translate-y-0.5 hover:bg-coral-hover hover:shadow-soft-lg active:translate-y-0",
        variant === "secondary" &&
          "border border-line-card bg-surface text-ink shadow-soft-sm hover:-translate-y-0.5 hover:bg-hover hover:shadow-soft-md active:translate-y-0",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function StitchCard({
  children,
  className,
  interactive = false,
  ...props
}: HTMLAttributes<HTMLDivElement> & { interactive?: boolean }) {
  return (
    <div
      className={cn(
        "stitch-surface rounded-2xl border border-line-card bg-surface shadow-soft-md",
        interactive &&
          "transition-all duration-300 hover:-translate-y-1 hover:border-purple/30 hover:shadow-soft-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function StitchSection({
  children,
  className,
  ...props
}: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("relative overflow-hidden py-20 lg:py-28", className)} {...props}>
      {children}
    </section>
  );
}

export function StitchColorCard({
  children,
  tone = "pink",
  className,
}: {
  children: ReactNode;
  tone?: "pink" | "lilac" | "yellow" | "mint";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "stitch-color-surface relative isolate overflow-hidden rounded-[1.75rem] p-6 shadow-soft-md transition-all duration-300 hover:-translate-y-1 hover:shadow-soft-lg",
        tone === "pink" && "stitch-card-pink",
        tone === "lilac" && "stitch-card-lilac",
        tone === "yellow" && "stitch-card-yellow",
        tone === "mint" && "stitch-card-mint",
        className,
      )}
    >
      <span className="stitch-card-glow" aria-hidden="true" />
      {children}
    </div>
  );
}

export function StitchOrbitalGraphic({ className }: { className?: string }) {
  return (
    <div className={cn("stitch-orbital-graphic", className)} aria-hidden="true">
      <span className="stitch-orbit stitch-orbit-one" />
      <span className="stitch-orbit stitch-orbit-two" />
      <span className="stitch-orbit stitch-orbit-three" />
      <span className="stitch-orbital-dot" />
    </div>
  );
}

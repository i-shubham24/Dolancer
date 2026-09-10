import { cn } from "@/lib/cn";

/**
 * A real, visible shimmer. The sibling app references a .skeleton class that is
 * defined in none of its stylesheets, so its loaders paint nothing; ours is defined
 * in styles/base.css and respects prefers-reduced-motion.
 */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton h-4 w-full", className)} aria-hidden="true" />;
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-xl border-[1.5px] border-ink bg-surface p-5 shadow-offset-sm", className)}
      aria-hidden="true"
    >
      <Skeleton className="h-3 w-24" />
      <Skeleton className="mt-4 h-6 w-3/5" />
      <Skeleton className="mt-3 h-3 w-full" />
      <Skeleton className="mt-2 h-3 w-4/5" />
    </div>
  );
}

export function SkeletonTile({ className }: { className?: string }) {
  return (
    <div
      className={cn("rounded-xl border border-line-card bg-surface px-[22px] py-5 shadow-soft-sm", className)}
      aria-hidden="true"
    >
      <Skeleton className="h-3 w-20" />
      <Skeleton className="mt-4 h-8 w-28" />
      <Skeleton className="mt-3 h-3 w-32" />
    </div>
  );
}

/** Screen-reader announcement to pair with any skeleton region. */
export function LoadingAnnounce({ label }: { label: string }) {
  return (
    <span role="status" aria-live="polite" className="sr-only">
      {label}
    </span>
  );
}

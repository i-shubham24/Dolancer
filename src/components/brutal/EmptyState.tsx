import * as React from "react";
import { cn } from "@/lib/cn";

/**
 * Every list that can be empty gets one of these, with a clear next action.
 * A blank region is never an acceptable empty state.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-ink",
        "bg-surface px-6 py-12 text-center shadow-offset-sm",
        className,
      )}
    >
      {icon ? (
        <span className="flex h-14 w-14 items-center justify-center rounded-lg border-2 border-ink bg-lime shadow-offset-sm">
          {icon}
        </span>
      ) : null}
      <div className="space-y-1.5">
        <h3 className="text-xl font-extrabold tracking-[-0.03em]">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-sm leading-relaxed text-ink-2">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

/** Every failure gets a designed state with a retry path. */
export function ErrorState({
  title = "That did not load",
  description,
  onRetry,
  className,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-ink",
        "bg-danger-bg px-6 py-10 text-center shadow-offset-sm",
        className,
      )}
      role="alert"
    >
      <div className="space-y-1.5">
        <h3 className="text-lg font-extrabold tracking-[-0.03em] text-danger-ink">{title}</h3>
        {description ? (
          <p className="mx-auto max-w-md text-sm text-danger-ink/80">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="rounded-md border-2 border-ink bg-surface px-4 py-2 text-xs font-extrabold shadow-offset-xs transition-all hover:-translate-x-px hover:-translate-y-px hover:shadow-offset-sm"
        >
          Try again
        </button>
      ) : null}
    </div>
  );
}

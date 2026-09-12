import { Link2, ExternalLink, Check, Clock } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Pinned to the top of the properties rail, because it gates everything else.
 *
 * PRD Rule (BR-018): Working artefacts are created and owned by company workspace
 * accounts, never by a doer's personal account. The supervisor provides the link.
 */
export function WorkingLinkCard({
  workingDocUrl,
}: {
  workingDocUrl: string | null;
}) {
  const hasLink = Boolean(workingDocUrl?.trim());

  return (
    <div
      className={cn(
        "rounded-xl border-2 p-4 shadow-offset-sm",
        hasLink ? "border-ink bg-surface" : "border-ink bg-warning-bg",
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-md border-[1.5px] border-ink",
            hasLink ? "bg-success-bg text-success-ink" : "bg-lime",
          )}
        >
          {hasLink ? (
            <Check className="h-3 w-3" aria-hidden="true" />
          ) : (
            <Clock className="h-3 w-3" aria-hidden="true" />
          )}
        </span>
        <h3 className="text-xs font-extrabold uppercase tracking-[0.05em]">Company Workspace</h3>
      </div>

      {!hasLink ? (
        <p className="mt-2 text-[11px] leading-snug text-ink-2">
          Waiting for your supervisor to set up the company workspace. You can start work once the link appears.
        </p>
      ) : (
        <div className="mt-3 space-y-2">
          <p className="text-[11px] leading-snug text-ink-2 mb-2">
            This is your company-owned workspace. Do not use personal accounts.
          </p>
          <a
            href={workingDocUrl ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 break-all text-xs font-bold text-blue underline decoration-2 underline-offset-2 hover:text-blue-hover"
          >
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
            {workingDocUrl}
          </a>
        </div>
      )}
    </div>
  );
}

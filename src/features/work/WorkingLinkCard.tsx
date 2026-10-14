import { motion } from "framer-motion";
import { ExternalLink, FolderOpen, Hourglass } from "lucide-react";
import { cn } from "@/lib/cn";
import { isHttpsUrl } from "@/lib/validations";
import { CARD, cardMotion } from "@/components/app/card-styles";

/**
 * The company workspace, which gates everything else.
 *
 * PRD Rule (BR-018): working artefacts are created and owned by company workspace
 * accounts, never by a doer's personal account. The supervisor provides the link.
 */
export function WorkingLinkCard({ workingDocUrl }: { workingDocUrl: string | null }) {
  const hasLink = Boolean(workingDocUrl?.trim());
  const safe = hasLink && isHttpsUrl(workingDocUrl);
  let host = "";
  try {
    host = safe ? new URL(workingDocUrl as string).hostname.replace(/^www\./, "") : "";
  } catch {
    host = "";
  }

  return (
    <motion.section variants={cardMotion} className={cn(CARD, "gap-3")} aria-labelledby="workspace">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            hasLink ? "bg-success-bg text-success-ink" : "bg-warning-bg text-warning-ink",
          )}
          aria-hidden="true"
        >
          {hasLink ? <FolderOpen className="h-5 w-5" /> : <Hourglass className="h-5 w-5" />}
        </span>
        <div className="min-w-0 flex-1">
          <h2 id="workspace" className="text-[15px] font-extrabold tracking-[-0.02em]">
            Company workspace
          </h2>
          <p className="truncate text-xs font-semibold text-ink-muted">
            {hasLink ? host || "Ready" : "Your supervisor is setting it up"}
          </p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold",
            hasLink ? "bg-success-bg text-success-ink" : "bg-warning-bg text-warning-ink",
          )}
        >
          {hasLink ? "Ready" : "Waiting"}
        </span>
      </div>

      {safe ? (
        <a
          href={workingDocUrl as string}
          target="_blank"
          rel="noreferrer noopener"
          className="group flex min-h-[44px] items-center justify-center gap-2 rounded-full bg-panel px-4 text-sm font-bold text-primary transition-colors hover:bg-info-bg focus-visible:outline-2 focus-visible:outline-primary"
        >
          Open workspace
          <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
      ) : hasLink ? (
        <p className="break-all rounded-xl bg-panel px-3 py-2 text-xs font-semibold text-ink-2">{workingDocUrl}</p>
      ) : null}
      <p className="text-[11.5px] font-medium text-ink-muted">
        {hasLink ? "Company owned. Do not sign in with personal accounts." : "You can start work once the link appears here."}
      </p>
    </motion.section>
  );
}

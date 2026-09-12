import { Search } from "lucide-react";
import { PALETTE_EVENT } from "./CommandMenu";

/**
 * Visible trigger for the command palette.
 *
 * Lives in page headers at the top right, just left of the availability
 * toggle. Opens the same palette as Cmd/Ctrl K, which stays available
 * everywhere including pages with no visible trigger.
 */
export function SearchTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(PALETTE_EVENT))}
      aria-label="Open quick navigation"
      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-lg border-[1.5px] border-ink bg-surface px-3 py-2 text-sm font-bold text-ink-2 shadow-offset-xs transition-all duration-[120ms] hover:-translate-x-px hover:-translate-y-px hover:text-ink hover:shadow-offset-sm"
    >
      <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden md:inline">Jump to...</span>
      <kbd className="hidden rounded border border-line-card bg-surface-2 px-1.5 py-0.5 font-mono text-[10px] font-bold lg:inline">
        ⌘K
      </kbd>
    </button>
  );
}

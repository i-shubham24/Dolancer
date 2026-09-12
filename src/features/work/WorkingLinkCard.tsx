import { useState } from "react";
import { Link2, ExternalLink, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/cn";
import { useSetWorkingDoc } from "./queries";

/**
 * Frontend mirror of the database rule, with parsing the prefix check misses.
 *
 * The database enforces https and a 2048 char cap. Here we also parse the URL,
 * require a real hostname, and block localhost and private ranges so a doer
 * learns the problem immediately instead of after a round trip. The database
 * remains authoritative.
 */
function validateWorkingUrl(trimmed: string): string | null {
  if (!trimmed) return null;
  if (trimmed.length > 2048) return "That link is too long. Keep it under 2048 characters.";
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    return "Enter a complete link starting with https://";
  }
  if (parsed.protocol !== "https:") return "The link must start with https://";
  const host = parsed.hostname.toLowerCase();
  if (!host || !host.includes(".")) return "Enter a complete link with a valid address.";
  if (host === "localhost" || host.endsWith(".localhost")) return "Use a public link, not localhost.";
  if (/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/.test(host)) {
    return "Use a public link, not a private network address.";
  }
  if (/\s/.test(trimmed)) return "The link must not contain spaces.";
  return null;
}

/**
 * Pinned to the top of the properties rail, because it gates everything else.
 *
 * The doer supplies this link themselves: set_working_doc is doer-scoped in the
 * database, so there is no path by which a supervisor could populate it.
 */
export function WorkingLinkCard({
  projectId,
  workingDocUrl,
  editable,
}: {
  projectId: string;
  workingDocUrl: string | null;
  editable: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(workingDocUrl ?? "");
  const [error, setError] = useState<string | null>(null);
  const mutation = useSetWorkingDoc(projectId);

  const hasLink = Boolean(workingDocUrl?.trim());

  async function save(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();

    // Mirror the database rule plus parsing, so the message is immediate.
    const problem = validateWorkingUrl(trimmed);
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);

    const result = await mutation.mutateAsync(trimmed);
    if (result.ok) setEditing(false);
  }

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
            <Link2 className="h-3 w-3" aria-hidden="true" />
          )}
        </span>
        <h3 className="text-xs font-extrabold uppercase tracking-[0.05em]">Working link</h3>
      </div>

      {editing || !hasLink ? (
        editable ? (
          <form onSubmit={save} className="mt-3 space-y-2.5">
            <Label htmlFor="working-link" className="sr-only">
              Working link
            </Label>
            <Input
              id="working-link"
              type="url"
              inputMode="url"
              placeholder="https://..."
              value={value}
              maxLength={2048}
              autoComplete="off"
              spellCheck={false}
              onChange={(event) => setValue(event.target.value)}
              aria-describedby="working-link-help"
            />
            {error ? (
              <p role="alert" className="text-xs font-semibold text-danger-ink">
                {error}
              </p>
            ) : (
              <p id="working-link-help" className="text-[11px] leading-snug text-ink-2">
                {hasLink
                  ? "Where you are doing the work. Your supervisor uses this to follow along."
                  : "Nothing moves until this is in. Add where you are doing the work so your supervisor can follow along."}
              </p>
            )}
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1" disabled={mutation.isPending}>
                {mutation.isPending ? "Saving..." : "Save link"}
              </Button>
              {hasLink ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setEditing(false);
                    setValue(workingDocUrl ?? "");
                    setError(null);
                  }}
                >
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        ) : (
          <p className="mt-2 text-[11px] leading-snug text-ink-2">
            No working link was set while this project was active.
          </p>
        )
      ) : (
        <div className="mt-3 space-y-2">
          <a
            href={workingDocUrl ?? "#"}
            target="_blank"
            rel="noreferrer noopener"
            className="flex items-center gap-1.5 break-all text-xs font-bold text-blue underline decoration-2 underline-offset-2 hover:text-blue-hover"
          >
            <ExternalLink className="h-3 w-3 shrink-0" aria-hidden="true" />
            {workingDocUrl}
          </a>
          {editable ? (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-block min-h-[44px] px-1 py-2 text-[11px] font-bold text-ink-muted underline underline-offset-2 hover:text-ink"
            >
              Change link
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}

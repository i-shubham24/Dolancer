import { useState } from "react";
import { X, Check } from "lucide-react";
import { cn } from "@/lib/cn";

/**
 * Flip between how freelancing usually goes and how this works.
 *
 * The rows are paired, so switching sides answers the same question twice. Nothing
 * here names a competitor or invents a statistic about one: these are descriptions
 * of the open-marketplace model in general, which is a fair thing to characterise,
 * rather than claims about any particular company.
 */

const ROWS: { question: string; usual: string; here: string }[] = [
  {
    question: "Getting the work",
    usual: "Write proposals, bid against people willing to go lower, hear nothing back.",
    here: "Work matching your skills appears on your board. Claim it, or do not.",
  },
  {
    question: "Agreeing the price",
    usual: "Negotiate, get talked down, discover the scope was bigger than described.",
    here: "The pay is on the brief before you commit, and it does not change.",
  },
  {
    question: "Dealing with the client",
    usual: "Manage the relationship, absorb the feedback, handle the awkward conversations.",
    here: "You work with a supervisor. They handle the client side entirely.",
  },
  {
    question: "Getting paid",
    usual: "Invoice, wait, follow up, wait again, write off the ones that never pay.",
    here: "Approved work releases automatically to the account you registered.",
  },
  {
    question: "When something goes wrong",
    usual: "It is between you and the client, and you are the one out of pocket.",
    here: "Your supervisor reviews the work first, and the platform carries the dispute.",
  },
  {
    question: "Your reputation",
    usual: "Starts at zero on every new platform, and one bad client can dent it.",
    here: "Built on delivered work. Higher levels see new work sooner.",
  },
];

type Side = "usual" | "here";

export function ComparisonSwitch() {
  const [side, setSide] = useState<Side>("here");
  const isHere = side === "here";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-6">
        <h2 id="compare" className="max-w-lg text-4xl font-extrabold tracking-[-0.04em]">
          The same six questions, answered twice
        </h2>

        <div
          role="tablist"
          aria-label="Compare ways of working"
          className="inline-flex shrink-0 rounded-full border-2 border-ink bg-subtle p-1 shadow-offset-sm"
        >
          {(["usual", "here"] as const).map((option) => {
            const selected = option === side;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setSide(option)}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-extrabold tracking-[-0.01em] transition-all duration-[120ms]",
                  selected
                    ? option === "here"
                      ? "border-[1.5px] border-ink bg-lime shadow-offset-xs"
                      : "border-[1.5px] border-ink bg-surface shadow-offset-xs"
                    : "border-[1.5px] border-transparent text-ink-2 hover:text-ink",
                )}
              >
                {option === "usual" ? "The usual way" : "Here"}
              </button>
            );
          })}
        </div>
      </div>

      <ul className="mt-10 grid gap-3 md:grid-cols-2" aria-live="polite">
        {ROWS.map((row) => (
          <li
            key={row.question}
            className={cn(
              "rounded-2xl border-2 border-ink p-5 transition-all duration-[200ms] ease-spring",
              isHere ? "bg-surface shadow-offset-md" : "bg-neutral-bg shadow-offset-xs",
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border-[1.5px] border-ink",
                  isHere ? "bg-lime" : "bg-danger-bg",
                )}
              >
                {isHere ? (
                  <Check className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <X className="h-3.5 w-3.5 text-danger-ink" aria-hidden="true" />
                )}
              </span>
              <div>
                <h3 className="text-2xs font-extrabold uppercase tracking-[0.06em] text-ink-muted">
                  {row.question}
                </h3>
                <p
                  className={cn(
                    "mt-1.5 text-sm font-semibold leading-relaxed",
                    isHere ? "text-ink" : "text-ink-2",
                  )}
                >
                  {isHere ? row.here : row.usual}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

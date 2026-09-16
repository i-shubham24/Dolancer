import { useState } from "react";
import { formatPaise } from "@/lib/paise";
import { ShieldCheck, Send, Landmark } from "lucide-react";

/**
 * Payout tracker: from the approval gate to the bank credit.
 *
 * Every payout moves through named stages a doer can check, so nothing sits
 * in a black box between "approved" and "paid". The left stepper walks the
 * three stages; the receipt on the right reflects the selected stage. No
 * deductions are discussed here - the itemised receipt lives on the doer's
 * earnings page.
 */
const STAGES = [
  {
    id: "approved",
    icon: ShieldCheck,
    title: "Approved",
    body: "Your supervisor clears the delivery and the approval gate is satisfied.",
    chip: "Gate clears",
    status: "Approved for release",
    share: 34,
  },
  {
    id: "released",
    icon: Send,
    title: "Released",
    body: "The payout is released to your registered payout account.",
    chip: "Within 48 hours",
    status: "Released to bank",
    share: 67,
  },
  {
    id: "bank",
    icon: Landmark,
    title: "In your bank",
    body: "The UPI or NEFT credit lands with an itemised receipt you can keep.",
    chip: "Receipt kept",
    status: "Credited + receipted",
    share: 100,
  },
] as const;

const EXAMPLE_PAISE = 8000 * 100;

export function PayoutExplainer() {
  const [active, setActive] = useState(1);
  const stage = STAGES[active]!;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <span className="inline-flex items-center rounded-full bg-white px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] text-ink">
          Approval to payout
        </span>
        <h2 id="payout" className="mt-4 text-4xl font-extrabold tracking-[-0.04em] text-white">
          Follow every payout home
        </h2>
        <p className="mt-4 text-md leading-relaxed text-slate-300">
          From the approval gate to the bank credit, each payout moves through
          named stages you can check. No chasing, no guessing where it stands.
        </p>

        <div className="mt-8 space-y-3" role="tablist" aria-label="Payout stages">
          {STAGES.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === active;
            return (
              <button
                key={item.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActive(i)}
                className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-primary/60 bg-primary/20"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    isActive ? "bg-primary text-white" : "bg-white/10 text-slate-300"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-extrabold text-white">
                    <span className="mr-2 tabular-nums text-slate-400">0{i + 1}</span>
                    {item.title}
                  </span>
                  <span className="mt-0.5 block text-xs font-medium leading-relaxed text-slate-300">
                    {item.body}
                  </span>
                </span>
                <span
                  className={`hidden shrink-0 rounded-full px-2.5 py-1 text-[11px] font-extrabold sm:inline-block ${
                    isActive ? "bg-primary text-white" : "bg-white/10 text-slate-300"
                  }`}
                >
                  {item.chip}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* The receipt. Rotated a touch so it reads as a thing sitting on the page. */}
      {/* Centred in its column rather than flush right: the rotation throws a
          corner out, and against the viewport edge it reads as clipped. */}
      <div className="flex justify-center lg:pr-6">
        <div className="relative w-full max-w-sm rotate-[1.2deg] transition-transform duration-300 ease-spring hover:rotate-0">
          <div className="torn-bottom rounded-[2rem] border border-line-card bg-[color-mix(in_srgb,var(--color-primary)_16%,white)] px-7 pt-7 shadow-soft-lg">
            <div className="text-center">
              <p className="font-mono text-2xs font-bold uppercase tracking-[0.18em] text-ink-muted">
                Dolancer
              </p>
              <p className="mt-1 font-mono text-2xs uppercase tracking-[0.14em] text-ink-3">
                Payout statement
              </p>
            </div>

            <div
              aria-hidden="true"
              className="my-5 border-t border-dashed border-line-card"
            />

            <dl className="space-y-3.5 font-mono text-sm" aria-live="polite">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Agreed pay</dt>
                <dd className="font-bold tabular-nums">{formatPaise(EXAMPLE_PAISE)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Status</dt>
                <dd className="font-bold text-success-ink">{stage.status}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Rail</dt>
                <dd className="font-bold tabular-nums">UPI •••• 4910</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Receipt</dt>
                <dd className="font-bold tabular-nums">TXN-89412</dd>
              </div>
            </dl>

            <div
              aria-hidden="true"
              className="my-5 border-t border-dashed border-line-card"
            />

            {/* Progress follows the selected stage. */}
            <div
              className="mt-5 h-3.5 overflow-hidden rounded-full bg-subtle"
              aria-hidden="true"
            >
              <div
                className="h-full bg-primary transition-[width] duration-300"
                style={{ width: `${stage.share}%` }}
              />
            </div>
            <div className="mt-2.5 flex flex-wrap justify-between gap-2 font-mono text-2xs font-bold text-ink-2">
              <span>0{active + 1} of 03</span>
              <span>{stage.title}</span>
            </div>

            <p className="mt-5 text-center font-mono text-[10px] leading-relaxed text-ink-3">
              Example. Every payout lands with an itemised receipt on your
              earnings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

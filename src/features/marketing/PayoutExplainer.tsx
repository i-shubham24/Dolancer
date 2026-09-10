import { useState } from "react";
import { formatPaise } from "@/lib/paise";

/**
 * An interactive breakdown of how a payout reaches you.
 *
 * The point of this is the SHAPE, not the numbers: a doer is always shown gross,
 * what was withheld, and what landed, as three separate figures that reconcile. Most
 * platforms show one blended number and leave you to work out the rest.
 *
 * It is drawn as an actual paper receipt, torn edge and all, because that is what it
 * is. A card with three rows in it would say the same thing and mean nothing; a
 * receipt is a thing people already know how to read, and know to keep.
 *
 * The withholding rate is set by the visitor rather than asserted by us. Publishing
 * a specific tax rate on a public page is a claim about someone's tax affairs that
 * varies with their status, so this asks rather than tells, and says so on the slip.
 *
 * The example amount is a plain slider with no discipline attached, because pay is
 * per brief. A per-category figure here would amount to a rate card, and one data
 * point is enough to work backwards to what a client was charged.
 */
export function PayoutExplainer() {
  const [rupees, setRupees] = useState(8000);
  const [ratePercent, setRatePercent] = useState(10);

  const grossPaise = rupees * 100;
  const withheldPaise = Math.round((grossPaise * ratePercent) / 100);
  const netPaise = grossPaise - withheldPaise;
  const netShare = grossPaise === 0 ? 0 : (netPaise / grossPaise) * 100;

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
      <div>
        <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] text-inverse">
          Work it out yourself
        </span>
        <h2 id="payout" className="mt-4 text-4xl font-extrabold tracking-[-0.04em]">
          You see every number
        </h2>
        <p className="mt-4 text-md leading-relaxed text-ink-2">
          What the brief said, what was withheld, and what landed in your account. Three
          figures that add up, on every payout, so you can check them against your own
          records.
        </p>

        <div className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="payout-amount"
              className="flex items-center justify-between text-sm font-extrabold"
            >
              An example project payout
              <span className="rounded-full border-[1.5px] border-ink bg-lime px-2.5 py-0.5 text-xs tabular-nums shadow-offset-xs">
                {formatPaise(grossPaise)}
              </span>
            </label>
            <input
              id="payout-amount"
              type="range"
              min={1000}
              max={40000}
              step={500}
              value={rupees}
              onChange={(event) => setRupees(Number(event.target.value))}
              className="mt-3 w-full accent-coral"
            />
          </div>

          <div>
            <label
              htmlFor="payout-rate"
              className="flex items-center justify-between text-sm font-extrabold"
            >
              If your withholding rate is
              <span className="rounded-full border-[1.5px] border-ink bg-surface px-2.5 py-0.5 text-xs tabular-nums shadow-offset-xs">
                {ratePercent}%
              </span>
            </label>
            <input
              id="payout-rate"
              type="range"
              min={0}
              max={20}
              step={1}
              value={ratePercent}
              onChange={(event) => setRatePercent(Number(event.target.value))}
              className="mt-3 w-full accent-blue"
            />
            <p className="mt-2 text-xs text-ink-muted">
              Set this yourself. Your actual rate depends on your tax status, and we apply the
              correct one at payout rather than the one you pick here.
            </p>
          </div>
        </div>
      </div>

      {/* The receipt. Rotated a touch so it reads as a thing sitting on the page. */}
      {/* Centred in its column rather than flush right: the rotation throws a
          corner out, and against the viewport edge it reads as clipped. */}
      <div className="flex justify-center lg:pr-6">
        <div className="relative w-full max-w-sm rotate-[1.2deg] transition-transform duration-300 ease-spring hover:rotate-0">
          <div className="torn-bottom border-x-2 border-t-2 border-ink bg-surface px-7 pt-7 shadow-offset-lg">
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
              className="my-5 border-t-2 border-dashed border-ink/25"
            />

            <dl className="space-y-3.5 font-mono text-sm" aria-live="polite">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Brief says</dt>
                <dd className="font-bold tabular-nums">{formatPaise(grossPaise)}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-ink-2">Tax withheld</dt>
                <dd className="font-bold tabular-nums text-danger-ink">
                  {withheldPaise === 0 ? formatPaise(0) : `- ${formatPaise(withheldPaise)}`}
                </dd>
              </div>
            </dl>

            <div
              aria-hidden="true"
              className="my-5 border-t-2 border-dashed border-ink/25"
            />

            <div className="flex items-baseline justify-between gap-4">
              <span className="font-mono text-xs font-bold uppercase tracking-[0.1em]">
                You get
              </span>
              <span className="font-mono text-3xl font-extrabold tabular-nums tracking-[-0.02em]">
                {formatPaise(netPaise)}
              </span>
            </div>

            {/* A single split bar, in place of a chart. */}
            <div
              className="mt-5 flex h-3.5 overflow-hidden rounded-full border-2 border-ink"
              aria-hidden="true"
            >
              <div
                className="bg-lime transition-[width] duration-200"
                style={{ width: `${netShare}%` }}
              />
              <div
                className="border-l-2 border-ink bg-coral transition-[width] duration-200"
                style={{ width: `${100 - netShare}%` }}
              />
            </div>
            <div className="mt-2.5 flex flex-wrap justify-between gap-2 font-mono text-2xs font-bold">
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-ink bg-lime"
                  aria-hidden="true"
                />
                You receive
              </span>
              <span className="flex items-center gap-1.5">
                <span
                  className="h-2.5 w-2.5 rounded-full border border-ink bg-coral"
                  aria-hidden="true"
                />
                Withheld
              </span>
            </div>

            <p className="mt-5 text-center font-mono text-[10px] leading-relaxed text-ink-3">
              Illustrative. Withholding is calculated across your financial year, not per
              project. Your earnings page shows the real figures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Money helpers. Amounts are integer minor units (paise) end to end, never floats.
 *
 * Postgres bigint columns arrive over PostgREST as strings, so every *_paise value
 * needs explicit coercion before arithmetic. Forgetting this yields silent string
 * concatenation instead of addition.
 */

export type Paise = number;

export function toPaise(value: unknown): Paise {
  if (typeof value === "number") return Number.isFinite(value) ? Math.trunc(value) : 0;
  if (typeof value === "string") {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
}

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const INR_PRECISE = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** Format paise as rupees. Whole rupees drop the decimals to keep figures scannable. */
export function formatPaise(paise: unknown, opts?: { precise?: boolean }): string {
  const value = toPaise(paise);
  const rupees = value / 100;
  if (opts?.precise || value % 100 !== 0) return INR_PRECISE.format(rupees);
  return INR.format(rupees);
}

export function sumPaise(values: readonly unknown[]): Paise {
  return values.reduce<number>((total, value) => total + toPaise(value), 0);
}

import { supabase } from "@/lib/supabase";
import { callRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { toPaise } from "@/lib/paise";
import { demo, demoId, demoRespond, isDemo } from "@/lib/demo-data";
import { IFSC_PATTERN, sameName } from "@/features/verification/api";

/**
 * Payouts: where a doer's pay goes, and every payout sent to them.
 *
 * Pay is sent as soon as the supervisor approves the work, to UPI or a bank account,
 * in India only. The first method gets payouts; if a UPI payout fails, it goes to
 * the bank account instead. A new or changed method starts getting payouts 24 hours
 * after it is saved, so someone who gets into an account cannot quietly move money.
 *
 * Live mode reads two doer-scoped views and calls three edge functions that the
 * backend still has to add (see docs/BACKEND-HANDOFF.md, section 6). The demo keeps
 * everything in memory.
 */

export type PayoutMethodKind = "upi" | "bank";

export interface PayoutMethod {
  id: string;
  kind: PayoutMethodKind;
  /** The UPI ID, or the bank's name. */
  label: string;
  /** Last four digits of a bank account; null for UPI. */
  last4: string | null;
  /** The account holder's name as the bank or UPI app returned it. */
  holderName: string;
  /** Gets payouts first. */
  primary: boolean;
  /** When a newly saved method starts getting payouts; null once it does. */
  activeFrom: string | null;
}

/** sending: on its way. paid: in the account. failed: did not go through. rerouted: UPI failed, sent to the bank. */
export type PayoutStatus = "sending" | "paid" | "failed" | "rerouted";

export interface Payout {
  id: string;
  projectId: string;
  amountPaise: number;
  status: PayoutStatus;
  methodKind: PayoutMethodKind;
  /** Where it went, as shown: a UPI ID or "HDFC Bank ••4521". */
  methodName: string;
  /** The bank's reference number once paid. */
  utr: string | null;
  approvedAt: string;
  settledAt: string | null;
}

export type NewPayoutMethod =
  | { kind: "upi"; vpa: string }
  | { kind: "bank"; accountNumber: string; ifsc: string; holderName: string };

export const HOLD_HOURS = 24;

/** name@bank, as UPI apps write it. */
export const UPI_PATTERN = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z][a-zA-Z0-9]{1,63}$/;
export const ACCOUNT_PATTERN = /^\d{9,18}$/;

export function methodName(method: Pick<PayoutMethod, "kind" | "label" | "last4">): string {
  return method.kind === "upi" ? method.label : `${method.label} ••${method.last4 ?? ""}`;
}

/** The method payouts go to right now: the first one that has passed its wait. */
export function activeMethod(methods: PayoutMethod[], now = Date.now()): PayoutMethod | null {
  const ready = methods.filter((method) => !method.activeFrom || new Date(method.activeFrom).getTime() <= now);
  return ready.find((method) => method.primary) ?? ready[0] ?? null;
}

/** Problems with what was typed, before anything is sent. */
export function newMethodProblem(input: NewPayoutMethod): string | null {
  if (input.kind === "upi") return UPI_PATTERN.test(input.vpa) ? null : "That does not look like a UPI ID. It looks like name@bank.";
  if (!ACCOUNT_PATTERN.test(input.accountNumber)) return "Account numbers are 9 to 18 digits.";
  if (!IFSC_PATTERN.test(input.ifsc)) return "That does not look like an IFSC code.";
  if (input.holderName.trim().length < 3) return "Enter the name on the account.";
  return null;
}

/* ------------------------------------------------------------------ */
/*  Demo                                                               */
/* ------------------------------------------------------------------ */

const IFSC_BANKS: Record<string, string> = { HDFC: "HDFC Bank", ICIC: "ICICI Bank", SBIN: "State Bank of India", UTIB: "Axis Bank", KKBK: "Kotak Bank", PUNB: "Punjab National Bank", BARB: "Bank of Baroda" };
const bankFor = (ifsc: string) => IFSC_BANKS[ifsc.slice(0, 4)] ?? "Your bank";
const utr = () => String(Math.floor(4e11 + Math.random() * 5e11));

let demoSendingTimer: number | null = null;

/** In the demo, a payout on its way lands a little while after the page first looks. */
function demoSettleSoon() {
  if (demoSendingTimer !== null) return;
  demoSendingTimer = window.setTimeout(() => {
    for (const payout of demo.payouts) {
      if (payout.status !== "sending") continue;
      payout.status = "paid";
      payout.utr = utr();
      payout.settledAt = new Date().toISOString();
      demo.notifications.unshift({
        id: demoId("note"),
        template_type: "payout_released",
        deep_link: "/payouts",
        read_at: null,
        created_at: payout.settledAt,
      });
    }
  }, 15_000);
}

/* ------------------------------------------------------------------ */
/*  Reads                                                              */
/* ------------------------------------------------------------------ */

interface PayoutMethodRow {
  id: string;
  method_type: PayoutMethodKind;
  vpa_masked: string | null;
  bank_name: string | null;
  account_last4: string | null;
  holder_name: string;
  is_primary: boolean;
  active_from: string | null;
}

export async function fetchPayoutMethods(): Promise<PayoutMethod[]> {
  if (isDemo()) return demoRespond(() => demo.payoutMethods);

  const { data, error } = await supabase
    .from("payout_methods_doer")
    .select(selectColumns("id", "method_type", "vpa_masked", "bank_name", "account_last4", "holder_name", "is_primary", "active_from"));
  if (error) throw new Error(error.message);
  return ((data as unknown as PayoutMethodRow[] | null) ?? []).map((row) => ({
    id: row.id,
    kind: row.method_type,
    label: row.method_type === "upi" ? (row.vpa_masked ?? "") : (row.bank_name ?? "Bank account"),
    last4: row.account_last4,
    holderName: row.holder_name,
    primary: row.is_primary,
    activeFrom: row.active_from,
  }));
}

interface PayoutRow {
  id: string;
  project_id: string;
  amount_paise: number | string;
  status: "queued" | "processing" | "paid" | "failed" | "rerouted";
  method_type: PayoutMethodKind;
  method_display: string;
  utr: string | null;
  approved_at: string;
  status_event_at: string | null;
}

export async function fetchPayouts(): Promise<Payout[]> {
  if (isDemo()) {
    demoSettleSoon();
    return demoRespond(() => demo.payouts);
  }

  const { data, error } = await supabase
    .from("payouts_doer")
    .select(selectColumns("id", "project_id", "amount_paise", "status", "method_type", "method_display", "utr", "approved_at", "status_event_at"))
    .order("approved_at", { ascending: false })
    .limit(200);
  if (error) throw new Error(error.message);
  return ((data as unknown as PayoutRow[] | null) ?? []).map((row) => ({
    id: row.id,
    projectId: row.project_id,
    amountPaise: toPaise(row.amount_paise),
    status: row.status === "queued" || row.status === "processing" ? "sending" : row.status,
    methodKind: row.method_type,
    methodName: row.method_display,
    utr: row.utr,
    approvedAt: row.approved_at,
    settledAt: row.status === "paid" || row.status === "rerouted" ? row.status_event_at : null,
  }));
}

/* ------------------------------------------------------------------ */
/*  Writes                                                             */
/* ------------------------------------------------------------------ */

/**
 * Ask the UPI app or bank whose account this is. For a bank account the provider
 * sends ₹1 and reads back the holder's name. The name must match the doer's
 * profile name, which is the name on their PAN.
 */
export async function checkPayoutAccount(input: NewPayoutMethod, profileName: string): Promise<{ holderName: string; matches: boolean }> {
  const problem = newMethodProblem(input);
  if (problem) throw new Error(problem);

  let holderName: string;
  if (isDemo()) {
    holderName = await demoRespond(() => (input.kind === "bank" ? input.holderName : profileName).trim().toUpperCase());
  } else {
    const { data, error } = await supabase.functions.invoke("check-payout-account", { body: input });
    if (error) throw new Error(error.message);
    holderName = String((data as { holderName?: string } | null)?.holderName ?? "");
  }
  return { holderName, matches: sameName(holderName, profileName) };
}

/** Send a one-time code to the doer's phone before payout details change. */
export async function sendPayoutCode(): Promise<void> {
  if (isDemo()) {
    await demoRespond(() => null);
    return;
  }
  const { error } = await supabase.functions.invoke("send-payout-code", { body: {} });
  if (error) throw new Error(error.message);
}

/**
 * Save a new UPI ID or bank account, or replace one. It goes through the
 * set-payout-method edge function, which tokenises it with the payment provider
 * and stores only a masked copy. It gets payouts after the 24-hour wait, unless it
 * is the doer's first method.
 */
export async function savePayoutMethod(input: NewPayoutMethod, code: string, replaces: string | null): Promise<void> {
  const problem = newMethodProblem(input);
  if (problem) throw new Error(problem);
  if (!/^\d{6}$/.test(code)) throw new Error("Enter the 6-digit code.");

  if (isDemo()) {
    await demoRespond(() => {
      const old = replaces ? demo.payoutMethods.find((method) => method.id === replaces) : undefined;
      const others = demo.payoutMethods.filter((method) => method.id !== replaces && method.kind !== input.kind);
      const first = demo.payoutMethods.length === 0;
      const added: PayoutMethod = {
        id: demoId("method"),
        kind: input.kind,
        label: input.kind === "upi" ? input.vpa.toLowerCase() : bankFor(input.ifsc),
        last4: input.kind === "bank" ? input.accountNumber.slice(-4) : null,
        holderName: input.kind === "bank" ? input.holderName.trim().toUpperCase() : (demo.profile.full_name ?? "").toUpperCase(),
        primary: old?.primary ?? others.length === 0,
        activeFrom: first ? null : new Date(Date.now() + HOLD_HOURS * 3_600_000).toISOString(),
      };
      demo.payoutMethods = [...others, added].sort((a, b) => Number(b.primary) - Number(a.primary));
      return null;
    });
    return;
  }

  const body =
    input.kind === "upi"
      ? { method: "upi", vpa: input.vpa, code, replaces }
      : { method: "bank", accountNumber: input.accountNumber, ifsc: input.ifsc, name: input.holderName.trim(), code, replaces };
  const { error } = await supabase.functions.invoke("set-payout-method", { body });
  if (error) throw new Error(error.message);
}

/** Make this method get payouts first; the other one becomes the backup. */
export async function makePrimaryMethod(id: string): Promise<void> {
  if (isDemo()) {
    await demoRespond(() => {
      demo.payoutMethods = demo.payoutMethods
        .map((method) => ({ ...method, primary: method.id === id }))
        .sort((a, b) => Number(b.primary) - Number(a.primary));
      return null;
    });
    return;
  }
  unwrap(await callRpc<null>("set_primary_payout_method", { p_id: id }));
}

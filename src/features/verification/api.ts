import { supabase } from "@/lib/supabase";
import { callRpc, unwrap } from "@/lib/rpc";
import { selectColumns } from "@/lib/select";
import { BUCKETS } from "@/lib/constants";
import { demo, demoRespond, isDemo } from "@/lib/demo-data";
import type { KycRow, KycStatus } from "@/types/database";

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

const EXTENSIONS_FOR_TYPE: Record<string, string[]> = {
  "image/jpeg": ["jpg", "jpeg"],
  "image/png": ["png"],
  "image/webp": ["webp"],
  "application/pdf": ["pdf"],
};

/**
 * Immediate, offline file check shared by the form and the uploader.
 *
 * File.type is spoofable, so the extension is cross-checked against it: a
 * .exe renamed to image/jpeg fails here instead of after Submit. Storage RLS
 * and the payout-first ordering remain the real controls.
 */
export function validateIdentityFile(file: File): string | null {
  if (file.size === 0) return "That file is empty.";
  if (file.size > MAX_UPLOAD_BYTES) return "Files must be under 10MB.";
  const raw = file.name.split(".").pop()?.toLowerCase() ?? "";
  const allowed = EXTENSIONS_FOR_TYPE[file.type];
  if (!allowed || !allowed.includes(raw)) return "Upload a JPG, PNG, WEBP or PDF.";
  return null;
}

export async function fetchKycStatus(): Promise<KycStatus> {
  if (isDemo()) return demoRespond(() => demo.kyc);

  const { data, error } = await supabase
    .from("kyc")
    .select(selectColumns("status"))
    .limit(1);
  if (error) throw new Error(error.message);
  // A doer who has never submitted has no kyc row at all, which reads as pending.
  return (data as unknown as KycRow[] | null)?.[0]?.status ?? "pending";
}

function extensionFor(file: File): string {
  const raw = file.name.split(".").pop()?.toLowerCase() ?? "";
  const cleaned = raw.replace(/[^a-z0-9]/g, "");
  return cleaned || (file.type === "application/pdf" ? "pdf" : "jpg");
}

/**
 * Upload an identity document.
 *
 * The object path is a bare random UUID at the bucket root. It deliberately does
 * NOT contain the doer id, their name, or the original filename: a storage path is
 * visible inside any signed URL, so anything encoded in it is effectively public to
 * whoever holds that link. The kyc-docs bucket is admin-read only, and a doer has
 * insert permission but no read policy, so they cannot fetch back what they sent.
 */
async function uploadIdentityFile(file: File): Promise<string> {
  const problem = validateIdentityFile(file);
  if (problem) throw new Error(problem);

  const objectPath = `${crypto.randomUUID()}.${extensionFor(file)}`;
  const { error } = await supabase.storage
    .from(BUCKETS.kyc)
    .upload(objectPath, file, { contentType: file.type, upsert: false });
  if (error) throw new Error(error.message);
  return objectPath;
}

export type PayoutInput =
  | { method: "upi"; vpa: string }
  | { method: "bank"; accountNumber: string; ifsc: string; name: string };

export interface PayoutResult {
  id: string;
  methodType: string;
  vpaMasked: string | null;
  accountLast4: string | null;
}

/**
 * Register where the doer gets paid.
 *
 * This goes through the set-payout-method edge function rather than a table insert,
 * because the client insert on payout_methods was withdrawn: the raw VPA or account
 * number must be tokenized server side and never persisted. The function creates
 * the payment-provider contact and fund account, then stores only tokens plus a
 * masked display, so Postgres never holds anything payable.
 */
export async function setPayoutMethod(input: PayoutInput): Promise<PayoutResult> {
  const { data, error } = await supabase.functions.invoke("set-payout-method", {
    body: input,
  });
  if (error) throw new Error(error.message);
  return data as PayoutResult;
}

export async function submitKyc(input: {
  document: File;
  selfie: File;
  payout: PayoutInput;
}): Promise<KycStatus> {
  // Nothing is uploaded or stored in the demo; the submission just goes to review.
  if (isDemo()) {
    return demoRespond(() => {
      demo.kyc = "submitted";
      return demo.kyc;
    });
  }

  // Payout first: it is the step most likely to be rejected by the provider, and
  // failing here before any document is stored avoids orphaned uploads.
  await setPayoutMethod(input.payout);

  const [docRef, selfieRef] = await Promise.all([
    uploadIdentityFile(input.document),
    uploadIdentityFile(input.selfie),
  ]);

  const status = unwrap(
    await callRpc<KycStatus>("submit_kyc", { p_doc_ref: docRef, p_selfie_ref: selfieRef }),
  );
  return status;
}

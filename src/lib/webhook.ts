/**
 * Webhook signature verification utility.
 *
 * Provides cryptographic HMAC-SHA256 signature verification with timing-safe
 * comparison using standard Web Crypto APIs (crypto.subtle), preventing timing attacks.
 */

/**
 * Constant-time byte comparison to protect against timing attacks.
 */
function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    const valA = a[i] ?? 0;
    const valB = b[i] ?? 0;
    mismatch |= valA ^ valB;
  }
  return mismatch === 0;
}

/**
 * Converts a hex string into a Uint8Array byte buffer.
 */
function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/[^0-9a-fA-F]/g, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(clean.substring(i * 2, i * 2 + 2), 16);
  }
  return bytes;
}

/**
 * Verifies an HMAC-SHA256 webhook signature (e.g., Razorpay, Supabase, Stripe, GitHub).
 *
 * @param payload Raw string or bytes of the webhook body.
 * @param signature Hex-encoded expected signature from request headers.
 * @param secret Shared webhook signing secret.
 * @returns Promise<boolean> indicating whether the signature is cryptographically valid.
 */
export async function verifyWebhookSignature(
  payload: string | Uint8Array,
  signature: string,
  secret: string,
): Promise<boolean> {
  try {
    if (!signature || !secret) return false;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);
    const bodyBytes = typeof payload === "string" ? encoder.encode(payload) : payload;

    const key = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["sign"],
    );

    const calculatedSigBuffer = await crypto.subtle.sign("HMAC", key, bodyBytes as BufferSource);
    const calculatedBytes = new Uint8Array(calculatedSigBuffer);
    const expectedBytes = hexToBytes(signature);

    return constantTimeEqual(calculatedBytes, expectedBytes);
  } catch {
    return false;
  }
}

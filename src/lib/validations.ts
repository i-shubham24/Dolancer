import { z } from "zod";

/**
 * Common schema validations for the frontend to prevent malformed submissions
 * and provide immediate UX feedback before network requests.
 */

export const emailSchema = z
  .string()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.")
  .max(254, "Email is too long.");

export const otpCodeSchema = z
  .string()
  .min(6, "Code must be 6 digits.")
  .max(6, "Code must be 6 digits.")
  .regex(/^\d+$/, "Code must contain only numbers.");

export const profileBasicsSchema = z.object({
  fullName: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(100, "Name is too long.")
    .regex(/^[\p{L}\s'-]+$/u, "Name contains invalid characters."),
  whatsapp: z
    .string()
    .max(20, "WhatsApp number is too long.")
    .regex(/^\+?[0-9\s-]+$/, "Please enter a valid phone number format.")
    .optional()
    .or(z.literal("")),
});

export const applicationBioSchema = z
  .string()
  .min(20, "Please provide a little more detail (at least 20 characters).")
  .max(2000, "Bio is too long. Please keep it under 2000 characters.");

export const supportTicketSchema = z.object({
  subject: z
    .string()
    .min(5, "Subject must be at least 5 characters.")
    .max(100, "Subject is too long."),
  body: z
    .string()
    .min(10, "Please provide more details.")
    .max(2000, "Message is too long."),
});

/**
 * Safe external URL validation to prevent SSRF and protocol smuggling.
 * Ensures the URL is https only, max 2048 chars, and blocks local/private IP ranges.
 */
export const safeHttpsUrlSchema = z
  .string()
  .max(2048, "URL is too long (max 2048 characters).")
  .refine((val) => {
    const trimmed = val?.trim();
    if (!trimmed) return true;
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:") return false;
      const host = parsed.hostname.toLowerCase();
      if (
        host === "localhost" ||
        host === "127.0.0.1" ||
        host === "::1" ||
        host === "0.0.0.0" ||
        host === "169.254.169.254" ||
        host.endsWith(".local") ||
        host.endsWith(".internal") ||
        /^10\./.test(host) ||
        /^192\.168\./.test(host) ||
        /^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(host)
      ) {
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }, "Please enter a valid, public https:// URL.");

/**
 * Helper to safely parse Zod schemas and throw a standard Error with the first issue message.
 * This integrates cleanly with React Query mutations.
 */
export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0]?.message || "Validation failed");
  }
  return result.data;
}

/** True only for a well-formed https URL. Checked before a stored value is rendered as a link. */
export function isHttpsUrl(value: string | null | undefined): value is string {
  if (!value) return false;
  try {
    return new URL(value.trim()).protocol === "https:";
  } catch {
    return false;
  }
}

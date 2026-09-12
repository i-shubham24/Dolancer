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
    .regex(/^[\p{L}\s\-\']+$/u, "Name contains invalid characters."),
  whatsapp: z
    .string()
    .max(20, "WhatsApp number is too long.")
    .regex(/^\+?[0-9\s\-]+$/, "Please enter a valid phone number format.")
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
 * Helper to safely parse Zod schemas and throw a standard Error with the first issue message.
 * This integrates cleanly with React Query mutations.
 */
export function validateOrThrow<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);
  if (!result.success) {
    throw new Error(result.error.errors[0].message);
  }
  return result.data;
}

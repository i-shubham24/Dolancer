/**
 * The single query-key namespace.
 *
 * The reference monorepo has no query keys at all (every doer read there is a Next
 * server component), so this is designed here from scratch. Keeping every key in one
 * file makes invalidation legible: a mutation can see exactly what it invalidates.
 */

import type { WorkBucket } from "@/types/domain";

export const qk = {
  session: ["session"] as const,

  profile: () => ["profile"] as const,
  gate: () => ["gate"] as const,
  rating: () => ["rating"] as const,
  country: () => ["country"] as const,

  pool: {
    all: () => ["pool"] as const,
    list: (cursor?: string | null) => ["pool", "list", cursor ?? null] as const,
  },

  work: {
    all: () => ["work"] as const,
    list: (bucket: WorkBucket, cursor?: string | null) =>
      ["work", "list", bucket, cursor ?? null] as const,
    detail: (projectId: string) => ["work", "detail", projectId] as const,
    thread: (projectId: string) => ["work", "thread", projectId] as const,
    messages: (threadId: string) => ["work", "messages", threadId] as const,
    attachments: (threadId: string) => ["work", "attachments", threadId] as const,
  },

  earnings: {
    all: () => ["earnings"] as const,
    summary: () => ["earnings", "summary"] as const,
    ledger: (cursor?: string | null) => ["earnings", "ledger", cursor ?? null] as const,
  },

  kyc: () => ["kyc"] as const,

  skills: {
    all: () => ["skills"] as const,
    catalogue: () => ["skills", "catalogue"] as const,
    mine: () => ["skills", "mine"] as const,
  },

  training: {
    all: () => ["training"] as const,
    lessons: () => ["training", "lessons"] as const,
    lesson: (lessonId: string) => ["training", "lesson", lessonId] as const,
    questions: (lessonId: string) => ["training", "questions", lessonId] as const,
  },

  notifications: {
    all: () => ["notifications"] as const,
    list: (cursor?: string | null) => ["notifications", "list", cursor ?? null] as const,
  },

  referrals: () => ["referrals"] as const,
  application: () => ["application"] as const,

  tickets: {
    all: () => ["tickets"] as const,
    list: () => ["tickets", "list"] as const,
    detail: (ticketId: string) => ["tickets", "detail", ticketId] as const,
    messages: (ticketId: string) => ["tickets", "messages", ticketId] as const,
  },
} as const;

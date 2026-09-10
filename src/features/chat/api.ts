import { supabase } from "@/lib/supabase";
import { selectColumns } from "@/lib/select";
import { BUCKETS } from "@/lib/constants";
import type { MessageRow } from "@/types/database";

export interface ChatMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
}

export interface ChatAttachment {
  id: string;
  messageId: string | null;
  bucket: string;
  objectPath: string;
  filename: string;
  mimeType: string | null;
  sizeBytes: number | null;
  createdAt: string;
}

/**
 * Find this project's supervisor_doer thread.
 *
 * There are exactly two threads per project, created atomically when the project
 * is. The doer is a participant of this one only; the user_supervisor thread is
 * unreadable to them, and RLS returns zero rows rather than an error if they ask.
 * That is the whole anonymity model: the separation is physical, so there is no
 * filter here to forget.
 */
export async function fetchThreadId(projectId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from("threads")
    .select(selectColumns("id"))
    .match({ project_id: projectId, kind: "supervisor_doer" })
    .limit(1);
  if (error) throw new Error(error.message);
  return (data as unknown as { id: string }[] | null)?.[0]?.id ?? null;
}

export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  // Newest first with a limit, then reversed, so a long thread loads its tail
  // rather than its head.
  const { data, error } = await supabase
    .from("messages")
    .select(selectColumns("id", "author_id", "body", "created_at"))
    .eq("thread_id", threadId)
    .order("created_at", { ascending: false })
    .limit(100);
  if (error) throw new Error(error.message);

  return ((data as unknown as MessageRow[] | null) ?? [])
    .map((row) => ({
      id: row.id,
      authorId: row.author_id,
      body: row.body,
      createdAt: row.created_at,
    }))
    .reverse();
}

export async function sendMessage(threadId: string, body: string): Promise<void> {
  const { data: userData } = await supabase.auth.getUser();
  const authorId = userData.user?.id;
  if (!authorId) throw new Error("Not signed in");

  // The insert policy requires author_id = auth.uid() and that the caller can read
  // the thread, so a participant can only ever post as themselves.
  const { error } = await supabase
    .from("messages")
    .insert({ thread_id: threadId, author_id: authorId, body: body.trim() });
  if (error) throw new Error(error.message);
}

export async function fetchAttachments(threadId: string): Promise<ChatAttachment[]> {
  const { data, error } = await supabase
    .from("attachments")
    .select(
      selectColumns(
        "id",
        "message_id",
        "bucket",
        "object_path",
        "filename",
        "mime_type",
        "size_bytes",
        "created_at",
      ),
    )
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw new Error(error.message);

  return (
    (data as unknown as {
      id: string;
      message_id: string | null;
      bucket: string;
      object_path: string;
      filename: string;
      mime_type: string | null;
      size_bytes: number | null;
      created_at: string;
    }[] | null) ?? []
  ).map((row) => ({
    id: row.id,
    messageId: row.message_id,
    bucket: row.bucket,
    objectPath: row.object_path,
    filename: row.filename,
    mimeType: row.mime_type,
    sizeBytes: row.size_bytes,
    createdAt: row.created_at,
  }));
}

const READABLE_BUCKETS = new Set<string>([BUCKETS.chat, BUCKETS.deliverables]);

/**
 * Mint a short-lived signed URL.
 *
 * Storage RLS is the real gate: the SELECT policy joins the object path back to its
 * thread and applies the same predicate the tables use, so a path belonging to
 * someone else's thread simply fails. The bucket allowlist here is defence in depth,
 * to stop a malformed row pointing this at kyc-docs.
 *
 * These URLs are bearer tokens until they expire, so the window is deliberately
 * short and they are never persisted.
 */
export async function signedUrlFor(bucket: string, objectPath: string): Promise<string> {
  if (!READABLE_BUCKETS.has(bucket)) throw new Error("That file is not available here.");

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60);
  if (error) throw new Error(error.message);
  if (!data?.signedUrl) throw new Error("Could not open that file.");
  return data.signedUrl;
}

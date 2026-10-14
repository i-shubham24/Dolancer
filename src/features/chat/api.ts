import { supabase } from "@/lib/supabase";
import { selectColumns } from "@/lib/select";
import { BUCKETS } from "@/lib/constants";
import { DEMO_USER_ID, demo, demoId, demoRespond, demoThreadId, isDemo } from "@/lib/demo-data";
import { fetchProjects } from "@/features/work/api";
import { taskTitle } from "@/lib/task-title";
import type { MessageRow, ProjectStatus } from "@/types/database";

export interface ChatMessage {
  id: string;
  authorId: string;
  body: string;
  createdAt: string;
  /** An offer the supervisor shared in the message, shown as a card under it. */
  offerId?: string | null;
}

/**
 * One conversation in the inbox. "project" is the supervisor thread on a task the
 * doer holds or held; "invite" is a supervisor reaching out about new work before
 * the doer has accepted anything.
 */
export interface InboxThread {
  id: string;
  kind: "project" | "invite";
  title: string;
  category: string;
  projectId: string | null;
  offerId: string | null;
  status: ProjectStatus | null;
  workingDocUrl: string | null;
  last: ChatMessage | null;
  updatedAt: string;
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
  if (isDemo()) {
    return demoRespond(() =>
      demo.projects.some((project) => project.id === projectId) ? demoThreadId(projectId) : null,
    );
  }

  const { data, error } = await supabase
    .from("threads")
    .select(selectColumns("id"))
    .match({ project_id: projectId, kind: "supervisor_doer" })
    .limit(1);
  if (error) throw new Error(error.message);
  return (data as unknown as { id: string }[] | null)?.[0]?.id ?? null;
}

export async function fetchMessages(threadId: string): Promise<ChatMessage[]> {
  if (isDemo()) return demoRespond(() => demo.messages[threadId] ?? []);

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
  if (isDemo()) {
    return demoRespond(() => {
      (demo.messages[threadId] ??= []).push({
        id: demoId("message"),
        authorId: DEMO_USER_ID,
        body: body.trim(),
        createdAt: new Date().toISOString(),
      });
    });
  }

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
  if (isDemo()) return demoRespond(() => demo.attachments[threadId] ?? []);

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
  // The demo lists attachments but has no stored files behind them.
  if (isDemo()) throw new Error("Files cannot be opened in the demo.");
  if (!READABLE_BUCKETS.has(bucket)) throw new Error("That file is not available here.");

  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(objectPath, 60);
  if (error) throw new Error(error.message);
  if (!data?.signedUrl) throw new Error("Could not open that file.");
  return data.signedUrl;
}

/**
 * Every conversation the doer has, newest activity first.
 *
 * Project threads are the same supervisor_doer threads the task page shows, so a
 * reply in either place lands in both. Invites need a thread type the server does
 * not have yet (a supervisor writing before a task is accepted), so outside the
 * demo that list is empty until it does.
 */
export async function fetchInbox(): Promise<InboxThread[]> {
  if (isDemo()) {
    return demoRespond(() => {
      const lastOf = (threadId: string) => {
        const list = demo.messages[threadId] ?? [];
        return list[list.length - 1] ?? null;
      };
      const projects: InboxThread[] = demo.projects.map((project) => {
        const id = demoThreadId(project.id);
        const last = lastOf(id);
        return {
          id,
          kind: "project",
          title: taskTitle(project),
          category: project.category,
          projectId: project.id,
          offerId: null,
          status: project.status,
          workingDocUrl: project.workingDocUrl,
          last,
          updatedAt: last?.createdAt ?? project.updatedAt,
        };
      });
      const invites: InboxThread[] = demo.invites.map((invite) => {
        const last = lastOf(invite.threadId);
        return {
          id: invite.threadId,
          kind: "invite",
          title: invite.title,
          category: invite.category,
          projectId: null,
          offerId: invite.offerId,
          status: null,
          workingDocUrl: null,
          last,
          updatedAt: last?.createdAt ?? invite.createdAt,
        };
      });
      return [...projects, ...invites].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    });
  }

  const [active, closed] = await Promise.all([fetchProjects("active"), fetchProjects("closed")]);
  const projects = [...active, ...closed];
  if (projects.length === 0) return [];

  const threads = await supabase
    .from("threads")
    .select(selectColumns("id", "project_id"))
    .eq("kind", "supervisor_doer")
    .in(
      "project_id",
      projects.map((project) => project.id),
    )
    .limit(200);
  if (threads.error) throw new Error(threads.error.message);
  const rows = (threads.data as unknown as { id: string; project_id: string }[] | null) ?? [];
  if (rows.length === 0) return [];

  const recent = await supabase
    .from("messages")
    .select(selectColumns("id", "thread_id", "author_id", "body", "created_at"))
    .in(
      "thread_id",
      rows.map((row) => row.id),
    )
    .order("created_at", { ascending: false })
    .limit(400);
  if (recent.error) throw new Error(recent.error.message);

  const latest = new Map<string, ChatMessage>();
  for (const row of (recent.data as unknown as (MessageRow & { thread_id: string })[] | null) ?? []) {
    if (latest.has(row.thread_id)) continue;
    latest.set(row.thread_id, { id: row.id, authorId: row.author_id, body: row.body, createdAt: row.created_at });
  }

  const byProject = new Map(projects.map((project) => [project.id, project]));
  return rows
    .flatMap((row) => {
      const project = byProject.get(row.project_id);
      if (!project) return [];
      const last = latest.get(row.id) ?? null;
      const thread: InboxThread = {
        id: row.id,
        kind: "project",
        title: taskTitle(project),
        category: project.category,
        projectId: project.id,
        offerId: null,
        status: project.status,
        workingDocUrl: project.workingDocUrl,
        last,
        updatedAt: last?.createdAt ?? project.updatedAt,
      };
      return [thread];
    })
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

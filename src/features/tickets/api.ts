import { supabase } from "@/lib/supabase";
import { selectColumns } from "@/lib/select";
import type { TicketStatus } from "@/types/database";

export const TICKET_CATEGORIES = [
  { id: "payout", label: "Payment or payout" },
  { id: "quality", label: "A project I am working on" },
  { id: "account", label: "Account access" },
  { id: "general", label: "Something else" },
] as const;

export interface Ticket {
  id: string;
  subject: string;
  category: string;
  status: TicketStatus;
  createdAt: string;
}

export interface TicketMessage {
  id: string;
  authorId: string | null;
  body: string;
  createdAt: string;
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  const id = data.user?.id;
  if (!id) throw new Error("Not signed in");
  return id;
}

export async function fetchTickets(): Promise<Ticket[]> {
  const { data, error } = await supabase
    .from("tickets")
    .select(selectColumns("id", "subject", "category", "status", "created_at"))
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw new Error(error.message);

  return (
    (data as unknown as { id: string; subject: string; category: string; status: TicketStatus; created_at: string }[] | null) ?? []
  ).map((row) => ({
    id: row.id,
    subject: row.subject,
    category: row.category,
    status: row.status,
    createdAt: row.created_at,
  }));
}

export async function fetchTicket(ticketId: string): Promise<Ticket | null> {
  const { data, error } = await supabase
    .from("tickets")
    .select(selectColumns("id", "subject", "category", "status", "created_at"))
    .eq("id", ticketId)
    .limit(1);
  if (error) throw new Error(error.message);

  const row = (data as unknown as { id: string; subject: string; category: string; status: TicketStatus; created_at: string }[] | null)?.[0];
  return row
    ? {
        id: row.id,
        subject: row.subject,
        category: row.category,
        status: row.status,
        createdAt: row.created_at,
      }
    : null;
}

export async function fetchTicketMessages(ticketId: string): Promise<TicketMessage[]> {
  const { data, error } = await supabase
    .from("ticket_messages")
    .select(selectColumns("id", "author_id", "body", "created_at"))
    .eq("ticket_id", ticketId)
    .order("created_at", { ascending: true })
    .limit(200);
  if (error) throw new Error(error.message);

  return (
    (data as unknown as { id: string; author_id: string | null; body: string; created_at: string }[] | null) ?? []
  ).map((row) => ({
    id: row.id,
    authorId: row.author_id,
    body: row.body,
    createdAt: row.created_at,
  }));
}

export async function openTicket(input: {
  subject: string;
  category: string;
  body: string;
}): Promise<string> {
  const openerId = await currentUserId();

  const { data, error } = await supabase
    .from("tickets")
    .insert({
      opener_id: openerId,
      subject: input.subject.trim(),
      category: input.category,
      status: "open",
    })
    .select(selectColumns("id"))
    .limit(1);
  if (error) throw new Error(error.message);

  const ticketId = (data as unknown as { id: string }[] | null)?.[0]?.id;
  if (!ticketId) throw new Error("The ticket was not created.");

  const message = await supabase
    .from("ticket_messages")
    .insert({ ticket_id: ticketId, author_id: openerId, body: input.body.trim() });
  if (message.error) throw new Error(message.error.message);

  return ticketId;
}

export async function replyToTicket(ticketId: string, body: string): Promise<void> {
  const authorId = await currentUserId();
  const { error } = await supabase
    .from("ticket_messages")
    .insert({ ticket_id: ticketId, author_id: authorId, body: body.trim() });
  if (error) throw new Error(error.message);
}

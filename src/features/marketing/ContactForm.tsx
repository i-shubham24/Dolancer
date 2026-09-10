import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Send, Mail, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Label } from "@/components/ui/input";
import { useAuth } from "@/providers/AuthProvider";
import { openTicket, TICKET_CATEGORIES } from "@/features/tickets/api";
import { CONTACT } from "./content";

/**
 * One form, two honest destinations.
 *
 * Signed in, it opens a real support ticket: attached to the account, visible in
 * the app, and answerable in a thread. Signed out, there is no public endpoint to
 * post to, so rather than a form that pretends to submit and quietly drops the
 * message, it composes the mail and hands it to the visitor's own mail client. They
 * can see it was really sent, and they keep a copy.
 *
 * The alternative, a form that POSTs nowhere and shows a thank-you, is the single
 * most common lie on a contact page. Not here.
 */
export function ContactForm() {
  const { session, user } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<string>(TICKET_CATEGORIES[0].id);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [handedOff, setHandedOff] = useState(false);

  const ticket = useMutation({
    mutationFn: () => openTicket({ subject, category, body: message }),
    onSuccess: (ticketId) => {
      toast.success("Ticket opened. You can follow it in support.");
      navigate(`/tickets/${ticketId}`);
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const ready = session
    ? subject.trim().length > 3 && message.trim().length > 10
    : name.trim().length > 1 && email.trim().length > 4 && subject.trim().length > 3 && message.trim().length > 10;

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!ready) return;

    if (session) {
      ticket.mutate();
      return;
    }

    const body = `${message.trim()}\n\nFrom: ${name.trim()} <${email.trim()}>`;
    window.location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(
      subject.trim(),
    )}&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border-2 border-ink bg-surface p-6 shadow-offset-lg lg:p-8"
    >
      <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Send us a message</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-2">
        {session
          ? "This opens a support ticket on your account, so whoever picks it up already has your details and you can follow the whole thread."
          : "This opens your mail app with the message ready to send, so you keep a copy and can see it actually went."}
      </p>

      <div className="mt-6 space-y-4">
        {!session ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="contact-name">Your name</Label>
              <Input
                id="contact-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoComplete="name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-email">Your email</Label>
              <Input
                id="contact-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>
        ) : (
          <p className="rounded-md border border-line-card bg-surface-2 px-3 py-2.5 text-xs text-ink-2">
            Sending as {user?.email}
          </p>
        )}

        <div className="space-y-2">
          <Label htmlFor="contact-category">What is it about?</Label>
          <select
            id="contact-category"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-md border-2 border-ink bg-surface px-4 py-[11px] text-sm font-medium shadow-offset-xs outline-none transition-all focus:-translate-x-px focus:-translate-y-px focus:shadow-offset-sm"
          >
            {TICKET_CATEGORIES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-subject">Subject</Label>
          <Input
            id="contact-subject"
            value={subject}
            onChange={(event) => setSubject(event.target.value)}
            placeholder="A short summary"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message">Message</Label>
          <Textarea
            id="contact-message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us what is going on."
            required
          />
        </div>
      </div>

      {handedOff ? (
        <div
          role="status"
          className="mt-5 flex items-start gap-2.5 rounded-md border-2 border-ink bg-success-bg px-4 py-3"
        >
          <Check className="mt-0.5 h-4 w-4 shrink-0 text-success-ink" aria-hidden="true" />
          <p className="text-xs font-semibold leading-snug text-success-ink">
            Your mail app should have opened with the message ready. If nothing happened,
            email {CONTACT.email} directly.
          </p>
        </div>
      ) : null}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={!ready || ticket.isPending}>
        {session ? (
          <Send className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Mail className="h-4 w-4" aria-hidden="true" />
        )}
        {ticket.isPending
          ? "Opening ticket..."
          : session
            ? "Open a support ticket"
            : "Compose the message"}
      </Button>

      {!ready ? (
        <p className="mt-3 text-center text-xs text-ink-muted">
          Fill in the fields above to continue.
        </p>
      ) : null}
    </form>
  );
}

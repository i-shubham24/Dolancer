import { Link } from "react-router-dom";
import { Mail, Clock, Scale, LifeBuoy } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { CONTACT } from "./content";
import { ContactForm } from "./ContactForm";

/**
 * Contact.
 *
 * The form routes by who is asking: a signed-in doer opens a real support ticket
 * attached to their account, and a visitor composes a mail they keep a copy of.
 * Neither path posts into a void. See ContactForm for why that matters.
 */
export function ContactPage() {
  const { session } = useAuth();

  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-16 lg:px-6 lg:py-24">
      <div className="max-w-2xl">
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.045em]">
          Talk to{" "}
          <span className="inline-block -rotate-[2deg] rounded-xl border-2 border-ink bg-lime px-3 pb-1 shadow-offset-md">
            a person.
          </span>
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-ink-2">
          Questions about payments, verification, a project you are on, or your account.
          Someone answers every one of them.
        </p>
      </div>

      <div className="mt-12 grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
        <ContactForm />

        <div className="space-y-4">
          {session ? (
            <Card className="border-2 bg-lime shadow-offset-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-surface shadow-offset-xs">
                <LifeBuoy className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">
                Already have tickets open?
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-ink/75">
                Everything you have raised, and every reply, lives in one place.
              </p>
              <Button asChild variant="dark" className="mt-4">
                <Link to="/tickets">Go to support</Link>
              </Button>
            </Card>
          ) : (
            <Card className="border-2 bg-blue shadow-offset-md">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-surface shadow-offset-xs">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">Or email directly</h2>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-block break-all text-sm font-bold underline decoration-2 underline-offset-2"
              >
                {CONTACT.email}
              </a>
            </Card>
          )}

          <Card className="bg-ink text-inverse">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-white/25 bg-white/10">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">When we are around</h2>
            <p className="mt-2 text-sm font-bold">{CONTACT.hours}</p>
            <p className="mt-3 text-xs leading-relaxed text-white/55">
              Anything about a project you are actively working on is best raised with your
              supervisor in that project's thread. They will see it soonest.
            </p>
          </Card>

          <Card className="bg-purple-light">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink bg-purple text-inverse">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">Grievances</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              If something has not been resolved through support, or concerns how your data has
              been handled, our grievance officer is reachable directly.
            </p>
            <a
              href={`mailto:${CONTACT.grievanceEmail}`}
              className="mt-3 inline-flex items-center gap-2 break-all text-sm font-bold text-purple underline decoration-2 underline-offset-2"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {CONTACT.grievanceEmail}
            </a>
          </Card>
        </div>
      </div>

      <p className="mt-10 text-xs leading-relaxed text-ink-muted">
        Dolancer is operated by {CONTACT.company}, {CONTACT.jurisdiction}. See our{" "}
        <Link to="/legal/terms" className="underline underline-offset-2 hover:text-ink">
          terms
        </Link>{" "}
        and{" "}
        <Link to="/legal/privacy" className="underline underline-offset-2 hover:text-ink">
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}

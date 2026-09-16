import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Mail, Clock, Scale, LifeBuoy } from "lucide-react";
import { StitchBadge, StitchCard, StitchSection } from "@/components/stitch/StitchPrimitives";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/providers/AuthProvider";
import { CONTACT } from "./content";
import { ContactForm } from "./ContactForm";
import { MicroFloaties } from "./MicroFloaties";

/**
 * Contact.
 *
 * The form routes by who is asking: a signed-in doer opens a real support ticket
 * attached to their account, and a visitor composes a mail they keep a copy of.
 * Neither path posts into a void. See ContactForm for why that matters.
 */
export function ContactPage() {
  const { session } = useAuth();
  const reduceMotion = useReducedMotion();

  return (
    <div className="fresh-page fresh-contact-page">
      <StitchSection className="fresh-hero fresh-editorial-hero fresh-contact-hero">
        <MicroFloaties zone="contact-hero" />
      <div className="fresh-container fresh-contact-hero-grid">
        <div className="relative z-10">
          <StitchBadge>We are here to help</StitchBadge>
          <motion.h1 initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }} className="mt-5 max-w-2xl">
            Talk to <span className="fresh-highlight fresh-underline fresh-underline-pink">a person.</span>
          </motion.h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-2">
            Questions about payments, verification, a project you are on, or your account.
            Someone answers every one of them.
          </p>
        </div>
        <motion.div
          className="fresh-contact-scene"
          initial={reduceMotion ? false : { opacity: 0, y: 18, rotate: 2 }}
          animate={reduceMotion ? undefined : { opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          aria-hidden="true"
        >
          <div className="fresh-contact-scene-main">
            <Mail />
            <strong>We read every message.</strong>
            <span>Support that feels human.</span>
          </div>
          <div className="fresh-contact-scene-float fresh-contact-scene-float-one">Reply within a day</div>
          <div className="fresh-contact-scene-float fresh-contact-scene-float-two"><LifeBuoy /> Here to help</div>
          <span className="fresh-contact-scene-dot fresh-contact-scene-dot-one" />
          <span className="fresh-contact-scene-dot fresh-contact-scene-dot-two" />
        </motion.div>
      </div>
      </StitchSection>

      <div className="fresh-container fresh-contact-content relative grid gap-6 pb-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:pb-24">
        <MicroFloaties zone="contact-form" />
        <div className="fresh-contact-form-wrap">
          <ContactForm />
        </div>

        <div className="fresh-contact-aside space-y-4">
          {session ? (
            <StitchCard className="bg-success-bg p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface">
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
            </StitchCard>
          ) : (
            <StitchCard className="bg-highlight-light p-6">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-surface">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </span>
              <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">Or email directly</h2>
              <a
                href={`mailto:${CONTACT.email}`}
                className="mt-2 inline-block break-all text-sm font-bold underline decoration-2 underline-offset-2"
              >
                {CONTACT.email}
              </a>
            </StitchCard>
          )}

          <StitchCard className="bg-highlight-light p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-highlight text-inverse">
              <Clock className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">When we are around</h2>
            <p className="mt-2 text-sm font-bold">{CONTACT.hours}</p>
            <p className="mt-3 text-xs leading-relaxed text-ink-2">
              Anything about a project you are actively working on is best raised with your
              supervisor in that project's thread. They will see it soonest.
            </p>
          </StitchCard>

          <StitchCard className="stitch-card-pink p-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-highlight text-inverse">
              <Scale className="h-5 w-5" aria-hidden="true" />
            </span>
            <h2 className="mt-4 text-lg font-extrabold tracking-[-0.03em]">Grievances</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">
              If something has not been resolved through support, or concerns how your data has
              been handled, our grievance officer is reachable directly.
            </p>
            <a
              href={`mailto:${CONTACT.grievanceEmail}`}
              className="mt-3 inline-flex items-center gap-2 break-all text-sm font-bold text-highlight underline decoration-2 underline-offset-2"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {CONTACT.grievanceEmail}
            </a>
          </StitchCard>
        </div>
      </div>

      <p className="fresh-container mt-10 pb-10 text-xs leading-relaxed text-ink-muted">
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

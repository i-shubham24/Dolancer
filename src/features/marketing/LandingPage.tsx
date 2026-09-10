import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/brutal/Card";
import { STEPS, FAQS, TESTIMONIALS } from "./content";
import { Marquee } from "./Marquee";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";
import { ComparisonSwitch } from "./ComparisonSwitch";
import { FloatingCapsules } from "./FloatingCapsules";
import { DifferenceRail } from "./DifferenceRail";
import { HeroDoodles, Cube, Cylinder, Cradle } from "./HeroDoodles";

const ACCENTS = ["bg-coral", "bg-blue", "bg-lime", "bg-purple"] as const;
const ACCENT_TEXT = ["text-ink", "text-inverse", "text-ink", "text-inverse"] as const;

/** Words that cycle in the hero. Each is a real discipline people are hired for. */
const ROTATING = ["writing", "design", "code", "research", "video", "marketing"];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-ink px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] text-inverse">
      {children}
    </span>
  );
}

function Section({
  children,
  className = "",
  labelledBy,
}: {
  children: React.ReactNode;
  className?: string;
  labelledBy?: string;
}) {
  return (
    <section aria-labelledby={labelledBy} className={className}>
      <div className="mx-auto w-full max-w-[1320px] px-4 py-16 lg:px-6 lg:py-24">{children}</div>
    </section>
  );
}

function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Respect a reduced-motion preference by simply not cycling.
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (query.matches) return;

    const timer = window.setInterval(() => {
      setIndex((value) => (value + 1) % ROTATING.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  // The sibling app sets a tilted, hard-shadowed sticker inline in its headline,
  // and that device is the most recognisable thing about it. Reusing it here is
  // what makes the two products read as one family.
  return (
    <span className="mx-1 inline-block -rotate-[4deg] rounded-xl border-2 border-ink bg-lime px-4 pb-1 shadow-offset-md">
      {ROTATING[index]}
    </span>
  );
}

export function LandingPage() {
  return (
    <>
      {/* Hero */}
      {/* No bottom border: the tilted belt below supplies its own rules, and a
          straight line above it reads as a mistake. */}
      <section className="relative overflow-hidden">
        {/* Anchored at the top corner, bleeding off both edges. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-28 -top-28 h-80 w-80 rotate-12 rounded-3xl border-2 border-ink bg-coral"
        />
        <HeroDoodles />

        <div className="relative mx-auto grid w-full max-w-[1320px] gap-8 px-4 pb-16 pt-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center lg:px-6 lg:pb-20 lg:pt-14">
          <div className="max-w-3xl">
            <span className="inline-flex rotate-[-2.5deg] items-center rounded-full border-2 border-ink bg-surface px-3.5 py-1.5 text-xs font-extrabold uppercase tracking-[0.05em] shadow-offset-sm">
              For skilled people who would rather just work
            </span>

            <h1 className="mt-6 text-balance text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-5xl lg:text-6xl xl:text-[4.1rem]">
              Get paid for
              <br />
              your <RotatingWord />
              <br />
              without the chasing.
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-2">
              No bidding. No proposals. No invoices to follow up. Work arrives with the pay
              already agreed, a supervisor reviews it before it goes out, and you are paid when
              it is approved.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Button asChild size="lg">
                <Link to="/sign-up">
                  Start earning
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="#walkthrough">See a project run</a>
              </Button>
            </div>

            <p className="mt-5 text-sm text-ink-muted">
              Free to join, and takes a couple of minutes.
            </p>
          </div>

          <FloatingCapsules />
        </div>
      </section>

      <Marquee />

      {/* Interactive walkthrough */}
      <Section labelledBy="walkthrough">
        <WorkflowDemo />
      </Section>

      {/* A deck you push */}
      <Section labelledBy="differences" className="border-y-2 border-ink bg-blue">
        <DifferenceRail />
      </Section>

      {/* Comparison */}
      <Section labelledBy="compare">
        <ComparisonSwitch />
      </Section>

      {/* Payout breakdown */}
      <Section labelledBy="payout" className="relative overflow-hidden border-y-2 border-ink bg-lime-light">
        <Cylinder
          className="float-bob pointer-events-none absolute -left-6 top-10 hidden w-24 opacity-90 xl:block"
          style={{ animationDelay: "1.2s" }}
        />
        <PayoutExplainer />
      </Section>

      {/* How you start */}
      <Section labelledBy="how" className="border-y-2 border-ink bg-ink text-inverse">
        <Eyebrow>How it works</Eyebrow>
        <h2 id="how" className="max-w-2xl text-4xl font-extrabold tracking-[-0.04em]">
          Four steps to your first payout
        </h2>
        <p className="mt-3 max-w-xl text-md text-white/60">
          You can do the first one right now, and look around properly before the rest.
        </p>

        <ol className="scattered mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border-2 border-white/25 bg-white/5 p-5 transition-all duration-[150ms] hover:-translate-y-1 hover:bg-white/10"
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink text-lg font-extrabold ${ACCENTS[index % ACCENTS.length]} ${ACCENT_TEXT[index % ACCENT_TEXT.length]}`}
              >
                {index + 1}
              </span>
              <h3 className="mt-4 text-lg font-extrabold tracking-[-0.025em]">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">{step.body}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* Verification */}
      <Section labelledBy="verification" className="relative overflow-hidden">
        <Cradle
          className="float-bob pointer-events-none absolute -right-4 top-16 hidden w-24 xl:block"
          style={{ animationDelay: "0.5s" }}
        />
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl border-2 border-ink bg-lime shadow-offset-sm">
              <ShieldCheck className="h-5 w-5" aria-hidden="true" />
            </span>
            <Eyebrow>Verification</Eyebrow>
        <h2 id="verification" className="mt-5 text-4xl font-extrabold tracking-[-0.04em]">
              Why we verify you
            </h2>
            <p className="mt-4 text-md leading-relaxed text-ink-2">
              Money is going to move to you, so we have to know who you are. That is the whole
              reason, and it is the only thing verification is used for.
            </p>
            <p className="mt-3 text-md leading-relaxed text-ink-2">
              You can sign up, look around, pick your skills and read the training before any
              of it. Verification unlocks earning, it does not gate the door.
            </p>
          </div>

          <Card className="space-y-4">
            <h3 className="text-lg font-extrabold tracking-[-0.025em]">What we ask for</h3>
            <ul className="space-y-3 text-sm leading-relaxed text-ink-2">
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>
                  <strong className="font-extrabold text-ink">A government photo ID</strong>, so
                  we can confirm you are a real person.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>
                  <strong className="font-extrabold text-ink">A photo of your face</strong>, to
                  match against that ID.
                </span>
              </li>
              <li className="flex gap-2.5">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-ink" />
                <span>
                  <strong className="font-extrabold text-ink">Where you want to be paid</strong>,
                  a UPI ID or a bank account.
                </span>
              </li>
            </ul>
            <p className="border-t border-line-subtle pt-4 text-xs leading-relaxed text-ink-muted">
              Documents are stored encrypted under a random reference, never under your name,
              and are deleted once your identity is confirmed. Your full account number is
              never stored: it is exchanged for a token with our payments provider, and we keep
              only a masked version so you can tell which account it is.
            </p>
          </Card>
        </div>
      </Section>

      {/*
        Renders only when there are real quotes. The array ships empty by design and
        must never carry invented, illustrative or placeholder testimonials. This is
        the page promising people they will be paid, and a fabricated review on it
        would undermine the only thing it is selling.
      */}
      {TESTIMONIALS.length > 0 ? (
        <Section labelledBy="testimonials" className="border-y-2 border-ink bg-surface">
          <h2 id="testimonials" className="text-4xl font-extrabold tracking-[-0.04em]">
            From people doing the work
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {TESTIMONIALS.map((entry) => (
              <Card key={entry.quote} className="h-full">
                <p className="text-md font-bold leading-relaxed tracking-[-0.01em]">
                  {entry.quote}
                </p>
                <footer className="mt-4 border-t border-line-subtle pt-3 text-sm">
                  <span className="font-extrabold">{entry.name}</span>
                  <span className="ml-2 text-ink-muted">{entry.discipline}</span>
                </footer>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* FAQ */}
      <Section labelledBy="faq" className="relative overflow-hidden border-y-2 border-ink bg-purple-light">
        <Cube
          className="float-bob pointer-events-none absolute -right-2 top-14 hidden w-20 xl:block"
          style={{ animationDelay: "2s" }}
        />
        <Eyebrow>Common questions</Eyebrow>
        <h2 id="faq" className="text-4xl font-extrabold tracking-[-0.04em]">
          Questions people ask
        </h2>

        <div className="mt-10 max-w-3xl space-y-3">
          {FAQS.map((faq) => (
            <details
              key={faq.question}
              className="taped group relative rounded-xl border-2 border-ink bg-canvas shadow-offset-sm transition-all duration-[180ms] ease-spring open:shadow-offset-md hover:-translate-x-px hover:-translate-y-px"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-md font-extrabold tracking-[-0.015em] [&::-webkit-details-marker]:hidden">
                {faq.question}
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-[1.5px] border-ink bg-surface">
                  <Plus className="h-3 w-3 group-open:hidden" aria-hidden="true" />
                  <Minus className="hidden h-3 w-3 group-open:block" aria-hidden="true" />
                </span>
              </summary>
              <p className="border-t border-line-subtle px-5 py-4 text-sm leading-relaxed text-ink-2">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </Section>

      {/* Closing. Compact and on the light canvas: a full-bleed saturated slab
          this close to the black footer was two loud beats in a row, and it
          drowned the copy it was meant to carry. Lime is the accent now, not
          the field. */}
      <Section labelledBy="cta">
        <div className="mx-auto max-w-4xl rounded-3xl border-2 border-ink bg-surface p-8 shadow-offset-xl lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="min-w-0 flex-1">
              <span className="inline-block -rotate-[3deg] rounded-lg border-2 border-ink bg-lime px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] shadow-offset-xs">
                Free to join
              </span>
              <h2
                id="cta"
                className="mt-4 max-w-md text-3xl font-extrabold leading-[1.1] tracking-[-0.04em]"
              >
                Good at something? Come and get paid for it.
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-2">
                Signing up takes a couple of minutes, and you can look around properly
                before you decide to verify.
              </p>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5">
              <Button asChild size="lg">
                <Link to="/sign-up">
                  Create your account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/contact">Talk to us first</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

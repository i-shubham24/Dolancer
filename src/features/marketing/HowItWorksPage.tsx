import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/brutal/Card";
import { STEPS } from "./content";
import { WorkflowDemo } from "./WorkflowDemo";
import { PayoutExplainer } from "./PayoutExplainer";
import { DifferenceRail } from "./DifferenceRail";
import { CategoryTags } from "./CategoryTags";

const ACCENTS = ["bg-coral", "bg-blue", "bg-lime", "bg-purple"] as const;
const ACCENT_TEXT = ["text-ink", "text-inverse", "text-ink", "text-inverse"] as const;

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
      <div className="mx-auto w-full max-w-[1320px] px-4 py-16 lg:px-6 lg:py-20">{children}</div>
    </section>
  );
}

export function HowItWorksPage() {
  return (
    <>
      <section className="border-b-2 border-ink">
        <div className="mx-auto w-full max-w-[1320px] px-4 py-16 lg:px-6 lg:py-20">
          <h1 className="max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-[-0.045em]">
            The whole thing,
            <br />
            <span className="bg-blue px-2 text-inverse">start to paid.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-ink-2">
            No part of this is hidden until after you sign up. Read it all, then decide.
          </p>
        </div>
      </section>

      <Section labelledBy="steps">
        <h2 id="steps" className="text-4xl font-extrabold tracking-[-0.04em]">
          Getting started
        </h2>
        <ol className="scattered mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title}>
              <Card className="h-full">
                <span
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border-2 border-ink text-lg font-extrabold shadow-offset-sm ${ACCENTS[index % ACCENTS.length]} ${ACCENT_TEXT[index % ACCENT_TEXT.length]}`}
                >
                  {index + 1}
                </span>
                <h3 className="mt-4 text-lg font-extrabold tracking-[-0.025em]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-2">{step.body}</p>
              </Card>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="walkthrough" className="border-y-2 border-ink bg-surface">
        <WorkflowDemo />
      </Section>

      <Section labelledBy="payout" className="border-y-2 border-ink bg-lime-light">
        <PayoutExplainer />
      </Section>

      <Section labelledBy="differences" className="border-y-2 border-ink bg-blue">
        <DifferenceRail />
      </Section>

      <Section labelledBy="disciplines" className="border-b-2 border-ink bg-surface">
        <h2 id="disciplines" className="text-4xl font-extrabold tracking-[-0.04em]">
          What gets briefed here
        </h2>
        <p className="mt-3 max-w-xl text-md text-ink-2">
          Pick the disciplines you are genuinely strong in. Only work matching them reaches
          your board, so accuracy matters more than breadth.
        </p>
        <div className="mt-10">
          <CategoryTags />
        </div>
      </Section>

      <Section labelledBy="cta">
        <div className="mx-auto max-w-4xl rounded-3xl border-2 border-ink bg-surface p-8 shadow-offset-xl lg:p-10">
          <div className="flex flex-wrap items-center justify-between gap-8">
            <div className="min-w-0 flex-1">
              <span className="inline-block -rotate-[3deg] rounded-lg border-2 border-ink bg-lime px-3 py-1 text-2xs font-extrabold uppercase tracking-[0.08em] shadow-offset-xs">
                That is all of it
              </span>
              <h2
                id="cta"
                className="mt-4 max-w-md text-3xl font-extrabold leading-[1.1] tracking-[-0.04em]"
              >
                Ready when you are.
              </h2>
            </div>

            <div className="flex shrink-0 flex-col gap-2.5">
              <Button asChild size="lg">
                <Link to="/sign-up">
                  Create your account
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link to="/contact">Ask a question first</Link>
              </Button>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}

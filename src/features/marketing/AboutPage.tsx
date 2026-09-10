import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CONTACT } from "./content";

/**
 * About.
 *
 * States what the company is, who runs it, and how the arrangement works, with no
 * invented figures: no user counts, no funding claims, no founding story we cannot
 * evidence. A page whose job is establishing trust cannot afford a single number
 * someone could check and find wrong.
 */
export function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-[1320px] px-4 py-16 lg:px-6 lg:py-24">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-extrabold leading-[1.05] tracking-[-0.045em]">
          We think skilled work
          <br />
          should be{" "}
          <span className="inline-block -rotate-[2deg] rounded-xl border-2 border-ink bg-coral px-3 pb-1 shadow-offset-md">
            simpler than this.
          </span>
        </h1>

        <div className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
          <p>
            Most freelance platforms put the entire burden on the person doing the work. You
            find the client, you pitch, you price yourself against strangers, you manage the
            relationship, you absorb the revisions, and then you chase the invoice. The
            platform takes a cut for introducing you and steps back.
          </p>
          <p>
            We run it the other way around. We find the client, scope the work properly, and
            agree a price before anyone starts. A supervisor briefs you, reviews what you
            produce, and handles the client entirely. You do the part you are actually good
            at, and you get paid for it.
          </p>
          <p>
            That means we carry things you would otherwise carry alone: the cost of winning
            work, the disputes, the refunds, the awkward conversations. It is why we keep a
            share of what a client pays, and why we would rather tell you that plainly than
            let you discover it later.
          </p>
        </div>
      </div>

      <div className="mt-16 grid gap-5 md:grid-cols-3">
        {[
          {
            title: "You stay anonymous",
            body: "Clients never learn your name, where you are, what you are paid, or that you work through us. They see a discipline and nothing else. This protects you as much as it protects them.",
            fill: "bg-blue",
            tilt: "-rotate-[0.8deg]",
          },
          {
            title: "You are not an employee",
            body: "You choose what to claim and when to stop. Nothing is assigned to you against your will, and pausing is a switch you control.",
            fill: "bg-lime",
            tilt: "rotate-[0.6deg]",
          },
          {
            title: "You are always paid",
            body: "If work you delivered was sound and the client changed their mind, that is our problem to absorb, not yours. If we ever part ways, anything you have earned is still paid out.",
            fill: "bg-coral",
            tilt: "-rotate-[0.4deg]",
          },
        ].map((card) => (
          <div
            key={card.title}
            className={`${card.fill} ${card.tilt} rounded-2xl border-2 border-ink p-6 shadow-offset-md transition-all duration-[220ms] ease-spring hover:rotate-0 hover:-translate-y-1.5 hover:shadow-offset-lg`}
          >
            <h2 className="text-xl font-extrabold leading-tight tracking-[-0.03em]">
              {card.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink/80">{card.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border-2 border-ink bg-ink p-8 text-inverse shadow-offset-lg">
        <h2 className="text-2xl font-extrabold tracking-[-0.03em]">Who runs this</h2>
        <p className="mt-3 max-w-2xl text-md leading-relaxed text-white/65">
          Dolancer is operated by {CONTACT.company}, registered in {CONTACT.jurisdiction}. We
          also run a client-facing brand, which is how work reaches this side of the platform.
          We do not hide that connection, and you are free to ask about it.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link to="/sign-up">
              Start earning
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/contact">Ask us something</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

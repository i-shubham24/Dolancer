/**
 * Public site content.
 *
 * Everything a visitor reads before signing up lives here, so copy can be changed
 * without touching layout.
 *
 * One hard rule governs this file: **nothing here may be invented.** No made-up
 * statistics, no fabricated testimonials, no ratings we did not receive, no logos of
 * companies that are not customers. The product's entire pitch is that a doer will
 * reliably be paid by people who do not lie to them, and a fake review on the page
 * making that promise is the one falsehood that would undo it. It is also an
 * explicit platform rule, not merely good taste.
 */

export interface Category {
  name: string;
  blurb: string;
}

/** The disciplines work is briefed under. These map to the platform's own labels. */
export const CATEGORIES: Category[] = [
  { name: "Writing and content", blurb: "Articles, documentation, scripts, editing." },
  { name: "Design", blurb: "Brand, product, print, presentation." },
  { name: "Creative and media", blurb: "Video, audio, motion, illustration." },
  { name: "IT and software", blurb: "Web, mobile, data, infrastructure." },
  { name: "AI agents and automations", blurb: "Workflows, integrations, agent builds." },
  { name: "Marketing", blurb: "Campaigns, copy, social, performance." },
  { name: "Research and business", blurb: "Analysis, decks, market and competitor work." },
  { name: "Something else", blurb: "If it is skilled work, brief it and we will match it." },
];

export interface Step {
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    title: "Join in minutes",
    body: "Your name, your email, and a code we send you. You land in a working dashboard straight away, with nothing blocking you.",
  },
  {
    title: "Get verified",
    body: "An ID and where you want to be paid. A supervisor confirms it. This is what unlocks earning, and you keep full access while it happens.",
  },
  {
    title: "Work comes to you",
    body: "Projects matched to the skills you picked show up on your board with the pay already set. Claim what suits you. No bidding, no proposals.",
  },
  {
    title: "Deliver and get paid",
    body: "You work with a supervisor who reviews it before it goes out. Once it is approved, your payout is released.",
  },
];

export interface Difference {
  title: string;
  body: string;
}

export const DIFFERENCES: Difference[] = [
  {
    title: "No bidding wars",
    body: "You never undercut anyone to win work, and nobody undercuts you. The rate is set before the job reaches your board.",
  },
  {
    title: "The pay is agreed upfront",
    body: "Every brief shows exactly what you earn before you claim it. No estimates, no scope arguments halfway through.",
  },
  {
    title: "A supervisor has your back",
    body: "Someone experienced reviews your work before a client sees it, and handles the client conversation so you do not have to.",
  },
  {
    title: "You work your own hours",
    body: "Take up to three projects at a time, or pause and take none. Your availability is yours to set.",
  },
  {
    title: "No chasing invoices",
    body: "You are not billing anyone. Once work is approved, the payout is released to the account you registered.",
  },
  {
    title: "Your share grows",
    body: "Consistent, well-rated work moves you up, and higher levels see new work sooner.",
  },
];

export interface Faq {
  question: string;
  answer: string;
}

export const FAQS: Faq[] = [
  {
    question: "When do I get paid?",
    answer:
      "After the work you delivered is approved. Your supervisor reviews it first, then it goes to the client for approval, and the payout is released to the account you registered during verification.",
  },
  {
    question: "How much does a project pay?",
    answer:
      "It depends on the brief, and it is always shown in full before you claim anything. There is no rate card, because the pay reflects the specific piece of work rather than a category average.",
  },
  {
    question: "What about tax?",
    answer:
      "Tax is withheld when a payout is released, calculated across your earnings for the financial year rather than per project. Your earnings page shows the gross, what was withheld, and what you received, as three separate figures.",
  },
  {
    question: "How much work will I get?",
    answer:
      "That depends on the skills you pick and how much work is coming in for them. Only projects matching your skills reach you, so picking accurately matters more than picking broadly.",
  },
  {
    question: "Can I work on several projects at once?",
    answer:
      "Up to three at a time. When you are holding three, the board is hidden until you finish one. This is not a penalty and does not affect your standing.",
  },
  {
    question: "Do I talk to the client?",
    answer:
      "No. You work with a supervisor, who is your only point of contact and handles everything on the client side. You will not know who the client is, and they will not know who you are.",
  },
  {
    question: "What do you need to verify me?",
    answer:
      "A government photo ID, a photo of your face so we can match it, and where you want to be paid. Documents are stored under a random reference, never your name, and are deleted once your identity is confirmed.",
  },
  {
    question: "What happens if my work needs changes?",
    answer:
      "Your supervisor tells you what to fix and you revise it. Revisions within the brief you accepted are part of the work. If something is genuinely outside the brief, raise it with your supervisor.",
  },
];

/**
 * Real quotes only, from real doers who gave permission.
 *
 * This array is deliberately empty, and the section does not render while it is.
 * Do not populate it with invented, illustrative, or placeholder testimonials, and
 * do not add names or photos of people who did not agree to appear here.
 */
export interface Testimonial {
  quote: string;
  name: string;
  discipline: string;
}

export const TESTIMONIALS: Testimonial[] = [];

export const CONTACT = {
  /** Replace with the real support address before launch. */
  email: "support@dolancer.in",
  /** Replace with the real grievance officer address before launch. */
  grievanceEmail: "grievance@assignexperts.in",
  hours: "24 hours a day, 7 days a week",
  company: "Assign Experts Private Limited",
  jurisdiction: "Punjab, India",
} as const;

/**
 * Public site content.
 *
 * The visual system is expressive, but the product language stays precise. Public
 * copy describes a managed, supervisor-routed service rather than an open market.
 */

export interface Category {
  name: string;
  blurb: string;
}

export const CATEGORIES: Category[] = [
  { name: "Writing & Content", blurb: "Articles, editing, technical writing, product content and copy." },
  { name: "Design", blurb: "Brand identity, UI and UX, presentations, illustration and print." },
  { name: "Creative & Media", blurb: "Video, motion, audio, photo retouching and social assets." },
  { name: "IT & Software", blurb: "Web development, apps, scripts, APIs, QA and integrations." },
  { name: "AI Agents & Automations", blurb: "Workflow automation, integrations, data processing and AI pipelines." },
  { name: "Marketing", blurb: "SEO, paid media, social, email and content strategy." },
  { name: "Research & Business", blurb: "Market research, competitor analysis, business plans and data work." },
  { name: "Something Else", blurb: "Tell us what you need. A coordinator will categorise it internally." },
];

export interface Step {
  title: string;
  body: string;
}

export const STEPS: Step[] = [
  {
    title: "Create your account",
    body: "Use passwordless email access, confirm that you are 18 or older, and tell us which disciplines you can genuinely deliver.",
  },
  {
    title: "Complete verification",
    body: "Share the identity and payout details required for safe payments. Verification can be reviewed while you explore your account, but it must be complete before payout.",
  },
  {
    title: "Receive an assigned offer",
    body: "A supervisor sends you a specific project with its scope, deadline, workspace and agreed doer payout. There is no public task pool, bidding or proposal race.",
  },
  {
    title: "Deliver through review",
    body: "Work in the company workspace, speak with your supervisor, submit for quality review, and receive payout only after the approval gate clears.",
  },
];

export interface Difference {
  title: string;
  body: string;
}

export const DIFFERENCES: Difference[] = [
  {
    title: "No bidding wars",
    body: "You never undercut anyone to win work. A supervisor routes a specific project to you when it fits your verified disciplines.",
  },
  {
    title: "The pay is agreed upfront",
    body: "Every assigned offer shows exactly what you earn before you accept it. There are no surprise discounts or mid-project negotiations.",
  },
  {
    title: "A supervisor has your back",
    body: "A supervisor reviews your work before delivery and handles the client conversation. You do not need to chase or identify the client.",
  },
  {
    title: "You choose what to accept",
    body: "You can accept or decline an offer. When you accept, you commit to the stated scope and deadline and work within the active-project limit.",
  },
  {
    title: "No chasing invoices",
    body: "You are not billing a client. When the project clears its approval gate, the payout is released to the account you registered.",
  },
  {
    title: "Your share grows",
    body: "Consistent, well-rated work can move you through the platform levels and unlock stronger opportunities over time.",
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
      "After your supervisor has cleared the delivery and the client approval gate is satisfied. If a client does not respond, the approved timeout process may release the payout later. Your earnings page shows the gross, withholding and net as separate figures.",
  },
  {
    question: "How much does a project pay?",
    answer:
      "Each assigned offer states the doer payout before you accept it. There is no public rate card because the payout reflects the specific scope, deadline and level rules for that project.",
  },
  {
    question: "What about tax?",
    answer:
      "Where required by law, tax is withheld when a payout is released. Your earnings record shows the amount used for the payout calculation and the relevant withholding information.",
  },
  {
    question: "How do projects reach me?",
    answer:
      "A supervisor manually routes specific projects to vetted doers whose verified disciplines fit the brief. There is no public work pool, bidding, proposal process or client search.",
  },
  {
    question: "Can I work on several projects at once?",
    answer:
      "The platform limits active projects so that delivery quality stays manageable. The current limit is shown in your dashboard and may prevent new offers while your slots are full.",
  },
  {
    question: "Do I talk to the client?",
    answer:
      "No. You work with a supervisor, who is your point of contact. The client sees only a discipline label and does not receive your name or personal details.",
  },
  {
    question: "What do you need to verify me?",
    answer:
      "Verification may require a PAN, a government photo identity document and payout details. The exact fields and retention rules are explained in the Privacy Policy before submission.",
  },
  {
    question: "What work is not allowed?",
    answer:
      "Dolancer does not accept coursework, essays, dissertations, exams, graded assignments, impersonation, plagiarism, fabrication, unauthorised cyber security work or other unlawful requests. Ask support if a brief is unclear.",
  },
  {
    question: "What happens if my work needs changes?",
    answer:
      "Your supervisor explains what needs changing and you revise within the accepted brief. Work outside the original scope must be raised with the supervisor before you continue.",
  },
];

/** Existing proof sections are intentionally left unchanged until the evidence review. */
export interface Testimonial {
  quote: string;
  name: string;
  discipline: string;
}

export const TESTIMONIALS: Testimonial[] = [];

export const CONTACT = {
  email: "support@dolancer.in",
  grievanceEmail: "grievance@assignexperts.in",
  hours: "24 hours a day, 7 days a week",
  company: "Assign Experts Private Limited",
  jurisdiction: "Punjab, India",
} as const;

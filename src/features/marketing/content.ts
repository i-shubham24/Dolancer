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
  { name: "Something Else", blurb: "Other kinds of work come up too. Your supervisor will tell you where it fits." },
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
    title: "No bidding",
    body: "You never lower your price to win work. A supervisor sends you a project when it fits your skills.",
  },
  {
    title: "Pay is fixed first",
    body: "Every offer shows what you will earn before you accept. No surprise cuts. No bargaining halfway.",
  },
  {
    title: "A supervisor has your back",
    body: "A supervisor checks your work before it goes out and talks to the client for you. You never have to chase the client.",
  },
  {
    title: "You choose what to accept",
    body: "You can say yes or no to any offer. When you say yes, you agree to the work and the deadline shown. There is a limit on how many projects you can hold at once.",
  },
  {
    title: "No invoices to chase",
    body: "You do not bill anyone. When the project is approved, your pay is sent to the account you registered.",
  },
  {
    title: "Your share grows",
    body: "Good, steady work moves you up the levels. Higher levels can get better offers.",
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
      "After your supervisor has checked the work and the client has approved it. If the client does not reply, a set waiting period ends and the pay can still be released. Your earnings page lists every payout with its receipt.",
  },
  {
    question: "How much does a project pay?",
    answer:
      "Each offer shows your pay before you accept. There is no fixed rate list, because pay depends on the work, the deadline and your level.",
  },
  {
    question: "How does the money reach me?",
    answer:
      "By UPI or bank transfer (NEFT) to the account you registered. Each payout comes with a receipt you can check.",
  },
  {
    question: "How do projects reach me?",
    answer:
      "A supervisor picks doers whose skills fit the project and sends them the offer. There is no public job list, no bidding and no searching for clients.",
  },
  {
    question: "Can I work on several projects at once?",
    answer:
      "Yes, up to a limit, so quality stays good. Your dashboard shows the limit. When your slots are full, you cannot take a new offer until one finishes.",
  },
  {
    question: "Do I talk to the client?",
    answer:
      "No. You talk to your supervisor. The client only sees the kind of work, not your name or details.",
  },
  {
    question: "What do you need to verify me?",
    answer:
      "A government photo ID, a photo of you and your payout details. A PAN may be needed for tax. The Privacy Policy explains what we collect and how long we keep it.",
  },
  {
    question: "What work is not allowed?",
    answer:
      "We do not take coursework, essays, dissertations, exams or graded assignments. We also do not take impersonation, copied work, made-up data, hacking without permission or anything illegal. Ask support if a brief looks wrong.",
  },
  {
    question: "What happens if my work needs changes?",
    answer:
      "Your supervisor tells you what to change, and you fix it within the agreed work. Anything extra must be agreed with your supervisor first.",
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
  grievanceEmail: "grievance@dolancer.in",
  hours: "24 hours a day, 7 days a week",
  company: "Dolancer",
  jurisdiction: "India",
} as const;

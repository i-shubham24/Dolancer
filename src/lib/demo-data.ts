import type { ChatAttachment, ChatMessage } from "@/features/chat/api";
import type { LedgerRow } from "@/features/earnings/api";
import type { Payout, PayoutMethod } from "@/features/payouts/api";
import type { SkillOption } from "@/features/skills/api";
import type { Ticket, TicketMessage } from "@/features/tickets/api";
import type { LessonDetail, LessonQuestion } from "@/features/training/api";
import type {
  DoerApplicationRow,
  KycStatus,
  NotificationRow,
  ProfileRow,
} from "@/types/database";
import type { DoerGateState, DoerProject, EarningsSummary, PoolOffer } from "@/types/domain";
import { DEMO_USER_ID } from "./demo-auth";
import { SKILL_AREAS, skillId } from "@/features/skills/catalog";

/**
 * Demo mode: the whole app on in-memory sample data, with no backend.
 *
 * When VITE_DEMO_MODE is "true", every feature api checks isDemo() and reads or
 * writes the state in this file instead of calling Supabase. Writes last for the
 * rest of the visit, so claiming a task, starting it, adding a link and submitting
 * it all play out on screen. A reload starts again from the seed. The real Supabase
 * paths are untouched and take over as soon as the flag is off.
 *
 * Everyone and everything here is fictional.
 */

// Sign-in and the demo flag live in demo-auth, so the first page a visitor loads
// does not carry the whole seed below. Re-exported here for the feature apis.
export { DEMO_USER_ID, demoAuth, isDemo } from "./demo-auth";

/* ------------------------------------------------------------------ */
/*  Plumbing                                                           */
/* ------------------------------------------------------------------ */

const LATENCY_MS = 250;

/**
 * Answer the way the network would: after a short pause, and with a copy.
 *
 * The pause lets loading and saving states show. The copy is what makes updates
 * visible at all. TanStack Query compares each result with the one before it, so
 * handing out the live objects and later changing them in place would make every
 * refetch look like nothing had happened.
 */
export async function demoRespond<T>(produce: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, LATENCY_MS));
  return structuredClone(produce());
}

let lastId = 0;

/** A unique id for anything created during the visit. */
export function demoId(prefix: string): string {
  lastId += 1;
  return `${prefix}-${Date.now().toString(36)}-${lastId}`;
}

/** Every project has exactly one supervisor thread. In the demo its id is derived. */
export function demoThreadId(projectId: string): string {
  return `thread-${projectId}`;
}

const DAY_MS = 86_400_000;
const seededAt = Date.now();
const daysAgo = (days: number) => new Date(seededAt - days * DAY_MS).toISOString();
const daysFromNow = (days: number) => new Date(seededAt + days * DAY_MS).toISOString();

const SUPERVISOR_ID = "a93e7d15-2c64-4f8b-b1d0-6e5f3a9c2d71";

/* ------------------------------------------------------------------ */
/*  Seed                                                               */
/* ------------------------------------------------------------------ */

function makeProject(
  fields: Omit<
    DoerProject,
    "supervisorId" | "qcBounceCount" | "lastBounceReason" | "revisionReason" | "revisionCount"
  >,
): DoerProject {
  return {
    supervisorId: SUPERVISOR_ID,
    qcBounceCount: 0,
    lastBounceReason: null,
    revisionReason: null,
    revisionCount: 0,
    ...fields,
  };
}

const BLOG_SERIES_ID = "3f8a2c71-9d4e-4b6a-8c15-7e2d9f0a4b36";
const LAUNCH_CALENDAR_ID = "c2d94e17-5a3b-4f80-b6e2-91d7a4c3f58e";
const FINTECH_ARTICLES_ID = "e71b3a09-4c2d-4e8f-a5b6-3d9c0f2e7a14";

/** Two of the three slots in use, so there is room to claim one more from the board. */
const activeProjects: DoerProject[] = [
  makeProject({
    id: BLOG_SERIES_ID,
    category: "Writing & Content",
    status: "in_progress",
    brief:
      "Eight blog posts on cloud cost optimisation\n\n" +
      "Posts of 1,200 to 1,500 words for engineering leads at mid-sized companies. Use H2 and H3 headings, a meta description under 155 characters, and two internal link suggestions per post.\n\n" +
      "Readers already know the basics, so skip the introductions and lead with practical steps. The keyword list and style guide are pinned in the chat.",
    payoutPaise: 850_000,
    workingDocUrl: "https://docs.google.com/document/d/demo-cloud-cost-series",
    progressPct: 60,
    createdAt: daysAgo(5),
    updatedAt: daysAgo(1.1),
    deliveryAt: daysFromNow(3),
  }),
  makeProject({
    id: LAUNCH_CALENDAR_ID,
    category: "Marketing",
    status: "in_review",
    brief:
      "30-day launch calendar for a B2B software product\n\n" +
      "A month of posts across LinkedIn, X and Instagram for a product launch. Each post needs a caption, a note on the visual, and a suggested posting time.\n\n" +
      "Keep LinkedIn captions under 150 words and include five reusable hashtag sets.",
    payoutPaise: 450_000,
    workingDocUrl: "https://docs.google.com/spreadsheets/d/demo-launch-calendar",
    progressPct: 100,
    createdAt: daysAgo(8),
    updatedAt: daysAgo(0.6),
    deliveryAt: daysFromNow(1),
  }),
];

/** Approved work. Each project has a matching payout in the ledger. */
const closedProjects: DoerProject[] = [
  makeProject({
    id: FINTECH_ARTICLES_ID,
    category: "Writing & Content",
    status: "approved",
    brief:
      "Five thought leadership articles on fintech\n\n" +
      "Articles of about 1,000 words each on digital payments, lending and personal finance apps, written for a company blog.",
    payoutPaise: 600_000,
    workingDocUrl: "https://docs.google.com/document/d/demo-fintech-articles",
    progressPct: 100,
    createdAt: daysAgo(34),
    updatedAt: daysAgo(20),
    deliveryAt: daysAgo(22),
  }),
  makeProject({
    id: "8d4c6f2a-1b7e-4a93-9c05-e6b2d8a1f437",
    category: "Marketing",
    status: "approved",
    brief:
      "On-page SEO for 15 product pages\n\n" +
      "Keyword mapping, rewritten titles and meta descriptions, and header structure fixes for an online furniture store.",
    payoutPaise: 900_000,
    workingDocUrl: "https://docs.google.com/spreadsheets/d/demo-product-seo",
    progressPct: 100,
    createdAt: daysAgo(48),
    updatedAt: daysAgo(35),
    deliveryAt: daysAgo(37),
  }),
  makeProject({
    id: "b5e0a8c3-7f19-4d6b-8e24-0a3c9f5d1b62",
    category: "Writing & Content",
    status: "approved",
    brief:
      "Four customer case studies for an EdTech platform\n\n" +
      "Interview notes are provided. Each case study runs to about 1,200 words with a pull quote and a results summary.",
    payoutPaise: 750_000,
    workingDocUrl: "https://docs.google.com/document/d/demo-edtech-case-studies",
    progressPct: 100,
    createdAt: daysAgo(62),
    updatedAt: daysAgo(50),
    deliveryAt: daysAgo(52),
  }),
  makeProject({
    id: "4a9f1e6d-3c28-4b7a-a0d5-8f6e2c1b9a73",
    category: "Marketing",
    status: "approved",
    brief:
      "Quarterly social content for a skincare brand\n\n" +
      "Ninety Instagram and Facebook captions across three product lines, with a monthly theme for each.",
    payoutPaise: 1_200_000,
    workingDocUrl: "https://docs.google.com/spreadsheets/d/demo-skincare-social",
    progressPct: 100,
    createdAt: daysAgo(78),
    updatedAt: daysAgo(65),
    deliveryAt: daysAgo(67),
  }),
  makeProject({
    id: "f2c7b9e4-6d31-4a58-b8f0-5e1a3d7c0b29",
    category: "Marketing",
    status: "approved",
    brief:
      "SEO content hub of 12 articles\n\n" +
      "Two pillar pages and ten supporting articles on home loans, linked to each other, with a keyword brief for each.",
    payoutPaise: 1_400_000,
    workingDocUrl: "https://docs.google.com/document/d/demo-home-loans-hub",
    progressPct: 100,
    createdAt: daysAgo(95),
    updatedAt: daysAgo(80),
    deliveryAt: daysAgo(82),
  }),
];

/** One payout per approved project, released on the day it was approved. */
const ledger: LedgerRow[] = closedProjects.map((project) => ({
  id: `payout-${project.id}`,
  projectId: project.id,
  amountPaise: project.payoutPaise,
  createdAt: project.updatedAt,
}));

/**
 * Where the demo doer's pay goes: UPI first, the bank account from verification as
 * the backup.
 */
const payoutMethods: PayoutMethod[] = [
  { id: "method-upi", kind: "upi", label: "shubham@okhdfcbank", last4: null, holderName: "SHUBHAM", primary: true, activeFrom: null },
  { id: "method-bank", kind: "bank", label: "HDFC Bank", last4: "4521", holderName: "SHUBHAM", primary: false, activeFrom: null },
];

/**
 * One payout per released ledger row. The newest was approved a few minutes ago and
 * is still on its way, so the tracker has something to show; one older UPI payout
 * failed and went to the bank instead.
 */
const payouts: Payout[] = [...ledger]
  .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  .map((row, index) => {
    if (index === 0) {
      const now = new Date(seededAt - 3 * 60_000).toISOString();
      row.createdAt = now;
      const project = closedProjects.find((item) => item.id === row.projectId);
      if (project) project.updatedAt = now;
    }
    const upi = index % 2 === 0;
    const status: Payout["status"] = index === 0 ? "sending" : index === 3 ? "rerouted" : "paid";
    const toBank = status === "rerouted" || !upi;
    // Spread across the day, so the rows do not all show the same time.
    const settledAt = status === "sending" ? null : new Date(new Date(row.createdAt).getTime() + (4 + index * 137) * 60_000).toISOString();
    return {
      id: row.id,
      projectId: row.projectId,
      amountPaise: row.amountPaise,
      status,
      methodKind: toBank ? "bank" : "upi",
      methodName: toBank ? "HDFC Bank ••4521" : "shubham@okhdfcbank",
      utr: status === "sending" ? null : String(428715903362 - index * 1_904_431_117),
      approvedAt: row.createdAt,
      settledAt,
    };
  });

const grossPaise = ledger.reduce((sum, row) => sum + row.amountPaise, 0);
// A flat tenth stands in for TDS, which is really worked out across the financial
// year. What matters on screen is that gross, withheld and net reconcile.
const taxWithheldPaise = Math.round(grossPaise / 10);

/**
 * Open work on the board. The Copywriting brief stays hidden until a Copywriting
 * skill is picked, which is how the real board matches work to skills.
 */
const BUYERS_GUIDE_ID = "9e3d5b18-2f6a-4c7e-b9a1-4d8c0e6f2a53";
const EMAIL_SEQUENCE_ID = "0e5c9a2b-4d86-4f13-b7e0-9a1d6c3f8e47";
const SEO_PAGES_ID = "1c6a8e40-7b3d-4f29-a6e5-0d2f9b4c7e81";

const pool: PoolOffer[] = [
  {
    id: BUYERS_GUIDE_ID,
    category: "Writing & Content",
    status: "paid",
    payoutPaise: 1_200_000,
    deliveryAt: daysFromNow(7),
    createdAt: daysAgo(0.1),
    brief:
      "Buyer's guide to project management tools for remote teams\n\n" +
      "A 3,000-word guide comparing five tools on pricing, integrations and fit for teams of 10 to 50 people. Include a summary table and a short verdict for each tool. Research notes are provided.",
  },
  {
    id: EMAIL_SEQUENCE_ID,
    category: "Writing & Content",
    status: "paid",
    payoutPaise: 650_000,
    deliveryAt: daysFromNow(5),
    createdAt: daysAgo(0.4),
    brief:
      "Welcome email sequence for a fitness app\n\n" +
      "Five emails that take a new subscriber from sign-up to their first workout, with subject lines, preview text, and an A/B variant of the first email.",
  },
  {
    id: SEO_PAGES_ID,
    category: "Marketing",
    status: "paid",
    payoutPaise: 750_000,
    deliveryAt: daysFromNow(5),
    createdAt: daysAgo(0.6),
    brief:
      "On-page SEO pass for 20 landing pages\n\n" +
      "Keyword mapping, rewritten titles and meta descriptions, and an internal linking plan, delivered in a single sheet. The search console export is shared once you accept.",
  },
  {
    id: "6b2f4d97-8e1c-4a05-9d3b-7c5e1a8f0b24",
    category: "Marketing",
    status: "paid",
    payoutPaise: 350_000,
    deliveryAt: daysFromNow(4),
    createdAt: daysAgo(1.2),
    brief:
      "Copy for 15 Instagram carousels\n\n" +
      "Slide copy for 15 carousels of six to eight slides each, for a wellness brand's product launch. Brand voice notes and visual direction are provided. Design is not part of this task.",
  },
  {
    id: "d8a1c5e3-0f47-4b92-8a6d-2e9b7f3c1d05",
    category: "Writing & Content",
    status: "paid",
    payoutPaise: 500_000,
    deliveryAt: daysFromNow(6),
    createdAt: daysAgo(2),
    brief:
      "Six-issue newsletter on personal finance\n\n" +
      "Issues of 800 to 1,000 words for first-time investors. Plain language, one practical takeaway per issue, and a suggested subject line for each.",
  },
];

const supervisorSays = (id: string, body: string, createdAt: string, offerId?: string): ChatMessage => ({
  id,
  authorId: SUPERVISOR_ID,
  body,
  createdAt,
  offerId: offerId ?? null,
});

const doerSays = (id: string, body: string, createdAt: string): ChatMessage => ({
  id,
  authorId: DEMO_USER_ID,
  body,
  createdAt,
});

/** Picked at the start, so the board has work to show. */
const SEEDED_PICKS = new Set(["Blog writing", "Content writing", "SEO writing", "Social media copy"]);

function seedSkills(): SkillOption[] {
  return SKILL_AREAS.flatMap((area) =>
    area.skills.map((name) => ({ id: skillId(name), name, category: area.name, selected: SEEDED_PICKS.has(name) })),
  );
}

/** A free skill course: a short read and a two-question check. */
function skillCourse(
  id: string,
  title: string,
  category: string,
  moduleOrder: number,
  completed: boolean,
  body: string,
  quiz: [prompt: string, options: string[], answer: number][],
): DemoLesson {
  return {
    id,
    title,
    category,
    moduleOrder,
    completed,
    body,
    questions: quiz.map(([prompt, options], index) => ({
      id: `${id}-q${index + 1}`,
      prompt,
      options,
      sortOrder: index + 1,
    })),
    answerKey: quiz.map(([, , answer]) => answer),
  };
}

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

interface DemoLesson extends LessonDetail {
  questions: LessonQuestion[];
  /** The 1-based correct option for each question, in order. Only grading reads it. */
  answerKey: number[];
}

/** Someone who joined with the doer's link, and how far along they are. */
export interface ReferralInvitee {
  id: string;
  name: string | null;
  createdAt: string;
  stage: "joined" | "verified" | "earned";
}

interface DemoInvite {
  threadId: string;
  offerId: string;
  title: string;
  category: string;
  createdAt: string;
}

interface DemoState {
  profile: ProfileRow;
  projects: DoerProject[];
  pool: PoolOffer[];
  earnings: EarningsSummary;
  ledger: LedgerRow[];
  payoutMethods: PayoutMethod[];
  payouts: Payout[];
  skills: SkillOption[];
  lessons: DemoLesson[];
  kyc: KycStatus;
  rating: { average: number | null; count: number; level: string };
  application: DoerApplicationRow | null;
  referrals: { code: string; invited: ReferralInvitee[] };
  /** Supervisors reaching out about new work, before anything is accepted. */
  invites: DemoInvite[];
  notifications: NotificationRow[];
  /** Keyed by thread id. */
  messages: Record<string, ChatMessage[]>;
  /** Keyed by thread id. */
  attachments: Record<string, ChatAttachment[]>;
  tickets: Ticket[];
  /** Keyed by ticket id. */
  ticketMessages: Record<string, TicketMessage[]>;
}

export const demo: DemoState = {
  profile: {
    full_name: "Shubham",
    whatsapp: "+91 98765 43210",
    country: "IN",
    available: true,
  },

  projects: [...activeProjects, ...closedProjects],
  pool,

  earnings: { grossPaise, taxWithheldPaise, netPaise: grossPaise - taxWithheldPaise },
  ledger,
  payoutMethods,
  payouts,

  skills: seedSkills(),

  lessons: [
    {
      id: "lesson-1",
      category: null,
      title: "How work reaches you",
      moduleOrder: 1,
      completed: true,
      body:
        "Every project is scoped by a supervisor before it reaches you. They turn the request into a clear brief, set the deadline and fix your payout, so anything assigned to you is ready to work on.\n\n" +
        "You will only receive offers in categories you have picked on the Skills page, and only while you are set to Available. If you are not receiving offers, check those two things first.\n\n" +
        "An offer is yours the moment you accept it. Read the brief and the deadline before you commit, because each accepted offer uses one of your three slots.",
      questions: [
        {
          id: "lesson-1-q1",
          prompt: "Who writes the brief and fixes your payout before a project reaches the board?",
          options: ["The client", "Your supervisor", "Another doer", "It is set automatically"],
          sortOrder: 1,
        },
        {
          id: "lesson-1-q2",
          prompt: "Your board looks empty. What should you check first?",
          options: [
            "That you have skills picked and are set to Available",
            "That it is a weekday",
            "That your rating is above 4.5",
            "That you have refreshed recently",
          ],
          sortOrder: 2,
        },
        {
          id: "lesson-1-q3",
          prompt: "How many projects can you hold at once?",
          options: ["One", "Two", "Three", "As many as you like"],
          sortOrder: 3,
        },
      ],
      answerKey: [2, 1, 3],
    },
    {
      id: "lesson-2",
      category: null,
      title: "Quality standards and delivery",
      moduleOrder: 2,
      completed: true,
      body:
        "Your working link is where the work lives. Add it as soon as you start: progress updates and submission stay locked until it is in, and your supervisor uses it to follow along.\n\n" +
        "Update your progress as you go. A quick update tells your supervisor the work is moving and often saves a message.\n\n" +
        "Submitting for review is what hands the work over. Sending files in chat does not count as delivery. If your supervisor asks for changes, their notes appear at the top of the project and the work reopens for you.",
      questions: [
        {
          id: "lesson-2-q1",
          prompt: "What has to be in place before you can submit?",
          options: [
            "A message to your supervisor",
            "Your working link",
            "A five star rating",
            "Nothing, you can submit any time",
          ],
          sortOrder: 1,
        },
        {
          id: "lesson-2-q2",
          prompt: "Does sending files in chat count as delivering the work?",
          options: [
            "Yes, always",
            "Only for small tasks",
            "No, you need to submit for review",
            "Only if your supervisor replies",
          ],
          sortOrder: 2,
        },
      ],
      answerKey: [2, 3],
    },
    {
      id: "lesson-3",
      category: null,
      title: "Working with your supervisor",
      moduleOrder: 3,
      completed: false,
      body:
        "Your supervisor is your only point of contact on a project. You never deal with the client directly, and the client never learns who you are.\n\n" +
        "Ask early. A short message when something in the brief is unclear saves a round of changes later.\n\n" +
        "Your payout is fixed when you accept an offer and released once the work is approved. Every payout lands with an itemised receipt on your earnings page.",
      questions: [
        {
          id: "lesson-3-q1",
          prompt: "Who do you talk to about a project?",
          options: ["The client", "Your supervisor", "Support only", "Other doers"],
          sortOrder: 1,
        },
        {
          id: "lesson-3-q2",
          prompt: "When is your payout released?",
          options: [
            "When you accept an offer",
            "When you submit",
            "Once the work is approved",
            "At the end of the year",
          ],
          sortOrder: 2,
        },
      ],
      answerKey: [2, 3],
    },
    skillCourse(
      "course-blog",
      "Blog posts that people finish",
      "Writing & Content",
      10,
      true,
      "Start with the reader's problem in the first two lines. If the opening could fit any post, rewrite it.\n\n" +
        "Use headings that say something. A reader who skims only the H2s should still get the main points.\n\n" +
        "End each section with one clear step the reader can take today. Cut any paragraph that does not move them closer to it.",
      [
        ["What should the first two lines do?", ["Introduce the writer", "Name the reader's problem", "List every keyword", "Thank the reader"], 2],
        ["A reader skims only your H2 headings. What should they get?", ["Nothing, headings are decoration", "The main points of the post", "The author's name", "The word count"], 2],
      ],
    ),
    skillCourse(
      "course-email",
      "Email sequences that get opened",
      "Writing & Content",
      11,
      false,
      "Each email in a sequence has one job. Write that job down before you write the email.\n\n" +
        "Subject lines work best when they are short and specific. Say what is inside, not how exciting it is.\n\n" +
        "Keep to one link per email where you can. More choices usually mean fewer clicks.",
      [
        ["How many jobs should one email in a sequence have?", ["One", "Three", "As many as fit", "None, it is just a reminder"], 1],
        ["What makes a subject line work?", ["Capital letters", "Short and specific", "Lots of punctuation", "Being as long as possible"], 2],
      ],
    ),
    skillCourse(
      "course-captions",
      "Social captions in a brand voice",
      "Marketing",
      12,
      false,
      "Read the brand's last twenty posts before you write one. Note the words they use and the ones they never use.\n\n" +
        "Lead with the hook. On most platforms only the first line shows before the cut.\n\n" +
        "Write two versions of any caption you are unsure about, and say which one you prefer and why.",
      [
        ["What should you read before writing for a brand?", ["Their recent posts", "Their annual report", "Only competitor ads", "Nothing, start fresh"], 1],
        ["Why lead with the hook?", ["It is a legal rule", "Often only the first line shows", "It makes the caption longer", "Hashtags need it"], 2],
      ],
    ),
    skillCourse(
      "course-seo",
      "On-page SEO in one sitting",
      "Marketing",
      13,
      false,
      "Every page needs one main keyword. Put it in the title, the first paragraph and one heading, then write for people.\n\n" +
        "Keep titles under 60 characters and meta descriptions under 155, so search results do not cut them off.\n\n" +
        "Link to two or three related pages on the same site, using words that say where the link goes.",
      [
        ["How many main keywords should one page aim for?", ["One", "Five", "Ten", "As many as possible"], 1],
        ["Why keep meta descriptions under 155 characters?", ["Search results cut longer ones", "The page loads faster", "It hides the keyword", "Nobody reads them"], 1],
      ],
    ),
    skillCourse(
      "course-slides",
      "Slides that read at a glance",
      "Design",
      14,
      false,
      "One idea per slide. If a slide needs two headings, it is two slides.\n\n" +
        "Write the heading as the takeaway, not the topic. Costs fell 20% says more than Costs.\n\n" +
        "Leave space. A slide with room around its content looks more sure of itself than one filled to the edges.",
      [
        ["How many ideas should one slide carry?", ["One", "Two", "Three", "As many as fit"], 1],
        ["Which heading is better?", ["Costs", "Costs fell 20%", "Slide 4", "Update"], 2],
      ],
    ),
    skillCourse(
      "course-research",
      "Market research in a day",
      "Research & Business",
      15,
      false,
      "Write the question the brief asks at the top of your doc. Every source you add should help answer it.\n\n" +
        "Use at least three kinds of source: public data, company pages, and real customer voices such as reviews.\n\n" +
        "Put a one-paragraph answer before the detail. Busy readers may stop there.",
      [
        ["What goes at the top of your research doc?", ["The question you need to answer", "Your sources", "A cover image", "Your name"], 1],
        ["Where should the short answer go?", ["Before the detail", "In an appendix", "Nowhere, let them read it all", "Only in the chat"], 1],
      ],
    ),
  ],

  // Not verified, so the verification steps and the welcome checklist can be walked through.
  kyc: "pending",

  // L2 needs an average of 4.7 across at least 15 ratings, so these agree.
  rating: { average: 4.8, count: 18, level: "L2" },

  application: {
    id: "application-shubham",
    bio: "Six years writing long-form content and marketing copy, mostly for software and fintech companies. Strongest in blog series, case studies and SEO content.",
    status: "approved",
    created_at: daysAgo(118),
  },

  referrals: {
    code: "SHUBHAM2026",
    invited: [
      { id: "invitee-1", name: "Priya Sharma", createdAt: daysAgo(40), stage: "earned" },
      { id: "invitee-2", name: "Rahul Verma", createdAt: daysAgo(12), stage: "verified" },
      { id: "invitee-3", name: "Ananya Iyer", createdAt: daysAgo(3), stage: "joined" },
    ],
  },

  invites: [
    {
      threadId: "invite-seo-pages",
      offerId: SEO_PAGES_ID,
      title: "On-page SEO pass for 20 landing pages",
      category: "Marketing",
      createdAt: daysAgo(0.2),
    },
    {
      threadId: "invite-buyers-guide",
      offerId: BUYERS_GUIDE_ID,
      title: "Buyer's guide to project management tools",
      category: "Writing & Content",
      createdAt: daysAgo(1.1),
    },
  ],

  notifications: [
    {
      id: "notification-6",
      template_type: "message_posted",
      deep_link: `/work/${BLOG_SERIES_ID}`,
      read_at: null,
      created_at: daysAgo(0.3),
    },
    {
      id: "notification-5",
      template_type: "message_posted",
      deep_link: `/work/${LAUNCH_CALENDAR_ID}`,
      read_at: null,
      created_at: daysAgo(0.5),
    },
    {
      id: "notification-4",
      template_type: "payment_held",
      deep_link: `/work/${BLOG_SERIES_ID}`,
      read_at: daysAgo(4.9),
      created_at: daysAgo(5),
    },
    {
      id: "notification-3",
      template_type: "payout_released",
      deep_link: "/dashboard?view=earnings",
      read_at: daysAgo(19),
      created_at: daysAgo(20),
    },
    {
      id: "notification-2",
      template_type: "project_approved",
      deep_link: `/work/${FINTECH_ARTICLES_ID}`,
      read_at: daysAgo(19),
      created_at: daysAgo(20.1),
    },
    {
      id: "notification-1",
      template_type: "verification_approved",
      deep_link: "/verification",
      read_at: daysAgo(109),
      created_at: daysAgo(110),
    },
  ],

  messages: {
    [demoThreadId(BLOG_SERIES_ID)]: [
      supervisorSays(
        "message-blog-1",
        "Hi Shubham, thanks for picking this up. The style guide is attached, and the keyword list is on its second page. Shout if anything in the brief is unclear.",
        daysAgo(4.8),
      ),
      doerSays(
        "message-blog-2",
        "Thanks! One check before I start: should the examples lean on one cloud provider, or stay provider-neutral?",
        daysAgo(4.6),
      ),
      supervisorSays(
        "message-blog-3",
        "Stay provider-neutral where you can. If an example really needs a specific provider, pick the most common one and say so.",
        daysAgo(4.5),
      ),
      doerSays(
        "message-blog-4",
        "Posts one to five are drafted in the working doc and progress is at 60%. The last three will be in by tomorrow evening.",
        daysAgo(1.1),
      ),
      supervisorSays(
        "message-blog-5",
        "Read the first five. Solid work, and the practical angle is exactly what the brief needs. Keep going.",
        daysAgo(0.3),
      ),
    ],
    [demoThreadId(LAUNCH_CALENDAR_ID)]: [
      supervisorSays(
        "message-launch-1",
        "Welcome aboard. The product one-pager is in the brief. Keep LinkedIn captions under 150 words.",
        daysAgo(7.5),
      ),
      doerSays(
        "message-launch-2",
        "Got it. I am drafting week one now, and the sheet is linked as my working doc.",
        daysAgo(6),
      ),
      doerSays(
        "message-launch-3",
        "All 30 posts are in, with visual notes and posting times. Submitted for review.",
        daysAgo(0.6),
      ),
      supervisorSays(
        "message-launch-4",
        "Thanks Shubham. I will go through it today and come back to you here.",
        daysAgo(0.5),
      ),
    ],
    "invite-seo-pages": [
      supervisorSays(
        "message-invite-seo-1",
        "Hi Shubham, an SEO task just came in that fits your skills. Twenty landing pages, due in five days. Have a look and accept it from the card if it suits you.",
        daysAgo(0.2),
        SEO_PAGES_ID,
      ),
    ],
    "invite-buyers-guide": [
      supervisorSays(
        "message-invite-guide-1",
        "A long buyer's guide came in and I thought of your SaaS writing. Research notes are ready. Want it?",
        daysAgo(1.1),
        BUYERS_GUIDE_ID,
      ),
      doerSays("message-invite-guide-2", "Thanks! Reading the brief now, I will let you know today.", daysAgo(1)),
    ],
    ...Object.fromEntries(
      closedProjects.map((project) => [
        demoThreadId(project.id),
        [
          supervisorSays(
            `message-${project.id}`,
            "Approved. Thank you for delivering this cleanly and on time.",
            project.updatedAt,
          ),
        ],
      ]),
    ),
  },

  attachments: {
    [demoThreadId(BLOG_SERIES_ID)]: [
      {
        id: "attachment-style-guide",
        messageId: "message-blog-1",
        bucket: "chat-attachments",
        objectPath: "demo/style-guide.pdf",
        filename: "cloud-series-style-guide.pdf",
        mimeType: "application/pdf",
        sizeBytes: 184_320,
        createdAt: daysAgo(4.8),
      },
    ],
  },

  tickets: [
    {
      id: "tk-1057",
      subject: "How do I change my UPI ID?",
      category: "account",
      status: "pending",
      createdAt: daysAgo(2),
    },
    {
      id: "tk-1042",
      subject: "Payout for my fintech articles has not arrived",
      category: "payout",
      status: "resolved",
      createdAt: daysAgo(18),
    },
  ],

  ticketMessages: {
    "tk-1057": [
      {
        id: "ticket-message-1057-1",
        authorId: DEMO_USER_ID,
        body: "I have opened a new bank account and would like payouts to go to a different UPI ID. How do I change it?",
        createdAt: daysAgo(2),
      },
      {
        id: "ticket-message-1057-2",
        authorId: null,
        body: "Payout details are locked after verification to keep your earnings safe. Reply here with the UPI ID you want to use, and we will confirm the change by email before switching it.",
        createdAt: daysAgo(1.7),
      },
    ],
    "tk-1042": [
      {
        id: "ticket-message-1042-1",
        authorId: DEMO_USER_ID,
        body: "My fintech articles project was approved two days ago, but the payout has not reached my account yet.",
        createdAt: daysAgo(18),
      },
      {
        id: "ticket-message-1042-2",
        authorId: null,
        body: "Thanks for flagging this. The payout was released on approval, and banks can take up to two working days to show it. We will keep this open until you confirm.",
        createdAt: daysAgo(17.8),
      },
      {
        id: "ticket-message-1042-3",
        authorId: DEMO_USER_ID,
        body: "It has arrived now. Thank you!",
        createdAt: daysAgo(17),
      },
    ],
  },
};

/* ------------------------------------------------------------------ */
/*  Server behaviour the demo has to imitate                           */
/* ------------------------------------------------------------------ */

/**
 * Something happens without the doer doing anything: the supervisor writes on the
 * work in progress. The message lands in the thread and an alert is raised, the same
 * two rows the server would write, so the pop-up and the chat agree.
 */
export function demoSimulateEvent(): void {
  const project = demo.projects.find((item) => item.status === "in_progress") ?? demo.projects[0];
  if (!project) return;
  const threadId = demoThreadId(project.id);
  const thread = demo.messages[threadId] ?? (demo.messages[threadId] = []);
  thread.push(
    supervisorSays(
      demoId("message"),
      "Quick one: please add a short summary box at the top of each post. Everything else looks good.",
      new Date().toISOString(),
    ),
  );
  demo.notifications.unshift({
    id: demoId("note"),
    template_type: "message_posted",
    deep_link: `/work/${project.id}`,
    read_at: null,
    created_at: new Date().toISOString(),
  });
}

/**
 * A supervisor starts a chat about new work: the email sequence on the board. The
 * thread, its first message and the alert land together, as the server would write
 * them. Returns false when that offer is gone or the chat already exists.
 */
export function demoSimulateInvite(): boolean {
  const offer = demo.pool.find((entry) => entry.id === EMAIL_SEQUENCE_ID);
  const threadId = "invite-email-sequence";
  if (!offer || demo.invites.some((invite) => invite.threadId === threadId)) return false;
  const now = new Date().toISOString();
  demo.invites.unshift({
    threadId,
    offerId: offer.id,
    title: "Welcome email sequence for a fitness app",
    category: offer.category,
    createdAt: now,
  });
  demo.messages[threadId] = [
    supervisorSays(
      demoId("message"),
      "Hi Shubham, I have a five-email welcome sequence for a fitness app. It is a good fit for your email skills. Take a look?",
      now,
      offer.id,
    ),
  ];
  demo.notifications.unshift({
    id: demoId("note"),
    template_type: "work_invite",
    deep_link: `/messages/${threadId}`,
    read_at: null,
    created_at: now,
  });
  return true;
}

/** The reviewer approves a demo verification a few seconds after it is sent. */
export function demoApproveKycSoon(): void {
  window.setTimeout(() => {
    if (demo.kyc !== "submitted") return;
    demo.kyc = "approved";
    demo.notifications.unshift({
      id: demoId("note"),
      template_type: "verification_approved",
      deep_link: "/verification",
      read_at: null,
      created_at: new Date().toISOString(),
    });
  }, 6000);
}

/**
 * The doer_pool view: nothing while the doer is unavailable, and only categories
 * they have picked a skill in. Newest first.
 */
export function demoPoolView(): PoolOffer[] {
  if (!demo.profile.available) return [];
  const picked = new Set(
    demo.skills.filter((skill) => skill.selected).map((skill) => skill.category),
  );
  return demo.pool
    .filter((offer) => picked.has(offer.category))
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

/**
 * claim_project_as_doer: the offer leaves the board and lands in active work, ready
 * to start, with a first note from the supervisor. False means it was not claimable.
 */
export function demoClaim(projectId: string): boolean {
  const offer = demoPoolView().find((entry) => entry.id === projectId);
  if (!offer) return false;

  const claimedAt = new Date().toISOString();
  demo.pool = demo.pool.filter((entry) => entry.id !== projectId);
  demo.projects.unshift(
    makeProject({
      id: offer.id,
      category: offer.category,
      status: "paid",
      brief: offer.brief,
      payoutPaise: offer.payoutPaise,
      workingDocUrl: null,
      progressPct: 0,
      createdAt: offer.createdAt,
      updatedAt: claimedAt,
      deliveryAt: offer.deliveryAt,
    }),
  );
  demo.messages[demoThreadId(projectId)] = [
    supervisorSays(
      demoId("message"),
      "Thanks for picking this up. Everything you need should be in the brief, and I am here if anything is unclear. Add your working link when you start so I can follow along.",
      claimedAt,
    ),
  ];
  return true;
}

const PASS_MARK = 70;

/** grade_lesson: the answer key never leaves the "server". */
export function demoGradeLesson(
  lessonId: string,
  answers: number[],
): { score: number; passed: boolean } {
  const key = demo.lessons.find((lesson) => lesson.id === lessonId)?.answerKey ?? [];
  const correct = key.filter((answer, index) => answers[index] === answer).length;
  const score = key.length === 0 ? 100 : Math.round((correct / key.length) * 100);
  return { score, passed: score >= PASS_MARK };
}

/** The readiness checks behind the dashboard checklist, read from demo state. */
export function demoGateState(): DoerGateState {
  const kycDone = demo.kyc === "approved";
  const skillsDone = demo.skills.some((skill) => skill.selected);
  // Only the required modules count; skill courses are optional extras.
  const trainingDone = demo.lessons.filter((lesson) => !lesson.category).every((lesson) => lesson.completed);
  const steps = [true, kycDone, skillsDone, trainingDone];

  return {
    isDoer: true,
    applicationSubmitted: demo.application !== null,
    applicationStatus: demo.application?.status ?? "none",
    kycDone,
    skillsDone,
    trainingDone,
    stepsDone: steps.filter(Boolean).length,
    totalSteps: steps.length,
    unlocked: kycDone && skillsDone && trainingDone,
  };
}

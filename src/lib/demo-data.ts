import type { Session, User } from "@supabase/supabase-js";
import type { ChatAttachment, ChatMessage } from "@/features/chat/api";
import type { LedgerRow } from "@/features/earnings/api";
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
import { env } from "./env";

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

export function isDemo(): boolean {
  return env.demoMode;
}

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

/* ------------------------------------------------------------------ */
/*  Identity and sign-in                                               */
/* ------------------------------------------------------------------ */

export const DEMO_USER_ID = "5b1f0c3e-8a47-4d2b-9e6a-1c7d2f4a8b90";
const SUPERVISOR_ID = "a93e7d15-2c64-4f8b-b1d0-6e5f3a9c2d71";

const DEMO_USER: User = {
  id: DEMO_USER_ID,
  email: "shubham@example.com",
  app_metadata: {},
  user_metadata: { full_name: "Shubham" },
  aud: "authenticated",
  created_at: daysAgo(120),
};

function demoSession(): Session {
  return {
    access_token: "demo",
    refresh_token: "demo",
    token_type: "bearer",
    expires_in: 3600,
    expires_at: Math.floor(Date.now() / 1000) + 3600,
    user: DEMO_USER,
  };
}

/*
 * Any email signs in, and there is no code to enter. The flag lives in
 * sessionStorage, so a reload keeps you signed in and closing the tab signs you out.
 */
const SIGNED_IN_KEY = "dolancer.demo.signedIn";
const authListeners = new Set<(session: Session | null) => void>();

function readSignedIn(): boolean {
  try {
    return sessionStorage.getItem(SIGNED_IN_KEY) === "true";
  } catch {
    return false;
  }
}

function writeSignedIn(signedIn: boolean): void {
  try {
    if (signedIn) sessionStorage.setItem(SIGNED_IN_KEY, "true");
    else sessionStorage.removeItem(SIGNED_IN_KEY);
  } catch {
    // Storage can be blocked. The session then lasts until the next reload.
  }
}

function emitAuth(session: Session | null): void {
  for (const listener of authListeners) listener(session);
}

export const demoAuth = {
  getSession(): Session | null {
    return readSignedIn() ? demoSession() : null;
  },
  signIn(): void {
    writeSignedIn(true);
    emitAuth(demoSession());
  },
  signOut(): void {
    writeSignedIn(false);
    emitAuth(null);
  },
  /** The demo counterpart of supabase.auth.onAuthStateChange. Returns the unsubscribe. */
  onChange(listener: (session: Session | null) => void): () => void {
    authListeners.add(listener);
    return () => {
      authListeners.delete(listener);
    };
  },
};

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
    category: "Content Writing",
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
    category: "Social Media",
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
    category: "Content Writing",
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
    category: "SEO",
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
    category: "Content Writing",
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
    category: "Social Media",
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
    category: "SEO",
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

const grossPaise = ledger.reduce((sum, row) => sum + row.amountPaise, 0);
// A flat tenth stands in for TDS, which is really worked out across the financial
// year. What matters on screen is that gross, withheld and net reconcile.
const taxWithheldPaise = Math.round(grossPaise / 10);

/**
 * Open work on the board. The Copywriting brief stays hidden until a Copywriting
 * skill is picked, which is how the real board matches work to skills.
 */
const pool: PoolOffer[] = [
  {
    id: "9e3d5b18-2f6a-4c7e-b9a1-4d8c0e6f2a53",
    category: "Content Writing",
    status: "paid",
    payoutPaise: 1_200_000,
    deliveryAt: daysFromNow(7),
    createdAt: daysAgo(0.1),
    brief:
      "Buyer's guide to project management tools for remote teams\n\n" +
      "A 3,000-word guide comparing five tools on pricing, integrations and fit for teams of 10 to 50 people. Include a summary table and a short verdict for each tool. Research notes are provided.",
  },
  {
    id: "0e5c9a2b-4d86-4f13-b7e0-9a1d6c3f8e47",
    category: "Copywriting",
    status: "paid",
    payoutPaise: 650_000,
    deliveryAt: daysFromNow(5),
    createdAt: daysAgo(0.4),
    brief:
      "Welcome email sequence for a fitness app\n\n" +
      "Five emails that take a new subscriber from sign-up to their first workout, with subject lines, preview text, and an A/B variant of the first email.",
  },
  {
    id: "1c6a8e40-7b3d-4f29-a6e5-0d2f9b4c7e81",
    category: "SEO",
    status: "paid",
    payoutPaise: 750_000,
    deliveryAt: daysFromNow(5),
    createdAt: daysAgo(0.6),
    brief:
      "On-page SEO pass for 20 landing pages\n\n" +
      "Keyword mapping, rewritten titles and meta descriptions, and an internal linking plan, delivered in a single sheet. The search console export is shared once you claim.",
  },
  {
    id: "6b2f4d97-8e1c-4a05-9d3b-7c5e1a8f0b24",
    category: "Social Media",
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
    category: "Content Writing",
    status: "paid",
    payoutPaise: 500_000,
    deliveryAt: daysFromNow(6),
    createdAt: daysAgo(2),
    brief:
      "Six-issue newsletter on personal finance\n\n" +
      "Issues of 800 to 1,000 words for first-time investors. Plain language, one practical takeaway per issue, and a suggested subject line for each.",
  },
];

const supervisorSays = (id: string, body: string, createdAt: string): ChatMessage => ({
  id,
  authorId: SUPERVISOR_ID,
  body,
  createdAt,
});

const doerSays = (id: string, body: string, createdAt: string): ChatMessage => ({
  id,
  authorId: DEMO_USER_ID,
  body,
  createdAt,
});

/* ------------------------------------------------------------------ */
/*  State                                                              */
/* ------------------------------------------------------------------ */

interface DemoLesson extends LessonDetail {
  questions: LessonQuestion[];
  /** The 1-based correct option for each question, in order. Only grading reads it. */
  answerKey: number[];
}

interface DemoState {
  profile: ProfileRow;
  projects: DoerProject[];
  pool: PoolOffer[];
  earnings: EarningsSummary;
  ledger: LedgerRow[];
  skills: SkillOption[];
  lessons: DemoLesson[];
  kyc: KycStatus;
  rating: { average: number | null; count: number; level: string };
  application: DoerApplicationRow | null;
  referrals: { code: string; invited: { id: string; createdAt: string; joined: boolean }[] };
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

  skills: [
    { id: "skill-blog", name: "Blog writing", category: "Content Writing", selected: true },
    { id: "skill-content", name: "Content writing", category: "Content Writing", selected: true },
    { id: "skill-case-studies", name: "Case studies", category: "Content Writing", selected: false },
    { id: "skill-whitepapers", name: "Whitepapers", category: "Content Writing", selected: false },
    { id: "skill-seo-writing", name: "SEO writing", category: "SEO", selected: true },
    { id: "skill-keywords", name: "Keyword research", category: "SEO", selected: false },
    { id: "skill-on-page", name: "On-page SEO", category: "SEO", selected: false },
    { id: "skill-social-copy", name: "Social media copy", category: "Social Media", selected: true },
    { id: "skill-calendars", name: "Content calendars", category: "Social Media", selected: false },
    { id: "skill-ad-copy", name: "Ad copy", category: "Copywriting", selected: false },
    { id: "skill-email", name: "Email campaigns", category: "Copywriting", selected: false },
    { id: "skill-landing", name: "Landing pages", category: "Copywriting", selected: false },
    { id: "skill-slides", name: "Presentation design", category: "Design", selected: false },
    { id: "skill-graphics", name: "Social graphics", category: "Design", selected: false },
    { id: "skill-market", name: "Market research", category: "Research", selected: false },
    { id: "skill-surveys", name: "Survey analysis", category: "Research", selected: false },
  ],

  lessons: [
    {
      id: "lesson-1",
      title: "How work reaches you",
      moduleOrder: 1,
      completed: true,
      body:
        "Every project is scoped by a supervisor before it reaches you. They turn the request into a clear brief, set the deadline and fix your payout, so anything on the board is ready to work on.\n\n" +
        "The board only shows work in categories you have picked on the Skills page, and only while you are set to Available. If it looks empty, check those two things first.\n\n" +
        "A claim is yours the moment you make it, and the first qualified claim wins. Read the brief and the deadline before you commit, because each claim uses one of your three slots.",
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
      title: "Working with your supervisor",
      moduleOrder: 3,
      completed: true,
      body:
        "Your supervisor is your only point of contact on a project. You never deal with the client directly, and the client never learns who you are.\n\n" +
        "Ask early. A short message when something in the brief is unclear saves a round of changes later.\n\n" +
        "Your payout is fixed when you claim and released once the work is approved. Tax is withheld at release and shown on your earnings page, so the figures there always reconcile.",
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
            "When you claim",
            "When you submit",
            "Once the work is approved",
            "At the end of the year",
          ],
          sortOrder: 2,
        },
      ],
      answerKey: [2, 3],
    },
  ],

  kyc: "approved",

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
      { id: "invitee-1", createdAt: daysAgo(40), joined: true },
      { id: "invitee-2", createdAt: daysAgo(12), joined: true },
    ],
  },

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
      deep_link: "/earnings",
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
  const trainingDone = demo.lessons.every((lesson) => lesson.completed);
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

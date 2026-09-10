# UX patterns for the remaining screens

Distilled from the worker-side surfaces of Upwork, Fiverr, Toptal, Contra, Linear,
Raycast, Gumroad and Lemon Squeezy, filtered through what Dolancer can actually do. This
is the brief for the screens not yet built.

Applied already: the three-state availability control, the "Link needed" status, and the
capacity reassurance copy. Everything below is for the next pass.

---

## The two ideas that matter most

**1. A blocker is a state, not an error.** Fiverr models an order waiting on requirements
as its own status ("In Queue"), so the clock visibly has not started. We do the same with
`Link needed`: it renders as a badge on the list row and in the workbench header, so the
doer finds the blocker while scanning, not by pressing a button and being refused. State
the consequence, not the refusal: say what stays frozen, not "you can't".

**2. Show only the money states the database can actually prove.**

Upwork's four-bucket pipeline (In progress, In review, Pending, Available) is a genuinely
good pattern, and we **cannot use it**. `ledger_doer` contains only already-released rows,
and `razorpay_payouts` has no doer read policy, so every bucket except the last would be
fabricated.

So `/earnings` shows exactly two figures, both real:

```
Available balance        Cumulative tax withheld
(released to you)        (TDS and GST, financial year to date)
```

Both come from `doer_earnings_summary()`, which returns gross, tax withheld and net. Show
gross alongside them so the three reconcile, and never blend them into one number: TDS is a
statutory withholding a doer must be able to check against their own filing.

**Do not add a "Pending" metric.** Not as a zero, not as a placeholder, not as "coming
soon". Inventing a financial state about someone's money is worse than omitting it, and a
zero that never moves reads as "you have earned nothing". If item 2 of
`BACKEND-HANDOFF.md` lands, revisit this; until then, two figures.


---

## /pool, the claim board

Card anatomy, borrowed from Raycast's list item: category glyph, title, one-line scope
subtitle inline, then right-aligned accessories in order: **payout (largest type on the
card)**, relative deadline (`2d`), effort, up to three skill tags.

- Reserve colour for exactly two meanings, deadline urgency and status. Nowhere else.
- Show the exact gross payout on the card, before claiming, labelled "before tax". Payout
  is fixed and pre-disclosed, so there is nothing to hide. Do NOT attempt a TDS breakdown
  here: withholding is computed at release against cumulative financial-year earnings, so
  no per-task figure exists to show yet.
- Index skill synonyms for search without rendering them (Raycast `keywords`), so search
  works without cluttering the card.
- Click opens a right drawer, not a new page, so tasks can be compared without losing
  scroll position. When the drawer is open, **stop rendering accessories on the row** -
  information moves into the detail, it never appears twice.
- Claim needs an explicit confirm, never a bare keystroke. It is a commitment against a
  hard three-slot cap, and the deadline should be repeated in the confirmation.
- Sorts worth having: payout high to low, deadline soonest, newest.

Three distinct empty states, each with its own action: filters exclude everything ("Clear
filters"), the pool is genuinely empty ("Notify me when work appears"), and you are at
capacity ("Go to active work"). Collapsing these into one message is the common miss.

At capacity: a persistent banner at the top plus disabled Claim buttons, with the release
condition stated. Show a `2 of 3 active` pill in the header at all times so the cap is
legible before it bites.

## /work, the project list

Sort closest-to-done first, the way Linear orders by status, so active work surfaces and
finished work sinks. Sticky group headers carrying counts: `Link needed 1`,
`In progress 2`, `Submitted 1`. Blocked items rise to the top by construction.

## /work/:id, the workbench

Linear's layout: content left (brief, deliverables, activity), a properties rail right,
visually integrated rather than a walled-off grey panel.

- **Pin the working link to the top of the rail.** Linear pins the most decision-relevant
  block; here that is the thing gating everything else.
- Rail order below it: status, deadline, gross payout, supervisor, short copyable task ID.
- Disabled actions carry their reason **directly beneath them**, not in a tooltip, and the
  fix is the primary action: "Add working link".
- After submitting, show "Submitted, with your supervisor" plus an expected review-by
  time. Borrow Upwork's warning shape: sending files in chat is **not** a submission. Our
  architecture invites exactly that mistake.
- Show the task's payout in the workbench, so nobody leaves to check what a job is worth.
- A state-dependent overflow menu keeps the primary rail to Update progress and Submit;
  everything rare lives in the ellipsis, showing only what is legal in the current state.
- The supervisor chat is a persistent pane, not a separate page.

## /earnings

- Two metric blocks, not four: Available balance and Cumulative tax withheld. See "the two
  ideas that matter most" above for why a Pending figure cannot exist here.
- A three-row reconciliation, gross / tax withheld / net, with net bolded and largest.
  **Itemise, never blend.** Lemon Squeezy's single blended fee generates transparency
  complaints, and TDS is a statutory withholding a doer must be able to check against their
  own filing, so it needs its own line and its rate.
- History table: date, task, gross, TDS, net, status, expanding in place rather than
  navigating away. Per-period export.
- Keep already-paid items in their own section. Gumroad subtracts paid amounts from the
  gross line and it is a documented source of confusion.
- State the next payout as a date, and if a minimum applies, name the shortfall and say
  the balance rolls over automatically, so no action is implied.
- If the ledger's day boundary is not the display timezone, say so once, next to the
  numbers.

## /verification and /profile

Contra's shape: about five one-line items, ordered cheapest to hardest, with identity and
payout details last. Show the remaining items rather than only a percentage: a percentage
is a nag, a list is a to-do. Frame the payoff as an outcome ("verified doers can claim
work"), and retire the dashboard card permanently at 100%.

The checklist gates the **action, never the navigation**. Browsing the pool stays open when
unverified; only Claim is disabled, with the reason on the card.

## Cross-cutting

- **Status vocabulary capped at six**, one badge component, one colour each, identical
  everywhere: `Link needed`, `In progress`, `Submitted`, `Changes requested`, `Approved`,
  `Paid`. Every one answers "is the clock running?".
- **Deadlines:** relative on cards ("Due in 2d"), absolute with timezone on detail ("Due
  Fri 12 Sep, 6:00 PM IST"). One escalation rule everywhere: neutral above 48h, warning
  12 to 48h, critical under 12h. Overdue reads "Overdue by 5h", never a negative
  countdown. `deadlineUrgency()` in `lib/datetime.ts` already implements this.
- **Keyboard:** Cmd/Ctrl K command menu, Enter as primary and Cmd Enter as secondary, with
  shortcut labels right-aligned beside actions so they are absorbed passively.

---

## Patterns to avoid, and why

| Pattern | Why it cannot apply |
| --- | --- |
| Availability badge bought with credits | Availability must be free and derived from the cap |
| Connects, proposals, bidding, cover letters | Payout is fixed and claiming is blind |
| Client-trust card metadata (payment verified, client spend or rating, proposal count) | The doer never sees the client. Upwork's card is largely client-trust signal, which we structurally cannot show. Substitute payout, deadline, effort, skill match |
| "Funded" or escrow milestone language | Banned wording, and "funded" implies client-held money. Keep the Active/Future/Completed shape, drop the vocabulary |
| "In review" implying a client is reviewing | Review is by the internal supervisor, always |
| A user-editable queue limit | Our cap is fixed at three; a settings toggle implies it can be raised |
| Level systems driven by buyer ratings or repeat business | No client relationship exists to generate those signals. Any Dolancer tier must be built from supervisor-observable facts and must state what feeds it |
| Rate setting or "create services" in the profile checklist | Pricing is platform-set |
| A single blended fee | TDS must be reconcilable line by line |
| Subtracting already-paid amounts from the gross line | Documented confusion source |

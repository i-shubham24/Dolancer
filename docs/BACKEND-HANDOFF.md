# Backend handoff

Gaps found while building the Dolancer SPA that cannot be fixed in the frontend. Each was
verified against the migration SQL in the `assign-x` monorepo, not inferred from docs.

Nothing here is blocking: the app ships around every one of them. But each is a place
where the product promise and the database currently disagree.

---

## 1. The 3-project concurrency cap does not exist

**Severity: high.** It is a P0 requirement in the PRD (BR-021, FR-DO-008, AC-18).

A full-repo grep for `concurren*`, `max_active`, `wip`, `at a time` finds nothing. There
is no check constraint, no trigger, and no predicate inside `claim_project_as_doer`. A doer
can hold unlimited projects today.

The SPA enforces a cap in Zustand and auto-flips availability off on reaching it, shown as
"At capacity". That
is the correct UX, and the availability half genuinely works because `doer_pool` requires
`profiles.available`. But `claim_project_as_doer` is directly callable by any authenticated
doer, so **the cap stops the button, not the claim.**

To make it real, add a predicate to the claim RPC:

```sql
-- inside claim_project_as_doer, before the update
if (
  select count(*) from public.projects
  where doer_id = auth.uid()
    and status in ('claimed','quoted','paid','in_progress','in_review','delivered')
) >= 3 then
  raise exception 'concurrency cap reached';
end if;
```

The number should come from a config table rather than a literal, matching how
`claim_pool_config.head_start_minutes` is handled, so it stays admin-tunable.

---

## 2. The doer cannot read payout status, so there is no pending balance

**Severity: high.** It removes a headline figure from the earnings screen.

The PRD (section 10.7) specifies three balances: Available, Pending (earned on delivered
but unapproved work), and Lifetime. Only Lifetime is currently derivable.

- `ledger_doer` exposes only `release_doer` legs, which by construction exist only *after*
  approval and release. Everything in it is already paid.
- Actual disbursement state lives in `razorpay_payouts` (`queued | processing | paid |
  failed`), and **the doer has no read policy on that table at all.**

The reference Next.js app papers over this by hardcoding a "Paid" pill on every row. The
SPA instead shows a single released state, because inventing a pending number about
someone's money is worse than omitting it.

Needed: a doer-scoped view over `razorpay_payouts`, plus something that exposes value
earned on delivered-but-unapproved projects. Suggested shape:

```sql
create view public.payouts_doer with (security_barrier = true) as
  select rp.id, rp.project_id, rp.status, rp.status_event_at, l.amount_paise
  from public.razorpay_payouts rp
  join public.ledger_entries l
    on l.project_id = rp.project_id
   and l.beneficiary_id = rp.beneficiary_id
   and l.entry_type = 'release_doer'
  where rp.beneficiary_id = (select auth.uid());
```

**Working today:** `doer_earnings_summary()` returns
`{ gross_paise, tax_withheld_paise, net_paise }`, so cumulative TDS and GST renders
correctly and gross, tax and net are shown separately as required.

---

## 3. Level tiers do not match the PRD

**Severity: medium.** The doer sees a different ladder than the one they were promised.

| | PRD (section 10.6) | `rating_level()` in `0045` |
| --- | --- | --- |
| Tiers | 3 | 2 |
| L2 threshold | 10 projects and 4.0 average | 4.7 average and 15 ratings |
| L3 | 30 projects and 4.0 average | does not exist |
| Effect | drives the 35/45/55% cut | drives only the claim head-start |

The SPA renders whatever `my_rating_summary()` returns and does not invent an L3. Someone
needs to decide which ladder is real, because the PRD publishes these numbers to doers on
the public site, and a mismatch there is a trust problem rather than a bug.

---

## 4. Training gating is inverted

**Severity: medium.** A P0 requirement and the database contradict each other.

PRD FR-DO-007 and BR-022 are explicit: *"Training shall never gate onboarding,
verification, or offer eligibility at platform level."* The stated reason is that mandatory
training weakens the independent-contractor position, which makes this a legal question
rather than a product preference.

But `claim_project_as_doer` calls `has_completed_required_lessons(auth.uid(), 'doer')` and
raises if it fails. Training is currently a hard gate on claiming.

Either the requirement or the RPC should change. The SPA presents training as a readiness
step, which matches the database's actual behaviour.

---

## 5. The identifier guard does not cover a browser insert

**Severity: medium, and it grows when chat ships.**

`identifierRejection()` runs inside the Next.js server action for sending a message. It has
no database-level counterpart: there is no constraint or trigger on `messages`.

An SPA inserts into `messages` directly from the browser, so nothing enforces the guard.
The SPA will run it client-side as best-effort, but a client-side check on a directly
callable table is not a control.

Given that the PRD specifies AI screening of every message for contact details and identity
reveals, with fail-closed behaviour, this probably wants to become a `send_message` RPC
that screens server-side and is the only granted write path, mirroring how
`set-payout-method` replaced the client insert on `payout_methods` in migration 0142.

---

## Smaller notes

- `projects_doer` lost `security_barrier = true` when `0166` recreated it; `0128` had it.
  Harmless while the view has no user-supplied filter, worth restoring before one is added.
- The PRD never specifies the label a doer sees for the client. Section 4.3 covers only the
  client's view. The SPA uses the literal string `Client` throughout.
- Parameter naming drifts from the docs in two places worth knowing: it is
  `claim_project_as_doer(p_id)`, not `p_project_id`, and `set_project_progress`, not
  `set_progress`.

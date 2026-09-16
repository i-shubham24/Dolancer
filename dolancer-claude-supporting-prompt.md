# Supporting Prompt for Claude: AssignX–Dolancer Confidentiality Boundary and Post-Implementation Plan

Continue the current Dolancer implementation task. Do not restart the project, discard existing work, or perform a broad unrelated rewrite. This is a supporting instruction that adds a critical product boundary and a post-implementation audit to the task already in progress.

Work locally in:

```text
D:\Dolancer
```

Do not deploy, publish, push, or modify the Vercel production site.

---

## Critical client instruction

AssignX and Dolancer are separate branded surfaces.

Clients must not know that Dolancer exists. Dolancer doers must not know that AssignX exists. The products may share protected internal operations and a supervisor bridge, but neither end user may see the other product’s identity, URLs, branding, legal pages, partner references, or private data.

This is not just a frontend navigation rule. It must be enforced through:

- Role-specific API projections.
- Database policies and RPCs.
- Realtime event filtering.
- Chat routing.
- File and URL handling.
- Notifications and email templates.
- Error messages.
- Metadata.
- Support and audit surfaces.

Never solve this only by hiding fields in React.

---

## Product boundary

The intended architecture is:

```text
AssignX client UI
        ↓ controlled internal supervisor bridge
Internal supervisor and operations UI
        ↓ controlled assigned-offer projection
Dolancer doer UI
```

AssignX is the client-facing managed-delivery product.

Dolancer is the private doer-facing assigned-work, execution, review, and payout product.

The internal supervisor surface may see both sides only when authorized. It must have distinct permissions, data projections, navigation, and audit logging.

---

## AssignX client visibility

The AssignX client may see:

- AssignX branding.
- AssignX navigation and legal identity.
- Their request and approved scope.
- A supervisor or role-labelled project lead if operationally approved.
- Managed milestones.
- QA status.
- Review-ready deliverables.
- Approval actions.
- Payment or escrow information under AssignX policy.
- Supervisor communication.
- AssignX support and escalation.
- Generic managed-team language.

The AssignX client must not see:

- The Dolancer name.
- Dolancer URLs.
- Dolancer logos, colors, legal pages, or product references.
- Doer names, profiles, locations, education, rates, or contact details.
- Doer payout.
- Internal assignment IDs.
- Internal doer notes.
- Doer chat.
- Doer-facing status labels.
- Internal routing metadata.
- Source file names or URLs exposing Dolancer.
- Any link to the Dolancer application.

The AssignX client experience can use the teammate’s strong creative workflow:

```text
Tell us what you need
→ Scope locked
→ Supervisor owns delivery
→ Managed team executes
→ QA complete
→ Client reviews and approves
```

Do not expose how or where internal doers are sourced.

---

## Dolancer doer visibility

The Dolancer doer may see:

- Dolancer branding.
- Dolancer navigation and legal identity.
- Assigned offers.
- Lawful category and deliverable brief.
- Acceptance criteria.
- Deadline.
- Working link.
- Supervisor messages.
- Review feedback.
- Revision status.
- Doer payout and approved deductions where permitted.
- Payout status.
- Training, verification, skills, levels, referrals, notifications, and support.

The Dolancer doer must not see:

- AssignX name.
- AssignX URL.
- AssignX logo or legal links.
- Client name.
- Client company.
- Client email, phone, location, or website.
- Client payment amount.
- Client budget.
- Client dashboard.
- Client screenshots containing identity.
- Client-side approval controls.
- Internal client notes.
- Partner-platform references.
- Direct client contact information.

The Dolancer doer experience should use:

```text
Supervisor assigned an offer
→ Review brief
→ Accept or decline
→ Work in protected workspace
→ Submit for supervisor review
→ Address revisions
→ Approval clears
→ Payout releases
```

Use a neutral counterparty label such as “AssignX client” only if the PRD explicitly requires it. Otherwise use “client,” “client representative,” or a role label that does not expose the platform identity.

---

## Required API and data audit

Inspect the existing Supabase queries, API functions, RPC calls, database types, and realtime handlers.

Prefer explicit role-specific projections such as:

```text
ClientProjectView
SupervisorProjectView
DoerOfferView
DoerWorkbenchView
ClientMilestoneView
InternalAuditView
```

Do not pass a broad project object to every frontend and filter it only in React.

Verify or document whether the current implementation guarantees:

1. A doer can only query offers assigned to the authenticated doer.
2. A doer cannot access another doer’s offer by changing an ID or URL.
3. An offer cannot be accepted after withdrawal or expiry.
4. A declined offer cannot be accepted later.
5. A reassigned offer cannot be accepted by the former doer.
6. Acceptance is idempotent and replay-safe.
7. Verification and capacity gates are server-enforced.
8. Client identity never appears in doer responses.
9. Client price never appears in doer responses.
10. Doer identity never appears in client responses.
11. Doer payout never appears in client responses.
12. Realtime events expose only role-allowed fields.
13. Chat messages are routed through the supervisor boundary.
14. Working links do not expose client identity.
15. Error messages do not leak internal metadata.
16. Payout mutations are limited to authorized operations roles.
17. Audit events record sensitive assignment, review, approval, and payout transitions.

If the backend cannot be verified from the repository, do not claim that it is secure. Mark the exact dependency as blocked in the validation report.

---

## Translate the teammate’s AssignX creativity into Dolancer

Do not copy AssignX’s page literally. Preserve Dolancer’s own visual identity.

The following concepts may be adapted:

### 1. Private lifecycle rail

Create a Dolancer-specific rail:

```text
Offer received
→ Scope reviewed
→ Accepted
→ In progress
→ Submitted
→ Supervisor review
→ Approved
→ Payout queued
→ Paid
```

The rail must reflect real server state. Do not animate fictional progress.

### 2. Supervisor ownership card

Show:

- Supervisor role.
- What the supervisor reviews.
- How to request clarification.
- Response state only if real.
- Escalation action.

Do not show client identity or AssignX identity.

### 3. Action Required hub

Use real action states:

- Review assigned offer.
- Complete verification.
- Add working link.
- Submit delivery.
- Address requested changes.
- Add payout details.

Every action needs one next step, a reason, and a safe fallback.

### 4. Route-line visuals

Use a Dolancer-owned interpretation of AssignX’s connected workflow:

```text
Assigned offer
→ Supervisor checkpoint
→ Protected workspace
→ Review checkpoint
→ Payout release
```

Use Dolancer’s own colors, iconography, typography, labels, and illustration shapes. Do not copy AssignX’s exact logo, line geometry, hero composition, phrases, or graphics.

### 5. QA checkpoint signals

Show only real checks, such as:

- Brief reviewed.
- Acceptance criteria checked.
- Working link received.
- Delivery received.
- Supervisor review complete.
- Changes requested.
- Quality gate cleared.

Do not claim automated QA, plagiarism scanning, AI detection, security auditing, or guaranteed quality unless those systems exist and have approved copy.

### 6. Responsive active-work view

Adapt the client-oriented project dashboard into a private doer view with:

- My work list.
- Active work grouped by lifecycle.
- Deadlines.
- Status timeline.
- Action-required items.
- Capacity information.

Do not add client-facing Gantt, client payment, public task browsing, bidding, or marketplace filters to Dolancer.

---

## Post-Claude sequence

When your current implementation is complete, do the following before adding another major visual feature:

### Step 1: Freeze the baseline

Report:

- Changed files.
- Features implemented.
- Tests run.
- Tests passed.
- Tests failed.
- Known limitations.
- Backend assumptions.
- Legal placeholders.
- Unfinished work.

Do not overwrite this baseline with a new redesign.

### Step 2: Create a surface-contract matrix

Create a local document such as:

```text
docs/ASSIGNX_DOLANCER_SURFACE_CONTRACT.md
```

Include:

- Field or concept.
- AssignX client visibility.
- Dolancer doer visibility.
- Supervisor visibility.
- Storage location.
- API projection.
- Redaction rule.
- Audit requirement.
- Legal dependency.

At minimum cover:

- Project ID.
- Client identity.
- Client company.
- Client contact.
- Client budget.
- Doer identity.
- Doer payout.
- Supervisor identity.
- Scope.
- Acceptance criteria.
- Deadline.
- Working link.
- Deliverables.
- Revision reason.
- QA status.
- Approval status.
- Payout status.
- Chat messages.
- Attachments.
- Support tickets.
- Audit events.

### Step 3: Run the leakage audit

For AssignX, search rendered output, API responses, metadata, links, file names, notifications, chat, and errors for:

- Dolancer.
- Doer name.
- Doer email.
- Doer location.
- Doer payout.
- Internal assignment IDs.

For Dolancer, search for:

- AssignX.
- Client company.
- Client name.
- Client email.
- Client phone.
- Client website.
- Client payment.
- Client budget.
- Client dashboard links.

Test both the UI and API. UI hiding is not sufficient.

### Step 4: Add private Dolancer lifecycle components

Only after the surface contract and leakage audit:

- Private lifecycle rail.
- Supervisor ownership card.
- Action-required hub.
- Dolancer route-line empty/loading illustration.
- Status milestone cards.
- Supervisor-only communication panel.
- QA and review checkpoint visuals.
- Responsive active-work grouping.
- Meaningful state transitions tied to actual API responses.

### Step 5: Validate role separation

Use separate test accounts:

```text
AssignX client test account
Dolancer doer test account
Internal supervisor test account
```

Test public pages, authenticated routes, refresh, direct URLs, unauthorized access, stale requests, error states, realtime updates, chat, files, and notifications.

Never validate only through a privileged supervisor account.

---

## Important content warning

The AssignX reference site contains impressive but potentially unverified visual claims and examples, including:

- Delivered-project counts.
- Trustpilot ratings.
- Customer logos.
- Named testimonials.
- “Guaranteed delivery.”
- “Zero financial risk.”
- Specific supervisor names and photos.
- Specific project progress and payment examples.
- “Assignments & Research.”

Treat these as visual references only. Do not transfer them into Dolancer. Do not expose them to doers. Do not reuse names, photos, logos, quotes, ratings, metrics, or guarantees without source, consent, date, definition, legal approval, and an update owner.

Also reconcile all research-related language with Dolancer’s prohibited academic-work rules. Use “Research & Business” and exclude academic assessment, coursework, exam, plagiarism, fabrication, and impersonation work.

---

## Do not violate these constraints

Do not:

- Deploy.
- Publish.
- Modify the Vercel production site.
- Expose AssignX to Dolancer doers.
- Expose Dolancer to AssignX clients.
- Add public work browsing.
- Add bidding.
- Add public client selection.
- Add fake activity.
- Add fake urgency.
- Add unsupported guarantees.
- Add unverified metrics.
- Add client identity to doer views.
- Add doer identity to client views.
- Treat UI hiding as a security control.
- Claim backend security that was not verified.
- Replace the current app with a generic starter.
- Add decorative animation that hides state or content.

---

## Final target

AssignX should feel like a complete client managed-delivery product.

Dolancer should feel like a complete private doer assignment, execution, review, and payout product.

The supervisor should be able to bridge both surfaces internally.

Neither end user should know the other product exists.

The desired Dolancer experience is:

> A calm, premium work cockpit for verified doers, where every assignment has a clear owner, every deliverable has a visible review path, every communication route is protected, and every payout has an understandable release state.

Implement this supporting instruction after the current work is stable. Preserve good existing work and make the smallest coherent changes necessary.

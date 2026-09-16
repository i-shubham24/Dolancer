# AssignX–Dolancer Boundary Addendum

## Critical client instruction

Clients must not know that Dolancer exists. Doers must not know the identity of the client-side platform or partner surface. AssignX and Dolancer may share an underlying operational system, but they must not appear to users as partner products, sibling brands, or two visible sides of a marketplace.

This is a **brand and information boundary**, not merely a navigation decision.

The correct relationship is:

```text
Client-facing AssignX surface
        ↓ controlled internal supervisor bridge
Internal operational project record
        ↓ controlled assigned-offer projection
Doer-facing Dolancer surface
```

The supervisor and authorized internal operations may see both sides. The client and doer must see only the information required for their role.

## What the AssignX client must see

The client sees AssignX as the complete service provider and managed delivery platform.

The client may see:

- AssignX branding.
- AssignX navigation, domain, email, support, and legal identity.
- Their request and approved scope.
- A named or role-labelled AssignX project supervisor if that is operationally approved.
- Managed milestones.
- QA status.
- Review-ready deliverables.
- Approval actions.
- Payment or escrow information handled under AssignX policy.
- A controlled supervisor communication channel.
- AssignX support and escalation.
- Generic managed-team language such as “our delivery team” or “our implementation team.”

The client must not see:

- The Dolancer name.
- Dolancer URLs.
- Dolancer logos, icons, colors, legal links, or product names.
- Doer names.
- Doer profiles.
- Doer location, education, experience, rate, payout, or identity.
- Internal doer IDs.
- “Dolancer,” “doer network,” “freelancer,” or “creator marketplace” language.
- Any link to the doer-facing application.
- Internal assignment notes.
- Doer chat or doer-facing status metadata.
- Internal category labels that reveal partner routing.
- File names, metadata, notifications, email sender names, or URLs that expose Dolancer.

The AssignX design should therefore use the teammate’s strongest creative patterns as a polished client experience:

> Tell us what you need → Scope locked → Supervisor owns delivery → Managed team executes → QA complete → Client reviews and approves.

This experience must never explain that the work is being sourced through a separate partner platform.

## What the Dolancer doer must see

The doer sees Dolancer as the complete work and payout surface.

The doer may see:

- Dolancer branding.
- Dolancer navigation, domain, email, support, and legal identity.
- Assigned offers routed by an authorized supervisor.
- The work category and deliverable brief.
- Acceptance criteria.
- Deadline.
- Doer payout, approved deductions, and net payout where permitted.
- Protected working link.
- Supervisor messages.
- Review feedback.
- Revision status.
- Approval status as exposed by policy.
- Payout status.
- Training, verification, skills, levels, referrals, notifications, and support.
- Generic counterparty labels such as “AssignX client,” “client representative,” or a role label only if required by the PRD.

The doer must not see:

- The client’s company, brand, name, email, phone, location, website, or identifying context.
- The AssignX name if the client instruction requires complete separation.
- AssignX logo, URLs, legal pages, app links, or partner references.
- Client-facing milestone budget or client payment amount.
- Client dashboards, client screenshots, client comments containing identity, or client notification templates.
- Source platform references in file names, URLs, API responses, logs rendered in the UI, or chat metadata.
- Any invitation to contact or select the client.
- Any “client panel” or “approve and pay” control.

The Dolancer workflow should therefore use the same operational truth but different user-facing language:

> Supervisor assigned an offer → Review brief → Accept or decline → Work in protected workspace → Submit for supervisor review → Address revisions → Approval clears → Payout releases.

The doer should experience this as a private assignment and managed professional workflow, never as access to AssignX or a public client project.

## What supervisors and internal operations may see

Authorized supervisors may need a unified internal view, but that view must be role-protected and must not be reused directly as either public surface.

The supervisor view may include:

- Internal project ID.
- AssignX/client-side request.
- Scope and quote.
- Client communication.
- Assignment decisions.
- Candidate or doer records.
- Internal QA.
- Doer payout information.
- Client payment information where authorized.
- Audit trail.
- Held-message review.
- Escalation and dispute information.

The supervisor view must not be exposed through client or doer APIs. It should have a distinct internal role, navigation, permissions, DTOs, and audit logging.

## Brand firewall requirements

Treat AssignX and Dolancer as separate products at the presentation, API, and operational layers.

### Presentation firewall

Do not share:

- Visible logos.
- Product names.
- Partner references.
- Cross-links.
- Shared favicon or app title if it reveals the other product.
- Cross-branded legal pages.
- Cross-branded footer links.
- Shared public testimonials that reveal the relationship.
- Screenshots that expose the other surface.
- Identical app shell navigation.
- Copy such as “from AssignX,” “powered by Dolancer,” or “our partner platform.”

Shared design primitives are acceptable, but each surface must have its own visible brand treatment and vocabulary.

### API firewall

Do not pass cross-surface information through client or doer DTOs merely because the frontend hides it.

Use separate role-specific projections such as:

- `ClientProjectView`.
- `SupervisorProjectView`.
- `DoerOfferView`.
- `DoerWorkbenchView`.
- `ClientMilestoneView`.
- `InternalAuditView`.

Each projection must explicitly select allowed fields. Avoid returning a broad project object and filtering in React.

### URL and file firewall

Check all of the following for leakage:

- Browser URLs.
- Document URLs.
- Working-link URLs.
- Download names.
- Uploaded file names.
- Image alt text.
- OpenGraph metadata.
- Browser title.
- Favicon.
- Email sender and reply-to fields.
- Notification titles.
- Support ticket metadata.
- Error messages.
- Realtime event payloads.
- Analytics event names.
- Sentry or logging labels visible to users.

### Communication firewall

The supervisor is the controlled communication bridge.

Client messages should be routed to the supervisor or AssignX team. Doer messages should be routed to the supervisor. Do not expose direct client-to-doer messaging.

If an AI or moderation layer screens messages, it must operate within the correct role boundary and must not disclose the other surface or hidden identity.

## How to reuse the teammate’s creativity safely

The AssignX implementation has excellent patterns that can inspire Dolancer without exposing the partnership.

### 1. Route-line hero

AssignX’s strongest visual idea is a connected route from request to approval. Reinterpret it for Dolancer as a private assignment route:

```text
Assigned offer → Supervisor brief → Protected workspace → Review → Payout
```

Use Dolancer’s own palette, labels, icons, and illustrations. Do not copy AssignX’s logo, exact hero, exact line geometry, or client wording.

### 2. Six-step lifecycle

AssignX visually communicates a sequence with numbered nodes, progress lines, and status chips. Dolancer can use a doer-specific lifecycle rail:

1. Offer received.
2. Scope reviewed.
3. Offer accepted.
4. Work in progress.
5. Submitted to supervisor.
6. Approved and payout queued.

Some steps can be collapsed on mobile. The rail must reflect actual server state, not a decorative animation.

### 3. Supervisor ownership card

AssignX makes the supervisor visible and responsible. Dolancer can use a supervisor card with:

- Supervisor role.
- Current availability or response status only if real.
- What the supervisor reviews.
- How to ask for clarification.
- Escalation action.

Do not show the client identity or the AssignX brand.

### 4. Action-required hub

AssignX’s “Action Required” pattern is highly valuable. Dolancer can use it for:

- Offer awaiting response.
- Verification action required.
- Working link required.
- Revision requested.
- Delivery incomplete.
- Supervisor clarification needed.
- Payout information missing.

Each action should have one clear next step, a reason, and a safe fallback.

### 5. Status and milestone cards

AssignX uses status labels such as In Progress, Review, Pending, and QA Passed. Dolancer can use:

- Assigned.
- Awaiting acceptance.
- In progress.
- Supervisor review.
- Changes requested.
- Resubmitted.
- Approval pending.
- Payout pending.
- Payout released.

Do not expose client payment values or client-facing milestone budgets.

### 6. Preview modes

AssignX uses table, Gantt, and Kanban concepts. Dolancer should not automatically copy all three. The appropriate doer-facing adaptation is:

- My work list.
- Active work grouped by lifecycle.
- Compact status timeline.
- Optional calendar/deadline view if it serves doer capacity.

A full client-oriented Gantt may reveal details or complexity that doers do not need. Use it only if the PRD and permissions support it.

### 7. Supervisor channel

The teammate’s supervisor communication panel is a strong pattern. Dolancer should implement a supervisor-only conversation with:

- Clear sender role.
- Protected attachments.
- Message screening or held-message behavior where required.
- No client identity.
- No client contact information.
- No direct external messaging.
- Clear unread and action-required states.

### 8. QA and approval signals

AssignX’s “Supervisor QA Passed” is a good trust pattern. Dolancer can show:

- Brief checked.
- Acceptance criteria reviewed.
- Working link verified.
- Delivery received.
- Supervisor review complete.
- Changes requested.
- Quality gate cleared.

Do not claim automated QA, plagiarism checks, AI checks, or guaranteed quality unless those systems are real, explained, and approved.

### 9. Dark mode and theme control

AssignX includes a visible theme switch. Dolancer may keep its palette switcher and consider a dark mode only if contrast, semantic colors, screenshots, and motion states are fully tested. Theme switching must never be used to imitate AssignX. It should be a Dolancer preference.

## What must not be copied from AssignX into Dolancer

Do not copy the following client-side concepts into the doer experience:

- Create Work.
- Client Panel.
- Review and Pay.
- Escrow approval buttons.
- Client milestone budgets.
- Client team names.
- Public “managed marketplace” positioning.
- Doer photos visible to clients.
- Partner ecosystem references that expose the relationship.
- AssignX testimonials or client logos.
- AssignX exact claims such as 2.5k delivered projects, 4.98 Trustpilot, or “guaranteed milestone delivery” unless independently verified and legally approved for the specific surface.

Do not copy the AssignX phrase “Assignments & Research” without reconciling it with Dolancer’s prohibited academic-work rules. Use “Research & Business” and clearly exclude academic assessment work.

## Post-Claude execution plan

Claude is currently executing the approved Dolancer code task in the background. Do not merge AssignX ideas into the active work blindly. Wait until Claude reports its files, tests, and remaining gaps.

### Post-Claude Phase A: Inspect and preserve

1. Review Claude’s changed-file list.
2. Review its validation report.
3. Start the local Dolancer application.
4. Confirm that the current Claude work is stable.
5. Create a visual and interaction baseline before integrating AssignX-inspired ideas.
6. Do not overwrite Claude’s work with a second broad redesign.

### Post-Claude Phase B: Establish surface contracts

Create a cross-surface matrix with columns for:

- Field or concept.
- AssignX client visibility.
- Dolancer doer visibility.
- Supervisor visibility.
- Storage location.
- API projection.
- Redaction rule.
- Audit requirement.
- Legal dependency.

At minimum include:

- Project ID.
- Client name.
- Client company.
- Client contact.
- Client budget.
- Doer ID.
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

### Post-Claude Phase C: Implement the Dolancer visual translation

Build only the following AssignX-inspired ideas in Dolancer:

1. Private lifecycle rail.
2. Supervisor ownership card.
3. Action-required hub.
4. Route-line hero or empty-state illustration.
5. Status milestone cards.
6. Supervisor-only communication panel.
7. QA and review checkpoint visuals.
8. Responsive active-work grouping.
9. Carefully defined theme control.
10. Meaningful state transitions tied to real API responses.

Keep Dolancer’s own:

- Product name.
- Logo.
- Color palette.
- Typography.
- Copy.
- Icon language.
- Legal identity.
- Trust claims.
- Privacy surface.

### Post-Claude Phase D: Test for cross-surface leakage

Perform a dedicated leakage audit.

For the AssignX client surface, search rendered text, HTML, metadata, network responses, links, filenames, images, and browser titles for:

- Dolancer.
- Doer identity.
- Doer email.
- Doer location.
- Internal assignment IDs.
- Doer payout.
- Doer profile information.

For the Dolancer doer surface, search for:

- AssignX.
- Client company.
- Client name.
- Client email.
- Client phone.
- Client website.
- Client payment.
- Client budget.
- Client dashboard links.
- AssignX legal or support links.

Test both UI and API responses. UI hiding is not sufficient.

### Post-Claude Phase E: Approve only after both brands remain coherent

The integration is successful only if:

- AssignX feels like a complete client managed-delivery product.
- Dolancer feels like a complete doer assigned-work and payout product.
- Neither side knows the other partner brand.
- The supervisor can safely bridge both sides internally.
- The shared route line and lifecycle ideas communicate the same operational truth without sharing identity.
- The client never sees doer identity or partner-platform details.
- The doer never sees client identity or partner-platform details.
- The visual quality is elevated without becoming a marketplace imitation.
- Every animation represents a real state or safe preview.

## Final product architecture

The intended architecture is:

```text
AssignX client UI
  - AssignX brand
  - client request
  - client scope
  - supervisor communication
  - milestone review
  - client approval/payment
  - no Dolancer or doer identity

Internal supervisor/operations UI
  - role-protected
  - unified operational record
  - client and doer projections
  - assignment, QA, screening, escalation, payout controls
  - full audit trail

Dolancer doer UI
  - Dolancer brand
  - assigned offers
  - supervisor communication
  - protected workspace
  - delivery and revision workflow
  - payout and training
  - no AssignX or client identity
```

This is not a public two-sided marketplace. It is a controlled managed-delivery system with two intentionally isolated branded surfaces and one protected internal operational bridge.

## Important warning about AssignX’s current visible claims

The AssignX page currently displays impressive but potentially unverified claims and examples, including:

- 2.5k+ delivered projects.
- 4.98 Trustpilot.
- Named client testimonials.
- Company logos.
- “Guarantee milestone delivery.”
- “Zero financial risk.”
- “Assignments & Research.”
- Specific names and photos of supervisor/doer-like people.
- Specific project progress and payment examples.

Treat these as visual reference content only until the owner confirms evidence, consent, legal approval, and correct product scope. Do not transfer them into Dolancer. Do not assume they can be shown to doers. Do not expose the relationship between products.

## Final recommendation

AssignX has a strong creative foundation for the client side: it makes an abstract managed-service workflow visible through route lines, progress cards, supervisors, milestones, action-required states, QA checkpoints, and review moments.

Dolancer should not clone the AssignX site. It should translate the same operational clarity into a private doer experience with different information, vocabulary, branding, and permissions.

The best Dolancer expression is:

> A supervisor-routed work cockpit for verified doers, where every offer has a clear scope, every action has an owner, every review has a checkpoint, and every payout has a visible release path.

The first post-Claude task should be a surface-contract and leakage audit. Only after that should the AssignX-inspired lifecycle and motion components be integrated.

# Claude Execution Prompt: Dolancer PRD-Conformance, Trust, Frontend, Motion, and Validation

You are executing a heavy, multi-phase product and frontend task for the Dolancer project. Work directly in the local repository:

```text
D:\Dolancer
```

Do not work on the deployed Vercel site. Do not deploy, publish, push, or modify production unless explicitly requested later. All implementation and testing must remain local until the user separately approves deployment.

The goal is to complete Dolancer as a truthful, premium, supervised service platform aligned with the following sources:

1. The Assign Experts Platform PRD.
2. The standalone Dolancer prototype.
3. The current local Dolancer codebase.
4. The existing Dolancer implementation plan.
5. The approved execution strategy below.
6. Frontend research from Aardvark Book Club, Fiverr, Upwork, Freelancer, and Toptal.

You must preserve existing good visual work and existing application architecture wherever possible. Do not replace the project with a generic starter, a new framework, a new design system disconnected from the current one, or a shallow AI-generated redesign.

---

## 1. Product truth and non-negotiable positioning

Dolancer is the doer-facing surface of a managed service. It is not a public freelance marketplace.

The intended flow is:

> Brief → Route → Work → Review → Release

A client submits a request through the related AssignX or internal service. Internal staff quote and collect payment. A supervisor routes a suitable, specific project to a vetted doer. The supervisor provides or controls the working environment, oversees communication, reviews the work, handles the client relationship, and controls the approval path. The doer performs the accepted scope and receives payout after the applicable approval gate clears.

The doer must not:

- Browse a public marketplace of projects.
- Browse or select clients.
- Bid against other doers.
- Write competing proposals.
- Negotiate publicly.
- Identify or directly communicate with the client as an identifiable person.
- See the client’s name, company, email, phone, location, or other identifying detail.
- See the client price if it differs from doer payout.
- Claim arbitrary public work.

The client must not receive the doer’s:

- Name.
- Location.
- Personal contact details.
- Education.
- Experience level.
- Platform identity.
- Rate or payout.
- Private profile information.

The frontend must never imply public browsing, open bidding, public seller comparison, public client selection, or instant marketplace work.

User-facing language must prefer:

- Assigned offer.
- Supervisor-routed project.
- Accept offer.
- Decline offer.
- My work.
- Review and approval.
- Protected workspace.
- Supervisor support.
- Payout after approval.

Avoid user-facing:

- Claim brief.
- Claim task.
- Public pool.
- Task board.
- Open brief.
- Browse jobs.
- Bid.
- Proposal race.
- Choose a client.
- Live activity theater.
- Fake scarcity.
- Fake urgency.

Internal function names such as `claimProject` may remain temporarily if changing them would break backend contracts, but no internal terminology may leak into user-facing UI, toast messages, accessibility labels, page titles, or marketing copy.

---

## 2. PRD scope that must be represented

The minimum complete doer surface includes:

- Light onboarding.
- Passwordless email OTP authentication.
- Explicit 18+ eligibility gate.
- Country and account setup.
- Discipline selection.
- Identity verification.
- Payout setup.
- Non-blocking verification where the PRD permits account exploration.
- Payment and payout gating.
- Manual supervisor project offers.
- Offer acceptance and rejection.
- Project capacity limits.
- Company-controlled or approved working link.
- Supervisor communication.
- Delivery and revision handling.
- Quality feedback.
- Levels.
- Earnings.
- Payout history.
- Training.
- Referrals.
- Notifications.
- Support tickets.
- Legal pages.
- Privacy and identity protection.
- Auditability.
- Role-based access control.

The wider system must eventually support or truthfully expose dependencies for:

- Client submission.
- Internal quotation.
- Verified client payment.
- Manual assignment.
- Server-enforced lifecycle statuses.
- Chat screening.
- Held-message review.
- Delivery approval.
- Revision limits.
- Ratings where legally and operationally approved.
- TDS handling.
- Payout authorization.
- Refunds.
- Immutable audit logs.
- Role-based permissions.

Do not invent backend behavior. If the backend is not implemented or cannot be verified, the frontend must not promise it as completed. In demo mode, label fictional behavior clearly and keep it isolated from production logic.

---

## 3. Canonical categories

Use this canonical category set consistently throughout public content, onboarding, skills, demo data, examples, filters, admin terminology, and offer cards:

1. Writing & Content
2. Design
3. Creative & Media
4. IT & Software
5. AI Agents & Automations
6. Marketing
7. Research & Business
8. Something Else

Do not present academic coursework, essay writing, dissertation writing, exams, graded assignments, plagiarism, fabrication, impersonation, or research misconduct as services.

Research services must be described as lawful business, market, technical, data, or operational research. They must include prohibited-use boundaries.

---

## 4. Existing local work that is already present and must be preserved

The local code already includes substantial prior work. Before changing anything, inspect the current files and preserve the established visual language.

Existing implemented or partially implemented areas include:

- Marketing layout and landing page.
- Public How It Works page.
- About and Contact pages.
- Local Terms and Privacy routes.
- Auth layout.
- Passwordless email OTP flow.
- Demo sign-in flow.
- Google authentication path.
- Turnstile support.
- Sign-in and sign-up shared page.
- 18+ sign-up confirmation.
- Terms acceptance.
- Privacy acknowledgement.
- Authenticated AppShell.
- Dashboard.
- Assigned offers page.
- Offer cards.
- Offer review drawer.
- Work list.
- Workbench.
- Working-link gate.
- Lifecycle actions.
- Supervisor chat panel.
- Realtime project refresh.
- Verification page.
- Skills.
- Training.
- Notifications.
- Earnings.
- Referrals.
- Support tickets.
- Admin route.
- Four palette options.
- Framer Motion transitions.
- Responsive layouts.
- Existing visual primitives.
- Existing content and legal drafts.

Do not remove existing product architecture such as:

- React Router route structure.
- Protected route boundaries.
- AuthProvider.
- Supabase API boundaries.
- TanStack Query hooks and query keys.
- Existing mutations.
- Demo mode.
- Existing loading, empty, error, skeleton, retry, and accessibility primitives.
- Existing realtime invalidation.
- Existing payout formatting.
- Existing lifecycle status helpers.

---

## 5. Known current issues and loopholes

### 5.1 Backend assignment enforcement is not proven

The frontend now describes a private assigned-offer system, but internal code still uses:

- `doer_pool`.
- `claim_project_as_doer`.
- `claimProject`.
- Pool query abstractions.
- Claim mutation names.

Do not assume these are safe merely because the UI says “assigned offers.” Verify or document the backend boundary.

Confirm that:

1. The doer-facing query only returns rows assigned to the authenticated doer.
2. Changing a project ID or request parameter cannot expose another doer’s offer.
3. The database view filters by authenticated user.
4. The acceptance RPC checks authenticated identity.
5. The RPC checks assignment ownership.
6. The RPC checks verification state.
7. The RPC checks project capacity.
8. The RPC checks project status.
9. Withdrawn offers cannot be accepted.
10. Expired offers cannot be accepted.
11. Declined offers cannot be accepted later.
12. Reassigned offers cannot be accepted by the former doer.
13. Duplicate acceptance is idempotent and safe.
14. The returned doer view contains no client identity.
15. The returned doer view contains no client price.
16. Errors do not leak private or administrative metadata.
17. Realtime events contain only permitted information.
18. Chat messages are routed through the correct supervisor/doer boundary.
19. Working links do not expose client identity.
20. Payout operations remain restricted to authorized QQD/Admin or approved service roles.

If backend SQL, migrations, RPCs, or policies are available in the repository, inspect and test them. If they are not available, record the unverified dependency clearly and do not claim Phase 0 is complete.

### 5.2 Legal pages are local drafts, not final legal advice

The current local Terms and Privacy content is intentionally a structural baseline. It covers:

- 18+ eligibility.
- Identity and payout verification.
- Payment and withholding.
- Prohibited academic and unlawful work.
- Confidentiality.
- IP.
- Payout approval.
- Data collection.
- Data retention.
- Grievance contacts.
- Security.
- Identity masking.

It still requires qualified review and confirmed values for:

- Legal entity address.
- Correct legal entity name.
- CIN or applicable registration information.
- Grievance officer.
- Data protection contact.
- Governing law.
- Dispute forum.
- Exact retention periods.
- Processor and vendor list.
- Cross-border processing.
- Cookies and analytics.
- Account deletion process.
- Data access and correction process.
- Refund and cancellation policy.
- Worker classification.
- Final payout timing.
- IP transfer/licence language.

Do not silently convert draft values into production claims. Keep clear local-preview labels until approved.

### 5.3 Demo data has older terminology

Inspect all demo data and align it with canonical categories and assigned-offer language. Some seeded records may still use labels such as:

- Content Writing.
- Social Media.
- Claiming a task.
- Board.
- Public pool.
- Task-oriented descriptions.

Use canonical categories and consistent user-facing language. Demo behavior must model private supervisor routing, not a public marketplace.

### 5.4 Scroll reveal may fail due to route timing

The earlier implementation mounted `ScrollRevealController` globally in `App.tsx` and searched for `#main`. Because `#main` is rendered inside the router layout, it may not exist when the controller effect runs. The effect may return permanently, leaving reveals unattached.

Fix this by one of the following preferred approaches:

- Mount the reveal controller inside `MarketingLayout` and `AppShell` next to the `main` element.
- Or make the controller route-aware and rerun when the outlet changes.
- Or observe for the layout root before attaching.

Do not hide content by default. The safest pattern is that content is visible by default and reveal classes are progressive enhancement only. A no-JavaScript browser must see all text. A reduced-motion browser must see all text immediately.

### 5.5 Progressbar accessibility inconsistency

The progress bar may currently place a `role="progressbar"` inside an `aria-hidden="true"` parent. Correct this by either:

- Making the entire indicator decorative and removing the progressbar role.
- Or removing `aria-hidden` and making the indicator accessible.

For a page-scroll indicator, decorative presentation is acceptable and likely preferable. Do not create unnecessary screen-reader announcements for scroll position.

---

## 6. Phase 0: Truth, permissions, terminology, route audit

Do this first. Do not start large visual redesign work until Phase 0 is complete or all unverified dependencies are explicitly documented.

### 6.1 Build the traceability matrix

Create a repository document such as:

```text
docs/PRD_TRACEABILITY_MATRIX.md
```

Map each requirement to:

- Requirement.
- PRD/prototype reference.
- User role.
- Screen or route.
- Component.
- API/query/mutation.
- Database policy or RPC.
- State/status.
- Test or verification method.
- Owner.
- Legal or operational dependency.
- Status: verified, partial, missing, blocked, or draft.

Include at least:

- Onboarding.
- 18+ gate.
- Passwordless auth.
- Country setup.
- Verification.
- Payout setup.
- Assigned offers.
- Accept.
- Decline.
- Withdrawn.
- Expired.
- Reassigned.
- Capacity.
- Working link.
- Supervisor chat.
- Delivery.
- Revisions.
- Approval.
- Payout.
- TDS display.
- Earnings.
- Training.
- Referrals.
- Notifications.
- Support.
- Legal routes.
- Identity masking.
- Client price masking.
- Audit logging.
- RLS and RPC enforcement.

### 6.2 Build the permission/state matrix

Create a document such as:

```text
docs/PERMISSION_STATE_MATRIX.md
```

For each role, route, action, and state, record:

- Who can see it.
- Who can change it.
- Preconditions.
- Server enforcement.
- UI state.
- Error state.
- Audit event.

Roles should include at least:

- Doer.
- Supervisor.
- Client or AssignX side.
- QQD/Admin.
- Support.
- System/automation where applicable.

### 6.3 Add explicit edge-state handling

Where the current domain model allows it, add explicit states or safe UI handling for:

- Offer pending.
- Offer accepted.
- Offer declined.
- Offer withdrawn.
- Offer expired.
- Offer reassigned.
- Offer blocked by verification.
- Offer blocked by capacity.
- Project in progress.
- Project submitted.
- Supervisor review.
- Changes requested.
- Client approval pending.
- Approved.
- Payout pending.
- Payout released.
- Payout held.
- Payout failed.
- Project cancelled.
- Dispute/escalation.

Do not invent backend states if they do not exist. If an edge state is not supported, show a safe neutral fallback and document it as a gap.

### 6.4 Fix route-timed reveal behavior

Move or redesign `ScrollRevealController` so it attaches after layout rendering and after route changes. It must:

- Work on marketing routes.
- Work on authenticated routes.
- Work after navigation.
- Work after lazy-loaded content appears.
- Avoid observing hidden or irrelevant elements.
- Unobserve elements after reveal.
- Disconnect cleanly on unmount.
- Avoid mutation observer loops.
- Avoid hiding text if the observer fails.
- Show all content under reduced motion.
- Show all content if IntersectionObserver is unsupported.

### 6.5 Terminology sweep

Search all user-facing files, content constants, accessibility labels, toast messages, empty states, page titles, and demo data for:

- claim
- board
- pool
- browse jobs
- open brief
- bid
- proposal
- client selection
- public marketplace
- live activity
- guaranteed payout
- instant transfer
- 48-hour payout

Replace only where the replacement reflects the PRD and actual backend behavior. Preserve internal API names if necessary, but do not expose them.

### Phase 0 gate

Do not claim Phase 0 complete unless:

- Traceability matrix exists.
- Permission/state matrix exists.
- Backend assignment boundary is verified or clearly blocked.
- Identity and client-price masking are verified or clearly blocked.
- Route-timed reveal bug is fixed.
- Text is visible without JS and under reduced motion.
- Public wording no longer implies a marketplace.
- Edge states are represented or documented.
- Local type and lint checks are attempted and results recorded.

---

## 7. Phase 1: Brief-first public conversion foundation

Only begin after Phase 0 changes are stable.

### 7.1 Hero and primary conversion

Change the first public action from a broad generic “Start earning” promise to a clearer supervised action appropriate to the actual audience. Recommended primary CTA:

```text
Start a brief
```

or:

```text
Tell us what you need
```

Recommended secondary CTA:

```text
See how supervision works
```

If Dolancer is primarily a doer-facing product at this stage, the hero may instead use:

```text
Join the verified doer network
```

but do not imply open work browsing.

The hero must answer:

- What Dolancer is.
- Who owns the work.
- What the user receives.
- What the user does next.
- What is protected.

### 7.2 Progressive brief flow

Build a guided brief or request capture flow only if the backend/API surface exists or can be safely demo-modeled.

Start with:

- What do you need?
- Desired outcome.
- Canonical category.
- Deadline.
- Budget range.
- Constraints.
- Contact.
- Consent.

Use progressive disclosure for advanced questions. Show a review summary before submission. After submission, show:

- Confirmation.
- Request identifier.
- Current owner or team.
- Expected next step.
- Expected response range only if verified.
- Support/contact route.
- Scope-change explanation.

Do not create public provider results. The response should start a supervised route.

### 7.3 Intent shortcuts

Borrow competitor search guidance without creating an inventory marketplace. Add example prompts such as:

- I need a landing page.
- I need product video assets.
- I need a market research report.
- I need a technical integration.
- I need content for a product launch.

Selecting one should prefill a brief or highlight a category, not reveal public sellers.

### 7.4 Trust near decisions

Add a trust panel near primary CTA and near final submit. It should explain:

- Supervisor ownership.
- Scope confirmation.
- Protected workspace.
- Review and approval.
- Revision handling.
- Payment conditions.
- Privacy and identity protection.
- Support and escalation.

Every claim must be evidence-backed or clearly labeled as a process description.

### 7.5 Curated categories

Use the eight canonical categories as curated examples. Each category should show:

- Typical lawful outcomes.
- Example deliverables.
- Supervisor/review path.
- Relevant prohibited-work boundary if needed.
- No fabricated counts.
- No fake activity.
- No unsupported earnings.

### 7.6 FAQ

Add or improve FAQ around:

- Scope.
- Timing.
- Supervisor role.
- Review.
- Approval.
- Payment.
- Tax/withholding.
- Revisions.
- Privacy.
- Identity masking.
- Prohibited work.
- Support.
- Cancellations and disputes.

### Phase 1 gate

A new visitor should be able to explain the model after one visit. A visitor should be able to start a request without encountering a public marketplace. Every submitted request must expose an owner and next step. Metrics must be factual and instrumentation must avoid unnecessary personal data.

---

## 8. Phase 2: Unified design, trust, and responsive system

### 8.1 Semantic token system

Formalize tokens for:

- Canvas.
- Surface.
- Elevated surface.
- Primary.
- Primary hover.
- Secondary.
- Accent.
- Text.
- Muted text.
- Border.
- Focus ring.
- Success.
- Warning.
- Danger.
- Information.
- Ambient gradients.
- Motion durations.
- Easing.
- Spacing.
- Responsive breakpoints.
- Elevation.

Preserve the four palette concept, but ensure the active palette changes semantic tokens rather than isolated hardcoded colors. Use one Dolancer primary action color and separate semantic status colors. Do not copy Fiverr’s green, Upwork’s green, Freelancer’s brand treatment, or Aardvark’s exact combinations.

### 8.2 Shared components

Create or evolve reusable components for:

- Brief-first hero.
- Process rail.
- Trust panel.
- Case study.
- Supervisor ownership card.
- Scope summary.
- Status timeline.
- FAQ accordion.
- Evidence metric.
- Contact capture.
- Loading state.
- Empty state.
- Error state.
- Blocked state.
- Reduced-motion variant.
- Responsive drawer.
- Accessible horizontal category rail.

Use two visual families:

1. Editorial/visual cards for categories, outcomes, and examples.
2. Dense operational cards for authenticated offers, work, statuses, evidence, and payout.

Do not render every section as the same generic rounded card.

### 8.3 Trust content model

Centralize trust content so it cannot drift. Every trust item needs:

- Claim.
- Definition.
- Evidence/source.
- Owner.
- Date.
- Update cadence.
- Legal status.
- Consent status if testimonial or logo.
- Backend enforcement status if it describes behavior.

Unverified metrics and testimonials must remain clearly marked in local preview or be hidden from production-facing routes. Do not delete the user-requested placeholders without recording why they are not production-safe.

### 8.4 Responsive and accessibility work

Test:

- 375px mobile.
- 768px tablet.
- 1024px laptop.
- 1280px desktop.
- 1440px desktop.

Check:

- 44px minimum touch targets.
- Keyboard navigation.
- Focus visibility.
- Screen-reader labels.
- Semantic headings.
- Contrast across all palettes.
- Drawer focus trapping.
- Escape behavior.
- Horizontal rails.
- Sticky headers.
- Reduced motion.
- Error recovery.
- Deep links.
- Refresh behavior.
- Unauthorized routes.
- Slow network.
- Empty data.
- Failed data.

### Phase 2 gate

All routes use the same tokens, components have documented states, all palettes pass contrast review, and mobile/desktop/keyboard/screen-reader/reduced-motion/error/unauthorized paths pass.

---

## 9. Phase 3: Authored Dolancer motion

Do not add random animation everywhere. Motion must orient, confirm, reveal context, or signal ownership.

It must never hide:

- Legal conditions.
- Status.
- Action availability.
- Important copy.
- Errors.
- Payment terms.
- Privacy conditions.

### 9.1 Signature route-line animation

Create a Dolancer-specific route-line visual system:

1. A brief card enters from the left.
2. A supervisor checkpoint appears in the middle.
3. A discipline/doer marker receives the route.
4. A review stamp confirms progress.
5. A payout token moves to release.

Use this for:

- Loading.
- Empty assigned-offer state.
- Verification processing.
- Workbench status.
- Review waiting.
- Approval.
- Payout release.

Do not copy Aardvark’s exact loading animation. Use independent Dolancer shapes, colors, and language.

### 9.2 Marketing interactions

Hero:

- Subtle pointer response.
- One active outcome card rises.
- Route line tracks pointer slightly.
- Payout/status detail animates only when active.
- Avoid excessive 3D tilt.
- Avoid continuous blobs and generic floating elements.

Process rail:

- Active step gains emphasis on viewport entry.
- Route line progresses.
- Previous steps become quieter.
- Static version remains legible.
- Manual controls remain available.

Categories:

- Selecting a category animates only changed content.
- Show outcomes, deliverables, review path, and policy boundary.
- Do not animate the entire page on each selection.

### 9.3 Authenticated interactions

Animate only real state changes:

- Offer received.
- Offer accepted.
- Offer declined.
- Working link added.
- Delivery submitted.
- Revision requested.
- Supervisor review completed.
- Approval cleared.
- Payout released.
- Capacity slot filled.
- Capacity slot reopened.

Use:

- Status timelines.
- Capacity slots.
- Review stamps.
- Message transitions.
- Small count changes.
- Focused success/error feedback.

Never create fictional live activity to make the product look busy.

### 9.4 Motion safety

- Support `prefers-reduced-motion`.
- Add pause controls for continuous motion.
- Reserve layout space.
- Avoid cumulative layout shift.
- Avoid observer leaks.
- Avoid animation-dependent content.
- Test low-end devices.
- Test touch and keyboard.
- Test screen readers.
- Test slow network.
- Test route transitions.

### Phase 3 gate

Motion-on and motion-off journeys convey the same meaning. The reveal controller cannot fail silently due to route timing. Layout shift and bundle budgets are acceptable. Continuous motion is interruptible or disabled by preference. Motion is tied to real product states.

---

## 10. Phase 4: Evidence-led validation and optimization

Run five to eight moderated sessions with representative users when possible.

Ask them to explain:

- Who owns the work?
- What happens next?
- What is protected?
- How does payment work?
- What happens if work needs changes?
- How do they contact support?
- How do they escalate a problem?

Measure:

- Hero CTA engagement.
- Brief start-to-submit completion.
- Qualified-request rate.
- Clarification loops.
- Confirmation comprehension.
- Supervisor response time.
- Support contacts.
- Request quality.
- Offer acceptance quality.
- Delivery completion.
- Revision frequency.
- Payout exceptions.
- Accessibility failures.
- Runtime errors.
- Route transition failures.
- Reduced-motion failures.

Run one-variable-at-a-time experiments only. Test:

- CTA wording.
- Proof placement.
- Process rail presentation.
- Category presentation.
- FAQ placement.
- Trust panel wording.

Do not test:

- Fake urgency.
- Fake activity.
- Unsupported guarantees.
- Public ranking.
- Public bidding.
- Unverified metrics.
- Dark patterns.

Final approval must include product, design, engineering, operations, privacy/legal, and support.

---

## 11. Competitor frontend findings to preserve

### Fiverr

What Fiverr does well:

- Search-first orientation.
- High-contrast hero.
- Suggested-service chips.
- Category rail.
- Modular sections.
- Early social proof.
- Visible ratings and safety content.
- Progressive disclosure.
- Clear header hierarchy.

Adapt for Dolancer:

- Use one dominant brief-first task.
- Add intent examples without public provider results.
- Use curated category exploration.
- Put verifiable trust near conversion.
- Use inspectable process and support labels.

Do not copy:

- Fiverr’s green identity.
- Seller marketplace.
- Gig browsing.
- Public rating dependence.
- Proprietary imagery.
- Exact wording or layout.

### Upwork

What Upwork does well:

- Two-path orientation.
- Guided project definition.
- Clear outcome and success criteria.
- Structured categories.
- Metadata-rich cards.
- Reviews and work history.
- FAQ objection handling.
- Repeated but understandable CTAs.
- Process stages.

Adapt for Dolancer:

- Guided brief prompts.
- Clear success definition.
- Transparent status metadata.
- Supervisor-owned stages.
- Approval checkpoints.
- FAQ close to conversion.

Do not copy:

- Open hiring.
- Proposal volume.
- Public profiles.
- Opaque matching.
- Marketplace filters.
- Upwork wording, logos, or claims.

### Freelancer

What Freelancer does well:

- Minimal public header.
- Immediate audience CTAs.
- Visual project examples.
- Proof bands.
- Deep information architecture.
- Filters and sorting where inventory exists.
- Grouped FAQs and help links.
- Strong long-page rhythm.

Adapt for Dolancer:

- Compact header.
- Outcome-led examples.
- Carefully defined proof modules.
- Progressive category expansion.
- Self-service help.
- Clear metadata for real work states.

Do not copy:

- Public job feed.
- Bids.
- Urgency theater.
- Public activity counts.
- Huge category walls.
- Ambiguous largest-network claims.

### Aardvark Book Club

What Aardvark does well:

- Expressive color.
- Editorial typography.
- Curated content.
- Strong section rhythm.
- Authored illustrations.
- Four-step narrative.
- Friendly voice.
- Repeated CTA moments.

Adapt for Dolancer:

- Authored route-line art.
- Curated examples.
- Narrative process rail.
- Warm personality.
- Tactile, intentional section transitions.

Do not copy:

- Exact illustrations.
- Mascot or brand shapes.
- Exact loading animation.
- Exact color composition.
- Exact layout or copy.

---

## 12. How to avoid AI-generated design slope

Do not make every element:

- A gradient blob.
- A floating rounded card.
- A pill.
- A hover-lift card.
- A decorative number.
- A random soft illustration.
- A generic trust badge.
- A glowing purple-blue background.

Use product-specific objects:

- Brief card.
- Route connector.
- Supervisor marker.
- Verification seal.
- Payout token.
- Capacity slot.
- Review stamp.
- Workspace link.
- Lifecycle rail.

Use meaningful asymmetry, restrained visual imperfection, and authored composition. Maintain a clear visual grammar rather than random decoration.

Motion should answer:

- What changed?
- What is active?
- What is waiting?
- What is blocked?
- What is approved?
- What needs attention?

Do not use motion merely because a component is present.

---

## 13. Validation protocol

Before declaring any phase complete:

1. Read the changed files back.
2. Run TypeScript compilation.
3. Run ESLint if configured.
4. Run Vite production build.
5. Run demo build if configured.
6. Run secret scan.
7. Run copy guard.
8. Start localhost.
9. Check public landing page.
10. Check How It Works.
11. Check legal Terms.
12. Check legal Privacy.
13. Check sign-up gate.
14. Check demo sign-in.
15. Check dashboard.
16. Check assigned offers.
17. Check offer acceptance.
18. Check decline behavior.
19. Check capacity block.
20. Check verification block.
21. Check workbench.
22. Check working-link gate.
23. Check submit/review states.
24. Check revision state.
25. Check earnings.
26. Check notifications.
27. Check support.
28. Check mobile viewport.
29. Check keyboard-only navigation.
30. Check reduced-motion mode.
31. Check no-JavaScript text visibility where practical.
32. Check route refresh/deep links.
33. Check unauthorized access.
34. Check identity masking.
35. Check client-price masking.
36. Check error and retry states.
37. Check no em dash characters in site copy.
38. Check no public marketplace language remains.
39. Check no unverified claims were accidentally introduced.
40. Record all failures in a validation report.

When a command fails because the Windows-mounted workspace cannot execute Linux binaries, do not hide the limitation. Run an equivalent local copy or direct compiler test where possible, record the environment limitation, and still require the user to run the normal Windows validation locally.

---

## 14. Execution behavior required from Claude

Work autonomously and carefully. Do not ask for confirmation for routine local edits. Do not deploy.

Use a todo list with one active phase at a time. Update it as each phase starts and completes.

Before every substantial modification:

- Inspect the current file.
- Preserve existing patterns.
- Understand imports and route boundaries.
- Make the smallest coherent change.
- Avoid broad rewrites without need.

After every substantial modification:

- Re-read the changed file.
- Run the narrowest relevant test.
- Then run the phase-level validation.

If a backend permission cannot be verified, do not pretend it is safe. Mark it as blocked and add the exact required verification.

If a legal value is unknown, retain a clear draft marker and do not invent a production value.

If a public claim is unverified, do not silently convert it into a factual claim. Keep it marked for replacement or remove it only with a documented reason.

If the local project is unavailable, do not edit another copy or the deployed site. Tell the user exactly what mount or credential is missing.

At the end, provide:

- Completed phases.
- Files changed.
- Tests run.
- Tests passed.
- Tests blocked and why.
- Backend gaps.
- Legal gaps.
- Remaining product risks.
- Exact localhost command and URL.
- No deployment unless explicitly requested.

---

## 15. Final standard

The website is complete only when it is:

- Truthful to the PRD.
- Consistent with the prototype’s intended product journey.
- Clear that Dolancer is supervised, not an open marketplace.
- Safe against unauthorized assignment and identity leakage.
- Honest about payment and verification.
- Legally reviewable.
- Accessible.
- Responsive.
- Fast enough.
- Animated with meaning.
- Visually distinctive without copying competitors.
- Authored rather than generically AI-styled.
- Validated across public and authenticated routes.
- Ready for controlled user testing before deployment.

The core product promise is:

> Dolancer reduces the uncertainty of getting work done by giving the user a clear route, a responsible supervisor, a protected workspace, transparent scope, and an accountable approval path.

Implement that promise in code, content, permissions, states, and motion. Do not merely decorate the current site.

## References

[1]: https://www.aardvarkbookclub.com/ "Aardvark Book Club public website"
[2]: https://www.fiverr.com/ "Fiverr public homepage"
[3]: https://www.fiverr.com/trust_safety "Fiverr Trust and Safety"
[4]: https://help.fiverr.com/hc/en-us/articles/360049982353-Leaving-and-managing-reviews-on-Fiverr "Fiverr Help Center review management"
[5]: https://www.upwork.com/ "Upwork public homepage"
[6]: https://www.upwork.com/i/how-it-works/client/ "Upwork client workflow and trust explanation"
[7]: https://www.upwork.com/reviews "Upwork public reviews"
[8]: https://www.upwork.com/services/ "Upwork Project Catalog"
[9]: https://www.freelancer.com/ "Freelancer public homepage"
[10]: https://www.freelancer.com/job/ "Freelancer public job discovery"
[11]: https://www.freelancer.com/jobs/web-design "Freelancer public category and listing page"
[12]: https://www.freelancer.com/faq/view.php "Freelancer public FAQ"
[13]: https://www.toptal.com/ "Toptal public homepage used as a premium trust reference"
[14]: https://www.toptal.com/top-3-percent "Toptal public screening explanation"
[15]: /home/ubuntu/projects/dolancer-13e25f12/AssignExperts-Platform-PRD-v1.docx "Assign Experts Platform PRD"
[16]: /home/ubuntu/projects/dolancer-13e25f12/Dolancer%20Prototype%20%28standalone%29.html "Dolancer standalone prototype"
[17]: /mnt/3a384f75-670d-44a4-a303-038056f43bc9/Dolancer/implementation_plan.md "Current Dolancer frontend implementation plan"

This is a product and frontend execution prompt, not legal advice. Final Terms, Privacy, tax, payment, worker classification, and data-protection decisions require qualified professional review.

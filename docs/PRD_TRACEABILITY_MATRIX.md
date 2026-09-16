# PRD Traceability Matrix

## Route Map
- `/` - LandingPage (MarketingLayout, public)
- `/how-it-works` - HowItWorksPage (MarketingLayout, public)
- `/about` - AboutPage (MarketingLayout, public)
- `/contact` - ContactPage (MarketingLayout, public)
- `/legal/:kind` - LegalPage (MarketingLayout, public)
- `/sign-in` - SignInPage (AuthLayout, public)
- `/sign-up` - SignInPage (AuthLayout, public)
- `/auth/callback` - AuthCallbackPage (AuthLayout, public)
- `/onboarding/country` - CountryOnboardingPage (AuthLayout, protected)
- `/dashboard` - DashboardPage (AppShell, protected)
- `/pool` - PoolPage (AppShell, protected)
- `/work` - WorkPage (AppShell, protected)
- `/work/:id` - WorkbenchPage (AppShell, protected)
- `/earnings` - EarningsPage (AppShell, protected)
- `/verification` - VerificationPage (AppShell, protected)
- `/skills` - SkillsPage (AppShell, protected)
- `/training` - TrainingPage (AppShell, protected)
- `/training/:id` - LessonPage (AppShell, protected)
- `/notifications` - NotificationsPage (AppShell, protected)
- `/profile` - ProfilePage (AppShell, protected)
- `/refer` - ReferPage (AppShell, protected)
- `/tickets` - TicketsPage (AppShell, protected)
- `/tickets/:id` - TicketPage (AppShell, protected)
- `/admin` - AdminPage (AppShell, protected, role-gated)

## Database Types
- ProjectStatus: draft, submitted, claimed, quoted, paid, in_progress, in_review, delivered, approved, cancelled
- KycStatus: pending, submitted, approved, rejected
- ApplicationStatus: pending, approved, rejected
- TicketStatus: open, pending, resolved, closed
- UserRole: user, supervisor, doer, admin

## API Boundaries
- `doer_pool` view: 7 columns, no client price, no client identity, no supervisor identity. Filtered by profiles.available, doer_skills category match, L1 head-start window.
- `projects_doer` view: 15 columns, filtered to doer_id = auth.uid()
- `ledger_doer` view: 5 columns, filtered to release_doer legs
- `claim_project_as_doer` RPC: accepts p_id, returns boolean. Raises for suspension, unapproved KYC, incomplete training.
- `doer_earnings_summary` RPC
- `my_rating_summary` RPC

## Domain Types
- DoerGateState: isDoer, applicationSubmitted, applicationStatus, kycDone, skillsDone, trainingDone, stepsDone, totalSteps, unlocked
- PoolOffer: id, category, status, payoutPaise, deliveryAt, createdAt, brief
- DoerProject: id, category, status, createdAt, updatedAt, workingDocUrl, progressPct, supervisorId, qcBounceCount, lastBounceReason, payoutPaise, brief, deliveryAt, revisionReason, revisionCount
- EarningsSummary: grossPaise, taxWithheldPaise, netPaise

## Requirements Mapping

| Requirement | PRD Ref | Role | Route | Component | API/Query | DB Policy/RPC | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Light onboarding | 1 | Any | /onboarding/country | CountryOnboardingPage | | | PARTIAL |
| Passwordless email OTP auth | 2 | Any | /sign-in, /sign-up | SignInPage | | | VERIFIED |
| 18+ eligibility gate | 3 | Any | /sign-up | SignInPage | | | PARTIAL |
| Country and account setup | 4 | Any | /onboarding/country | CountryOnboardingPage | | | VERIFIED |
| Discipline selection | 5 | Doer | /skills | SkillsPage | | | VERIFIED |
| Identity verification | 6 | Doer | /verification | VerificationPage | | | VERIFIED |
| Payout setup | 7 | Doer | N/A | N/A | | | BLOCKED |
| Non-blocking verification | 8 | Doer | /dashboard | DashboardPage | | | VERIFIED |
| Payment and payout gating | 9 | Doer | /pool, /work | AppShell | | | PARTIAL |
| Manual supervisor project offers | 10 | Doer | /pool | PoolPage | doer_pool | | PARTIAL |
| Offer acceptance | 11 | Doer | /pool | ClaimDrawer | claim_project_as_doer | claim_project_as_doer | VERIFIED |
| Offer rejection/decline | 12 | Doer | N/A | N/A | N/A | | MISSING |
| Project capacity limits | 13 | Doer | /pool | PoolPage | MAX_ACTIVE_PROJECTS | | PARTIAL |
| Company-controlled working link | 14 | Doer | /work/:id | WorkbenchPage | projects_doer | | VERIFIED |
| Supervisor communication | 15 | Doer | /work/:id | WorkbenchPage | chat messages | | VERIFIED |
| Delivery and revision handling | 16 | Doer | /work/:id | WorkbenchPage | projects_doer | | PARTIAL |
| Quality feedback | 17 | Doer | /dashboard | RatingCard | my_rating_summary | my_rating_summary | PARTIAL |
| Levels | 18 | Doer | /profile | ProfilePage | my_rating_summary | | PARTIAL |
| Earnings | 19 | Doer | /earnings | EarningsPage | doer_earnings_summary | doer_earnings_summary | VERIFIED |
| Payout history | 20 | Doer | /earnings | EarningsPage | ledger_doer | | PARTIAL |
| Training | 21 | Doer | /training | TrainingPage, LessonPage| | | VERIFIED |
| Referrals | 22 | Doer | /refer | ReferPage | | | VERIFIED |
| Notifications | 23 | Doer | /notifications| NotificationsPage | | | VERIFIED |
| Support tickets | 24 | Doer | /tickets | TicketsPage, TicketPage| | | VERIFIED |
| Legal pages | 25 | Any | /legal/:kind | LegalPage | | | DRAFT |
| Privacy and identity protection | 26 | Doer | /pool | PoolPage | doer_pool | | PARTIAL |
| Auditability | 27 | Admin | N/A | N/A | N/A | | BLOCKED |
| Role-based access control | 28 | Any | /admin | AdminPage | UserRole | | PARTIAL |
| Offer withdrawn handling | 29 | Doer | N/A | N/A | N/A | | MISSING |
| Offer expired handling | 30 | Doer | N/A | N/A | N/A | | MISSING |
| Offer reassigned handling | 31 | Doer | N/A | N/A | N/A | | MISSING |
| TDS display | 32 | Doer | /earnings | EarningsPage | doer_earnings_summary | | PARTIAL |
| Client price masking | 33 | Doer | /pool | PoolPage | doer_pool | | VERIFIED |
| Client identity masking | 34 | Doer | /pool | PoolPage | doer_pool | | VERIFIED |

## Backend Security Checks (Section 5.1)

1. **Row Level Security (RLS) on all tables**: UNVERIFIED. Needs full schema audit.
2. **Read access to profiles limited to self**: UNVERIFIED.
3. **No direct updates to doer level/rating by user**: UNVERIFIED.
4. **Client PII masked in doer views**: VERIFIED via `doer_pool` and `projects_doer` views.
5. **Supervisor PII masked in doer views**: VERIFIED via `doer_pool` view.
6. **Client financial info masked in doer views**: VERIFIED via absence of client price in `doer_pool`.
7. **Read access to projects limited to assigned doer**: UNVERIFIED. `projects_doer` view does this, but base table RLS needs checking.
8. **Claim project RPC verifies doer suspension status**: VERIFIED in `claim_project_as_doer` RPC.
9. **Claim project RPC verifies doer KYC approval**: VERIFIED in `claim_project_as_doer` RPC.
10. **Claim project RPC verifies training completion**: VERIFIED in `claim_project_as_doer` RPC.
11. **Claim project RPC verifies capacity limits**: UNVERIFIED.
12. **Submit project RPC checks ownership**: UNVERIFIED.
13. **Delivery update restricted to assigned doer**: UNVERIFIED.
14. **Ledger view filters to user's own legs**: VERIFIED via `ledger_doer` view.
15. **Only supervisors/admins can approve/reject KYC**: UNVERIFIED.
16. **Chat messages RLS limits read/write to project members**: UNVERIFIED.
17. **Support ticket RLS limits read/write to ticket creator**: UNVERIFIED.
18. **Earnings summary RPC restricted to own earnings**: UNVERIFIED.
19. **System fields (e.g. status) protected from direct user update**: UNVERIFIED.
20. **Admin routes protected by robust role checks in backend**: UNVERIFIED.

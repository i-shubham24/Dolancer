# Dolancer Permission and State Matrix

This document defines the permission and state matrix for the Dolancer platform.

## Roles
- **Doer**: The verified worker who receives and completes assigned offers.
- **Supervisor**: Internal staff who routes offers, reviews work, handles client communication.
- **Client/AssignX**: External party who submits requests (not visible to doer).
- **QQD/Admin**: Quality, quotation, dispatch and administrative staff.
- **Support**: Customer support staff.
- **System**: Automated processes (timeouts, notifications, status transitions).

## State Machine: Project Lifecycle

**ProjectStatus values**: `draft`, `submitted`, `claimed`, `quoted`, `paid`, `in_progress`, `in_review`, `delivered`, `approved`, `cancelled`.

### Status Details

For each status, here are the documented transitions and states:

| Status | Visible To | Can Transition To Next | Preconditions | Server Enforcement (RPC/RLS) | UI State (Doer) | Error State | Audit Event |
|--------|------------|------------------------|---------------|--------------------|----------|-------------|-------------|
| `draft` | Client | Client | Saved draft | RLS | N/A | N/A | Draft created |
| `submitted` | Client, Supervisor | Supervisor | Client submits | RLS | N/A | N/A | Project submitted |
| `claimed` | Supervisor | Supervisor | Supervisor assigned | RLS | N/A | N/A | Supervisor claimed |
| `quoted` | Client, Supervisor | Client | Quote generated | RLS | N/A | N/A | Quote provided |
| `paid` | Doer, Supervisor | Doer | Payment confirmed | `claim_project_as_doer` RPC | Assigned offer in `/pool` | Claim fails if locked | Payment received |
| `in_progress`| Doer, Supervisor | Doer | Claimed by doer | Auth, RLS | Workbench | Submit fails | Work started |
| `in_review` | Supervisor | Supervisor | Work submitted | RLS | Submitted state | Bounce increments | Work submitted |
| `delivered` | Client, Supervisor | Client, System | Supervisor approved | RLS | Delivered state | N/A | Work delivered |
| `approved` | All | System | Client approved/Timeout| RLS | Approved state | N/A | Work approved |
| `cancelled` | All | N/A | Cancellation | RLS | Cancelled state | N/A | Project cancelled |

### Status Transitions (from doer perspective)

1. `paid` -> doer sees it as an assigned offer in `/pool`
2. `paid` -> `in_progress` via `claim_project_as_doer` RPC (doer accepts)
3. `in_progress` -> `in_review` (doer submits work)
4. `in_review` -> `in_progress` (supervisor requests changes, `qc_bounce_count` increments)
5. `in_review` -> `delivered` (supervisor approves)
6. `delivered` -> `approved` (client approves or timeout)
7. `approved` -> payout released

Note: The doer never sees `draft`, `submitted`, `quoted` statuses. These are internal/client-side.

## Route Access Matrix

| Route | Unauthenticated | Doer (unlocked) | Doer (locked) | Supervisor | Admin |
|-------|----------------|-----------------|---------------|------------|-------|
| `/` | Yes | Yes | Yes | Yes | Yes |
| `/how-it-works` | Yes | Yes | Yes | Yes | Yes |
| `/about` | Yes | Yes | Yes | Yes | Yes |
| `/contact` | Yes | Yes | Yes | Yes | Yes |
| `/legal/:kind` | Yes | Yes | Yes | Yes | Yes |
| `/sign-in` | Yes | Redirect to `/dashboard` | Redirect to `/dashboard` | N/A | N/A |
| `/sign-up` | Yes | Redirect to `/dashboard` | Redirect to `/dashboard` | N/A | N/A |
| `/dashboard` | No (redirect to `/sign-in`) | Yes | Yes | N/A | N/A |
| `/pool` | No | Yes | Yes (empty or gated) | N/A | N/A |
| `/work` | No | Yes | Yes (empty) | N/A | N/A |
| `/work/:id` | No | Yes (own projects) | No | N/A | N/A |
| `/earnings` | No | Yes | Yes (empty) | N/A | N/A |
| `/verification`| No | Yes | Yes | N/A | N/A |
| `/skills` | No | Yes | Yes | N/A | N/A |
| `/training` | No | Yes | Yes | N/A | N/A |
| `/notifications`| No | Yes | Yes | N/A | N/A |
| `/profile` | No | Yes | Yes | N/A | N/A |
| `/refer` | No | Yes | Yes | N/A | N/A |
| `/tickets` | No | Yes | Yes | N/A | N/A |
| `/admin` | No | No (role-gated) | No | No (role-gated) | Yes |

## Action Permission Matrix

| Action | Doer | Supervisor | Admin | Preconditions | Server Enforcement | UI State |
|--------|------|------------|-------|---------------|-------------------|----------|
| Accept offer | Yes | No | No | unlocked, capacity available, offer status=paid | `claim_project_as_doer` RPC checks auth, KYC, training, capacity, status | ClaimDrawer with accept button |
| Decline offer | MISSING | N/A | N/A | N/A | No RPC found | No UI |
| Submit work | Yes | No | No | project status=in_progress, working link set | UNVERIFIED | WorkbenchPage |
| Request revision | No | Yes | Yes | project status=in_review | UNVERIFIED | N/A (supervisor-side) |
| Approve delivery | No | Yes | Yes | project status=in_review | UNVERIFIED | N/A |
| Release payout | No | No | Yes | project status=approved | UNVERIFIED | N/A |
| Set availability | Yes | No | No | authenticated | profile update | Dashboard toggle |
| Update skills | Yes | No | No | authenticated | `doer_skills` table | SkillsPage |
| Submit KYC | Yes | No | No | authenticated | `kyc` table insert | VerificationPage |
| Create ticket | Yes | No | No | authenticated | `tickets` table insert | TicketsPage |
| Send message | Yes | Yes | No | project assigned to doer | `messages` table, filtered by project | Chat panel |

## Edge States That Need UI Handling

Document these states and whether the frontend currently handles them:

| State | Current Handling | Required Handling |
|-------|-----------------|-------------------|
| Offer pending | Shows in pool | OK |
| Offer accepted | Moves to work list | OK |
| Offer declined | MISSING - no decline UI | Need decline button + confirmation |
| Offer withdrawn | MISSING - no status | Safe fallback: show "no longer available" |
| Offer expired | MISSING - no status | Safe fallback: remove from pool |
| Offer reassigned | MISSING - no status | Safe fallback: remove from pool |
| Offer blocked by verification | Partially handled | Gate message exists |
| Offer blocked by capacity | Partially handled | Capacity limit shown |
| Project in progress | Handled | OK |
| Project submitted | Handled | OK |
| Supervisor review | Handled (`in_review` status) | OK |
| Changes requested | Handled (`qc_bounce_count`) | OK |
| Client approval pending | Handled (`delivered` status) | OK |
| Approved | Handled | OK |
| Payout pending | MISSING | Need: show "payout processing" |
| Payout released | MISSING | Need: show in earnings |
| Payout held | MISSING | Need: show "payout held" with reason |
| Payout failed | MISSING | Need: show error + support link |
| Project cancelled | Handled (`cancelled` status) | OK |
| Dispute/escalation | MISSING | Need: escalation path to support |

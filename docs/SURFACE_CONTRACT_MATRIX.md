# Surface Contract Matrix

This matrix formalizes the API and UI boundaries between the AssignX client surface, the internal Supervisor operational surface, and the Dolancer doer surface. 

**Rule of Thumb:** 
- The Client sees AssignX and the managed team. They never see the Doer.
- The Doer sees Dolancer and the Supervisor. They never see the Client.
- The Supervisor acts as the authorized bridge.

| Concept/Field | AssignX (Client Surface) | Dolancer (Doer Surface) | Internal Supervisor Surface | Storage/API Source | Redaction Rule / Policy |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Branding/Identity** | AssignX logo, domain, support | Dolancer logo, domain, support | Internal unified identity | N/A (Frontend driven) | Strictly isolated at the presentation layer. |
| **Project Identity** | Public Project Title | Private Brief / Category | Internal Project ID & Full Brief | `projects` table | Dolancer only shows the sanitized brief and category. |
| **Client Identity** | Client Name, Company, Email | **BLOCKED** | Full visibility | `clients` or `projects.client_id` | Never pass client ID or profile to `DoerOfferView` API. |
| **Doer Identity** | **BLOCKED** | Doer Name, Profile, Metrics | Full visibility | `profiles` | Never pass doer ID or profile to `ClientProjectView` API. |
| **Supervisor Identity** | AssignX Project Manager (Role) | Supervisor (Role) | Full visibility | `profiles` (Internal) | Display by role label, not by real name or cross-brand email. |
| **Financials** | Client Budget, Escrow amount | Doer Payout, Tax withheld | Full visibility (both margins) | `projects.client_budget`, `projects.doer_payout` | Dolancer sees `payout_paise` only. AssignX sees `budget_cents` only. |
| **Work Scope** | Full SOW, Acceptance Criteria | Deliverable Brief, Acceptance Criteria | Full SOW & Brief | `projects.scope` | Scope must not include client branding or links in the Doer brief. |
| **Working Link** | Review-ready Deliverables | Protected Working Link | Working Link | `projects.working_doc_url` | Dolancer handles the working state; AssignX sees final review state. |
| **Chat/Communication** | Client ↔ AssignX Team | Doer ↔ Supervisor | Full visibility of both threads | `messages` (Partitioned) | Two strictly partitioned threads. No direct Client ↔ Doer messaging. |
| **Notifications/Emails** | from: AssignX Support | from: Dolancer Updates | Internal alerts | Email provider | Template engine must branch strictly on user role. |
| **QA / Approvals** | QA Passed, Approved by Client | Supervisor Review, Approved | Full audit trail | `projects.status` | AssignX shows "QA Passed". Dolancer shows "Supervisor Reviewed". |
| **System Labels** | "Our Implementation Team" | "AssignX Client" (Avoid if possible) | N/A | Hardcoded UI | Use generic counterparty labels. |

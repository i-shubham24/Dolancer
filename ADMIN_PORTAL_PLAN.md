# AdminX Architecture & Implementation Plan

This document outlines the architecture and implementation strategy for the AdminX platform, based strictly on Section 12 of the Assign Experts Platform PRD.

## Overview
AdminX is the founder-level control surface. It does not participate in day-to-day operations. Its purpose is to observe the business, configure it, and intervene.

AdminX will be built as a separate application (e.g., `adminx.assignx.com`), desktop-first, and accessible only to `founder` and `admin` roles. 

## 1. Security & Access
- **Authentication:** Only users with `role = admin` or `role = founder` in the `users` table can log in.
- **IP Restriction:** Access should be restricted by an IP allowlist or VPN where operationally feasible (NFR-025).
- **Audit Logging:** Every privileged action across all surfaces must be immutably logged with actor, role, action, target, before/after values, timestamp, and IP (BR-031). This log is append-only.

## 2. Core Modules

### 2.1 Overview Dashboard
Live operational picture containing:
- Projects by status
- Queue health and SLA breaches
- Revenue today and this month

### 2.2 Profit and Loss (P&L)
A crucial financial report. 
- **Gross Revenue:** Sum of captured client payments, converted to INR.
- **Doer Cost:** Sum of gross doer payouts before TDS.
- **Margin:** Net revenue minus doer cost, payment fees, chargebacks, and credits.
- **Breakdowns:** By category, supervisor, currency, urgency tier, doer level, and acquisition source.
- *Critical Insight:* Margin by doer level is the most important long-term report, as company share falls from 65% (L1) to 45% (L3).

### 2.3 Project Ledger
Full searchable ledger with complete lifecycle history and the exact money trail (quote, payout, TDS, fees, margin) per project.

### 2.4 People Management
- Directory of every client, doer, and internal user showing status, activity, and history.
- **Bans:** Suspend or remove any user with a reason. Removing a doer triggers a payout of their outstanding cleared balance (BR-037), hashes their PAN for the blacklist, and blocks future signups matching that PAN, phone, or bank account.

### 2.5 Role Management
Only the `founder` can appoint or revoke the `QQD` and `Admin` roles.

### 2.6 Configuration
Global business rules editable without a code release:
- Rate reference (internal pricing guidance)
- Level thresholds and percentages (35%, 45%, 55%)
- Referral amounts (₹100 to ₹200) and credit caps (30%)
- Urgency guidance and SLA targets
- Category and question set definitions for the submission flow

### 2.7 Financial Exports
Export endpoints for:
- Ledger records
- TDS computation and certificates (Section 194J at 10% on cumulative totals)
- GST invoicing (sequential, gapless)
- Reconciliation records

## Implementation Strategy
1. **Repository Structure:** Scaffold AdminX as a new Next.js or Vite SPA, sharing the UI component library but using a strict desktop-first layout.
2. **Permission Layer:** Ensure the API layer strictly enforces `role = admin` or `role = founder` on all endpoints used by this app.
3. **Audit Trail Middleware:** Implement an interceptor or Postgres trigger to write to the `audit_log` table for any mutation triggered by this app.
4. **Data Grid Components:** Since AdminX is data-heavy, integrate a robust data grid (e.g., TanStack Table) for the Ledger and People directories to support advanced filtering, sorting, and pagination.

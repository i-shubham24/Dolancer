# Dolancer

The doer-facing web app for the AssignX platform. React 19 + Vite SPA over the existing
Supabase backend.

Vetted specialists ("doers") claim pre-scoped, fixed-price tasks from a blind pool, do the
work, and are paid. They speak only to an internal supervisor and never to the client.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the two values
npm run dev
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Vite dev server on 5173 (honours `PORT`) |
| `npm run build` | Typecheck then production build |
| `npm run typecheck` | `tsc -b --noEmit` |
| `npm run lint` | ESLint |
| `npm run check:secrets` | Refuses privileged key material anywhere in source |
| `npm run check:copy` | Enforces the banned-word and em-dash rules |
| `npm run verify` | All of the above, in order |

## The rules this codebase enforces

These are not style preferences. Each one exists because breaking it causes a real
failure, so they are worth reading before writing a feature.

1. **Only the publishable key ships.** The Supabase secret key carries `BYPASSRLS`, which
   would dissolve the doer-anonymity boundary, because row level security *is* the
   boundary. `src/lib/env.ts` refuses to boot on anything key-shaped, and
   `npm run check:secrets` blocks it at commit time.
2. **The client is always `Client`.** A doer must never learn a client's name, email,
   company or domain. Use the `CLIENT_LABEL` constant. Never query a client profile. The
   views make this structural: `doer_pool` and `projects_doer` carry no client identity to
   render even if you asked.
3. **Never show client price or platform margin.** The doer sees `doer_payout_paise` and
   nothing else about money in.
4. **No escrow language.** Funds sit in a company account, not a regulated escrow, so the
   word is both inaccurate and a compliance problem. Use "Pending", "On hold", "Awaiting
   approval". `check:copy` enforces this.
5. **Money is integer paise.** Postgres bigint arrives as a *string*; coerce with
   `toPaise` before any arithmetic or you get string concatenation.
6. **No em dashes, no emojis** in code, comments or copy.

## Architecture

```
src/
  lib/          supabase client, env guard, rpc helper, query keys, paise, datetime, status
  types/        hand-written mirror of the Supabase relations we read
  stores/       Zustand: availability + concurrency guardrail, UI state
  providers/    AuthProvider (session + JWT role), AppProviders
  routes/       route table, ProtectedRoute
  layouts/      AppShell (sidebar + content), AuthLayout
  components/   ui/ (shadcn primitives), brutal/ (the maximalist system)
  features/     one folder per surface: api.ts, queries.ts, components, page
```

**State split.** TanStack Query owns everything the server knows. Zustand holds UI state
plus the optimistic availability toggle. Zustand never becomes a second source of truth
about the platform.

**Design system.** Ported from the sibling AssignX client app so the two read as one
product. Three moves define it: a 2px near-black border, a hard offset shadow, and a
translate that lifts on hover and presses in on active. `ColorStat` is the loud component
and `Card` the workhorse; keep secondary figures quiet, because if every figure is loud
none of them are.

## Working with the backend

The backend is authoritative and is maintained separately. Where the PRD and the deployed
schema disagree, **the schema wins**. Three consequences worth knowing up front:

- **There is no offers table.** Doers claim from the `doer_pool` view via
  `claim_project_as_doer`. There is no push, no 2-hour expiry, no decline.
- **The doer sets their own working link** via `set_working_doc`, which is doer-scoped.
  The UI then holds back progress updates and submission until it exists.
- **The 3-project cap does not exist in the database.** It is a UI guardrail only. The
  claim RPC is directly callable, so it stops the button, not the claim.

### Gotchas that will bite you

1. **`data === false` is not an error.** Lifecycle RPCs return `row_count > 0`, so
   PostgREST returns `false` with `error === null`, meaning wrong status, not yours, or
   already advanced. Use the helpers in `lib/rpc.ts`, which fold this into a typed result.
2. **bigint arrives as a string.** Every `*_paise` value needs `toPaise`.
3. **Table-returning RPCs come back as arrays**, even single-row ones. Use `callRowRpc`.
4. **`select *` is forbidden.** Some columns are grant-revoked and a wildcard errors
   outright. Use `selectColumns`, which refuses a wildcard.
5. **Exact RPC parameter names matter.** It is `claim_project_as_doer(p_id)`, not
   `p_project_id`, and `set_project_progress`, not `set_progress`. A wrong name is a
   runtime failure, not a type error, because the client is untyped.

The relation and RPC contract is transcribed in `src/types/database.ts`. It is
hand-written rather than generated, because PostgREST schema introspection is hardened
against the publishable key on this project, so **update it by hand when the backend
changes.**

## Status

Every doer surface is built and wired to live data: auth, country onboarding,
`/dashboard`, `/pool`, `/work`, `/work/:id` (including the supervisor chat),
`/earnings`, `/verification`, `/skills`, `/training`, `/notifications`, `/profile`,
`/refer`, and `/tickets`. There are no placeholder routes left.

Not verified end to end: most screens need a session with real data behind it, so they
have been typechecked and built but not exercised against a populated account.

`docs/UX-PATTERNS.md` holds the design reasoning. Read its `/earnings` section before
touching money: only two figures there are real, and a Pending balance is not one of them.

See `docs/BACKEND-HANDOFF.md` for the five gaps that need backend work.

# Dolancer Frontend UI Rebuild Plan

## Objective

Rebuild the Dolancer frontend presentation using the attached Stitch export as a visual reference, without replacing the existing application architecture or business behavior.

The implementation will:

- Preserve all current routes, TanStack Query hooks, Supabase calls, mutations, realtime behavior, auth guards, demo mode, age and verification gating, job claiming, work delivery, approvals, payouts, referrals, training, support, and admin workflows.
- Translate the Stitch layouts into reusable React components that fit the current feature boundaries.
- Use the Stitch references for composition, spacing, typography, color, card geometry, and responsive behavior rather than copying generated HTML.
- Add `framer-motion` only at the visual layer for page transitions, staggered collection reveals, hover and press states, drawer transitions, and layout changes.
- Avoid em-dashes in all new UI copy and documentation.
- Use responsive layouts for mobile, tablet, and desktop, with accessible focus states, keyboard navigation, reduced-motion support, and touch-sized controls.
- Use stable Unsplash image URLs only where imagery is needed, with no dependency on image loading for core workflows.
- Add a user-controlled visual theme switcher with four curated color palettes, while keeping typography, spacing, layout, contrast, and all business behavior consistent across themes.
- Treat the attached Stitch export as the source of visual truth by combining its modern-light authenticated surfaces with its kinetic creator-marketing direction. Existing code supplies behavior and content only; legacy visual primitives are not design constraints.

## Reference inventory and route mapping

| Stitch reference | Visual role | Dolancer route or surface | Planned treatment |
| --- | --- | --- | --- |
| `dolancer_landing_page_redesigned` | Primary public landing page | `/` via `MarketingLayout` and `LandingPage` | Rebuild hero, proof sections, project preview, guarantees, CTA, and footer as responsive modular sections. |
| `dolancer_autonomous_creator_landing_page_ultra_craft_edition` | Premium landing variation | `/` visual direction | Use as the stronger editorial and ambient-gradient direction while retaining the current landing content and links. |
| `dolancer_kinetic_interactive_creator_landing_page` | Motion-led landing variation | `/` visual direction | Adapt kinetic hero, reveal timing, and bento composition into real Framer Motion interactions. |
| `dolancer_how_it_works_kinetic_interactive` | Process and trust explanation | `/how-it-works` via `HowItWorksPage` | Map the delivery engine, escrow, supervisor, QA, and payout sections to existing marketing content. |
| `dolancer_why_us_the_autonomous_creator_thesis` | Positioning and differentiation | `/about` via `AboutPage` | Use the thesis, advantage cards, and comparison layout without inventing new product claims. |
| `dolancer_fee_calculator_escrow_breakdown` | Pricing and payout education | `/how-it-works`, `PayoutExplainer`, and relevant landing sections | Keep current fee and payout explanations authoritative; present them as calculator and escrow cards if the existing data model supports it. |
| `dolancer_faq_protocol_standards` | FAQ and protocol standards | `/legal` or the existing FAQ/content surface | Preserve legal copy and routing; use accordion or grouped protocol cards only where content already exists. |
| `dolancer_log_in` | Sign-in visual | `/sign-in` via `SignInPage` | Restyle the existing email OTP, resend, Google, Turnstile, error, cooldown, and demo flows. |
| `dolancer_sign_up` | Sign-up visual | `/sign-up` via `SignInPage` | Share the auth shell with sign-in while preserving mode-specific copy and behavior. |
| `dolancer_authentic_dashboard_modern_light_theme` | Authenticated shell and dashboard | `/dashboard` via `AppShell` and `DashboardPage` | Establish the main shell, sidebar, header, ambient canvas, profile area, readiness, capacity, active work, pool preview, and earnings summary. |
| `job_pool_dashboard_modern_light` | Job discovery dashboard | `/pool` via `PoolPage` | Convert the static job stream into filterable, animated pool cards backed by the existing pool query and claim drawer. |
| `dolancer_job_pool_dashboard` | Alternate job pool composition | `/pool` visual direction | Reuse the denser list and category treatment where it improves scanability on desktop and tablet. |
| `dolancer_job_pool_left_drawer_layout` | Job pool with navigation drawer | `/pool` within `AppShell` | Adapt the drawer pattern to the responsive sidebar and claim drawer without creating a second navigation state. |
| `dolancer_my_workbench_left_drawer_layout` | Active work list | `/work` via `WorkPage` | Map active and finished buckets, grouped status sections, empty states, and links to workbench detail. |
| `the_workbench_project_dor_1082_modern_light` | Workbench detail | `/work/:id` via `WorkbenchPage` | Restyle project brief, acceptance criteria, tokens, test evidence, handoff, lifecycle actions, and loading/error states. |
| `dolancer_earnings_ledger_left_drawer_layout` | Earnings and ledger | `/earnings` via `EarningsPage` | Rebuild summary cards, reconciliation, financial-year filter, CSV export, and ledger table while keeping values sourced from existing APIs. |
| `dolancer_creator_verification_clearance_left_drawer_layout` | Verification and skill clearance | `/verification` and `/skills` | Present age/identity verification, clearance, capability proofs, and skill actions without weakening gates or action requirements. |
| `dolancer_referrals_network_left_drawer_layout` | Referral network | `/refer` via `ReferPage` | Adapt QR, referral metrics, ledger, and network guarantees to the real referral data and mutation states. |
| Existing feature surfaces | Supporting authenticated workflows | `/training`, `/training/:id`, `/notifications`, `/profile`, `/tickets`, `/tickets/:id`, `/admin`, and `/onboarding/country` | Apply the shared design system and responsive shell to every remaining route, including all loading, error, empty, and protected states. |

## Existing behavior boundaries to preserve

The visual rewrite must not move or duplicate these boundaries:

- `src/routes/index.tsx`: route paths, lazy loading, `ProtectedRoute`, `AuthLayout`, `MarketingLayout`, route errors, and redirects remain authoritative.
- `src/features/*/api.ts`: Supabase reads, writes, validation, and error behavior remain unchanged unless a presentation-only adapter is required.
- `src/features/*/queries.ts`: query keys, cache invalidation, mutations, availability limits, and realtime refresh behavior remain unchanged.
- `src/providers/AuthProvider.tsx` and `src/features/auth/api.ts`: OTP, Google auth, demo sign-in, callback, session, and sign-out behavior remain unchanged.
- `src/features/work/LifecycleActions.tsx` and work APIs: claim, start, submit, supervisor review, approval, cancellation, and delivery actions remain unchanged.
- Verification, onboarding, and profile logic: age gating, country requirements, verification status, availability caps, and account eligibility remain enforced in existing code.
- Earnings and payout surfaces: gross, tax withheld, net, ledger filtering, and CSV export continue to use existing server data and formatting helpers.
- Existing accessibility primitives, error states, skeletons, command menu, preload behavior, and deep-link routing remain available after component restyling.

## Design system implementation

### Shared visual foundation

1. Add a small semantic token layer in the existing theme files, based on the Stitch references:
   - Canvas: cool slate or porcelain background.
   - Surfaces: white, translucent glass, and soft tinted section surfaces.
   - Primary: violet or electric cobalt, chosen consistently rather than mixing both as competing brands.
   - Success: teal or emerald.
   - Warning and danger: amber and rose.
   - Text: deep slate with muted slate variants.
2. Replace harsh neo-brutalist visual treatment in shared primitives with:
   - `rounded-2xl` cards and `rounded-xl` inputs.
   - Pill-shaped primary and secondary actions.
   - Soft borders and diffused shadows instead of offset shadows.
   - Ambient blurred gradient shapes on marketing and high-level dashboard surfaces.
3. Establish the Stitch typography pairing in the existing CSS setup, using DM Sans or Plus Jakarta Sans for headings and Inter for body and data text. Confirm the chosen font loading strategy before implementation to avoid a network-only failure.
4. Add shared motion primitives:
   - Route-level fade and vertical page entrance.
   - Staggered child reveal for cards and list rows.
   - Spring-based hover lift and button press feedback.
   - Drawer and modal enter/exit transitions.
   - `prefers-reduced-motion` fallback that removes nonessential movement.

### User-selectable color palettes

The color switcher is a presentation-only preference. It must change semantic color tokens, gradients, tinted surfaces, shadows, and status treatments without changing route behavior, data, permissions, queries, mutations, or copy.

#### Palette options

The four options will be presented with a name, a compact color preview, and a short accessible description:

| Palette | Primary direction | Supporting colors | Intended feel |
| --- | --- | --- | --- |
| **Cobalt** | Electric blue | Teal success, amber warning, rose danger | The default Stitch-inspired productivity theme |
| **Violet** | Deep violet | Emerald success, amber warning, rose danger | Creative, premium, and editorial |
| **Mint** | Emerald or teal | Cobalt information, amber warning, rose danger | Calm, optimistic, and growth-oriented |
| **Sunset** | Warm coral or orange | Indigo information, teal success, rose danger | Energetic, expressive, and high-contrast |

Each palette must define the same complete semantic token contract: canvas, surface, elevated surface, primary, primary foreground, secondary, accent, muted text, strong text, border, focus ring, success, warning, danger, informational states, and ambient gradient colors. Components must consume semantic tokens only, never palette-specific hex values.

#### Interaction and placement

- Add a palette control to the authenticated navigation/header and the public marketing header. It should be available on desktop and mobile without competing with the primary CTA or sign-out action.
- Use a compact palette button with a color-swatch icon and an accessible label such as `Change color palette`. Open a keyboard-accessible popover or menu containing the four choices.
- Display the active palette with a check indicator, selected state, visible focus ring, and text label. Do not rely on color alone to communicate selection.
- Close the menu on selection, outside click, Escape, or route navigation. Keep the control usable inside the mobile navigation drawer.
- Animate the palette transition with a short, non-blocking crossfade. Respect `prefers-reduced-motion` by switching immediately.
- Ensure all four palettes meet WCAG AA contrast for body text, controls, focus indicators, status badges, links, and disabled-state differentiation. Validate the lowest-contrast combinations explicitly.

#### State and implementation boundary

- Store the selected palette in a small UI preference store or existing UI store, with a typed union such as `cobalt | violet | mint | sunset`.
- Apply the selected value to the document root using a `data-palette` attribute or equivalent CSS class so CSS variables update globally without remounting route components.
- Initialize from local storage, fall back to `cobalt`, and recover safely if the stored value is unknown or malformed.
- Keep the preference local to the browser unless an existing profile-preferences API is intentionally added in a later product decision. Do not add a Supabase write for this visual-only setting.
- Avoid flash of an incorrect palette by applying the persisted value before the main app paint where practical, with a safe default for SSR-free Vite startup.
- Expose the current palette to the UI through a typed hook. Do not read or mutate `localStorage` directly from individual pages.
- Add palette tokens to the existing theme layer and update shared components first: buttons, inputs, cards, pills, status badges, skeletons, empty/error states, marketing sections, `AppShell`, and `MarketingLayout`.

### Component refactor targets

- Replace or evolve `src/components/brutal/Card.tsx`, `ColorStat.tsx`, `Pill.tsx`, `StatusBadge.tsx`, `ProjectCard.tsx`, `SegmentedToggle.tsx`, `Skeleton.tsx`, and `EmptyState.tsx` into neutral shared presentation primitives. Keep compatibility with current props where practical.
- Restyle `src/components/ui/button.tsx` and `input.tsx` first so every feature receives consistent focus, disabled, loading, and touch behavior.
- Refactor `AppShell` into the Stitch authenticated layout with responsive sidebar, sticky glass header, breadcrumb or page context, profile affordance, mobile drawer, and preserved command menu.
- Refactor `MarketingLayout` into the floating glass header and full-bleed responsive marketing frame while preserving public navigation, session-aware CTAs, skip links, and footer.
- Add a shared `PaletteSwitcher` component and typed palette preference hook/store. Keep the control visually consistent in both headers, while adapting its placement and trigger size for desktop, tablet, and mobile.

## Phased execution

### Phase 0: Foundation and safety checks

- Confirm the current baseline with typecheck, lint, build, and demo build.
- Add `framer-motion` to dependencies and verify the existing React version compatibility.
- Establish the four semantic palette token sets, palette preference store/hook, root theme application, typography, motion helpers, shared card/button/input primitives, and responsive container utilities.
- Build and wire the shared palette switcher into both public and authenticated navigation shells before feature-page restyling begins.
- Add a visual regression checklist for every route and an explicit reduced-motion behavior check.

### Phase 1: Public marketing and authentication

- Rebuild `MarketingLayout`, `LandingPage`, `HowItWorksPage`, `AboutPage`, `ContactPage`, and `LegalPage`.
- Rebuild the shared auth shell and `SignInPage` for both sign-in and sign-up modes.
- Preserve public copy sources, legal links, session-aware CTAs, OTP stages, Turnstile, resend cooldown, Google auth, demo mode, and error announcements.
- Validate mobile navigation, keyboard focus, deep links, and signed-in public browsing.

### Phase 2: Authenticated shell and dashboard

- Rebuild `AppShell`, dashboard header, navigation groups, profile block, mobile navigation, and page transition boundary.
- Recompose `DashboardPage`, `SpotlightHero`, `ReadinessCard`, and `CapacityRail` using soft modular cards and ambient sections.
- Preserve dashboard options, readiness prompts, availability mutations, active work links, pool preview, earnings summary, and age or verification prompts.

### Phase 3: Work discovery and execution

- Rebuild `PoolPage`, `PoolCard`, and `ClaimDrawer` with responsive grid/list modes, filter states, staggered reveal, hover lift, and animated claim transitions.
- Rebuild `WorkPage`, `ProjectCard`, and `WorkbenchPage` with grouped statuses, execution protocol, acceptance criteria, delivery evidence, and lifecycle actions.
- Preserve query loading and error behavior, claim limits, availability rules, status ordering, mutations, optimistic or invalidation behavior, and direct project URLs.

### Phase 4: Money, trust, and creator growth

- Rebuild `EarningsPage`, ledger presentation, payout explanation, `VerificationPage`, `SkillsPage`, and `ReferPage`.
- Add motion to summary metrics and ledger rows without animating values in a way that could misrepresent money.
- Preserve payout reconciliation, tax labels, financial-year filtering, CSV export, verification gates, skill clearance, referral mutations, and QR behavior.

### Phase 5: Remaining workflows and quality pass

- Restyle training, lesson, notifications, profile, tickets, ticket detail, country onboarding, and admin surfaces.
- Apply consistent skeleton, empty, error, disabled, and success states.
- Audit all routes at mobile, tablet, and desktop widths, including long tables and drawers.
- Run typecheck, lint, build, demo build, secret scan, copy guard, and the repository verification command.
- Perform a manual workflow pass for auth, age/verification gating, pool claim, work delivery, approval, payout display, export, referral, training, and support.

## Media strategy

- Use Unsplash source URLs only for decorative or illustrative imagery, never for required data or interaction state.
- Add descriptive `alt` text for meaningful images and empty alt text for decorative images.
- Apply fixed aspect-ratio containers, lazy loading, and responsive object positioning to prevent layout shift.
- Keep the existing icon system for product actions and status indicators; do not replace semantic icons with remote images.

## Acceptance criteria

- Every route in `src/routes/index.tsx` remains reachable at the same path and retains its existing guard or redirect behavior.
- All existing API calls, query keys, mutations, cache updates, and Supabase workflows remain intact.
- Dashboard options, active jobs, payouts, verification, and age-gating are still visible and enforce the same rules.
- The navigation palette control exposes exactly four named choices, clearly marks the active choice, works with mouse, touch, keyboard, and screen readers, and persists the selection across reloads and route changes.
- Every route renders correctly under all four palettes, with no hard-coded palette color bypassing the semantic token layer and no WCAG AA contrast regressions in primary interactive states.
- No raw Stitch `code.html` is copied into the application.
- No new UI copy contains an em-dash.
- Layouts work at mobile, tablet, and desktop widths without horizontal page overflow.
- Motion is subtle, interruptible, keyboard-safe, and disabled or reduced when the user prefers reduced motion.
- Loading, empty, error, disabled, and mutation-in-progress states are visually intentional and remain announced accessibly.
- `npm run verify` and the demo build pass after each relevant phase.

## Canonical visual direction

The attached `stitch_doer_freelance_task_portal.zip` is the canonical reference set for the rebuild. The implementation combines:

- **Modern-light product UI:** porcelain canvas, white rounded surfaces, violet or cobalt primary actions, teal success states, soft shadows, glass headers, spacious dashboard grids, and high-legibility data presentation.
- **Kinetic creator marketing:** editorial display typography, bento composition, dotted and grid textures, ambient gradients, curved SVG connectors, tactile floating cards, expressive but restrained motion, and responsive full-bleed sections.
- **Color story layer:** lavender-aware canvases, pink active states, mint success panels, yellow highlights, and lilac feature cards. These surfaces are semantic palette tokens, so the four palette choices recolor the complete visual language rather than only changing buttons.

The visual reset is intentionally not a restyle of the former brutalist system. Shared `brutal/*` paths may remain as compatibility filenames during migration, but their rendered output must follow the new soft-surface system. Hard black borders, offset shadows, rotated stickers, and coral-first controls are not allowed in newly rebuilt surfaces unless a specific Stitch reference calls for a deliberately tactile accent.

### Stitch component extraction rule

The exported `code.html` files are static Tailwind references, not React modules that can be imported directly. To use them accurately without blind copy-paste, recurring Stitch structures are extracted into typed React primitives under `src/components/stitch/`:

- `StitchSection`: responsive full-width section rhythm and ambient surface wrapper.
- `StitchCard`: white rounded surface with Stitch soft elevation and optional hover lift.
- `StitchBadge`: brand, success, and neutral status chips matching the reference semantics.
- `StitchButton`: pill action treatment with Stitch hover lift, glow, and focus behavior.
- `StitchColorCard`: palette-aware pink, lilac, yellow, and mint editorial cards for bento sections and feature storytelling.
- `StitchOrbitalGraphic`: responsive orbit linework and ambient nodes for the curved connector language in the references.

The homepage must use these primitives first. Authenticated navigation pages then migrate their cards, status chips, actions, and section wrappers to the same primitives, with real data and existing handlers passed in as props. No raw generated HTML, remote Stitch scripts, or static placeholder interactions may be copied into the application.

## New reference analysis and product direction

The currently available reference material, including the supplied visual reference image, points to a more expressive system than the original dashboard treatment:

- **Canvas:** pale lavender, porcelain, and softly tinted section backgrounds rather than a plain white page.
- **Composition:** large editorial headlines paired with a contained white product surface, then alternating bento panels with generous negative space.
- **Shapes:** heavily rounded cards, pill controls, circular avatars, soft inset panels, and curved orbit or connector lines. Hard black outlines and offset shadows are explicitly excluded.
- **Color rhythm:** one dominant palette color per section, supported by pink active states, mint success states, yellow highlights, lilac information panels, and neutral white data surfaces.
- **Trust language:** show the real project journey, visible pay before commitment, supervisor protection, verification clarity, and payout reconciliation. Avoid inflated claims or invented social proof.
- **Conversion path:** every public section should point toward one clear action: create an account and explore matched work. Secondary links explain the process without competing with registration.
- **Motion language:** editorial text reveals, floating ambient shapes, orbiting decorative lines, staggered cards, spring hover lift, animated accordion transitions, and route-level crossfades. Motion must support comprehension, not distract from pay, eligibility, or lifecycle actions.
- **Reference-specific treatment:** use the lavender-white-pink rhythm for the homepage and public conversion pages, the cleaner white/slate treatment for data-heavy authenticated pages, and the cobalt or violet accents only for focus, primary actions, progress, and selected navigation. Do not flatten every screen into one saturated color.

The supplied reference library is available at `D:\Dolancer\references`. It contains 24 WebP visual references, three tall full-page captures, and `stitch_doer_freelance_task_portal.zip`. The WebP set is primarily composed of 1200x900 and 2048x1536 screen references, with tall captures at 1200x5988, 1440x10876, and 2048x12077. The visual profiling confirms a consistent light editorial system: white product surfaces, pale lavender canvases, warm porcelain panels, pink highlight states, restrained cobalt accents, rounded modules, and generous whitespace. The tall captures should guide page rhythm and responsive section sequencing; the 4:3 captures should guide component composition and state detail. These assets are analyzed as visual references, not copied directly into the app.

Reference inventory:

- **Full-page compositions:** `5d5b8dda8440d42df55ffd7b76962195.webp`, `9a92c9031c8c1722e03442de4e0d4218.webp`, `564183439b3e3b37be1a9a9ed4b0ad29.webp`.
- **Desktop or tablet component and screen studies:** `0537d1ca70a7d78149a73d30827457cb.webp`, `096e70c22f418761353a50ea7237f454.webp`, `0a57ea851c499df75fea68073be66a1e.webp`, `17251318a8ab8f1c0496b680ce62de89.webp`, `1b2a91861d5e4d2ee9cab42eb1a9fe45.webp`, `29f327b779299f63d96541321214ab83.webp`, `36387ebb0a100561a201df8fa80bfe54.webp`, `3781e2a4d04fada2afc5a9f4bbab7e4b.webp`, `4548ce5ec55eaf04432ab8ab53c39c85.webp`, `478164f993514389661362e5351b3eac.webp`, `67bf3c26d373d59e797995b3acce7640.webp`, `901a961173e9625e8312b964d87011ca.webp`, `a242b000845edc9fd3ff6dc6fbc163e9.webp`, `a3208bffef5afd95f5873bf2116d2ac1.webp`, `afa198bf9e3efff9244c41e446eb700b.webp`, `b751efc0d5d1ca3c5726bd6858dee1f4.webp`, `c4c2edc456e17d5ba918131dff6224d0.webp`, `d263c98e3563ee96a9e3772a16211239.webp`, `e3d8b9e2e78233df6486f7ec5994646a.webp`, `f015d00afb41989a261aacc69c38bb70.webp`, and `original-93b889834ed881a99e76538846cb9a26.webp`.
- **Stitch source screens and design notes:** the ZIP includes named landing, how-it-works, FAQ, calculator, auth, dashboard, pool, workbench, earnings, referrals, verification, and `DESIGN.md` references. Its `code.html` files remain static references only.

## Experience architecture

### Phase A: Homepage as the conversion and trust proof

Recompose `/` as a guided narrative rather than a collection of feature sections:

1. **Animated promise hero:** split editorial headline, rotating or crossfading benefit phrase, compact palette-aware CTA cluster, and a floating project preview showing discipline, pay, deadline, and claim state.
2. **Trust rail:** small proof statements for pay visibility, supervisor-backed delivery, verification safety, and no bidding. Use icon plus text, not unsupported numbers.
3. **Interactive project journey:** a five-step tab or accordion from claim to payout. The active item uses the palette active surface, while the right-side card updates with real illustrative states and a progress transition.
4. **Color-card bento:** lilac, pink, mint, and yellow cards explaining the product thesis. Each card gets a small motion motif such as a dot field, orbit, checkmark path, or payout pulse.
5. **Payout transparency:** preserve `PayoutExplainer` calculations and show gross, withholding, and net as a clean receipt surface with animated but non-misleading progress updates.
6. **Eligibility and safety section:** explain age, identity, country, and skill gates in plain language with links to the real routes. This builds trust without weakening enforcement.
7. **Final CTA:** a calm high-contrast panel with one registration action, a short expectation of what happens next, and a sign-in link for returning users.

Homepage motion rules:

- Hero text enters by line with a 60-100 ms stagger and no perpetual text movement.
- Floating cards use low-amplitude, paused-on-hover motion and remain readable at all times.
- Scroll reveals trigger once per section and use opacity plus 16-24 px vertical movement.
- Interactive journey changes use a spring crossfade with `aria-live` updates.
- Decorative orbit paths may loop slowly, but pause under reduced motion and never contain required information.

### Phase B: Public navigation pages

- `/how-it-works`: convert the journey into a scrollable protocol with curved connectors, escrow and supervisor explanations, payout calculator, and a persistent registration CTA.
- `/about`: present the autonomous creator thesis with comparison cards and a concrete explanation of what Dolancer does and does not promise.
- `/contact`: use a soft support/contact layout with clear routing for signed-in users, public questions, and urgent account issues.
- `/legal/:kind`: use readable accordions and section navigation. Keep legal copy, links, and consent behavior unchanged.

All public pages share the same header, palette selector, motion primitives, CTA wording, footer, and responsive container. They must not introduce separate visual systems.

### Phase C: Authentication and onboarding

- `/sign-in` and `/sign-up`: use a centered auth card over the same ambient canvas as the homepage, with a visual side panel on desktop and a single-column layout on mobile.
- Preserve OTP, Google authentication, Turnstile, resend cooldown, demo mode, error announcements, and mode-specific copy.
- Animate only shell transitions and validation feedback. Never delay a submit, hide an error, or animate a security decision.
- `/onboarding/country`: use a guided step card with progress context, eligibility explanation, and the existing country mutation and redirects.

### Phase D: Authenticated shell and dashboard

- Rebuild `AppShell` as a glass top bar plus responsive navigation rail. Desktop uses a stable left rail; tablet uses a collapsible rail; mobile uses a bottom action bar plus drawer.
- `/dashboard`: lead with a personalized spotlight, readiness progress, availability control, active work preview, matched pool preview, and earnings summary.
- Use animated count-up only for non-financial progress metrics. Financial values fade or slide into place without pretending money is changing.
- Keep verification, age, country, availability, and capacity prompts visible as intentional trust and readiness cards.

### Phase E: Work, earnings, trust, and support surfaces

- `/pool`: filterable job cards with staggered reveals, saved board notification state, responsive list/grid modes, and an animated claim drawer.
- `/work` and `/work/:id`: grouped work states, clear lifecycle timeline, evidence and acceptance panels, and safe action confirmation.
- `/earnings`: summary cards, reconciliation visualization, financial-year filter, ledger table, and CSV export with no decorative motion on monetary totals.
- `/verification` and `/skills`: step-based clearance cards, document safety explanation, status states, and capability proof actions.
- `/refer`: network and referral metrics, QR action, referral ledger, and a share CTA using the existing mutations.
- `/training`, `/notifications`, `/profile`, `/tickets`, `/tickets/:id`, and `/admin`: apply the same shell, card language, loading states, empty states, and responsive behavior without changing permissions or data flows.

## Shared animation and interaction contract

- Create typed motion helpers for page entrance, staggered lists, card hover, drawer, accordion, and reduced-motion variants.
- Use `AnimatePresence` only where an element genuinely enters or leaves. Prefer CSS transitions for simple color, shadow, and focus changes.
- Respect keyboard focus, screen readers, touch targets of at least 44 px, and `prefers-reduced-motion`.
- Pause decorative loops when offscreen where practical. Do not animate large layout dimensions in a way that causes horizontal overflow.
- Keep all data state, mutation state, loading state, and error state sourced from existing hooks. Motion wraps those states but does not replace them.

## Delivery order and approval checkpoints

1. **Checkpoint 1:** approve this visual and experience direction.
2. **Checkpoint 2:** implement shared motion primitives, reference-aware tokens, and homepage shell.
3. **Checkpoint 3:** review the homepage in all four palettes at desktop and mobile widths.
4. **Checkpoint 4:** migrate public pages and auth/onboarding.
5. **Checkpoint 5:** migrate `AppShell`, dashboard, pool, workbench, earnings, verification, and remaining routes.
6. **Checkpoint 6:** run route, workflow, accessibility, reduced-motion, palette, and responsive verification before release.

Each checkpoint must preserve the existing route table and business boundaries. No phase should replace API, query, auth, verification, payout, or lifecycle code.

## Approval gate

This file is the complete implementation map. The requested redesign should begin with the homepage only after this expanded direction is approved. After homepage review, proceed page by page through public navigation, auth/onboarding, the authenticated shell, dashboard, work, earnings, verification, and remaining workflows.

import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { MarketingLayout } from "@/features/marketing/MarketingLayout";
import { LandingPage } from "@/features/marketing/LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteError } from "./RouteError";
import { NotFoundPage } from "./NotFoundPage";
import { applySeo } from "./apply-seo";
import { SkeletonCard } from "@/components/brutal/Skeleton";

/*
 * Route-level splitting. Only the public landing page stays in the entry chunk:
 * it is the first paint for almost every visitor, and it should not make them
 * download the signed-in app as well. The sign-in screens and the app shell load
 * on navigation, like every other page, behind a skeleton so a slow network reads
 * as loading rather than broken.
 */
const AppShell = lazy(() => import("@/layouts/AppShell").then((m) => ({ default: m.AppShell })));
const AuthLayout = lazy(() =>
  import("@/layouts/AuthLayout").then((m) => ({ default: m.AuthLayout })),
);
const SignInPage = lazy(() =>
  import("@/features/auth/SignInPage").then((m) => ({ default: m.SignInPage })),
);
const DashboardPage = lazy(() =>
  import("@/features/dashboard/DashboardPage").then((m) => ({ default: m.DashboardPage })),
);
const HowItWorksPage = lazy(() =>
  import("@/features/marketing/HowItWorksPage").then((m) => ({ default: m.HowItWorksPage })),
);
const ContactPage = lazy(() =>
  import("@/features/marketing/ContactPage").then((m) => ({ default: m.ContactPage })),
);
const LegalPage = lazy(() =>
  import("@/features/marketing/LegalPage").then((m) => ({ default: m.LegalPage })),
);
const AuthCallbackPage = lazy(() =>
  import("@/features/auth/AuthCallbackPage").then((m) => ({ default: m.AuthCallbackPage })),
);
const CountryOnboardingPage = lazy(() =>
  import("@/features/auth/CountryOnboardingPage").then((m) => ({
    default: m.CountryOnboardingPage,
  })),
);
const CalendarPage = lazy(() =>
  import("@/features/calendar/CalendarPage").then((m) => ({ default: m.CalendarPage })),
);
const PoolPage = lazy(() =>
  import("@/features/pool/PoolPage").then((m) => ({ default: m.PoolPage })),
);
const WorkPage = lazy(() =>
  import("@/features/work/WorkPage").then((m) => ({ default: m.WorkPage })),
);
const WorkbenchPage = lazy(() =>
  import("@/features/work/WorkbenchPage").then((m) => ({ default: m.WorkbenchPage })),
);
const EarningsPage = lazy(() =>
  import("@/features/earnings/EarningsPage").then((m) => ({ default: m.EarningsPage })),
);
const SkillsPage = lazy(() =>
  import("@/features/skills/SkillsPage").then((m) => ({ default: m.SkillsPage })),
);
const TrainingPage = lazy(() =>
  import("@/features/training/TrainingPage").then((m) => ({ default: m.TrainingPage })),
);
const LessonPage = lazy(() =>
  import("@/features/training/LessonPage").then((m) => ({ default: m.LessonPage })),
);
const VerificationPage = lazy(() =>
  import("@/features/verification/VerificationPage").then((m) => ({
    default: m.VerificationPage,
  })),
);
const NotificationsPage = lazy(() =>
  import("@/features/notifications/NotificationsPage").then((m) => ({
    default: m.NotificationsPage,
  })),
);
const ProfilePage = lazy(() =>
  import("@/features/profile/ProfilePage").then((m) => ({ default: m.ProfilePage })),
);
const ReferPage = lazy(() =>
  import("@/features/referrals/ReferPage").then((m) => ({ default: m.ReferPage })),
);
const TicketsPage = lazy(() =>
  import("@/features/tickets/TicketsPage").then((m) => ({ default: m.TicketsPage })),
);
const TicketPage = lazy(() =>
  import("@/features/tickets/TicketPage").then((m) => ({ default: m.TicketPage })),
);
// Hidden from navigation on purpose. Direct URL only, role-gated inside.
const AdminPage = lazy(() =>
  import("@/features/admin/AdminPage").then((m) => ({ default: m.AdminPage })),
);

function layout(node: React.ReactNode) {
  return <Suspense fallback={<div className="min-h-dvh bg-canvas" aria-busy="true" />}>{node}</Suspense>;
}

function page(node: React.ReactNode) {
  return (
    <Suspense
      fallback={
        <div className="space-y-4">
          <span role="status" aria-live="polite" className="sr-only">
            Loading page
          </span>
          <SkeletonCard />
        </div>
      }
    >
      {node}
    </Suspense>
  );
}

/**
 * There is no /pending and no /apply blocking route, and that is on purpose.
 * Verification and application state are prompts inside the dashboard, never walls
 * in front of it.
 */
export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/how-it-works", element: page(<HowItWorksPage />) },
      // The About page was merged into the home page. Old links land on that section.
      { path: "/about", element: <Navigate to={{ pathname: "/", hash: "#why-dolancer" }} replace /> },
      { path: "/contact", element: page(<ContactPage />) },
      { path: "/legal", element: <Navigate to="/legal/terms" replace /> },
      { path: "/legal/:kind", element: page(<LegalPage />) },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
  {
    element: layout(<AuthLayout />),
    errorElement: <RouteError />,
    children: [
      { path: "/sign-in", element: page(<SignInPage mode="sign-in" />) },
      { path: "/sign-up", element: page(<SignInPage mode="sign-up" />) },
      { path: "/auth/callback", element: page(<AuthCallbackPage />) },
      {
        path: "/onboarding/country",
        element: (
          <ProtectedRoute>
            {page(<CountryOnboardingPage />)}
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    element: (
      <ProtectedRoute>{layout(<AppShell />)}</ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { path: "/dashboard", element: page(<DashboardPage />) },
      { path: "/work", element: page(<WorkPage />) },
      { path: "/work/:id", element: page(<WorkbenchPage />) },
      { path: "/calendar", element: page(<CalendarPage />) },
      { path: "/pool", element: page(<PoolPage />) },
      { path: "/earnings", element: page(<EarningsPage />) },
      { path: "/verification", element: page(<VerificationPage />) },
      { path: "/skills", element: page(<SkillsPage />) },
      { path: "/training", element: page(<TrainingPage />) },
      { path: "/training/:id", element: page(<LessonPage />) },
      { path: "/notifications", element: page(<NotificationsPage />) },
      { path: "/profile", element: page(<ProfilePage />) },
      { path: "/refer", element: page(<ReferPage />) },
      { path: "/tickets", element: page(<TicketsPage />) },
      { path: "/tickets/:id", element: page(<TicketPage />) },
      { path: "/admin", element: page(<AdminPage />) },
    ],
  },
]);

// Title, description and preview tags for each page, kept in step with the router
// rather than set by each page.
const syncSeo = () => applySeo(router.state.location.pathname);
router.subscribe(syncSeo);
syncSeo();

import { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MarketingLayout } from "@/features/marketing/MarketingLayout";
import { LandingPage } from "@/features/marketing/LandingPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { RouteError } from "./RouteError";
import { SignInPage } from "@/features/auth/SignInPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { SkeletonCard } from "@/components/brutal/Skeleton";

/*
 * Route-level splitting. Landing, sign-in and dashboard stay in the entry
 * chunk because one of them is always the first paint. Everything else loads
 * on navigation behind a skeleton, which is also what code-split points need
 * so a slow network reads as loading rather than broken.
 */
const HowItWorksPage = lazy(() =>
  import("@/features/marketing/HowItWorksPage").then((m) => ({ default: m.HowItWorksPage })),
);
const AboutPage = lazy(() =>
  import("@/features/marketing/AboutPage").then((m) => ({ default: m.AboutPage })),
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
      { path: "/about", element: page(<AboutPage />) },
      { path: "/contact", element: page(<ContactPage />) },
      { path: "/legal", element: <Navigate to="/legal/terms" replace /> },
      { path: "/legal/:kind", element: page(<LegalPage />) },
    ],
  },
  {
    element: <AuthLayout />,
    errorElement: <RouteError />,
    children: [
      { path: "/sign-in", element: <SignInPage mode="sign-in" /> },
      { path: "/sign-up", element: <SignInPage mode="sign-up" /> },
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
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <RouteError />,
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/work", element: page(<WorkPage />) },
      { path: "/work/:id", element: page(<WorkbenchPage />) },
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
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

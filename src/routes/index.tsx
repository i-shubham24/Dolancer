import { createBrowserRouter, Navigate } from "react-router-dom";
import { AppShell } from "@/layouts/AppShell";
import { AuthLayout } from "@/layouts/AuthLayout";
import { MarketingLayout } from "@/features/marketing/MarketingLayout";
import { LandingPage } from "@/features/marketing/LandingPage";
import { HowItWorksPage } from "@/features/marketing/HowItWorksPage";
import { AboutPage } from "@/features/marketing/AboutPage";
import { ContactPage } from "@/features/marketing/ContactPage";
import { LegalPage } from "@/features/marketing/LegalPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { SignInPage } from "@/features/auth/SignInPage";
import { AuthCallbackPage } from "@/features/auth/AuthCallbackPage";
import { CountryOnboardingPage } from "@/features/auth/CountryOnboardingPage";
import { DashboardPage } from "@/features/dashboard/DashboardPage";
import { PoolPage } from "@/features/pool/PoolPage";
import { WorkPage } from "@/features/work/WorkPage";
import { WorkbenchPage } from "@/features/work/WorkbenchPage";
import { EarningsPage } from "@/features/earnings/EarningsPage";
import { SkillsPage } from "@/features/skills/SkillsPage";
import { TrainingPage } from "@/features/training/TrainingPage";
import { LessonPage } from "@/features/training/LessonPage";
import { VerificationPage } from "@/features/verification/VerificationPage";
import { NotificationsPage } from "@/features/notifications/NotificationsPage";
import { ProfilePage } from "@/features/profile/ProfilePage";
import { ReferPage } from "@/features/referrals/ReferPage";
import { TicketsPage } from "@/features/tickets/TicketsPage";
import { TicketPage } from "@/features/tickets/TicketPage";

/**
 * There is no /pending and no /apply blocking route, and that is on purpose.
 * Verification and application state are prompts inside the dashboard, never walls
 * in front of it.
 */
export const router = createBrowserRouter([
  {
    element: <MarketingLayout />,
    children: [
      { path: "/", element: <LandingPage /> },
      { path: "/how-it-works", element: <HowItWorksPage /> },
      { path: "/about", element: <AboutPage /> },
      { path: "/contact", element: <ContactPage /> },
      { path: "/legal", element: <Navigate to="/legal/terms" replace /> },
      { path: "/legal/:kind", element: <LegalPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: "/sign-in", element: <SignInPage mode="sign-in" /> },
      { path: "/sign-up", element: <SignInPage mode="sign-up" /> },
      { path: "/auth/callback", element: <AuthCallbackPage /> },
      {
        path: "/onboarding/country",
        element: (
          <ProtectedRoute>
            <CountryOnboardingPage />
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
    children: [
      { path: "/dashboard", element: <DashboardPage /> },
      { path: "/work", element: <WorkPage /> },
      { path: "/work/:id", element: <WorkbenchPage /> },
      { path: "/pool", element: <PoolPage /> },
      { path: "/earnings", element: <EarningsPage /> },
      { path: "/verification", element: <VerificationPage /> },
      { path: "/skills", element: <SkillsPage /> },
      { path: "/training", element: <TrainingPage /> },
      { path: "/training/:id", element: <LessonPage /> },
      { path: "/notifications", element: <NotificationsPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/refer", element: <ReferPage /> },
      { path: "/tickets", element: <TicketsPage /> },
      { path: "/tickets/:id", element: <TicketPage /> },
      
      
      
      
      
      
      
      
      { path: "*", element: <Navigate to="/dashboard" replace /> },
    ],
  },
]);

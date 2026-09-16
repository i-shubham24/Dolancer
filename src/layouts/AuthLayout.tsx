import { Outlet } from "react-router-dom";

/**
 * Split auth screen. The right panel is decorative and hidden on small viewports,
 * so the form always gets the full width when it matters.
 */
export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:h-dvh lg:overflow-hidden lg:grid-cols-2">
      <div className="auth-form-column flex min-w-0 items-center justify-center px-5 py-6 sm:px-10 lg:min-h-0 lg:overflow-y-auto lg:py-4">
        <Outlet />
      </div>

      <div className="auth-art-panel relative hidden min-w-0 overflow-hidden bg-canvas lg:block">
        <div className="auth-art-shape auth-art-shape-one absolute -right-16 -top-16 h-72 w-72 rotate-12 rounded-[4rem] bg-primary-light shadow-soft-lg" />
        <div className="auth-art-shape auth-art-shape-two absolute -bottom-24 -left-10 h-80 w-80 -rotate-6 rounded-full bg-secondary-light shadow-soft-lg" />
        <div className="auth-art-shape auth-art-shape-three absolute right-24 top-1/3 h-40 w-40 rotate-[18deg] rounded-[3rem] bg-accent-light shadow-soft-lg" />
        <div className="auth-art-shape auth-art-shape-four absolute left-1/4 top-1/4 h-28 w-28 rounded-full bg-primary-light/70 blur-sm" />

        <div className="relative flex h-full items-end p-10 xl:p-12">
          <blockquote className="auth-art-quote max-w-sm rounded-[2rem] bg-surface/90 p-6 shadow-soft-lg">
            <p className="text-2xl font-extrabold leading-[1.25] tracking-[-0.03em]">
              No bidding wars. The pay is agreed before you start, and a supervisor has your
              back.
            </p>
            <footer className="mt-4 text-sm font-bold text-ink-2">
              How work runs on Dolancer
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

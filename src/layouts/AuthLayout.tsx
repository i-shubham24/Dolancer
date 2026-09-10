import { Outlet } from "react-router-dom";

/**
 * Split auth screen. The right panel is decorative and hidden on small viewports,
 * so the form always gets the full width when it matters.
 */
export function AuthLayout() {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex items-center justify-center px-5 py-12 sm:px-10">
        <Outlet />
      </div>

      <div className="relative hidden overflow-hidden border-l-2 border-ink bg-canvas lg:block">
        <div className="absolute -right-16 -top-16 h-72 w-72 rotate-12 rounded-3xl border-2 border-ink bg-coral" />
        <div className="absolute -bottom-24 -left-10 h-80 w-80 -rotate-6 rounded-full border-2 border-ink bg-blue" />
        <div className="absolute right-24 top-1/3 h-40 w-40 rotate-[18deg] rounded-2xl border-2 border-ink bg-lime" />

        <div className="relative flex h-full items-end p-12">
          <blockquote className="max-w-sm rounded-2xl border-2 border-ink bg-surface p-6 shadow-modal">
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

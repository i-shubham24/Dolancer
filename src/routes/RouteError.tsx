import { Link, useRouteError } from "react-router-dom";
import { AlertTriangle, RotateCw, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/brutal/Card";
import { Button } from "@/components/ui/button";

/**
 * Route-level failure screen.
 *
 * Lazy chunks can fail to load when the network drops or a fresh deploy
 * invalidates the file the open tab points at. That must read as a loading
 * problem with a way out, never the framework's red error page.
 */
export function RouteError() {
  const error = useRouteError();
  if (import.meta.env.DEV && error) {
    console.warn("[dolancer] route failed:", error);
  }

  function retry() {
    window.location.reload();
  }

  return (
    <div className="mx-auto max-w-xl py-10">
      <Card className="border-2 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-warning-ink" aria-hidden="true" />
        <h1 className="mt-3 text-2xl font-extrabold tracking-[-0.03em]">
          This page did not load
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-ink-2">
          Check your connection and try again. Your work is safe; nothing was lost.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button onClick={retry}>
            <RotateCw className="h-4 w-4" aria-hidden="true" />
            Try again
          </Button>
          <Button asChild variant="secondary">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Back to dashboard
            </Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}

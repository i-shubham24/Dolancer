import { Suspense, lazy, useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";

// Toasts only follow something the visitor did, so the library loads after first paint
// instead of riding in the first file every visitor downloads.
const Toaster = lazy(() => import("sonner").then((m) => ({ default: m.Toaster })));

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
        <Suspense fallback={null}>
          <Toaster
            position="bottom-right"
            toastOptions={{
              // Same soft white card as the app's pop-ups, so confirmations look of a piece.
              style: {
                border: "1px solid rgba(9, 14, 26, 0.06)",
                borderRadius: "16px",
                boxShadow: "0 18px 44px -14px rgba(11, 31, 58, 0.35)",
                fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
                fontWeight: 600,
              },
            }}
          />
        </Suspense>
      </AuthProvider>
    </QueryClientProvider>
  );
}

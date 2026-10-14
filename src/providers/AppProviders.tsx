import { useState } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { createQueryClient } from "@/lib/query-client";
import { AuthProvider } from "./AuthProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        {children}
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
      </AuthProvider>
    </QueryClientProvider>
  );
}

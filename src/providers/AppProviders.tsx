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
            style: {
              border: "2px solid #111111",
              borderRadius: "10px",
              boxShadow: "3px 3px 0px #111111",
              fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
              fontWeight: 600,
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

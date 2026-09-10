import { QueryClient } from "@tanstack/react-query";

/**
 * Server state lives here and nowhere else. Zustand holds UI state only.
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      mutations: { retry: 0 },
    },
  });
}

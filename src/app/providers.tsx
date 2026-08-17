import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { BrowserRouter } from "react-router";
import type { ReactNode } from "react";
import { ApiError } from "../shared/types/api-error";

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (
        error instanceof ApiError &&
        error.status === 401 &&
        query.queryKey[0] !== "auth"
      ) {
        queryClient.setQueryData(["auth", "me"], null);
      }
    },
  }),
});

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

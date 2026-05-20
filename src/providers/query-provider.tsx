"use client";

import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { type ReactNode, useState } from "react";

const CACHE_KEY = "mathler-query-cache";
/** 24 hours — cache survives a full day of sessions */
const CACHE_MAX_AGE_MS = 1_000 * 60 * 60 * 24;

export const ReactQueryProvider = ({ children }: { children: ReactNode }) => {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Number.POSITIVE_INFINITY,
            gcTime: CACHE_MAX_AGE_MS,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            refetchOnReconnect: false,
            retry: 1,
          },
        },
      }),
  );

  const [persister] = useState(() =>
    createSyncStoragePersister({
      storage: typeof window !== "undefined" ? window.localStorage : undefined,
      key: CACHE_KEY,
    }),
  );

  return (
    <PersistQueryClientProvider
      client={client}
      persistOptions={{
        persister,
        maxAge: CACHE_MAX_AGE_MS,
        // Only persist the radio status query
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => query.queryKey[0] === "plaza-status",
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
};

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export default function QueryProvider({
   children,
}: {
   children: React.ReactNode;
}) {
   const [queryClient] = useState(
      () =>
         new QueryClient({
            defaultOptions: {
               queries: {
                  staleTime: 60 * 15000,
                  refetchOnWindowFocus: true,
                  retry: 1, // retry failed requests once
               },
            },
         }),
   );

   return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
   );
}

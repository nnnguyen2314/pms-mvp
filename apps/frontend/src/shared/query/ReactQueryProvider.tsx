'use client';

import React from 'react';
import { QueryClientProvider, HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { getQueryClient } from './queryClient';

export default function ReactQueryProvider({ children, state }: { children: React.ReactNode; state?: DehydratedState }) {
  const client = getQueryClient();
  return (
    <QueryClientProvider client={client}>
      <HydrationBoundary state={state}>{children}</HydrationBoundary>
    </QueryClientProvider>
  );
}

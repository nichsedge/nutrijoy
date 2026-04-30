"use client";

import { AppProvider } from './AppContext';
import { Toaster } from '@/components/ui/toaster';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      {children}
      <Toaster />
    </AppProvider>
  );
}
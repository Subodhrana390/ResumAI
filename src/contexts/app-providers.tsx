"use client";

import React from 'react';
import { ResumeProvider } from './resume-context';
// Import other providers here if needed, e.g., AuthProvider

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ResumeProvider>
      {/* <AuthProvider> */}
        {children}
      {/* </AuthProvider> */}
    </ResumeProvider>
  );
}

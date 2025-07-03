"use client";

import React from 'react';
import { ResumeProvider } from './resume-context';
import { AuthProvider } from './auth-context';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ResumeProvider>
        {children}
      </ResumeProvider>
    </AuthProvider>
  );
}

"use client";

import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, LogIn, Loader } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push('/resumes');
    }
  }, [user, isLoading, router]);

  if (isLoading || user) {
      return (
          <div className="flex items-center justify-center min-h-screen bg-background">
              <Loader className="h-8 w-8 animate-spin text-primary" />
          </div>
      )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <Link href="/" className="flex items-center justify-center mb-8" prefetch={false}>
          <BotMessageSquare className="h-10 w-10 text-primary" />
          <span className="ml-3 text-4xl font-bold font-headline">ResumAI</span>
        </Link>
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-headline">Welcome Back!</CardTitle>
          <CardDescription>
            This is a simulated login. Click the button below to continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={login} className="w-full" size="lg">
            <LogIn className="mr-2 h-5 w-5" />
            Log In as Demo User
          </Button>
        </CardContent>
      </Card>
      <p className="mt-4 text-xs text-muted-foreground">
        No account needed. This is for demonstration purposes only.
      </p>
    </div>
  );
}

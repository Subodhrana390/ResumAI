"use client";

import { useAuth } from '@/contexts/auth-context';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, Loader, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="24px" height="24px" {...props}>
        <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
        <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
        <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.222,0-9.612-3.356-11.303-8H6.306C9.656,39.663,16.318,44,24,44z" />
        <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.62,44,30.852,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
);

export default function LoginPage() {
  const { login, user, isLoading, isFirebaseConfigured } = useAuth();

  // The redirect logic and global loading screen are now handled in AuthProvider
  if (isLoading || (user && isFirebaseConfigured)) {
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
          <CardTitle className="text-2xl font-headline">Welcome!</CardTitle>
          <CardDescription>
            {isFirebaseConfigured ? "Sign in with your Google account to continue." : "Firebase is not configured."}
          </CardDescription>
        </CardHeader>
        <CardContent>
            {!isFirebaseConfigured ? (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Configuration Error</AlertTitle>
                    <AlertDescription>
                        Firebase is not configured correctly. Please add your credentials to the <code>.env</code> file. Login is disabled.
                    </AlertDescription>
                </Alert>
            ) : (
                <Button onClick={login} className="w-full" size="lg" variant="outline" disabled={!isFirebaseConfigured}>
                    <GoogleIcon className="mr-2 h-5 w-5" />
                    Sign in with Google
                </Button>
            )}
        </CardContent>
      </Card>
       <p className="mt-4 text-xs text-muted-foreground">
        {isFirebaseConfigured ? "This will create or sign you into your ResumAI account." : "Please contact the administrator or check the console."}
      </p>
    </div>
  );
}

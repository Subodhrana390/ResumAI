"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, firebaseConfigured } from '@/lib/firebase';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: FirebaseUser | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    // If Firebase is not configured, don't try to listen to auth state
    if (!auth) {
        setUser(null);
        setIsLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setIsLoading(false);
    }, (error) => {
      // Handle potential errors from onAuthStateChanged
      console.error("Auth state change error:", error);
      setUser(null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    if (!auth) {
        toast({
            title: "Login Unavailable",
            description: "Firebase is not configured. Please add API keys to the .env file.",
            variant: "destructive"
        });
        console.error("Firebase not configured, login unavailable.");
        return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // onAuthStateChanged will handle the user state and the effect below will redirect
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup closed by user.');
        // No toast needed for this case, it's an intentional user action.
      } else {
        console.error("Firebase login failed:", error);
        toast({
            title: "Login Failed",
            description: "Could not sign in with Google. Please check console for details.",
            variant: "destructive"
        });
      }
    }
  };

  const logout = async () => {
    if (!auth) {
        // If no auth, we are already "logged out". Go to login page.
        setUser(null);
        router.push('/login');
        return;
    }
    try {
      await signOut(auth);
      // The redirect logic in useEffect handles routing to /login
    } catch (error) {
      console.error("Firebase logout failed:", error);
    }
  };
  
   useEffect(() => {
    if (!isLoading) {
        // If firebase is not configured, we don't redirect. User can see public pages.
        if (firebaseConfigured) {
            const isAuthRoute = pathname === '/login';
            const isPublicRoute = pathname === '/';
            
            if (!user && !isAuthRoute && !isPublicRoute) {
                router.push('/login');
            }
            if (user && (isAuthRoute || isPublicRoute)) {
                router.push('/resumes');
            }
        }
    }
  }, [user, isLoading, router, pathname]);

  // Render a global loading screen while auth state is being determined
  // to prevent flicker or showing the wrong page briefly.
  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, isFirebaseConfigured: firebaseConfigured }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

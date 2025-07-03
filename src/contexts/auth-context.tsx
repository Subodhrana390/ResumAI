
"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, type User as FirebaseUser } from 'firebase/auth';
import { auth, firebaseConfigured, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Define the shape of our user profile, including subscription details
export type SubscriptionPlan = 'free' | 'pro';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  subscription: {
    plan: SubscriptionPlan;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  isFirebaseConfigured: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth || !db) {
        setUser(null);
        setIsLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in. Fetch or create their profile in Firestore.
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          setUser(userDoc.data() as UserProfile);
        } else {
          // New user: create a profile with a default 'free' plan.
          const newUserProfile: UserProfile = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            subscription: {
              plan: 'free',
            },
          };
          await setDoc(userDocRef, newUserProfile);
          setUser(newUserProfile);
        }
      } else {
        // User is signed out.
        setUser(null);
      }
      setIsLoading(false);
    }, (error) => {
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
      // onAuthStateChanged will handle setting user state and redirects.
    } catch (error: any) {
      if (error.code === 'auth/popup-closed-by-user') {
        console.log('Sign-in popup closed by user.');
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
        setUser(null);
        router.push('/login');
        return;
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Firebase logout failed:", error);
    }
  };

  const upgradeToPro = async () => {
    if (!user || !db) {
        toast({ title: "Error", description: "You must be logged in to upgrade.", variant: "destructive" });
        return;
    }
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, { subscription: { plan: 'pro' } }, { merge: true });
        
        // Update local user state immediately for instant UI feedback
        const updatedProfile: UserProfile = { ...user, subscription: { plan: 'pro' } };
        setUser(updatedProfile);

        toast({ title: "Upgrade Successful!", description: "Welcome to Pro! You now have access to all premium features." });
    } catch (error) {
        console.error("Upgrade failed:", error);
        toast({ title: "Upgrade Failed", description: "Could not update your subscription. Please try again.", variant: "destructive" });
    }
  };
  
   useEffect(() => {
    if (!isLoading) {
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

  if (isLoading) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-background">
            <Loader className="h-8 w-8 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, upgradeToPro, isFirebaseConfigured: firebaseConfigured }}>
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

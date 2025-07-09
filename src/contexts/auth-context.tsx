"use client";

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, deleteUser } from 'firebase/auth';
import { auth, firebaseConfigured, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
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
    status?: 'active' | 'canceled';
    startDate?: string;
    razorpay_payment_id?: string;
  };
}

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  upgradeToPro: () => Promise<void>;
  cancelSubscription: () => Promise<void>;
  deleteUserAccount: () => Promise<void>;
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
    if (!auth) {
        setUser(null);
        setIsLoading(false);
        return;
    }
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in. We must ensure `db` is available before proceeding.
        if (!db) {
            console.error("Firestore (db) is not configured. Cannot fetch or create user profile.");
            toast({ title: "Database Error", description: "Failed to connect to the database to load your profile.", variant: "destructive" });
            setUser(null);
            setIsLoading(false);
            return;
        }

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
  }, [toast]);

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
  
    const razorpayKey = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  
    if (!razorpayKey) {
      toast({ title: "Configuration Error", description: "Payment gateway is not configured. Please add `NEXT_PUBLIC_RAZORPAY_KEY_ID` to your .env file.", variant: "destructive" });
      console.error("Razorpay Key ID is not set in .env file.");
      return;
    }
  
    const options = {
      key: razorpayKey,
      amount: "9900", // Amount in paise (₹99.00)
      currency: "INR",
      name: "ResumAI Pro",
      description: "Monthly Pro Subscription",
      image: "https://placehold.co/128x128/a7d1e8/2d3e50?text=R", // A placeholder logo
      handler: async function (response: any) {
        // In a real app, you would send `response.razorpay_payment_id` to your backend for verification.
        // For this demo, we will assume payment is successful and upgrade the user.
        if (!db) return; // Re-check db for safety inside async handler
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const newSubscription = {
            plan: 'pro' as SubscriptionPlan,
            status: 'active' as const,
            startDate: new Date().toISOString(),
            razorpay_payment_id: response.razorpay_payment_id,
          };

          await setDoc(userDocRef, { subscription: newSubscription }, { merge: true });
  
          const updatedProfile: UserProfile = {
            ...user,
            subscription: {
              ...user.subscription,
              ...newSubscription,
            }
          };
          setUser(updatedProfile);
  
          toast({ title: "Upgrade Successful!", description: "Welcome to Pro! You now have access to all premium features." });
        } catch (error) {
          console.error("Upgrade failed after payment:", error);
          toast({ title: "Upgrade Failed", description: "Payment was successful, but we couldn't update your subscription. Please contact support.", variant: "destructive" });
        }
      },
      prefill: {
        name: user.displayName || "",
        email: user.email || "",
      },
      notes: {
        userId: user.uid,
      },
      theme: {
        color: "#A7D1E8", // Matches primary theme color
      },
    };
  
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', function (response: any) {
      toast({
        title: 'Payment Failed',
        description: response.error.description || 'Something went wrong.',
        variant: 'destructive',
      });
    });
    rzp.open();
  };

  const cancelSubscription = async () => {
    if (!user || !db || user.subscription.plan !== 'pro') return;

    if (!window.confirm("Are you sure you want to cancel your Pro subscription? You will still have access to Pro features until the end of your current billing cycle.")) {
        return;
    }

    try {
        const userDocRef = doc(db, 'users', user.uid);
        await setDoc(userDocRef, {
            subscription: {
                status: 'canceled',
            }
        }, { merge: true });

        const updatedProfile: UserProfile = {
            ...user,
            subscription: {
                ...user.subscription,
                status: 'canceled',
            }
        };
        setUser(updatedProfile);

        toast({ title: "Subscription Canceled", description: "Your Pro plan has been canceled. Your access will continue until the end of the billing period." });
    } catch (error) {
        console.error("Failed to cancel subscription:", error);
        toast({ title: "Error", description: "Could not cancel your subscription. Please try again.", variant: "destructive" });
    }
  };

  const deleteUserAccount = async () => {
    if (!user || !auth || !auth.currentUser || !db) {
        toast({ title: "Error", description: "You must be logged in to delete your account.", variant: "destructive" });
        return;
    }

    const currentUser = auth.currentUser;

    try {
        // 1. Delete all resumes in the subcollection
        const resumesColRef = collection(db, 'users', currentUser.uid, 'resumes');
        const resumesSnapshot = await getDocs(resumesColRef);
        const deletePromises = resumesSnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        // 2. Delete the main user document
        const userDocRef = doc(db, 'users', currentUser.uid);
        await deleteDoc(userDocRef);

        // 3. Delete the user from Firebase Auth
        await deleteUser(currentUser);

        toast({ title: "Account Deleted", description: "Your account and all associated data have been permanently deleted." });
        // The onAuthStateChanged listener will automatically handle the redirect to the login page.
    } catch (error: any) {
        console.error("Account deletion failed:", error);
        if (error.code === 'auth/requires-recent-login') {
            toast({
                title: "Authentication Required",
                description: "This is a sensitive operation. Please log out and log back in before trying again.",
                variant: "destructive",
                duration: 9000,
            });
        } else {
            toast({ title: "Deletion Failed", description: "An error occurred while deleting your account. Please try again.", variant: "destructive" });
        }
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
    <AuthContext.Provider value={{ user, isLoading, login, logout, upgradeToPro, cancelSubscription, deleteUserAccount, isFirebaseConfigured: firebaseConfigured }}>
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

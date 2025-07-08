
"use client";

import type { ResumeData } from '@/types/resume';
import { defaultResumeData } from '@/types/resume';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './auth-context';
import { db } from '@/lib/firebase';
import { collection, doc, getDocs, setDoc, deleteDoc, query } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

interface ResumeContextType {
  resumes: ResumeData[];
  activeResume: ResumeData | null;
  isLoading: boolean;
  loadResumes: () => Promise<void>;
  saveActiveResume: () => Promise<void>;
  createResume: () => Promise<ResumeData | null>;
  setActiveResumeById: (id: string | null) => void;
  deleteResume: (id:string) => Promise<void>;
  updateActiveResume: (updater: (prev: ResumeData | null) => ResumeData) => void;
  duplicateResume: (id: string) => Promise<ResumeData | null>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const loadResumes = useCallback(async () => {
    if (!user || !db) {
        setResumes([]);
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    try {
      const resumesCol = collection(db, 'users', user.uid, 'resumes');
      const q = query(resumesCol);
      const snapshot = await getDocs(q);
      const userResumes = snapshot.docs.map(doc => doc.data() as ResumeData);
      setResumes(userResumes);
    } catch (error) {
      console.error("Failed to load resumes from Firestore:", error);
      toast({ title: "Error", description: "Could not load your resumes from the database.", variant: "destructive"});
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);
  
  useEffect(() => {
      if (!isAuthLoading) {
        loadResumes();
        setActiveResume(null); // Clear active resume on user change
      }
  }, [user, isAuthLoading, loadResumes]);

  const createResume = useCallback(async (): Promise<ResumeData | null> => {
    if (!user || !db) {
        toast({ title: "Authentication Error", description: "You must be logged in to create a resume.", variant: "destructive"});
        return null;
    }

    // Subscription check: Free plan limit is 5 resumes
    if (user.subscription.plan === 'free' && resumes.length >= 5) {
        toast({
            title: "Upgrade to Pro to Create More Resumes",
            description: "The Free plan is limited to 5 resumes. Please upgrade to create more.",
            variant: "destructive"
        });
        return null;
    }

    const newId = uuidv4();
    const newResume: ResumeData = {
      ...defaultResumeData,
      id: newId,
      versionName: `Untitled Resume ${resumes.length + 1}`,
      contact: { ...defaultResumeData.contact, name: user.displayName || '', email: user.email || '' },
      meta: { ...defaultResumeData.meta, lastModified: new Date().toISOString() },
    };
    
    try {
        const resumeRef = doc(db, 'users', user.uid, 'resumes', newId);
        await setDoc(resumeRef, newResume);
        const updatedResumes = [...resumes, newResume];
        setResumes(updatedResumes);
        setActiveResume(newResume);
        toast({ title: "Resume Created!", description: "Your new resume has been saved." });
        return newResume;
    } catch (error) {
        console.error("Error creating resume in Firestore:", error);
        toast({ title: "Error", description: "Could not create new resume.", variant: "destructive"});
        return null;
    }
  }, [resumes, user, toast]);

  const setActiveResumeById = useCallback((id: string | null) => {
    if (id === null) {
      setActiveResume(null);
      return;
    }
    const resumeToActivate = resumes.find(r => r.id === id);
    setActiveResume(resumeToActivate || null);
  }, [resumes]);

  const updateActiveResume = useCallback((updater: (prev: ResumeData | null) => ResumeData) => {
    setActiveResume(prev => {
      const updated = updater(prev);
      return { ...updated, meta: { ...updated.meta, lastModified: new Date().toISOString() } };
    });
  }, []);
  
  const saveActiveResume = useCallback(async () => {
    if (!activeResume || !user || !db) {
        if(!db) toast({ title: "Save Failed", description: "Database connection not available.", variant: "destructive"});
        return;
    }
    
    const resumeToSave = { ...activeResume, meta: { ...activeResume.meta, lastModified: new Date().toISOString()}};
    try {
        const resumeRef = doc(db, 'users', user.uid, 'resumes', resumeToSave.id);
        await setDoc(resumeRef, resumeToSave, { merge: true });

        const updatedResumes = resumes.map(r => r.id === resumeToSave.id ? resumeToSave : r);
        if (!updatedResumes.find(r => r.id === resumeToSave.id)) {
            updatedResumes.push(resumeToSave);
        }
        setResumes(updatedResumes);
    } catch (error) {
        console.error("Error saving resume to Firestore:", error);
        toast({ title: "Save Error", description: "Your changes could not be saved to the database.", variant: "destructive"});
    }
  }, [activeResume, user, resumes, toast]);

  const deleteResume = useCallback(async (id: string) => {
    if (!user || !db) {
        toast({ title: "Error", description: "You must be logged in to delete resumes.", variant: "destructive"});
        return;
    }
    try {
        const resumeRef = doc(db, 'users', user.uid, 'resumes', id);
        await deleteDoc(resumeRef);
        
        const updatedResumes = resumes.filter(r => r.id !== id);
        setResumes(updatedResumes);
        
        if (activeResume?.id === id) {
          setActiveResume(null);
        }
        toast({ title: "Resume Deleted", description: "The resume has been successfully deleted."});
    } catch(error) {
        console.error("Error deleting resume from Firestore:", error);
        toast({ title: "Delete Error", description: "The resume could not be deleted.", variant: "destructive"});
    }
  }, [resumes, activeResume, user, toast]);

  const duplicateResume = useCallback(async (id: string): Promise<ResumeData | null> => {
    if (!user || !db) {
      toast({ title: "Error", description: "You must be logged in to duplicate resumes.", variant: "destructive"});
      return null;
    }

    if (user.subscription.plan === 'free' && resumes.length >= 5) {
        toast({
            title: "Upgrade to Pro to Duplicate",
            description: "The Free plan is limited to 5 resumes. Please upgrade to create more.",
            variant: "destructive"
        });
        return null;
    }

    const resumeToDuplicate = resumes.find(r => r.id === id);
    if (!resumeToDuplicate) {
        toast({ title: "Error", description: "Could not find the resume to duplicate.", variant: "destructive"});
        return null;
    }

    const newId = uuidv4();
    const duplicatedResume: ResumeData = {
      ...resumeToDuplicate,
      id: newId,
      versionName: `${resumeToDuplicate.versionName} (Copy)`,
      meta: { ...resumeToDuplicate.meta, lastModified: new Date().toISOString() },
    };
    
    try {
        const newResumeRef = doc(db, 'users', user.uid, 'resumes', newId);
        await setDoc(newResumeRef, duplicatedResume);
        
        const updatedResumes = [...resumes, duplicatedResume];
        setResumes(updatedResumes);
        setActiveResume(duplicatedResume);
        toast({ title: "Resume Duplicated!", description: "A copy of your resume has been created."});
        return duplicatedResume;
    } catch (error) {
         console.error("Error duplicating resume in Firestore:", error);
         toast({ title: "Duplicate Error", description: "The resume could not be duplicated.", variant: "destructive"});
         return null;
    }
  }, [resumes, user, toast]);


  return (
    <ResumeContext.Provider value={{ 
      resumes, 
      activeResume, 
      isLoading: isLoading || isAuthLoading,
      loadResumes, 
      saveActiveResume,
      createResume, 
      setActiveResumeById, 
      deleteResume,
      updateActiveResume,
      duplicateResume
    }}>
      {children}
    </ResumeContext.Provider>
  );
};

export const useResumeContext = () => {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error('useResume-context must be used within a ResumeProvider');
  }
  return context;
};

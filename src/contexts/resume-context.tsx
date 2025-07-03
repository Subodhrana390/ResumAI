"use client";

import type { ResumeData } from '@/types/resume';
import { defaultResumeData } from '@/types/resume';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from './auth-context';

const BASE_LOCAL_STORAGE_KEY = 'resumai_resumes';

interface ResumeContextType {
  resumes: ResumeData[];
  activeResume: ResumeData | null;
  isLoading: boolean;
  loadResumes: () => void;
  saveActiveResume: () => Promise<void>;
  createResume: () => Promise<ResumeData>;
  setActiveResumeById: (id: string | null) => void;
  deleteResume: (id:string) => Promise<void>;
  updateActiveResume: (updater: (prev: ResumeData) => ResumeData) => void;
  duplicateResume: (id: string) => Promise<ResumeData | null>;
}

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export const ResumeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading: isAuthLoading } = useAuth();
  const [resumes, setResumes] = useState<ResumeData[]>([]);
  const [activeResume, setActiveResume] = useState<ResumeData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getStorageKey = useCallback(() => {
    if (!user) return null;
    return `${BASE_LOCAL_STORAGE_KEY}_${user.uid}`;
  }, [user]);

  const loadResumes = useCallback(() => {
    const storageKey = getStorageKey();
    if (!storageKey) {
        setResumes([]);
        setIsLoading(false);
        return;
    }
    
    setIsLoading(true);
    try {
      const storedResumes = localStorage.getItem(storageKey);
      if (storedResumes) {
        const parsedResumes = JSON.parse(storedResumes) as ResumeData[];
        setResumes(parsedResumes);
      } else {
        setResumes([]);
      }
    } catch (error) {
      console.error("Failed to load resumes from localStorage:", error);
      setResumes([]);
    } finally {
      setIsLoading(false);
    }
  }, [getStorageKey]);
  
  useEffect(() => {
      if (!isAuthLoading) {
        loadResumes();
        setActiveResume(null);
      }
  }, [user, isAuthLoading, loadResumes]);


  const saveResumesToStorage = useCallback((updatedResumes: ResumeData[]) => {
    const storageKey = getStorageKey();
    if (!storageKey) return;

    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedResumes));
    } catch (error) {
      console.error("Failed to save resumes to localStorage:", error);
    }
  }, [getStorageKey]);

  const createResume = useCallback(async (): Promise<ResumeData> => {
    if (!user) {
        throw new Error("User not authenticated. Cannot create resume.");
    }
    const newId = uuidv4();
    const newResume: ResumeData = {
      ...defaultResumeData,
      id: newId,
      versionName: `Resume ${resumes.length + 1}`,
      contact: { ...defaultResumeData.contact, name: user.displayName || '', email: user.email || '' },
      experience: [],
      education: [],
      skills: [],
      projects: [],
      customSections: [],
      languages: [],
      meta: { ...defaultResumeData.meta, lastModified: new Date().toISOString() },
      settings: { ...defaultResumeData.settings },
    };
    const updatedResumes = [...resumes, newResume];
    setResumes(updatedResumes);
    setActiveResume(newResume);
    saveResumesToStorage(updatedResumes);
    return newResume;
  }, [resumes, saveResumesToStorage, user]);

  const setActiveResumeById = useCallback((id: string | null) => {
    if (id === null) {
      setActiveResume(null);
      return;
    }
    const resumeToActivate = resumes.find(r => r.id === id);
    setActiveResume(resumeToActivate || null);
  }, [resumes]);

  const updateActiveResume = useCallback((updater: (prev: ResumeData) => ResumeData) => {
    setActiveResume(prev => {
      if (!prev) return null;
      const updated = updater(prev);
      return { ...updated, meta: { ...updated.meta, lastModified: new Date().toISOString() } };
    });
  }, []);
  
  const saveActiveResume = useCallback(async () => {
    if (!activeResume) return;
    const updatedResumes = resumes.map(r => r.id === activeResume.id ? { ...activeResume, meta: { ...activeResume.meta, lastModified: new Date().toISOString()}} : r);
    if (!updatedResumes.find(r => r.id === activeResume.id)) {
       updatedResumes.push({...activeResume, meta: { ...activeResume.meta, lastModified: new Date().toISOString()}});
    }
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);
  }, [activeResume, resumes, saveResumesToStorage]);

  const deleteResume = useCallback(async (id: string) => {
    const updatedResumes = resumes.filter(r => r.id !== id);
    setResumes(updatedResumes);
    saveResumesToStorage(updatedResumes);
    if (activeResume?.id === id) {
      setActiveResume(null);
    }
  }, [resumes, activeResume, saveResumesToStorage]);

  const duplicateResume = useCallback(async (id: string): Promise<ResumeData | null> => {
    const resumeToDuplicate = resumes.find(r => r.id === id);
    if (!resumeToDuplicate) return null;

    const newId = uuidv4();
    const duplicatedResume: ResumeData = {
      ...resumeToDuplicate,
      id: newId,
      versionName: `${resumeToDuplicate.versionName} (Copy)`,
      meta: { ...resumeToDuplicate.meta, lastModified: new Date().toISOString() },
    };
    
    const updatedResumes = [...resumes, duplicatedResume];
    setResumes(updatedResumes);
    setActiveResume(duplicatedResume);
    saveResumesToStorage(updatedResumes);
    return duplicatedResume;
  }, [resumes, saveResumesToStorage]);


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
    throw new Error('useResumeContext must be used within a ResumeProvider');
  }
  return context;
};

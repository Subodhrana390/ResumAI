
"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Bot } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useResumeContext } from '@/contexts/resume-context';
import { generateAiResume } from '@/ai/flows/ai-resume-generation';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import type { ResumeData } from '@/types/resume';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function GenerateResumePage() {
    const { user } = useAuth();
    const router = useRouter();
    const { resumes } = useResumeContext();
    const { toast } = useToast();

    const [jobDescription, setJobDescription] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!user || !db) {
            toast({ title: "Not logged in or DB error", description: "You need to be logged in to generate a resume.", variant: "destructive" });
            return;
        }
        if (!jobDescription.trim()) {
            toast({ title: "Missing Information", description: "Please provide a job description.", variant: "destructive" });
            return;
        }

        setIsLoading(true);

        try {
            const canCreateResume = user.subscription.plan === 'pro' || resumes.length < 5;
            if (!canCreateResume) {
                toast({
                    title: "Upgrade to Pro to Create More Resumes",
                    description: "The Free plan is limited to 5 resumes. Please upgrade to create more.",
                    variant: "destructive"
                });
                setIsLoading(false);
                return;
            }

            const result = await generateAiResume({
                fullName: user.displayName || 'Your Name',
                email: user.email || 'your.email@example.com',
                jobDescription,
                additionalInfo
            });

            const newId = uuidv4();
            const jobTitleFromGen = result.experience[0]?.jobTitle || 'New Role';
            const newResumeData: ResumeData = {
                id: newId,
                versionName: `AI Gen: ${jobTitleFromGen}`,
                template: 'modern',
                contact: {
                    name: result.contact.name,
                    email: result.contact.email,
                    phone: result.contact.phone || '',
                    address: result.contact.address || '',
                    linkedin: result.contact.linkedin || '',
                    github: '',
                    portfolio: '',
                    photoUrl: user.photoURL || '',
                },
                summary: result.summary,
                experience: result.experience.map(exp => ({
                    id: uuidv4(),
                    jobTitle: exp.jobTitle,
                    company: exp.company,
                    location: exp.location,
                    startDate: exp.startDate,
                    endDate: exp.endDate,
                    isCurrent: false,
                    responsibilities: exp.responsibilities.map(text => ({ id: uuidv4(), text })),
                })),
                education: result.education.map(edu => ({
                    id: uuidv4(),
                    institution: edu.institution,
                    degree: edu.degree,
                    fieldOfStudy: edu.fieldOfStudy,
                    startDate: edu.startDate,
                    endDate: edu.endDate,
                    gpa: '',
                })),
                projects: result.projects.map(proj => ({
                    id: uuidv4(),
                    name: proj.name,
                    description: proj.description,
                    technologies: proj.technologies,
                    link: '',
                })),
                skills: result.skills.map(skill => ({ id: uuidv4(), name: skill, category: '' })),
                languages: [],
                customSections: [],
                meta: {
                    lastModified: new Date().toISOString(),
                    jobDescription: jobDescription,
                },
                settings: {
                    fontFamily: 'Inter',
                    fontSize: 'text-sm',
                    accentColor: '#A7D1E8',
                    showAddress: true,
                    showGithub: true,
                    showPortfolio: true,
                    showPhoto: true,
                },
            };
            
            const resumeRef = doc(db, 'users', user.uid, 'resumes', newId);
            await setDoc(resumeRef, newResumeData);

            toast({ title: "AI Resume Generated!", description: "Redirecting you to the editor..." });
            router.push(`/resumes/editor/${newId}`);

        } catch (error) {
            console.error("Resume generation failed:", error);
            toast({ title: "Generation Failed", description: "An error occurred during AI generation.", variant: "destructive" });
            setIsLoading(false);
        }
    };

    return (
        <AppShell>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight flex items-center gap-2"><Bot className="w-8 h-8 text-primary"/>AI Resume Generator</h1>
                    <p className="text-muted-foreground">Instantly create a tailored resume from a job description.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Generate from Job Profile</CardTitle>
                        <CardDescription>Our AI will analyze the job description and create a full resume optimized for it.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="job-description">1. Paste Job Description</Label>
                            <Textarea
                                id="job-description"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                rows={10}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="additional-info">2. Add Optional Notes (Optional)</Label>
                             <Textarea
                                id="additional-info"
                                value={additionalInfo}
                                onChange={(e) => setAdditionalInfo(e.target.value)}
                                placeholder="e.g., Mention my experience with Python and AWS. I am a recent graduate. Highlight my capstone project on data analysis."
                                rows={4}
                                disabled={isLoading}
                            />
                        </div>
                         <Button onClick={handleGenerate} disabled={isLoading || !jobDescription} size="lg">
                            {isLoading ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Generating Your Resume...
                                </>
                            ) : (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4" /> Generate Resume
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}

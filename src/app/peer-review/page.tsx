"use client";
import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bot, Sparkles, ThumbsUp, Lightbulb } from 'lucide-react';
import { useResumeContext } from '@/contexts/resume-context';
import { getAutomatedReview, type AutomatedReviewOutput } from '@/ai/flows/automated-resume-review';
import { useToast } from '@/hooks/use-toast';
import { ResumeData } from '@/types/resume';

const getResumeFullContent = (resume: ResumeData): string => {
    let content = `Name: ${resume.contact.name}\nEmail: ${resume.contact.email}\nPhone: ${resume.contact.phone}\n`;
    if (resume.contact.linkedin) content += `LinkedIn: ${resume.contact.linkedin}\n`;
    content += `\nSummary:\n${resume.summary}\n`;
    if (resume.experience.length > 0) {
        content += `\nExperience:\n`;
        resume.experience.forEach(exp => {
            content += `- ${exp.jobTitle} at ${exp.company}\n`;
            exp.responsibilities.forEach(resp => { content += `  - ${resp.text}\n`; });
        });
    }
    if (resume.projects.length > 0) {
        content += `\nProjects:\n`;
        resume.projects.forEach(proj => {
            content += `- ${proj.name}\n`;
            proj.description.split('\n').forEach(desc => { content += `  - ${desc}\n`; });
        });
    }
    if (resume.education.length > 0) {
        content += `\nEducation:\n`;
        resume.education.forEach(edu => {
            content += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution}\n`;
        });
    }
    if (resume.skills.length > 0) {
        content += `\nSkills:\n${resume.skills.map(s => s.name).join(', ')}\n`;
    }
    return content;
}

const ReviewResultDisplay = ({ report }: { report: AutomatedReviewOutput }) => (
    <Card className="mt-6">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot className="text-primary"/> AI Peer Review</CardTitle>
            <CardDescription>Here is some constructive feedback on your resume.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><ThumbsUp className="text-green-500" /> What You're Doing Well</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {report.review.positivePoints.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3 className="font-semibold flex items-center gap-2 mb-2"><Lightbulb className="text-amber-500" /> Areas for Improvement</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                    {report.review.areasForImprovement.map((point, index) => (
                        <li key={index}>{point}</li>
                    ))}
                </ul>
            </div>
        </CardContent>
    </Card>
);

export default function PeerReviewPage() {
    const { resumes, isLoading: resumesLoading } = useResumeContext();
    const [selectedResumeId, setSelectedResumeId] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [reviewResult, setReviewResult] = useState<AutomatedReviewOutput | null>(null);
    const { toast } = useToast();

    const handleGetReview = async () => {
        const resume = resumes.find(r => r.id === selectedResumeId);
        if (!resume) {
            toast({ title: "No Resume Selected", description: "Please select a resume to review.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        setReviewResult(null);

        try {
            const resumeContent = getResumeFullContent(resume);
            const result = await getAutomatedReview({ resumeContent });
            setReviewResult(result);
            toast({ title: "Review Complete!", description: "Your automated peer review is ready." });
        } catch (error) {
            console.error("Automated review failed:", error);
            toast({ title: "Review Failed", description: "An error occurred while generating the review.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppShell>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">Peer Review Network</h1>
                    <p className="text-muted-foreground">Get instant, automated feedback on your resume from our AI peer reviewer.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Get an Automated Review</CardTitle>
                        <CardDescription>Select one of your resumes to get instant, AI-powered feedback.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="resume-select">Select a Resume</Label>
                            <Select onValueChange={setSelectedResumeId} value={selectedResumeId} disabled={resumesLoading || isLoading}>
                                <SelectTrigger id="resume-select" className="w-full sm:w-[300px]">
                                    <SelectValue placeholder={resumesLoading ? "Loading resumes..." : "Select a resume"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {resumes.map(resume => (
                                        <SelectItem key={resume.id} value={resume.id}>{resume.versionName}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button onClick={handleGetReview} disabled={isLoading || !selectedResumeId}>
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isLoading ? 'Analyzing...' : 'Get AI Feedback'}
                        </Button>
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-muted">
                        <Sparkles className="w-12 h-12 text-primary animate-spin mb-4" /> 
                        <p className="text-lg font-semibold text-muted-foreground">Our AI is reviewing your resume...</p>
                        <p className="text-sm text-muted-foreground">This may take a moment.</p>
                    </div>
                )}
                
                {reviewResult && !isLoading && <ReviewResultDisplay report={reviewResult} />}

            </div>
        </AppShell>
    );
}

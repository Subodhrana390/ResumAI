"use client";
import { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useResumeContext } from '@/contexts/resume-context';
import { generateCoverLetter } from '@/ai/flows/cover-letter-generation';
import { useToast } from '@/hooks/use-toast';
import { jsPDF } from 'jspdf';
import { Skeleton } from '@/components/ui/skeleton';
import { ResumeData } from '@/types/resume';

const getResumeFullContent = (resume: ResumeData): string => {
    let content = `Name: ${resume.contact.name}\nEmail: ${resume.contact.email}\nPhone: ${resume.contact.phone}\n`;
    if (resume.contact.linkedin) content += `LinkedIn: ${resume.contact.linkedin}\n`;
    content += `\nSummary:\n${resume.summary}\n`;
    if (resume.experience.length > 0) {
        content += `\nExperience:\n`;
        resume.experience.forEach(exp => {
            content += `- ${exp.jobTitle} at ${exp.company}\n`;
            exp.responsibilities.forEach(resp => { content += `  - ${resp}\n`; });
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

export default function CoverLetterPage() {
    const { user } = useAuth();
    const { resumes, isLoading: isResumesLoading } = useResumeContext();
    const { toast } = useToast();

    const [resumeContent, setResumeContent] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (resumes.length > 0) {
            const latestResume = [...resumes].sort((a, b) => new Date(b.meta.lastModified).getTime() - new Date(a.meta.lastModified).getTime())[0];
            setResumeContent(getResumeFullContent(latestResume));
        }
    }, [resumes]);

    const handleGenerate = async () => {
        if (!resumeContent.trim() || !jobDescription.trim()) {
            toast({ title: "Missing Information", description: "Please ensure both resume content and a job description are provided.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setGeneratedCoverLetter('');

        try {
            const result = await generateCoverLetter({
                resumeContent,
                jobDescription,
                userName: user?.displayName || 'The Candidate',
            });
            setGeneratedCoverLetter(result.coverLetter);
            toast({ title: "Success!", description: "Your cover letter has been generated." });
        } catch (error) {
            console.error("Cover letter generation failed:", error);
            toast({ title: "Generation Failed", description: "An error occurred while generating the cover letter.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = () => {
        navigator.clipboard.writeText(generatedCoverLetter);
        toast({ title: "Copied!", description: "Cover letter copied to clipboard." });
    };

    const handleDownloadAsPDF = () => {
        const pdf = new jsPDF();
        pdf.setFont("helvetica");
        pdf.setFontSize(12);
        const margin = 20;
        const pageHeight = pdf.internal.pageSize.getHeight();
        const textLines = pdf.splitTextToSize(generatedCoverLetter, pdf.internal.pageSize.getWidth() - margin * 2);
        let y = margin;
        textLines.forEach((line: string) => {
            if (y > pageHeight - margin) {
                pdf.addPage();
                y = margin;
            }
            pdf.text(line, margin, y);
            y += 7; // Line height
        });
        pdf.save("ResumAI_Cover_Letter.pdf");
    };

    return (
        <AppShell>
            <ProFeatureGuard
                featureName="Cover Letter Generator"
                featureDescription="Generate personalized and professional cover letters in seconds with AI."
            >
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">AI Cover Letter Generator</h1>
                        <p className="text-muted-foreground">Paste your resume and a job description to generate a tailored cover letter.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Generate Your Cover Letter</CardTitle>
                            <CardDescription>Our AI will use your latest resume and the job description to craft a compelling letter.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="resume-content">Your Resume Content</Label>
                                {isResumesLoading ? (
                                    <Skeleton className="h-32 w-full" />
                                ) : (
                                    <Textarea
                                        id="resume-content"
                                        value={resumeContent}
                                        onChange={(e) => setResumeContent(e.target.value)}
                                        placeholder="Paste your resume content here, or it will be auto-filled from your latest resume."
                                        rows={8}
                                        disabled={isLoading}
                                    />
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job-description">Job Description</Label>
                                <Textarea
                                    id="job-description"
                                    value={jobDescription}
                                    onChange={(e) => setJobDescription(e.target.value)}
                                    placeholder="Paste the job description here..."
                                    rows={8}
                                    disabled={isLoading}
                                />
                            </div>
                            <Button size="lg" onClick={handleGenerate} disabled={isLoading || !resumeContent.trim() || !jobDescription.trim()}>
                                <Sparkles className="mr-2 h-4 w-4" />
                                {isLoading ? 'Generating...' : 'Generate Cover Letter'}
                            </Button>
                        </CardContent>
                    </Card>

                    {(isLoading || generatedCoverLetter) && (
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Generated Cover Letter</CardTitle>
                                    <CardDescription>Review, edit, and use your new cover letter.</CardDescription>
                                </div>
                                {!isLoading && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={handleCopyToClipboard}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                                        <Button variant="outline" size="sm" onClick={handleDownloadAsPDF}><Download className="mr-2 h-4 w-4"/>PDF</Button>
                                        <Button variant="outline" size="sm" onClick={handleGenerate}><RefreshCw className="mr-2 h-4 w-4"/>Regenerate</Button>
                                    </div>
                                )}
                            </CardHeader>
                            <CardContent>
                                {isLoading ? (
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-3/4" />
                                        <Skeleton className="h-4 w-full mt-4" />
                                        <Skeleton className="h-4 w-5/6" />
                                    </div>
                                ) : (
                                    <div className="p-4 bg-muted/50 rounded-md border text-sm whitespace-pre-line">
                                        {generatedCoverLetter}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ProFeatureGuard>
        </AppShell>
    );
}

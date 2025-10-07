
"use client";

import React, { useState } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from "@/components/ui/progress";
import { Sparkles, Upload, FileText, AlertCircle, ScanSearch } from 'lucide-react';
import { getResumeImprovementSuggestions, type ResumeImprovementSuggestionsOutput } from '@/ai/flows/resume-improvement-suggestions';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import * as pdfjsLib from 'pdfjs-dist';

// Set up worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;
}


const AtsResultDisplay = ({ report, prevScore }: { report: ResumeImprovementSuggestionsOutput, prevScore: number | null }) => (
    <div className="mt-6 space-y-6">
        <Card>
            <CardHeader>
                <CardTitle>ATS Analysis Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                    <div className="text-center">
                        <p className="text-sm text-muted-foreground">Compatibility Score</p>
                        <p className="text-6xl font-bold text-primary">{report.atsScore}%</p>
                        <Progress value={report.atsScore} className="mt-2" />
                    </div>
                    {prevScore !== null && (
                        <div className="text-center p-4 border-l">
                            <p className="text-sm text-muted-foreground">Previous Score</p>
                            <p className="text-4xl font-bold text-muted-foreground line-through">{prevScore}%</p>
                            <p className={cn("mt-2 text-lg font-semibold", report.atsScore > prevScore ? 'text-green-500' : 'text-destructive')}>
                                Change: {report.atsScore - prevScore > 0 ? '+' : ''}{report.atsScore - prevScore}%
                            </p>
                        </div>
                    )}
                </div>
                <div className="pt-4">
                    <h4 className="font-semibold mb-2">Overall Feedback:</h4>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{report.overallFeedback}</p>
                </div>
            </CardContent>
        </Card>

        <div>
            <h3 className="text-xl font-bold mb-3">Improvement Suggestions</h3>
            <div className="space-y-3">
                {report.suggestions.map((item, index) => (
                    <Card key={index} className="bg-background">
                        <CardHeader>
                            <CardTitle className="text-lg flex justify-between items-center">
                                <span>{item.category}</span>
                            </CardTitle>
                            <CardDescription>{item.problem}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="font-semibold text-sm">Suggestion:</p>
                            <p className="text-muted-foreground text-sm">{item.suggestion}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    </div>
);


export default function AtsCheckerPage() {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [atsReport, setAtsReport] = useState<ResumeImprovementSuggestionsOutput | null>(null);
    const [prevAtsScore, setPrevAtsScore] = useState<number | null>(null);
    const { toast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setResumeFile(file);
        } else {
            setResumeFile(null);
            toast({ title: "Invalid File", description: "Please upload a PDF file.", variant: "destructive" });
        }
    };
    
    const extractTextFromPdf = async (file: File): Promise<string> => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => 'str' in item ? item.str : '').join('\n');
            fullText += pageText + '\n\n';
        }
        return fullText;
    };

    const handleAnalyze = async () => {
        if (!resumeFile || !jobDescription) {
            toast({ title: "Missing Information", description: "Please upload a resume and provide a job description.", variant: "destructive" });
            return;
        }

        setIsLoading(true);
        if (atsReport) {
          setPrevAtsScore(atsReport.atsScore);
        }
        setAtsReport(null);

        try {
            const resumeContent = await extractTextFromPdf(resumeFile);

            if (!resumeContent.trim()) {
                toast({ title: "Extraction Failed", description: "Could not extract text from the PDF. It might be an image-based PDF.", variant: "destructive" });
                setIsLoading(false);
                return;
            }

            const result = await getResumeImprovementSuggestions({
                resumeContent: resumeContent,
                jobDescription: jobDescription
            });

            setAtsReport(result);
            toast({ title: "Analysis Complete!", description: `Your resume has an ATS score of ${result.atsScore}%.` });

        } catch (error) {
            console.error("ATS analysis failed:", error);
            toast({ title: "Analysis Failed", description: "An error occurred during the analysis.", variant: "destructive" });
            setAtsReport(null);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <AppShell>
            <div className="space-y-6 max-w-4xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold font-headline tracking-tight">ATS Checker</h1>
                    <p className="text-muted-foreground">Upload your resume and paste a job description to see how well you match.</p>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Analyze Your Resume</CardTitle>
                        <CardDescription>Get instant feedback on your resume's compatibility with Applicant Tracking Systems.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="resume-upload">1. Upload Resume (PDF)</Label>
                            <div className="flex items-center gap-4">
                               <Input id="resume-upload" type="file" accept=".pdf" onChange={handleFileChange} className="max-w-sm"/>
                               {resumeFile && (
                                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <FileText className="h-5 w-5 text-primary"/>
                                    <span>{resumeFile.name}</span>
                                 </div>
                               )}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="job-description">2. Paste Job Description</Label>
                            <Textarea
                                id="job-description"
                                value={jobDescription}
                                onChange={(e) => setJobDescription(e.target.value)}
                                placeholder="Paste the full job description here..."
                                rows={8}
                            />
                        </div>
                         <Button onClick={handleAnalyze} disabled={isLoading || !resumeFile || !jobDescription} size="lg">
                            {isLoading ? (
                                <>
                                    <Sparkles className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                                </>
                            ) : (
                                <>
                                    <ScanSearch className="mr-2 h-4 w-4" /> Analyze Resume
                                </>
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {isLoading && (
                    <div className="flex flex-col items-center justify-center p-12 text-center rounded-lg bg-muted">
                        <Sparkles className="w-12 h-12 text-primary animate-spin mb-4" /> 
                        <p className="text-lg font-semibold text-muted-foreground">Analyzing your resume against the job description...</p>
                        <p className="text-sm text-muted-foreground">This may take a moment.</p>
                    </div>
                )}
                
                {atsReport && !isLoading && <AtsResultDisplay report={atsReport} prevScore={prevAtsScore} />}
            </div>
        </AppShell>
    );
}

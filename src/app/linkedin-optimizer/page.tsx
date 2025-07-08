"use client";
import React, { useState, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Linkedin, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { optimizeLinkedInProfile, type OptimizeLinkedInProfileOutput } from '@/ai/flows/linkedin-optimization';
import { useToast } from '@/hooks/use-toast';
import { useResumeContext } from '@/contexts/resume-context';
import { Skeleton } from '@/components/ui/skeleton';

export default function LinkedinOptimizerPage() {
    const { resumes } = useResumeContext();
    const { toast } = useToast();

    const [currentSummary, setCurrentSummary] = useState('');
    const [targetRoles, setTargetRoles] = useState('');
    const [skills, setSkills] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [optimizedResult, setOptimizedResult] = useState<OptimizeLinkedInProfileOutput | null>(null);

    useEffect(() => {
        if (resumes.length > 0) {
            const latestResume = [...resumes].sort((a, b) => new Date(b.meta.lastModified).getTime() - new Date(a.meta.lastModified).getTime())[0];
            setCurrentSummary(latestResume.summary);
            setSkills(latestResume.skills.map(s => s.name));
            setTargetRoles(latestResume.experience[0]?.jobTitle || '');
        }
    }, [resumes]);

    const handleOptimize = async () => {
        if (!currentSummary.trim() || !targetRoles.trim()) {
            toast({ title: "Missing Information", description: "Please provide your current summary and target roles.", variant: "destructive" });
            return;
        }
        setIsLoading(true);
        setOptimizedResult(null);

        try {
            const result = await optimizeLinkedInProfile({
                currentSummary,
                targetRoles,
                skills,
            });
            setOptimizedResult(result);
            toast({ title: "Success!", description: "Your LinkedIn profile suggestions are ready." });
        } catch (error) {
            console.error("LinkedIn optimization failed:", error);
            toast({ title: "Optimization Failed", description: "An error occurred while optimizing your profile.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast({ title: "Copied!", description: "Content copied to clipboard." });
    };

    return (
        <AppShell>
            <ProFeatureGuard
                featureName="LinkedIn Profile Optimizer"
                featureDescription="Get AI-powered suggestions to improve your LinkedIn profile and attract recruiters."
            >
                <div className="space-y-6 max-w-4xl mx-auto">
                    <div>
                        <h1 className="text-3xl font-bold font-headline tracking-tight">LinkedIn Profile Optimizer</h1>
                        <p className="text-muted-foreground">Get AI suggestions to create an All-Star LinkedIn profile.</p>
                    </div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Optimize Your Profile</CardTitle>
                            <CardDescription>Auto-filled from your latest resume, you can edit the content below.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin-summary">Your Current LinkedIn Summary/About Section</Label>
                                <Textarea
                                    id="linkedin-summary"
                                    value={currentSummary}
                                    onChange={(e) => setCurrentSummary(e.target.value)}
                                    placeholder="Paste your current summary here..."
                                    rows={8}
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="target-roles">Target Job Titles</Label>
                                <Textarea
                                    id="target-roles"
                                    value={targetRoles}
                                    onChange={(e) => setTargetRoles(e.target.value)}
                                    placeholder="e.g., Software Engineer, Product Manager"
                                    rows={2}
                                    disabled={isLoading}
                                />
                            </div>
                            <Button size="lg" onClick={handleOptimize} disabled={isLoading || !currentSummary.trim() || !targetRoles.trim()}>
                                <Linkedin className="mr-2 h-4 w-4" />
                                {isLoading ? 'Optimizing...' : 'Optimize My Profile'}
                            </Button>
                        </CardContent>
                    </Card>

                    {(isLoading || optimizedResult) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>AI-Powered Suggestions</CardTitle>
                                <CardDescription>Use these suggestions to update your LinkedIn profile.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {isLoading ? (
                                    <div className="space-y-6">
                                        <div>
                                            <Skeleton className="h-5 w-32 mb-2" />
                                            <Skeleton className="h-8 w-full" />
                                        </div>
                                        <div>
                                            <Skeleton className="h-5 w-32 mb-2" />
                                            <Skeleton className="h-24 w-full" />
                                        </div>
                                    </div>
                                ) : optimizedResult && (
                                    <>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-semibold">Optimized Headline</h3>
                                                <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(optimizedResult.optimizedHeadline)}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-md border text-sm font-medium">
                                                {optimizedResult.optimizedHeadline}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex justify-between items-center mb-1">
                                                <h3 className="font-semibold">Optimized 'About' Summary</h3>
                                                <Button variant="ghost" size="sm" onClick={() => handleCopyToClipboard(optimizedResult.optimizedSummary)}><Copy className="mr-2 h-4 w-4"/>Copy</Button>
                                            </div>
                                            <div className="p-3 bg-muted/50 rounded-md border text-sm whitespace-pre-line">
                                                {optimizedResult.optimizedSummary}
                                            </div>
                                        </div>
                                        <Button variant="outline" onClick={handleOptimize} disabled={isLoading}>
                                            <RefreshCw className="mr-2 h-4 w-4" /> Regenerate
                                        </Button>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </ProFeatureGuard>
        </AppShell>
    );
}

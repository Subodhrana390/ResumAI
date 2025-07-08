"use client";
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Sparkles } from 'lucide-react';

export default function CoverLetterPage() {
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
                    <CardDescription>This feature is coming soon! Here's a preview of how it will work.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="resume-content">Your Resume Content</Label>
                        <Textarea id="resume-content" placeholder="Paste your resume content here..." rows={8} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="job-description">Job Description</Label>
                        <Textarea id="job-description" placeholder="Paste the job description here..." rows={8} disabled />
                    </div>
                    <Button size="lg" disabled>
                        <Sparkles className="mr-2 h-4 w-4" /> Generate Cover Letter
                    </Button>
                </CardContent>
            </Card>
        </div>
      </ProFeatureGuard>
    </AppShell>
  );
}

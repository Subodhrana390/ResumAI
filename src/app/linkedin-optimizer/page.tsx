"use client";
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Linkedin } from 'lucide-react';

export default function LinkedinOptimizerPage() {
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
                    <CardDescription>This feature is coming soon! Here's a preview of how it will work.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="linkedin-summary">Your Current LinkedIn Summary/About Section</Label>
                        <Textarea id="linkedin-summary" placeholder="Paste your current summary here..." rows={8} disabled />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="target-roles">Target Job Titles</Label>
                        <Textarea id="target-roles" placeholder="e.g., Software Engineer, Product Manager" rows={2} disabled />
                    </div>
                    <Button size="lg" disabled>
                        <Linkedin className="mr-2 h-4 w-4" /> Optimize My Profile
                    </Button>
                </CardContent>
            </Card>
        </div>
      </ProFeatureGuard>
    </AppShell>
  );
}

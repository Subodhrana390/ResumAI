"use client";
import { AppShell } from '@/components/layout/app-shell';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Users, Upload } from 'lucide-react';

export default function PeerReviewPage() {
  return (
    <AppShell>
      <div className="space-y-6 max-w-4xl mx-auto">
          <div>
              <h1 className="text-3xl font-bold font-headline tracking-tight">Peer Review Network</h1>
              <p className="text-muted-foreground">Get valuable feedback on your resume from peers and experts.</p>
          </div>
          <Card>
              <CardHeader>
                  <CardTitle>Submit for Review</CardTitle>
                  <CardDescription>This feature is coming soon! Here's a preview of how it will work.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className="space-y-2">
                      <Label htmlFor="resume-upload">Upload Your Resume for Review (PDF)</Label>
                      <div className="flex items-center gap-4">
                          <Button variant="outline" disabled><Upload className="mr-2 h-4 w-4" /> Choose File</Button>
                          <p className="text-sm text-muted-foreground">No file chosen</p>
                      </div>
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="review-notes">Specific Questions for Reviewers</Label>
                      <Textarea id="review-notes" placeholder="e.g., 'Does my project section sound professional?', 'Is my summary impactful enough for a software engineering role?'" rows={4} disabled />
                  </div>
                  <Button size="lg" disabled>
                      <Users className="mr-2 h-4 w-4" /> Submit for Peer Review
                  </Button>
              </CardContent>
          </Card>
      </div>
    </AppShell>
  );
}

"use client";
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function CareerCounselorPage() {
  return (
    <AppShell>
      <ProFeatureGuard
        featureName="Career Counselor Chat"
        featureDescription="Get instant career advice from our AI-powered counselor."
      >
        <div className="flex flex-col h-full max-w-4xl mx-auto">
          <div className="mb-4">
            <h1 className="text-3xl font-bold font-headline tracking-tight">AI Career Counselor</h1>
            <p className="text-muted-foreground">Ask anything about your career, job search, or resume.</p>
          </div>
          <Card className="flex-grow flex flex-col">
            <CardHeader>
              <CardTitle>Chat with ResumAI Bot</CardTitle>
              <CardDescription>This feature is coming soon!</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col gap-4">
              <ScrollArea className="flex-grow h-64 border rounded-lg p-4 bg-muted/50">
                {/* Chat messages would go here */}
                <div className="flex items-start gap-3">
                  <Avatar className="h-9 w-9 border">
                      <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                  <div className="bg-background rounded-lg p-3 max-w-[75%]">
                    <p className="text-sm">Hello! I'm the ResumAI Career Counselor. How can I help you with your career goals today?</p>
                  </div>
                </div>
              </ScrollArea>
              <div className="flex items-center gap-2">
                <Input placeholder="Type your message..." disabled />
                <Button disabled><Send className="h-4 w-4" /></Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </ProFeatureGuard>
    </AppShell>
  );
}

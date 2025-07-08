"use client";
import React, { useState, useRef, useEffect } from 'react';
import { AppShell } from '@/components/layout/app-shell';
import { ProFeatureGuard } from '@/components/layout/pro-feature-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/auth-context';
import { chatWithCounselor, type ChatMessage } from '@/ai/flows/career-counselor-chat';
import { useToast } from '@/hooks/use-toast';
import ReactMarkdown from 'react-markdown';

export default function CareerCounselorPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [messages, setMessages] = useState<ChatMessage[]>([
        {
            role: 'model',
            content: "Hello! I'm the ResumAI Career Counselor. How can I help you with your career goals today?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaViewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollAreaViewportRef.current) {
            scrollAreaViewportRef.current.scrollTo({ top: scrollAreaViewportRef.current.scrollHeight, behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMessage: ChatMessage = { role: 'user', content: inputValue };
        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsLoading(true);

        try {
            const history = messages;
            const result = await chatWithCounselor({ history, newMessage: userMessage.content });
            const modelMessage: ChatMessage = { role: 'model', content: result.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error("Chat error:", error);
            toast({ title: "An error occurred", description: "Could not get a response from the AI counselor.", variant: "destructive" });
            setMessages(prev => [...prev, { role: 'model', content: "I'm sorry, I seem to be having some trouble. Please try again later." }]);
        } finally {
            setIsLoading(false);
        }
    };

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
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col gap-4">
                            <ScrollArea className="flex-grow h-96 border rounded-lg p-4 bg-muted/50" viewportRef={scrollAreaViewportRef}>
                                <div className="space-y-6">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`flex items-start gap-3 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                            {message.role === 'model' && (
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarFallback>AI</AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`rounded-lg p-3 max-w-[80%] text-sm ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>
                                                <ReactMarkdown className="prose prose-sm dark:prose-invert" components={{ p: ({node, ...props}) => <p className="my-0" {...props} /> }}>
                                                    {message.content}
                                                </ReactMarkdown>
                                            </div>
                                            {message.role === 'user' && (
                                                <Avatar className="h-9 w-9 border">
                                                    <AvatarFallback>{user?.displayName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && (
                                        <div className="flex items-start gap-3">
                                            <Avatar className="h-9 w-9 border">
                                                <AvatarFallback>AI</AvatarFallback>
                                            </Avatar>
                                            <div className="bg-background rounded-lg p-3 max-w-[75%] flex items-center space-x-2">
                                                <Sparkles className="h-4 w-4 animate-spin" />
                                                <p className="text-sm text-muted-foreground">Thinking...</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <div className="flex items-center gap-2">
                                <Input
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type your message..."
                                    disabled={isLoading}
                                />
                                <Button onClick={handleSendMessage} disabled={isLoading || !inputValue.trim()}>
                                    {isLoading ? <Sparkles className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </ProFeatureGuard>
        </AppShell>
    );
}

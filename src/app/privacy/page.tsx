
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function PrivacyPolicyPage() {
    const [currentDate, setCurrentDate] = useState('');

    useEffect(() => {
        setCurrentDate(new Date().toLocaleDateString());
    }, []);

    return (
        <div className="bg-background min-h-screen">
            <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-headline">Privacy Policy</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-muted-foreground">
                        <p>Last updated: {currentDate}</p>

                        <div>
                            <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">1. Information We Collect</h2>
                            <p>
                            We collect information you provide directly to us. For example, we collect information when you create an account, create a resume, or otherwise communicate with us. The types of information we may collect include your name, email address, resume data, and any other information you choose to provide.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">2. How We Use Your Information</h2>
                            <p>
                            We use the information we collect to provide, maintain, and improve our services, including to personalize your experience. We may also use the information we collect to communicate with you about products, services, offers, and events offered by ResumAI.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">3. Information Sharing</h2>
                            <p>
                            We do not share your personal information with third parties except as described in this Privacy Policy. We may share information with vendors, consultants, and other service providers who need access to such information to carry out work on our behalf.
                            </p>
                        </div>
                        
                        <div>
                            <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">4. Data Security</h2>
                            <p>
                                We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration, and destruction.
                            </p>
                        </div>

                        <div>
                            <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">5. Disclaimer</h2>
                            <p>
                            This is a boilerplate Privacy Policy page. The content provided here is for placeholder purposes only and is not legally binding. It is essential to consult with a legal professional to draft a comprehensive and compliant privacy policy for your application.
                            </p>
                        </div>

                        <p className="pt-4">
                        <Link href="/" className="text-primary hover:underline">
                            Go back to Home
                        </Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

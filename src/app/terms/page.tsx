
"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TermsOfServicePage() {
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString());
  }, []);

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground">
            <p>Last updated: {currentDate}</p>

            <div>
                <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">1. Introduction</h2>
                <p>
                Welcome to ResumAI ("we," "our," or "us"). These Terms of Service govern your use of our web application and any related services provided by us. By accessing or using our service, you agree to be bound by these terms.
                </p>
            </div>

            <div>
                <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">2. Use of Our Service</h2>
                <p>
                You must be at least 18 years old to use our service. You are responsible for any activity that occurs through your account and you agree you will not sell, transfer, license or assign your account, username, or any account rights.
                </p>
            </div>
            
            <div>
                <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">3. User Content</h2>
                <p>
                    We do not claim ownership of any content that you provide on or through the service, such as your resume data ("User Content"). You are solely responsible for your User Content. You represent and warrant that you have all the rights, power, and authority necessary to grant the rights granted herein to any User Content that you submit.
                </p>
            </div>

            <div>
                <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">4. Prohibited Activities</h2>
                <p>
                You agree not to engage in any of the following prohibited activities: (i) copying, distributing, or disclosing any part of the service in any medium; (ii) using any automated system, including without limitation "robots," "spiders," "offline readers," etc., to access the service; (iii) transmitting spam, chain letters, or other unsolicited email.
                </p>
            </div>

            <div>
                <h2 className="text-foreground font-semibold text-lg mt-4 mb-2">5. Disclaimer</h2>
                <p>
                This is a boilerplate Terms of Service page. The content provided here is for placeholder purposes only and does not constitute legal advice. You should consult with a legal professional to create a terms of service agreement that is appropriate for your specific business and jurisdiction.
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

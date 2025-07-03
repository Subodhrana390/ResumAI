
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, FileText, Palette, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <BotMessageSquare className="h-8 w-8 text-primary" />
          <span className="ml-2 text-2xl font-bold font-headline">ResumAI</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="/resumes"
            className="text-sm font-medium hover:underline underline-offset-4"
            prefetch={false}
          >
            Login
          </Link>
           <Link href="/resumes" passHref>
             <Button>Get Started</Button>
           </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-br from-primary/30 via-background to-accent/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Craft Your Future with <span className="text-primary">ResumAI</span>
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Build professional, ATS-friendly resumes in minutes. Leverage AI to highlight your skills and land your dream job.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/resumes" passHref>
                    <Button size="lg">Create Your Resume</Button>
                  </Link>
                  <Link
                    href="#features"
                     passHref
                  >
                    <Button variant="outline" size="lg">Learn More</Button>
                  </Link>
                </div>
              </div>
              <Image
                src="/images/resume-builder-interface.png"
                width="600"
                height="400"
                alt="ResumAI Interface"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square shadow-xl"
              />
            </div>
          </div>
        </section>
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-secondary px-3 py-1 text-sm text-secondary-foreground">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Everything You Need to Succeed</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  ResumAI offers powerful tools to create standout resumes that catch employers' attention and pass through Applicant Tracking Systems.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 md:gap-12 lg:grid-cols-3 lg:gap-16 mt-12">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/20 inline-block mb-3">
                    <BotMessageSquare className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">AI-Powered Content</CardTitle>
                  <CardDescription>Generate compelling summaries and bullet points with our advanced AI.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 rounded-full bg-accent/20 inline-block mb-3">
                    <Palette className="h-8 w-8 text-accent" />
                  </div>
                  <CardTitle className="font-headline">Smart Templates</CardTitle>
                  <CardDescription>Choose from professionally designed, ATS-optimized templates.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="p-3 rounded-full bg-primary/20 inline-block mb-3">
                     <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="font-headline">ATS Checker</CardTitle>
                  <CardDescription>Analyze your resume for ATS compatibility and get improvement tips.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>
        <section id="pricing" className="w-full py-12 md:py-24 lg:py-32 border-t">
          <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight font-headline">
                Simple, Transparent Pricing
              </h2>
              <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Get started for free, or unlock powerful features with our Pro plan.
              </p>
            </div>
            <div className="mx-auto w-full max-w-sm space-y-2">
              <Card>
                <CardHeader>
                  <CardTitle className="font-headline">Free Tier</CardTitle>
                  <CardDescription>Basic resume building tools to get you started.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <ul className="list-disc list-inside text-left text-sm text-muted-foreground">
                    <li>1 Resume</li>
                    <li>Limited Templates</li>
                    <li>Basic AI Suggestions</li>
                  </ul>
                  <Link href="/resumes" passHref>
                    <Button className="w-full mt-4">Sign Up for Free</Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 ResumAI. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4" prefetch={false}>
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}

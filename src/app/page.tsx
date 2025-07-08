import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { BotMessageSquare, GraduationCap, Briefcase, Users, Award, BookOpen, Target, FileText, Linkedin, MessageCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function StudentLandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-white/80 backdrop-blur-sm">
        <Link href="#" className="flex items-center justify-center" prefetch={false}>
          <GraduationCap className="h-8 w-8 text-blue-600" />
          <span className="ml-2 text-2xl font-bold font-headline text-gray-800">Resume<span className="text-blue-600">AI</span></span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 sm:gap-6">
          <Link
            href="#features"
            className="text-sm font-medium hover:text-blue-600 transition-colors hidden sm:inline-block"
            prefetch={false}
          >
            Features
          </Link>
          <Link
            href="#pricing"
            className="text-sm font-medium hover:text-blue-600 transition-colors hidden sm:inline-block"
            prefetch={false}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium hover:text-blue-600 transition-colors"
            prefetch={false}
          >
            Login
          </Link>
          <Link href="/resumes" passHref>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">Get Started Free</Button>
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-24 lg:py-32 xl:py-40 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 opacity-60"></div>
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-8 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-6">
                <div className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm text-blue-700 font-medium w-fit">
                  🎓 Built for Students, By Students
                </div>
                <div className="space-y-4">
                  <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl/none font-headline text-gray-900">
                    Land Your First Job with a
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Professional Resume</span>
                  </h1>
                  <p className="max-w-[600px] text-gray-600 md:text-xl leading-relaxed">
                    No experience? No problem! Transform your academic projects, internships, and skills into a compelling resume that gets you noticed by employers.
                  </p>
                </div>
                <div className="flex flex-col gap-3 min-[400px]:flex-row">
                  <Link href="/resumes" passHref>
                    <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                      Build My Resume - Free
                    </Button>
                  </Link>
                  <Link href="#features" passHref>
                    <Button variant="outline" size="lg" className="border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors">
                      See How It Works
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>100% Free Forever</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>No Credit Card Required</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-20"></div>
                <Image
                  src="/images/Main_bg.png"
                  width="600"
                  height="400"
                  alt="Student Resume Interface"
                  data-ai-hint="student using resume builder interface"
                  className="relative mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last shadow-2xl border border-white/20"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6 text-center">
            <div className="space-y-6 mb-12">
              <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Trusted by <span className="text-indigo-600">Thousands</span> of Students
              </h2>
              <p className="text-lg text-gray-600 max-w-xl mx-auto">
                Our platform is loved by learners across the globe. Here’s why they choose us!
              </p>
            </div>
            </div>
        </section>

        <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-4 py-2 text-sm text-blue-700 font-medium">Student-Focused Features</div>
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline text-gray-900">Turn Your Potential Into Opportunities</h2>
                <p className="max-w-[900px] text-gray-600 md:text-xl/relaxed">
                  Our AI understands student backgrounds and helps you present your academic achievements, projects, and skills in the best possible light.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-8 sm:grid-cols-2 lg:grid-cols-2 lg:gap-12">
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 inline-block mb-4 w-fit">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-gray-900">Academic Project Optimizer</CardTitle>
                  <CardDescription className="text-gray-600">Transform your coursework and projects into impressive professional experience.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-green-500 to-green-600 inline-block mb-4 w-fit">
                    <BotMessageSquare className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-gray-900">AI Skills Translator</CardTitle>
                  <CardDescription className="text-gray-600">Convert your academic skills into industry-relevant language that employers understand.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 inline-block mb-4 w-fit">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-gray-900">Internship Maximizer</CardTitle>
                  <CardDescription className="text-gray-600">Highlight your internships and part-time work to show real-world impact.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-red-500 to-red-600 inline-block mb-4 w-fit">
                    <Award className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-gray-900">Achievement Amplifier</CardTitle>
                  <CardDescription className="text-gray-600">Showcase your awards, leadership roles, and extracurricular activities effectively.</CardDescription>
                </CardHeader>
              </Card>
              <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-md bg-white">
                <CardHeader className="pb-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 inline-block mb-4 w-fit">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="font-headline text-gray-900">Peer Review Network</CardTitle>
                  <CardDescription className="text-gray-600">Get feedback from other students and career counselors to perfect your resume.</CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section className="w-full py-16 md:py-24 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container px-4 md:px-6">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
                Join Thousands of Students Who Landed Their Dream Jobs
              </h2>
              <p className="max-w-2xl mx-auto text-xl text-blue-100">
                "I went from having no idea how to write a resume to landing 3 internship offers in just 2 weeks!" - Sarah, Computer Science Student
              </p>
              <Link href="/resumes" passHref>
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all transform hover:scale-105">
                  Start Building Your Future - Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section id="pricing" className="w-full py-16 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6">
            <div className="space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight md:text-4xl font-headline text-gray-900">
                Student-Friendly Pricing
              </h2>
              <p className="mx-auto max-w-[600px] text-gray-600 md:text-xl/relaxed">
                We believe every student deserves a great resume. That's why we offer a generous free plan and a powerful pro plan.
              </p>
            </div>
            <div className="mx-auto mt-12 grid max-w-4xl gap-8 md:grid-cols-2">
              <Card className="flex flex-col border-2 border-green-200 bg-green-50 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-green-500 text-white px-4 py-1 text-sm font-semibold">
                  STUDENT SPECIAL
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="font-headline text-green-800 text-2xl">Free Forever</CardTitle>
                  <CardDescription className="text-green-700">Everything you need to land your first job.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-4xl font-bold text-green-800">₹0<span className="text-sm font-normal text-green-600">/forever</span></p>
                  <ul className="space-y-3 text-green-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>5 Professional Resumes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Student-Focused Templates</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI-Powered Content Suggestions</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Project & Internship Optimizer</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>ATS Compatibility Checker</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/resumes" passHref className="w-full">
                    <Button className="w-full bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl transition-all">
                      Get Started Free
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
              <Card className="flex flex-col border-2 border-blue-500 relative overflow-hidden ring-2 ring-blue-500 shadow-2xl">
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-semibold">
                  CAREER BOOSTER
                </div>
                <CardHeader className="pt-8">
                  <CardTitle className="font-headline text-blue-800 text-2xl">Pro Student</CardTitle>
                  <CardDescription className="text-blue-700">Advanced features for serious job seekers.</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <p className="text-4xl font-bold text-blue-800">₹99<span className="text-sm font-normal text-blue-600">/month</span></p>
                  <ul className="space-y-3 text-blue-700">
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="font-semibold">Everything in Free, plus:</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Unlimited Resumes</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span>AI Cover Letter Generator</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Linkedin className="h-4 w-4 text-blue-600" />
                      <span>LinkedIn Profile Optimizer</span>
                    </li>
                     <li className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span>AI Career Counselor Chat</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Premium Templates & Designs</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Link href="/settings" passHref className="w-full">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-gray-50">
        <p className="text-xs text-gray-500">&copy; 2024 StudentResumeAI. Built by students, for students.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="/terms" className="text-xs hover:text-blue-600 transition-colors">
            Terms of Service
          </Link>
          <Link href="/privacy" className="text-xs hover:text-blue-600 transition-colors">
            Privacy
          </Link>
          <Link href="/student-resources" className="text-xs hover:text-blue-600 transition-colors">
            Student Resources
          </Link>
        </nav>
      </footer>
    </div>
  );
}

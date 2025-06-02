"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { AppShell } from '@/components/layout/app-shell';
import { useResumeContext } from '@/contexts/resume-context';
import { FilePlus, Edit3, Trash2, Copy, MoreVertical, Eye, Download, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';

export default function ResumesDashboardPage() {
  const { resumes, isLoading, createResume, deleteResume, duplicateResume, loadResumes } = useResumeContext();
  const router = useRouter();

  useEffect(() => {
    loadResumes(); // Ensure resumes are loaded when component mounts or resumes list changes
  }, [loadResumes]);


  const handleCreateNewResume = async () => {
    const newResume = await createResume();
    router.push(`/resumes/editor/${newResume.id}`);
  };

  const handleEditResume = (id: string) => {
    router.push(`/resumes/editor/${id}`);
  };

  const handleDeleteResume = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this resume?")) {
      await deleteResume(id);
    }
  };

  const handleDuplicateResume = async (id: string) => {
    const duplicated = await duplicateResume(id);
    if (duplicated) {
      router.push(`/resumes/editor/${duplicated.id}`);
    }
  };


  if (isLoading) {
    return (
      <AppShell>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">My Resumes</h1>
           <Skeleton className="h-10 w-36" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-1" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-20 w-full" />
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Skeleton className="h-9 w-9" />
                <Skeleton className="h-9 w-20" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-headline tracking-tight">My Resumes</h1>
        <Button onClick={handleCreateNewResume} size="lg">
          <FilePlus className="mr-2 h-5 w-5" /> Create New Resume
        </Button>
      </div>

      {resumes.length === 0 ? (
        <Card className="text-center py-12 col-span-full shadow-none border-dashed">
           <CardHeader>
            <Image src="https://placehold.co/300x200.png?text=No+Resumes+Yet" alt="No resumes" width={300} height={200} className="mx-auto mb-6 rounded-md" data-ai-hint="empty state illustration"/>
            <CardTitle className="text-2xl font-headline">No Resumes Yet</CardTitle>
            <CardDescription className="text-muted-foreground">
              Ready to land your dream job? Create your first resume to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleCreateNewResume} size="lg">
              <FilePlus className="mr-2 h-5 w-5" /> Create Your First Resume
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {resumes.sort((a,b) => new Date(b.meta.lastModified).getTime() - new Date(a.meta.lastModified).getTime()).map((resume) => (
            <Card key={resume.id} className="flex flex-col hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="font-headline text-xl hover:text-primary transition-colors">
                    <Link href={`/resumes/editor/${resume.id}`}>{resume.versionName}</Link>
                  </CardTitle>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditResume(resume.id)}>
                        <Edit3 className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicateResume(resume.id)}>
                        <Copy className="mr-2 h-4 w-4" /> Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" /> Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleDeleteResume(resume.id)}
                        className="text-destructive focus:text-destructive focus:bg-destructive/10"
                      >
                        <Trash2 className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardDescription>
                  Last modified: {formatDistanceToNow(new Date(resume.meta.lastModified), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-grow">
                {/* Basic preview or icon */}
                <Link href={`/resumes/editor/${resume.id}`} className="block">
                  <div className="aspect-[4/3] bg-muted rounded-md flex items-center justify-center">
                    <FileText className="h-16 w-16 text-muted-foreground/50" />
                  </div>
                </Link>
              </CardContent>
              <CardFooter className="flex justify-end gap-2 pt-4">
                <Button variant="outline" size="sm" onClick={() => router.push(`/resumes/editor/${resume.id}?view=preview`)}>
                  <Eye className="mr-1 h-4 w-4" /> Preview
                </Button>
                <Button size="sm" onClick={() => handleEditResume(resume.id)}>
                  <Edit3 className="mr-1 h-4 w-4" /> Edit
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </AppShell>
  );
}


"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { AppShell } from '@/components/layout/app-shell';
import { useResumeContext } from '@/contexts/resume-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Sparkles, Eye, Download, Settings2, FileText, Palette, CheckSquare, Loader } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { defaultResumeData, ResumeData } from '@/types/resume';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';
import { ResumePreview } from '@/components/resume/resume-preview';
import { Progress } from "@/components/ui/progress";
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { getResumeImprovementSuggestions, type ResumeImprovementSuggestionsInput, type ResumeImprovementSuggestionsOutput } from '@/ai/flows/resume-improvement-suggestions';

import {
  ContactForm,
  SummaryForm,
  ExperienceForm,
  ProjectsForm,
  EducationForm,
  SkillsForm,
  LanguagesForm,
  CustomSectionsForm
} from '@/components/resume/editor-forms';


export default function ResumeEditorPage() {
  const { resumeId } = useParams() as { resumeId: string };
  const router = useRouter();
  const { activeResume, setActiveResumeById, updateActiveResume, saveActiveResume, isLoading } = useResumeContext();
  const { toast } = useToast();
  
  const [isLoadingAITailoring, setIsLoadingAITailoring] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsReport, setAtsReport] = useState<ResumeImprovementSuggestionsOutput | null>(null);
  const [prevAtsScore, setPrevAtsScore] = useState<number | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  useEffect(() => {
    setActiveResumeById(resumeId);
  }, [resumeId, setActiveResumeById]);

  const handleUpdateField = useCallback((fieldPath: string, value: any) => {
    updateActiveResume(prev => {
      const newResume = prev ? { ...prev } : { ...defaultResumeData };
      const pathParts = fieldPath.split('.');
      let current: any = newResume;
      for (let i = 0; i < pathParts.length - 1; i++) {
        current[pathParts[i]] = { ...(current[pathParts[i]] || {}) };
        current = current[pathParts[i]];
      }
      current[pathParts[pathParts.length - 1]] = value;
      return newResume;
    });
  }, [updateActiveResume]);
  
  const handleSaveResume = async () => {
    if (!activeResume) return;
    await saveActiveResume();
    toast({ title: "Resume Saved!", description: `Changes to ${activeResume.versionName} have been saved.` });
  };

  const handleGetAtsSuggestions = async () => {
    if (!activeResume || !jobDescription) {
      toast({ title: "Missing Information", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingAITailoring(true);
    if (atsReport) {
      setPrevAtsScore(atsReport.atsScore);
    }
    try {
      let resumeFullContent = `Name: ${activeResume.contact.name}\nEmail: ${activeResume.contact.email}\nPhone: ${activeResume.contact.phone}\n`;
      if (activeResume.contact.linkedin) resumeFullContent += `LinkedIn: ${activeResume.contact.linkedin}\n`;
      resumeFullContent += `\nSummary:\n${activeResume.summary}\n`;
      
      if (activeResume.experience.length > 0) {
        resumeFullContent += `\nExperience:\n`;
        activeResume.experience.forEach(exp => {
          resumeFullContent += `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})\n`;
          exp.responsibilities.forEach(resp => {
            resumeFullContent += `  - ${resp.text}\n`;
          });
        });
      }

       if (activeResume.projects.length > 0) {
        resumeFullContent += `\nProjects:\n`;
        activeResume.projects.forEach(proj => {
            resumeFullContent += `- ${proj.name}\n`;
            proj.description.split('\n').forEach(desc => {
                resumeFullContent += `  - ${desc}\n`;
            });
        });
      }

      if (activeResume.education.length > 0) {
        resumeFullContent += `\nEducation:\n`;
        activeResume.education.forEach(edu => {
          resumeFullContent += `- ${edu.degree} in ${edu.fieldOfStudy} from ${edu.institution} (${edu.startDate} - ${edu.endDate})\n`;
        });
      }

      if (activeResume.skills.length > 0) {
        resumeFullContent += `\nSkills:\n${activeResume.skills.map(s => s.name + (s.category ? ` (${s.category})` : '')).join(', ')}\n`;
      }
      
      if (activeResume.languages.length > 0) {
        resumeFullContent += `\nLanguages:\n${activeResume.languages.map(l => l.name + (l.proficiency ? ` (${l.proficiency})` : '')).join(', ')}\n`;
      }

      if (activeResume.customSections.length > 0) {
        activeResume.customSections.forEach(section => {
            resumeFullContent += `\n${section.title}:\n`;
            section.items.forEach(item => {
                resumeFullContent += `- ${item.content}${item.subContent ? ` (${item.subContent})` : ''}${item.date ? ` [${item.date}]` : ''}\n`;
            });
        });
      }


      const suggestionInput: ResumeImprovementSuggestionsInput = {
        resumeContent: resumeFullContent,
        jobDescription: jobDescription,
      };
      const suggestionsResult = await getResumeImprovementSuggestions(suggestionInput);
      setAtsReport(suggestionsResult);

      toast({ title: "Resume Analysis Complete!", description: `Your new ATS score is ${suggestionsResult.atsScore}%.` });
    } catch (error) {
      console.error("Resume ATS suggestion failed:", error);
      toast({ title: "Error", description: "Failed to analyze resume for ATS.", variant: "destructive" });
    } finally {
      setIsLoadingAITailoring(false);
    }
  };
  
 const handleDownloadPDF = () => {
    const resumeContentElement = document.getElementById('resume-preview-content');
    if (resumeContentElement && activeResume) {
        
        const cardElement = resumeContentElement.closest('.bg-card');

        const originalStyles = {
            width: resumeContentElement.style.width,
            boxShadow: cardElement ? cardElement.getAttribute('style') : '',
        };
        
        const fixedWidthForCapturePx = 800; 
        resumeContentElement.style.width = `${fixedWidthForCapturePx}px`;
        if (cardElement) {
            cardElement.setAttribute('style', (cardElement.getAttribute('style') || '') + '; box-shadow: none !important;');
        }

        setTimeout(() => {
            html2canvas(resumeContentElement, {
                scale: 2, 
                useCORS: true,
                logging: false,
                width: fixedWidthForCapturePx,
                windowWidth: fixedWidthForCapturePx,
            }).then((canvas) => {
                resumeContentElement.style.width = originalStyles.width;
                if(cardElement && originalStyles.boxShadow !== null) {
                   cardElement.setAttribute('style', originalStyles.boxShadow);
                } else if (cardElement) {
                   cardElement.style.removeProperty('box-shadow');
                }

                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'pt', 'a4');

                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = pdf.internal.pageSize.getHeight();
                
                const canvasWidth = canvas.width;
                const canvasHeight = canvas.height;
                const ratio = canvasHeight / canvasWidth;

                const pageMargin = 0;
                const imgWidthOnPdf = pdfWidth - (pageMargin * 2);
                const imgHeightOnPdf = imgWidthOnPdf * ratio;

                let heightLeft = imgHeightOnPdf;
                let position = pageMargin;

                pdf.addImage(imgData, 'PNG', pageMargin, position, imgWidthOnPdf, imgHeightOnPdf);
                heightLeft -= (pdfHeight - (pageMargin * 2));

                while (heightLeft > 0) {
                    position = position - (pdfHeight - (pageMargin * 2));
                    pdf.addPage();
                    pdf.addImage(imgData, 'PNG', pageMargin, position, imgWidthOnPdf, imgHeightOnPdf);
                    heightLeft -= (pdfHeight - (pageMargin * 2));
                }
                
                pdf.save(`${activeResume.versionName.replace(/\s+/g, '_')}_ResumAI.pdf`);
                toast({ title: "PDF Downloaded", description: "Your resume has been downloaded." });

            }).catch(err => {
                resumeContentElement.style.width = originalStyles.width;
                if(cardElement && originalStyles.boxShadow !== null) {
                   cardElement.setAttribute('style', originalStyles.boxShadow);
                } else if (cardElement) {
                   cardElement.style.removeProperty('box-shadow');
                }

                console.error("Error generating PDF with html2canvas:", err);
                toast({ title: "PDF Generation Failed", description: "Could not generate PDF.", variant: "destructive" });
            });
        }, 150);
    } else {
       toast({ title: "Error", description: "Resume content not found for PDF generation.", variant: "destructive" });
    }
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    try {
      // 1. Get signature from our API
      const signatureResponse = await fetch('/api/upload-signature', {
        method: 'POST',
      });
      const { timestamp, signature, apiKey, cloudName } = await signatureResponse.json();

      if (!signature) {
        throw new Error('Failed to get upload signature from server.');
      }

      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('api_key', apiKey);

      const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error.message || 'Cloudinary upload failed.');
      }

      const uploadedImageData = await uploadResponse.json();
      const secureUrl = uploadedImageData.secure_url;

      // 3. Update resume state
      handleUpdateField('contact.photoUrl', secureUrl);
      toast({ title: 'Photo Uploaded!', description: 'Your new photo has been saved.' });
    } catch (error: any) {
      console.error('Photo upload failed:', error);
      toast({ title: 'Upload Failed', description: error.message || 'Could not upload your photo.', variant: 'destructive' });
    } finally {
      setIsUploadingPhoto(false);
      // Reset file input value so user can upload the same file again
      event.target.value = '';
    }
  };

  if (isLoading) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full">
          <Loader className="w-16 h-16 text-primary animate-spin mb-4" />
          <p className="text-xl text-muted-foreground font-semibold">Loading Editor...</p>
        </div>
      </AppShell>
    );
  }

  if (!activeResume) {
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground font-semibold">Resume Not Found</p>
          <p className="text-muted-foreground">The resume you are looking for does not exist or could not be loaded.</p>
          <Button onClick={() => router.push('/resumes')} className="mt-4">Go to Dashboard</Button>
        </div>
      </AppShell>
    );
  }

  const templateOptions = [
    { id: 'classic', name: 'Classic', imageUrl: 'https://placehold.co/150x200.png?text=Classic+Design', description: "A timeless, traditional layout.", dataAiHint: "classic resume" },
    { id: 'modern', name: 'Modern', imageUrl: 'https://placehold.co/150x200.png?text=Modern+Design', description: "A sleek, contemporary style.", dataAiHint: "modern resume" },
    { id: 'compact', name: 'Compact', imageUrl: 'https://placehold.co/150x200.png?text=Compact+Design', description: "A space-saving, concise format.", dataAiHint: "compact resume" },
    { id: 'two-column-classic', name: 'Two Column', imageUrl: 'https://placehold.co/150x200.png?text=Two+Column', description: "Classic two-column structure.", dataAiHint: "two column resume" },
    { id: 'creative', name: 'Creative', imageUrl: 'https://placehold.co/150x200.png?text=Creative', description: "A bold, stylish design.", dataAiHint: "creative resume" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
          <Input 
            className="text-xl font-bold font-headline w-full sm:w-1/2 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" 
            value={activeResume.versionName} 
            onChange={(e) => handleUpdateField('versionName', e.target.value)}
          />
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleSaveResume}><Save className="mr-2 h-4 w-4" /> Save</Button>
            <Button onClick={handleDownloadPDF}><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
          </div>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-0 overflow-hidden">
          <ScrollArea className="h-[calc(100vh-128px)] md:border-r">
            <div className="p-2 sm:p-4 space-y-6">
              <Tabs defaultValue="content" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="content"><Settings2 className="mr-2 h-4 w-4" />Content</TabsTrigger>
                  <TabsTrigger value="design"><Palette className="mr-2 h-4 w-4" />Design</TabsTrigger>
                  <TabsTrigger value="ats"><CheckSquare className="mr-2 h-4 w-4" />ATS Check</TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="space-y-6">
                  <ContactForm resume={activeResume} updateField={handleUpdateField} handlePhotoUpload={handlePhotoUpload} isUploadingPhoto={isUploadingPhoto}/>
                  <SummaryForm resume={activeResume} updateField={handleUpdateField} />
                  <ExperienceForm resume={activeResume} updateField={handleUpdateField} />
                  <ProjectsForm resume={activeResume} updateField={handleUpdateField} />
                  <EducationForm resume={activeResume} updateField={handleUpdateField} />
                  <SkillsForm resume={activeResume} updateField={handleUpdateField} jobDescriptionForAISkills={jobDescription} />
                  <LanguagesForm resume={activeResume} updateField={handleUpdateField} />
                  <CustomSectionsForm resume={activeResume} updateField={handleUpdateField} />
                </TabsContent>
                <TabsContent value="design">
                  <Card>
                    <CardHeader>
                        <CardTitle>Choose a Template</CardTitle>
                        <CardDescription>Select a style that best fits your profile.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                       <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {templateOptions.map((template) => (
                            <div
                                key={template.id}
                                onClick={() => handleUpdateField('template', template.id)}
                                className={cn(
                                    "border rounded-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-200 ease-in-out transform hover:scale-105",
                                    activeResume.template === template.id ? "ring-2 ring-primary shadow-2xl scale-105" : "border-border hover:border-primary/50"
                                )}
                                >
                                <Image 
                                    src={template.imageUrl} 
                                    alt={`${template.name} template preview`} 
                                    width={150} 
                                    height={200} 
                                    className="w-full h-auto rounded-md mb-3 object-cover aspect-[3/4]" 
                                    data-ai-hint={template.dataAiHint}
                                />
                                <h4 className="font-semibold text-center text-sm mb-1">{template.name}</h4>
                                <p className="text-xs text-muted-foreground text-center leading-tight">{template.description}</p>
                            </div>
                        ))}
                       </div>
                       <Separator />
                        <div>
                            <h4 className="font-semibold mb-2 text-base">Display Options</h4>
                            <div className="flex items-center justify-between rounded-lg border p-3">
                                <div className="space-y-0.5">
                                    <Label>Show Photo</Label>
                                    <p className="text-xs text-muted-foreground">
                                        Display your photo on the resume. (Recommended for Creative templates)
                                    </p>
                                </div>
                                <Switch
                                    checked={activeResume.settings.showPhoto}
                                    onCheckedChange={(checked) => handleUpdateField('settings.showPhoto', checked)}
                                    aria-label="Toggle photo visibility"
                                />
                            </div>
                        </div>
                       <p className="text-muted-foreground text-sm mt-6">More customization options like font and color coming soon!</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="ats">
                  <Card>
                    <CardHeader>
                        <CardTitle>ATS Compatibility Check</CardTitle>
                        <CardDescription>Analyze your resume against a job description to improve your chances.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="job-description">Job Description</Label>
                        <Textarea id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description here for targeted suggestions..." rows={5} />
                      </div>
                      <Button onClick={handleGetAtsSuggestions} disabled={isLoadingAITailoring}>
                        <Sparkles className="mr-2 h-4 w-4" /> {isLoadingAITailoring ? 'Analyzing...' : 'Analyze Resume'}
                      </Button>
                      
                       {isLoadingAITailoring && (
                         <div className="flex items-center justify-center p-8">
                            <Sparkles className="w-8 h-8 text-primary animate-spin" /> 
                            <p className="ml-3 font-semibold">Analyzing your resume...</p>
                         </div>
                       )}

                      {atsReport && !isLoadingAITailoring && (
                        <div className="mt-4 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>ATS Analysis Report</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                                        <div className="text-center">
                                            <p className="text-sm text-muted-foreground">Current Score</p>
                                            <p className="text-6xl font-bold text-primary">{atsReport.atsScore}%</p>
                                            <Progress value={atsReport.atsScore} className="mt-2" />
                                        </div>
                                        {prevAtsScore !== null && (
                                            <div className="text-center p-4 border-l">
                                                <p className="text-sm text-muted-foreground">Previous Score</p>
                                                <p className="text-4xl font-bold text-muted-foreground line-through">{prevAtsScore}%</p>
                                                <p className={cn("mt-2 text-lg font-semibold", atsReport.atsScore > prevAtsScore ? 'text-green-500' : 'text-destructive')}>
                                                    Change: {atsReport.atsScore - prevAtsScore > 0 ? '+' : ''}{atsReport.atsScore - prevAtsScore}%
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    <div className="pt-4">
                                        <h4 className="font-semibold mb-2">Overall Feedback:</h4>
                                        <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">{atsReport.overallFeedback}</p>
                                    </div>
                                </CardContent>
                            </Card>

                            <div>
                                <h3 className="text-xl font-bold mb-3">Improvement Suggestions</h3>
                                <div className="space-y-3">
                                    {atsReport.suggestions.map((item, index) => (
                                        <Card key={index} className="bg-background">
                                            <CardHeader>
                                                <CardTitle className="text-lg flex justify-between items-center">
                                                    <span>{item.category}</span>
                                                </CardTitle>
                                                <CardDescription>{item.problem}</CardDescription>
                                            </Header>
                                            <CardContent>
                                                <p className="font-semibold text-sm">Suggestion:</p>
                                                <p className="text-muted-foreground text-sm">{item.suggestion}</p>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>

          <ScrollArea className="h-[calc(100vh-128px)] bg-muted/30">
            <div className="p-4 md:p-8">
              {activeResume && <ResumePreview resumeData={activeResume} />}
            </div>
          </ScrollArea>
        </div>
      </div>
    </AppShell>
  );
}

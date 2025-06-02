
"use client";

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout/app-shell';
import { useResumeContext } from '@/contexts/resume-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Sparkles, Eye, Download, Share2, Settings2, FileText, Palette, CheckSquare, Info, Trash2, FilePlus } from 'lucide-react';
import { generateCareerSummary, type CareerSummaryInput } from '@/ai/flows/career-summary-generation';
import { getResumeImprovementSuggestions, type ResumeImprovementSuggestionsInput } from '@/ai/flows/resume-improvement-suggestions';
import { generateExperienceBulletPoints, type GenerateExperienceBulletPointsInput } from '@/ai/flows/experience-bullet-point-generation';
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';
import { ResumeContact, ResumeEducation, ResumeExperience, ResumeProject, ResumeSkill, defaultResumeData } from '@/types/resume';
import { v4 as uuidv4 } from 'uuid';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { cn } from '@/lib/utils';

// Sub-components for different resume sections
const ContactForm = ({ resume, updateField }: { resume: any, updateField: (field: string, value: any) => void }) => (
  <Card>
    <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Info className="w-5 h-5 text-primary" />Contact Information</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="name">Full Name</Label><Input id="name" value={resume.contact.name} onChange={e => updateField('contact.name', e.target.value)} placeholder="John Doe" /></div>
        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={resume.contact.email} onChange={e => updateField('contact.email', e.target.value)} placeholder="john.doe@example.com" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="phone">Phone</Label><Input id="phone" value={resume.contact.phone} onChange={e => updateField('contact.phone', e.target.value)} placeholder="(123) 456-7890" /></div>
        <div><Label htmlFor="address">Address</Label><Input id="address" value={resume.contact.address} onChange={e => updateField('contact.address', e.target.value)} placeholder="City, State" /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div><Label htmlFor="linkedin">LinkedIn</Label><Input id="linkedin" value={resume.contact.linkedin} onChange={e => updateField('contact.linkedin', e.target.value)} placeholder="linkedin.com/in/johndoe" /></div>
        <div><Label htmlFor="github">GitHub</Label><Input id="github" value={resume.contact.github} onChange={e => updateField('contact.github', e.target.value)} placeholder="github.com/johndoe" /></div>
      </div>
      <div><Label htmlFor="portfolio">Portfolio/Website</Label><Input id="portfolio" value={resume.contact.portfolio} onChange={e => updateField('contact.portfolio', e.target.value)} placeholder="johndoe.com" /></div>
    </CardContent>
  </Card>
);

const SummaryForm = ({ resume, updateField, generateAISummary, isLoadingAISummary }: { resume: any, updateField: (field: string, value: any) => void, generateAISummary: () => void, isLoadingAISummary: boolean }) => (
  <Card>
    <CardHeader>
      <div className="flex justify-between items-center">
        <CardTitle className="font-headline flex items-center gap-2"><FileText className="w-5 h-5 text-primary" />Professional Summary</CardTitle>
        <Button variant="outline" size="sm" onClick={generateAISummary} disabled={isLoadingAISummary}>
          <Sparkles className="mr-2 h-4 w-4" /> {isLoadingAISummary ? 'Generating...' : 'Generate with AI'}
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <Textarea value={resume.summary} onChange={e => updateField('summary', e.target.value)} placeholder="A brief summary of your skills and career objectives..." rows={5} />
    </CardContent>
  </Card>
);

const ExperienceForm = ({ resume, updateField, toast }: { resume: any, updateField: (field: string, value: any) => void, toast: any }) => {
  const [loadingAIForExperienceId, setLoadingAIForExperienceId] = useState<string | null>(null);

  const addExperience = () => {
    const newExp: ResumeExperience = { id: uuidv4(), jobTitle: '', company: '', location: '', startDate: '', endDate: '', isCurrent: false, responsibilities: [''] };
    updateField('experience', [...resume.experience, newExp]);
  };
  const updateExperience = (index: number, field: keyof ResumeExperience, value: any) => {
    const updatedExp = resume.experience.map((exp: ResumeExperience, i: number) => i === index ? { ...exp, [field]: value } : exp);
    updateField('experience', updatedExp);
  };
  const removeExperience = (index: number) => {
    updateField('experience', resume.experience.filter((_:any, i:number) => i !== index));
  };
  const addResponsibility = (expIndex: number) => {
    const updatedExp = resume.experience.map((exp: ResumeExperience, i: number) => i === expIndex ? { ...exp, responsibilities: [...exp.responsibilities, ''] } : exp);
    updateField('experience', updatedExp);
  };
  const updateResponsibility = (expIndex: number, respIndex: number, value: string) => {
    const updatedExp = resume.experience.map((exp: ResumeExperience, i: number) => i === expIndex ? { ...exp, responsibilities: exp.responsibilities.map((resp, ri) => ri === respIndex ? value : resp) } : exp);
    updateField('experience', updatedExp);
  };
  const removeResponsibility = (expIndex: number, respIndex: number) => {
     const updatedExp = resume.experience.map((exp: ResumeExperience, i: number) => i === expIndex ? { ...exp, responsibilities: exp.responsibilities.filter((_, ri) => ri !== respIndex) } : exp);
    updateField('experience', updatedExp);
  };

  const handleGenerateAIBulletPoints = async (expIndex: number) => {
    const currentExperience = resume.experience[expIndex];
    if (!currentExperience.jobTitle || !currentExperience.company) {
        toast({ title: "Missing Information", description: "Please provide a Job Title and Company before generating bullet points.", variant: "destructive" });
        return;
    }
    setLoadingAIForExperienceId(currentExperience.id);
    try {
      const input: GenerateExperienceBulletPointsInput = {
        jobTitle: currentExperience.jobTitle,
        company: currentExperience.company,
        existingResponsibilities: currentExperience.responsibilities.filter(r => r.trim() !== ''),
      };
      const result = await generateExperienceBulletPoints(input);
      if (result.generatedBulletPoints) {
        updateExperience(expIndex, 'responsibilities', result.generatedBulletPoints);
        toast({ title: "AI Bullet Points Generated!", description: "Responsibilities have been updated." });
      }
    } catch (error) {
      console.error("AI Bullet Point generation failed:", error);
      toast({ title: "Error", description: "Failed to generate AI bullet points.", variant: "destructive" });
    } finally {
      setLoadingAIForExperienceId(null);
    }
  };


  return (
  <Card>
    <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary" />Work Experience</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {resume.experience.map((exp: ResumeExperience, index: number) => (
        <Card key={exp.id} className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Job Title</Label><Input value={exp.jobTitle} onChange={e => updateExperience(index, 'jobTitle', e.target.value)} placeholder="Software Engineer" /></div>
            <div><Label>Company</Label><Input value={exp.company} onChange={e => updateExperience(index, 'company', e.target.value)} placeholder="Tech Solutions Inc." /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Location</Label><Input value={exp.location} onChange={e => updateExperience(index, 'location', e.target.value)} placeholder="City, State" /></div>
            <div><Label>Start Date</Label><Input type="month" value={exp.startDate} onChange={e => updateExperience(index, 'startDate', e.target.value)} /></div>
           </div>
           <div><Label>End Date</Label><Input type="month" value={exp.endDate} onChange={e => updateExperience(index, 'endDate', e.target.value)} disabled={exp.isCurrent} /><div className="flex items-center mt-1"><Input type="checkbox" checked={exp.isCurrent} onChange={e => updateExperience(index, 'isCurrent', e.target.checked)} className="w-4 h-4 mr-2" /><Label>Currently working here</Label></div></div>
           
          <div>
            <div className="flex justify-between items-center mb-1">
                <Label>Responsibilities/Achievements</Label>
                <Button variant="outline" size="sm" onClick={() => handleGenerateAIBulletPoints(index)} disabled={loadingAIForExperienceId === exp.id}>
                    <Sparkles className="mr-2 h-4 w-4" /> {loadingAIForExperienceId === exp.id ? 'Generating...' : 'AI Generate'}
                </Button>
            </div>
            {exp.responsibilities.map((resp, respIndex) => (
              <div key={respIndex} className="flex items-center gap-2 mt-1">
                <Textarea value={resp} onChange={e => updateResponsibility(index, respIndex, e.target.value)} placeholder="Developed new features..." rows={2}/>
                <Button variant="ghost" size="icon" onClick={() => removeResponsibility(index, respIndex)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={() => addResponsibility(index)} className="mt-2">Add Responsibility</Button>
          </div>
          <Button variant="destructive" size="sm" onClick={() => removeExperience(index)}>Remove Experience</Button>
        </Card>
      ))}
      <Button onClick={addExperience}>Add Experience</Button>
    </CardContent>
  </Card>
  );
};

const EducationForm = ({ resume, updateField }: { resume: any, updateField: (field: string, value: any) => void }) => {
   const addEducation = () => {
    const newEdu: ResumeEducation = { id: uuidv4(), institution: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '', gpa: '' };
    updateField('education', [...resume.education, newEdu]);
  };
  const updateEducation = (index: number, field: keyof ResumeEducation, value: any) => {
    const updatedEdu = resume.education.map((edu: ResumeEducation, i: number) => i === index ? { ...edu, [field]: value } : edu);
    updateField('education', updatedEdu);
  };
  const removeEducation = (index: number) => {
    updateField('education', resume.education.filter((_:any, i:number) => i !== index));
  };

  return (
  <Card>
    <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary" />Education</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      {resume.education.map((edu: ResumeEducation, index: number) => (
        <Card key={edu.id} className="p-4 space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Institution</Label><Input value={edu.institution} onChange={e => updateEducation(index, 'institution', e.target.value)} placeholder="University of Example" /></div>
            <div><Label>Degree</Label><Input value={edu.degree} onChange={e => updateEducation(index, 'degree', e.target.value)} placeholder="B.S. Computer Science" /></div>
          </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Field of Study</Label><Input value={edu.fieldOfStudy} onChange={e => updateEducation(index, 'fieldOfStudy', e.target.value)} placeholder="Computer Science" /></div>
            <div><Label>GPA (Optional)</Label><Input value={edu.gpa} onChange={e => updateEducation(index, 'gpa', e.target.value)} placeholder="3.8/4.0" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div><Label>Start Date</Label><Input type="month" value={edu.startDate} onChange={e => updateEducation(index, 'startDate', e.target.value)} /></div>
            <div><Label>End Date / Graduation</Label><Input type="month" value={edu.endDate} onChange={e => updateEducation(index, 'endDate', e.target.value)} /></div>
          </div>
          <Button variant="destructive" size="sm" onClick={() => removeEducation(index)}>Remove Education</Button>
        </Card>
      ))}
      <Button onClick={addEducation}>Add Education</Button>
    </CardContent>
  </Card>
  );
};

const SkillsForm = ({ resume, updateField }: { resume: any, updateField: (field: string, value: any) => void }) => {
  const [newSkill, setNewSkill] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('');

  const addSkill = () => {
    if (!newSkill.trim()) return;
    const skill: ResumeSkill = { id: uuidv4(), name: newSkill.trim(), category: newSkillCategory.trim() || undefined };
    updateField('skills', [...resume.skills, skill]);
    setNewSkill('');
    setNewSkillCategory('');
  };

  const removeSkill = (id: string) => {
    updateField('skills', resume.skills.filter((s: ResumeSkill) => s.id !== id));
  };

  return (
    <Card>
      <CardHeader><CardTitle className="font-headline flex items-center gap-2"><Settings2 className="w-5 h-5 text-primary"/>Skills</CardTitle></CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Input value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Add a skill (e.g., JavaScript)" />
          <Input value={newSkillCategory} onChange={e => setNewSkillCategory(e.target.value)} placeholder="Category (Optional)" />
          <Button onClick={addSkill}>Add Skill</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {resume.skills.map((skill: ResumeSkill) => (
            <div key={skill.id} className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full flex items-center gap-2 text-sm">
              {skill.name} {skill.category && `(${skill.category})`}
              <button onClick={() => removeSkill(skill.id)} className="text-destructive hover:text-destructive/80">&times;</button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};


const ResumePreview = ({ resumeData }: { resumeData: any }) => {
  if (!resumeData) return <div className="p-8 bg-muted rounded-lg text-center text-muted-foreground">Select a resume to preview.</div>;

  const templateClass = `template-${resumeData.template || 'classic'}`;

  return (
    <Card className="h-full shadow-lg">
      <CardContent className={cn("p-6 md:p-8 print-container", templateClass)} id="resume-preview-content">
        <div className="resume-header text-center mb-6">
          <h1>{resumeData.contact.name || "Your Name"}</h1>
          <p>
            {resumeData.contact.email || "your.email@example.com"}
            {resumeData.contact.phone && ` | ${resumeData.contact.phone}`}
            {resumeData.contact.address && resumeData.settings.showAddress && ` | ${resumeData.contact.address}`}
          </p>
          { (resumeData.contact.linkedin || (resumeData.contact.github && resumeData.settings.showGithub) || (resumeData.contact.portfolio && resumeData.settings.showPortfolio)) && 
            <p>
              {resumeData.contact.linkedin && <a href={resumeData.contact.linkedin} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.linkedin}</a>}
              {resumeData.contact.github && resumeData.settings.showGithub && <> | <a href={resumeData.contact.github} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.github}</a></>}
              {resumeData.contact.portfolio && resumeData.settings.showPortfolio && <> | <a href={resumeData.contact.portfolio} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.portfolio}</a></>}
            </p>
          }
        </div>

        {resumeData.summary && (
          <div className="resume-section mb-4">
            <h2 className="resume-section-title">Summary</h2>
            <p className="resume-item-content whitespace-pre-line">{resumeData.summary}</p>
          </div>
        )}

        {resumeData.experience?.length > 0 && (
          <div className="resume-section mb-4">
            <h2 className="resume-section-title">Experience</h2>
            {resumeData.experience.map((exp: ResumeExperience) => (
              <div key={exp.id} className="resume-item mb-3">
                <h3 className="resume-item-title">{exp.jobTitle} - {exp.company}</h3>
                <p className="resume-item-subtitle">{exp.location} | {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                <ul className="list-disc list-inside ml-4 resume-item-content">
                  {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
        
         {resumeData.education?.length > 0 && (
          <div className="resume-section mb-4">
            <h2 className="resume-section-title">Education</h2>
            {resumeData.education.map((edu: ResumeEducation) => (
              <div key={edu.id} className="resume-item mb-3">
                <h3 className="resume-item-title">{edu.degree} in {edu.fieldOfStudy} - {edu.institution}</h3>
                <p className="resume-item-subtitle">{edu.startDate} - {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.skills?.length > 0 && (
          <div className="resume-section mb-4">
            <h2 className="resume-section-title">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: ResumeSkill) => (
                <span key={skill.id} className="resume-skill-badge">{skill.name} {skill.category && `(${skill.category})`}</span>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};


export default function ResumeEditorPage() {
  const { resumeId } = useParams() as { resumeId: string };
  const router = useRouter();
  const { activeResume, setActiveResumeById, updateActiveResume, saveActiveResume, createResume } = useResumeContext();
  const { toast } = useToast();
  const [isLoadingAISummary, setIsLoadingAISummary] = useState(false);
  const [isLoadingAITailoring, setIsLoadingAITailoring] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [atsSuggestions, setAtsSuggestions] = useState<string[]>([]);
  
  const hasInitializedNewRef = useRef(false);
  const initialResumeIdPropRef = useRef(resumeId);

 useEffect(() => {
    let isMounted = true;

    const initializeNewResume = async () => {
        if (!hasInitializedNewRef.current) {
            hasInitializedNewRef.current = true; // Set flag before async operation
            const newResume = await createResume();
            if (isMounted && newResume?.id) {
                // Replace URL only after new resume is created and we have its ID
                router.replace(`/resumes/editor/${newResume.id}`, { scroll: false });
            }
        }
    };

    if (resumeId === 'new') {
        // Only initialize if we haven't done so for this 'new' instance
        // or if the activeResume is not the one we are trying to create.
        if (!activeResume || (activeResume.id === defaultResumeData.id || activeResume.id === '')) {
             initializeNewResume();
        } else if (activeResume && activeResume.id !== defaultResumeData.id && !hasInitializedNewRef.current) {
            // This case handles if the user navigates from an existing resume back to /new
            // We should re-trigger initialization.
            hasInitializedNewRef.current = false; // Reset for re-initialization
            initializeNewResume();
        }
    } else if (resumeId) {
        // If resumeId is not 'new', load the specific resume
        if (!activeResume || activeResume.id !== resumeId) {
            setActiveResumeById(resumeId);
        }
        // If we navigated from 'new' to a specific resume, reset the 'new' flag
        if (initialResumeIdPropRef.current === 'new') {
            hasInitializedNewRef.current = false;
        }
    }
    
    // Update initialResumeIdPropRef if resumeId has changed from the prop
    if (initialResumeIdPropRef.current !== resumeId) {
        initialResumeIdPropRef.current = resumeId;
    }
    
    return () => {
      isMounted = false;
      // Removed saveActiveResume from cleanup to prevent loops
    };
  }, [resumeId, createResume, setActiveResumeById, router, activeResume]);


  const handleUpdateField = useCallback((fieldPath: string, value: any) => {
    updateActiveResume(prev => {
      if (!prev) return defaultResumeData; 
      const pathParts = fieldPath.split('.');
      let current = { ...prev }; 
      let ref: any = current;

      for (let i = 0; i < pathParts.length - 1; i++) {
        ref[pathParts[i]] = { ...(ref[pathParts[i]] || {}) };
        ref = ref[pathParts[i]];
      }
      ref[pathParts[pathParts.length - 1]] = value;
      return current;
    });
  }, [updateActiveResume]);
  
  const handleSaveResume = async () => {
    if (!activeResume) return;
    await saveActiveResume();
    toast({ title: "Resume Saved!", description: `${activeResume.versionName} has been saved.` });
  };

  const handleGenerateAISummary = async () => {
    if (!activeResume) return;
    setIsLoadingAISummary(true);
    try {
      const input: CareerSummaryInput = {
        experienceLevel: 'student', 
        jobTitle: activeResume.experience[0]?.jobTitle || 'Entry-level role',
        skills: activeResume.skills.map(s => s.name).join(', '),
        experienceSummary: activeResume.experience.map(e => `${e.jobTitle} at ${e.company}: ${e.responsibilities.join('. ')}`).join('\n'),
      };
      const result = await generateCareerSummary(input);
      if (result.summary) {
        handleUpdateField('summary', result.summary);
        toast({ title: "AI Summary Generated!", description: "The summary has been updated." });
      }
    } catch (error) {
      console.error("AI Summary generation failed:", error);
      toast({ title: "Error", description: "Failed to generate AI summary.", variant: "destructive" });
    } finally {
      setIsLoadingAISummary(false);
    }
  };

  const handleGetAtsSuggestions = async () => {
    if (!activeResume || !jobDescription) {
      toast({ title: "Missing Information", description: "Please provide a job description.", variant: "destructive" });
      return;
    }
    setIsLoadingAITailoring(true);
    try {
      // Construct a more comprehensive resume content string for analysis
      let resumeFullContent = `Name: ${activeResume.contact.name}\nEmail: ${activeResume.contact.email}\nPhone: ${activeResume.contact.phone}\n`;
      if (activeResume.contact.linkedin) resumeFullContent += `LinkedIn: ${activeResume.contact.linkedin}\n`;
      resumeFullContent += `\nSummary:\n${activeResume.summary}\n`;
      
      if (activeResume.experience.length > 0) {
        resumeFullContent += `\nExperience:\n`;
        activeResume.experience.forEach(exp => {
          resumeFullContent += `- ${exp.jobTitle} at ${exp.company} (${exp.startDate} - ${exp.isCurrent ? 'Present' : exp.endDate})\n`;
          exp.responsibilities.forEach(resp => {
            resumeFullContent += `  - ${resp}\n`;
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


      const suggestionInput: ResumeImprovementSuggestionsInput = {
        resumeContent: resumeFullContent,
        jobDescription: jobDescription,
      };
      const suggestionsResult = await getResumeImprovementSuggestions(suggestionInput);
      setAtsSuggestions(suggestionsResult.suggestions);

      toast({ title: "Resume Analysis Complete!", description: "Check the ATS Checker tab for improvement suggestions based on the job description." });
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
      const originalWidth = resumeContentElement.style.width;
      // Temporarily set width for consistent canvas rendering if needed, e.g. A4 aspect ratio
      // resumeContentElement.style.width = '210mm'; 
      
      html2canvas(resumeContentElement, { 
        scale: 2, // Increase scale for better quality
        useCORS: true, // If you have external images
        // width: resumeContentElement.scrollWidth, // Use scrollWidth for full content
        // windowWidth: resumeContentElement.scrollWidth
      })
        .then((canvas) => {
          // resumeContentElement.style.width = originalWidth; // Reset width

          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4'); // A4 dimensions: 210mm x 297mm
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          
          // Calculate the aspect ratio of the canvas content
          const contentAspectRatio = canvasWidth / canvasHeight;
          
          let imgWidthOnPdf = pdfWidth;
          let imgHeightOnPdf = pdfWidth / contentAspectRatio;
          let yPosition = 0;

          if (imgHeightOnPdf <= pdfHeight) {
            // Content fits on one page or is shorter than one page
            pdf.addImage(imgData, 'PNG', 0, yPosition, imgWidthOnPdf, imgHeightOnPdf);
          } else {
            // Content is taller than one page, needs to be split
            let remainingCanvasHeight = canvasHeight;
            let currentYCanvas = 0;

            while (remainingCanvasHeight > 0) {
              if (yPosition > 0) { // Check if it's not the first page
                pdf.addPage();
              }
              // Calculate how much of the canvas height fits on one PDF page
              const sourceHeightToCopy = Math.min(remainingCanvasHeight, canvasWidth * (pdfHeight/pdfWidth) );

              const pageCanvas = document.createElement('canvas');
              pageCanvas.width = canvasWidth;
              pageCanvas.height = sourceHeightToCopy;
              const pageCtx = pageCanvas.getContext('2d');
              
              if (pageCtx) {
                // Crop the relevant part from the full canvas
                pageCtx.drawImage(canvas, 0, currentYCanvas, canvasWidth, sourceHeightToCopy, 0, 0, canvasWidth, sourceHeightToCopy);
                const pageImgData = pageCanvas.toDataURL('image/png');
                
                // Add the cropped image to the PDF page
                // The height of the image on PDF should maintain aspect ratio for this segment
                const currentSegmentHeightOnPdf = (pageCanvas.height / pageCanvas.width) * pdfWidth;
                pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, currentSegmentHeightOnPdf);

                currentYCanvas += sourceHeightToCopy;
                remainingCanvasHeight -= sourceHeightToCopy;
                yPosition += pdfHeight; // Mark that we've used a page worth of space
              } else {
                console.error("Failed to get 2D context for page canvas");
                break;
              }
            }
          }
          pdf.save(`${activeResume.versionName.replace(/\s+/g, '_')}_ResumAI.pdf`);
          toast({ title: "PDF Downloaded", description: "Your resume has been downloaded as a PDF." });
        })
        .catch(err => {
          // resumeContentElement.style.width = originalWidth; // Reset width on error too
          console.error("Error generating PDF:", err);
          toast({ title: "PDF Generation Failed", description: "Could not generate PDF.", variant: "destructive" });
        });
    } else {
       toast({ title: "Error", description: "Resume content not found for PDF generation.", variant: "destructive" });
    }
  };


  if (!activeResume && resumeId !== 'new') { 
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full">
          <FileText className="w-16 h-16 text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground font-semibold">Loading resume data...</p>
          <Button onClick={() => router.push('/resumes')} className="mt-4">Go to Dashboard</Button>
        </div>
      </AppShell>
    );
  }
  
  if (!activeResume && resumeId === 'new' && !hasInitializedNewRef.current) {
     return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full">
            <FilePlus className="w-16 h-16 text-muted-foreground mb-4 animate-pulse" />
            <p className="text-xl text-muted-foreground font-semibold">Creating new resume...</p>
        </div>
      </AppShell>
     );
  }
  
  if (!activeResume) { // Fallback if activeResume is somehow still null after 'new' handling
    return (
      <AppShell>
        <div className="flex flex-col items-center justify-center h-full">
           <p className="text-xl text-muted-foreground font-semibold">Error: No active resume. Please try creating one or selecting from dashboard.</p>
           <Button onClick={() => router.push('/resumes')} className="mt-4">Go to Dashboard</Button>
        </div>
      </AppShell>
    );
  }


  return (
    <AppShell>
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-card sticky top-0 z-10">
          <Input 
            className="text-xl font-bold font-headline w-1/2 border-0 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0" 
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
                  <ContactForm resume={activeResume} updateField={handleUpdateField} />
                  <SummaryForm resume={activeResume} updateField={handleUpdateField} generateAISummary={handleGenerateAISummary} isLoadingAISummary={isLoadingAISummary} />
                  <ExperienceForm resume={activeResume} updateField={handleUpdateField} toast={toast} />
                  <EducationForm resume={activeResume} updateField={handleUpdateField} />
                  <SkillsForm resume={activeResume} updateField={handleUpdateField} />
                </TabsContent>
                <TabsContent value="design">
                  <Card>
                    <CardHeader><CardTitle className="font-headline">Design & Layout</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                       <div>
                        <Label htmlFor="template-select">Template</Label>
                        <select id="template-select" value={activeResume.template} onChange={e => handleUpdateField('template', e.target.value)} className="w-full p-2 border rounded bg-background text-foreground">
                            <option value="classic">Classic</option>
                            <option value="modern">Modern</option>
                            <option value="compact">Compact</option>
                        </select>
                       </div>
                       <p className="text-muted-foreground text-sm">More customization options coming soon!</p>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="ats">
                  <Card>
                    <CardHeader><CardTitle className="font-headline">ATS Compatibility Check</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="job-description">Job Description (Optional)</Label>
                        <Textarea id="job-description" value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder="Paste job description here for more targeted suggestions..." rows={5} />
                      </div>
                      <Button onClick={handleGetAtsSuggestions} disabled={isLoadingAITailoring}>
                        <Sparkles className="mr-2 h-4 w-4" /> {isLoadingAITailoring ? 'Analyzing...' : 'Get ATS Suggestions'}
                      </Button>
                      {atsSuggestions.length > 0 && (
                        <div className="mt-4 p-4 bg-secondary rounded-md">
                          <h3 className="font-semibold mb-2 text-secondary-foreground">Improvement Suggestions:</h3>
                          <ul className="list-disc list-inside space-y-1 text-sm text-secondary-foreground/90">
                            {atsSuggestions.map((s, i) => <li key={i}>{s}</li>)}
                          </ul>
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
              <ResumePreview resumeData={activeResume} />
            </div>
          </ScrollArea>
        </div>
      </div>
    </AppShell>
  );
}

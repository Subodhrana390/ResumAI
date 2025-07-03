
"use client";

import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ResumeData, ResumeExperience, ResumeEducation, ResumeSkill, ResumeLanguage, ResumeCustomSection, ResumeCustomSectionItem } from '@/types/resume';

const ensureProtocol = (url: string) => {
    if (!url) return "#";
    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }
    return `https://${url}`;
};


export const ResumePreview = ({ resumeData }: { resumeData: ResumeData }) => {
  if (!resumeData) return <div className="p-8 bg-muted rounded-lg text-center text-muted-foreground">Select a resume to preview.</div>;

  const templateClass = `template-${resumeData.template || 'classic'}`;

  if (resumeData.template === 'two-column-classic') {
    const leftColumnCustomSections = ['Career Objective', 'Software', 'Certifications', 'Awards', 'Hobbies', 'Interests']; // Titles for left column
    
    const detailsSection = (
        <div className="left-column-section">
            <h3 className="left-column-section-title">Details</h3>
            <div className="left-column-section-content">
            {resumeData.contact.address && resumeData.settings.showAddress && <p className="left-column-contact-item">{resumeData.contact.address}</p>}
            {resumeData.contact.phone && <p className="left-column-contact-item">{resumeData.contact.phone}</p>}
            {resumeData.contact.email && <p className="left-column-contact-item">{resumeData.contact.email}</p>}
            {resumeData.contact.linkedin && <p className="left-column-contact-item"><a href={ensureProtocol(resumeData.contact.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.linkedin}</a></p>}
            {resumeData.contact.github && resumeData.settings.showGithub && <p className="left-column-contact-item"><a href={ensureProtocol(resumeData.contact.github)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.github}</a></p>}
            {resumeData.contact.portfolio && resumeData.settings.showPortfolio && <p className="left-column-contact-item"><a href={ensureProtocol(resumeData.contact.portfolio)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.portfolio}</a></p>}
            </div>
        </div>
    );

    const skillsSection = resumeData.skills?.length > 0 && (
        <div className="left-column-section">
            <h3 className="left-column-section-title">Software</h3>
            <div className="left-column-section-content">
            <ul>{resumeData.skills.map(skill => <li key={skill.id}>{skill.name}{skill.category ? ` (${skill.category})` : ''}</li>)}</ul>
            </div>
        </div>
    );
    
    const languagesSection = resumeData.languages?.length > 0 && (
        <div className="left-column-section">
            <h3 className="left-column-section-title">Languages</h3>
            <div className="left-column-section-content">
            {resumeData.languages.map(lang => <p key={lang.id}>{lang.name}{lang.proficiency ? ` (${lang.proficiency})` : ''}</p>)}
            </div>
        </div>
    );

    const leftCustoms = resumeData.customSections?.filter(section => 
        leftColumnCustomSections.some(title => section.title.toLowerCase().includes(title.toLowerCase()))
    );
    const rightCustoms = resumeData.customSections?.filter(section => 
        !leftColumnCustomSections.some(title => section.title.toLowerCase().includes(title.toLowerCase()))
    );


    return (
        <Card className="h-full shadow-lg bg-card text-card-foreground">
            <CardContent className={cn("p-6 md:p-8 print-container", templateClass)} id="resume-preview-content">
                <div className="resume-super-header-bar"></div>
                <h1 className="resume-main-name">{resumeData.contact.name || "Your Name"}</h1>
                
                <div className="resume-layout-grid">
                    <div className="resume-left-column">
                        {detailsSection}
                        {skillsSection}
                        {languagesSection}
                        {leftCustoms?.map(section => (
                            <div key={section.id} className="left-column-section">
                                <h3 className="left-column-section-title">{section.title}</h3>
                                <div className="left-column-section-content">
                                    {section.items.map(item => (
                                        <div key={item.id} className="mb-1">
                                            <p>{item.content}</p>
                                            {item.subContent && <p className="text-xs opacity-80">{item.subContent}</p>}
                                            {item.date && <p className="text-xs opacity-70">{item.date}</p>}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="resume-right-column">
                        {resumeData.summary && (
                        <div className="right-column-section">
                            <h2 className="right-column-section-title">Professional Profile</h2>
                            <p className="resume-item-content">{resumeData.summary}</p>
                        </div>
                        )}

                        {resumeData.experience?.length > 0 && (
                        <div className="right-column-section">
                            <h2 className="right-column-section-title">Professional Experience</h2>
                            {resumeData.experience.map((exp: ResumeExperience) => (
                            <div key={exp.id} className="resume-item">
                                <div className="resume-item-header">
                                <div className="resume-item-title-group">
                                    <h3 className="resume-item-title">{exp.jobTitle}</h3>
                                    <p className="resume-item-subtitle">{exp.company}{exp.location && `, ${exp.location}`}</p>
                                </div>
                                <p className="resume-item-dates">{exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                                </div>
                                <div className="resume-item-content">
                                <ul>
                                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                                </ul>
                                </div>
                            </div>
                            ))}
                        </div>
                        )}
                        
                        {resumeData.education?.length > 0 && (
                        <div className="right-column-section">
                            <h2 className="right-column-section-title">Education</h2>
                            {resumeData.education.map((edu: ResumeEducation) => (
                            <div key={edu.id} className="resume-item">
                                <div className="resume-item-header">
                                    <div className="resume-item-title-group">
                                        <h3 className="resume-item-title">{edu.degree}</h3>
                                        <p className="resume-item-subtitle">{edu.institution}{edu.fieldOfStudy && `, ${edu.fieldOfStudy}`}</p>
                                    </div>
                                    <p className="resume-item-dates">{edu.startDate} - {edu.endDate}</p>
                                </div>
                                {edu.gpa && <p className="text-xs text-gray-500 dark:text-gray-400">GPA: {edu.gpa}</p>}
                            </div>
                            ))}
                        </div>
                        )}
                        {rightCustoms?.map(section => (
                          <div key={section.id} className="right-column-section">
                            <h2 className="right-column-section-title">{section.title}</h2>
                            {section.items.map((item: ResumeCustomSectionItem) => (
                              <div key={item.id} className="resume-item">
                                 <h3 className="resume-item-title">{item.content}</h3>
                                 { (item.subContent || item.date) && 
                                    <p className="resume-item-subtitle">
                                        {item.subContent}
                                        {item.subContent && item.date && " | "}
                                        {item.date}
                                    </p>
                                 }
                              </div>
                            ))}
                          </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

  }

  // Fallback for other templates (classic, modern, compact)
  return (
    <Card className="h-full shadow-lg bg-card text-card-foreground">
      <CardContent className={cn("p-6 md:p-8 print-container", templateClass)} id="resume-preview-content">
        <div className="resume-header">
          <h1>{resumeData.contact.name || "Your Name"}</h1>
          <p>
            {resumeData.contact.email || "your.email@example.com"}
            {resumeData.contact.phone && ` | ${resumeData.contact.phone}`}
            {resumeData.contact.address && resumeData.settings.showAddress && ` | ${resumeData.contact.address}`}
          </p>
          { (resumeData.contact.linkedin || (resumeData.contact.github && resumeData.settings.showGithub) || (resumeData.contact.portfolio && resumeData.settings.showPortfolio)) && 
            <p>
              {resumeData.contact.linkedin && <a href={ensureProtocol(resumeData.contact.linkedin)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.linkedin}</a>}
              {resumeData.contact.github && resumeData.settings.showGithub && <> | <a href={ensureProtocol(resumeData.contact.github)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.github}</a></>}
              {resumeData.contact.portfolio && resumeData.settings.showPortfolio && <> | <a href={ensureProtocol(resumeData.contact.portfolio)} target="_blank" rel="noreferrer" className="hover:underline">{resumeData.contact.portfolio}</a></>}
            </p>
          }
        </div>

        {resumeData.summary && (
          <div className="resume-section">
            <h2 className="resume-section-title">Summary</h2>
            <p className="resume-item-content whitespace-pre-line">{resumeData.summary}</p>
          </div>
        )}

        {resumeData.experience?.length > 0 && (
          <div className="resume-section">
            <h2 className="resume-section-title">Experience</h2>
            {resumeData.experience.map((exp: ResumeExperience) => (
              <div key={exp.id} className="resume-item">
                <h3 className="resume-item-title">{exp.jobTitle} - {exp.company}</h3>
                <p className="resume-item-subtitle">{exp.location} | {exp.startDate} - {exp.isCurrent ? 'Present' : exp.endDate}</p>
                <div className="resume-item-content">
                  <ul>
                    {exp.responsibilities.map((resp, i) => <li key={i}>{resp}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
        
         {resumeData.education?.length > 0 && (
          <div className="resume-section">
            <h2 className="resume-section-title">Education</h2>
            {resumeData.education.map((edu: ResumeEducation) => (
              <div key={edu.id} className="resume-item">
                <h3 className="resume-item-title">{edu.degree} in {edu.fieldOfStudy} - {edu.institution}</h3>
                <p className="resume-item-subtitle">{edu.startDate} - {edu.endDate} {edu.gpa && `| GPA: ${edu.gpa}`}</p>
              </div>
            ))}
          </div>
        )}

        {resumeData.skills?.length > 0 && (
          <div className="resume-section">
            <h2 className="resume-section-title">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {resumeData.skills.map((skill: ResumeSkill) => (
                <span key={skill.id} className="resume-skill-badge">{skill.name} {skill.category && `(${skill.category})`}</span>
              ))}
            </div>
          </div>
        )}

        {resumeData.languages?.length > 0 && (
          <div className="resume-section">
            <h2 className="resume-section-title">Languages</h2>
             <div className="flex flex-wrap gap-x-4 gap-y-1">
              {resumeData.languages.map((lang: ResumeLanguage) => (
                <p key={lang.id} className="resume-item-content">
                  <span className="font-semibold">{lang.name}</span>
                  {lang.proficiency && <span className="text-muted-foreground"> ({lang.proficiency})</span>}
                </p>
              ))}
            </div>
          </div>
        )}

        {resumeData.customSections?.length > 0 && resumeData.customSections.map((section: ResumeCustomSection) => (
          <div key={section.id} className="resume-section">
            <h2 className="resume-section-title">{section.title}</h2>
            {section.items.map((item: ResumeCustomSectionItem) => (
              <div key={item.id} className="resume-item">
                 <h3 className="resume-item-title">{item.content}</h3>
                 { (item.subContent || item.date) && 
                    <p className="resume-item-subtitle">
                        {item.subContent}
                        {item.subContent && item.date && " | "}
                        {item.date}
                    </p>
                 }
              </div>
            ))}
          </div>
        ))}

      </CardContent>
    </Card>
  );
};

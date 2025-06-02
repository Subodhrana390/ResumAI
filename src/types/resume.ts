
export interface ResumeContact {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
}

export interface ResumeExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: string[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string; // Added startDate for education
  endDate: string; // Renamed from graduationDate for consistency
  gpa?: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  category?: string; // e.g., Programming Languages, Tools, Soft Skills
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResumeCustomSection {
  id: string;
  title: string;
  items: Array<{ id: string, content: string, subContent?: string, date?: string }>;
}

export interface ResumeData {
  id: string;
  versionName: string;
  template: string; // Identifier for the template, e.g., 'classic', 'modern'
  contact: ResumeContact;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  customSections: ResumeCustomSection[];
  meta: {
    jobDescription?: string;
    atsScore?: number;
    improvementSuggestions?: string[];
    lastModified: string;
  };
  settings: {
    fontFamily: string;
    fontSize: string; // e.g. 'text-sm', 'text-base'
    accentColor: string; // hex value
    showAddress: boolean;
    showGithub: boolean;
    showPortfolio: boolean;
  };
}

export const defaultResumeData: ResumeData = {
  id: '',
  versionName: 'My First Resume',
  template: 'classic',
  contact: {
    name: '',
    email: '',
    phone: '',
    linkedin: '',
    github: '',
    portfolio: '',
    address: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  customSections: [],
  meta: {
    lastModified: new Date().toISOString(),
  },
  settings: {
    fontFamily: 'Inter',
    fontSize: 'text-sm',
    accentColor: '#A7D1E8', // Default to primary color
    showAddress: true,
    showGithub: true,
    showPortfolio: true,
  }
};

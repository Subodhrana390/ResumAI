

export interface ResumeContact {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  portfolio: string;
  address: string;
  photoUrl: string;
}

export interface ResumeResponsibility {
  id: string;
  text: string;
}

export interface ResumeExperience {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  responsibilities: ResumeResponsibility[];
}

export interface ResumeEducation {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ResumeSkill {
  id: string;
  name: string;
  category?: string;
}

export interface ResumeProject {
  id: string;
  name: string;
  description: string;
  technologies: string[];
  link: string;
  startDate: string;
  endDate: string;
}

export interface ResumeLanguage {
  id: string;
  name: string;
  proficiency: string;
}

export interface ResumeCustomSectionItem {
  id: string;
  content: string;
  subContent: string;
  date: string;
}
export interface ResumeCustomSection {
  id: string;
  title: string;
  items: ResumeCustomSectionItem[];
}

export interface ResumeData {
  id: string;
  versionName: string;
  template: string;
  contact: ResumeContact;
  summary: string;
  experience: ResumeExperience[];
  education: ResumeEducation[];
  skills: ResumeSkill[];
  projects: ResumeProject[];
  languages: ResumeLanguage[];
  customSections: ResumeCustomSection[];
  meta: {
    jobDescription?: string;
    atsScore?: number;
    improvementSuggestions?: string[];
    lastModified: string;
  };
  settings: {
    fontFamily: string;
    fontSize: string;
    accentColor: string;
    showAddress: boolean;
    showGithub: boolean;
    showPortfolio: boolean;
    showPhoto: boolean;
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
    photoUrl: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  customSections: [],
  meta: {
    lastModified: new Date().toISOString(),
  },
  settings: {
    fontFamily: 'Inter',
    fontSize: 'text-sm',
    accentColor: '#A7D1E8', 
    showAddress: true,
    showGithub: true,
    showPortfolio: true,
    showPhoto: true,
  }
};

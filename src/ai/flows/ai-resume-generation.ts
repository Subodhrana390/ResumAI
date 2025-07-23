'use server';
/**
 * @fileOverview An AI-powered resume generation flow.
 *
 * - generateAiResume - A function that generates a resume based on user input.
 * - GenerateAiResumeInput - The input type for the generateAiResume function.
 * - GenerateAiResumeOutput - The return type for the generateAiResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateAiResumeInputSchema = z.object({
  fullName: z.string().describe("The user's full name."),
  email: z.string().describe("The user's email address."),
  jobDescription: z.string().describe('The full job description for the target role.'),
  additionalInfo: z
    .string()
    .optional()
    .describe('Any additional information, like key skills, past projects, or experiences the user wants to highlight.'),
});
export type GenerateAiResumeInput = z.infer<typeof GenerateAiResumeInputSchema>;

const GeneratedExperienceSchema = z.object({
    jobTitle: z.string(),
    company: z.string(),
    location: z.string(),
    startDate: z.string(),
    endDate: z.string(),
    responsibilities: z.array(z.string()),
});

const GeneratedEducationSchema = z.object({
    institution: z.string(),
    degree: z.string(),
    fieldOfStudy: z.string(),
    startDate: z.string(),
    endDate: z.string(),
});

const GeneratedProjectSchema = z.object({
    name: z.string(),
    description: z.string(),
    technologies: z.array(z.string()),
});

const GenerateAiResumeOutputSchema = z.object({
  contact: z.object({
    name: z.string(),
    email: z.string(),
    phone: z.string().optional().default(''),
    linkedin: z.string().optional().default(''),
    address: z.string().optional().default(''),
  }),
  summary: z.string().describe("A professional summary for the resume, tailored to the job description."),
  experience: z.array(GeneratedExperienceSchema).describe("A list of 1-2 relevant, impactful work experiences. If the user is a student with no experience, create plausible internship or project-based experiences."),
  education: z.array(GeneratedEducationSchema).describe("A list of educational qualifications. Assume a relevant degree if not specified."),
  projects: z.array(GeneratedProjectSchema).describe("A list of 1-2 relevant projects with descriptions."),
  skills: z.array(z.string()).describe("A list of 5-10 key technical and soft skills relevant to the job description."),
});
export type GenerateAiResumeOutput = z.infer<typeof GenerateAiResumeOutputSchema>;


export async function generateAiResume(input: GenerateAiResumeInput): Promise<GenerateAiResumeOutput> {
  return generateAiResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiResumePrompt',
  input: {schema: GenerateAiResumeInputSchema},
  output: {schema: GenerateAiResumeOutputSchema},
  prompt: `You are an expert resume writer specializing in creating compelling, professional resumes tailored to specific job descriptions.
Your task is to generate a complete, structured resume for a user based on the information provided.

**User Information:**
- Full Name: {{{fullName}}}
- Email: {{{email}}}
{{#if additionalInfo}}
- Additional Information/Notes from user: {{{additionalInfo}}}
{{/if}}

**Target Job Description:**
{{{jobDescription}}}

**Instructions:**
1.  **Analyze the Job Description**: Carefully read the job description to understand the key requirements, skills, and qualifications.
2.  **Generate a Full Resume**: Create a complete resume in the required JSON format.
3.  **Contact Info**: Use the provided full name and email. You can generate a plausible phone number, address, and LinkedIn profile URL if not provided. Always return a string, even if it's empty.
4.  **Summary**: Write a powerful, concise professional summary that immediately highlights the candidate's suitability for the role described.
5.  **Experience**:
    - Based on the job description, create 1 or 2 highly relevant and impactful work experience entries.
    - If the user seems to be a student or fresher (based on their additional info or lack thereof), invent a plausible internship or a detailed, project-based role that sounds like professional experience.
    - For each experience, write 3-4 achievement-oriented bullet points using strong action verbs. Quantify results where possible.
6.  **Education**: Generate a standard, relevant educational background (e.g., Bachelor's in Computer Science from a known university).
7.  **Projects**: Create 1-2 project examples that showcase the skills needed for the job. Include a brief description and the technologies used.
8.  **Skills**: List 5-10 of the most important technical and soft skills, derived directly from the job description.

The generated resume must be realistic, professional, and directly targeted at the provided job description.
`,
});

const generateAiResumeFlow = ai.defineFlow(
  {
    name: 'generateAiResumeFlow',
    inputSchema: GenerateAiResumeInputSchema,
    outputSchema: GenerateAiResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('AI failed to generate a resume.');
    }
    // Ensure optional fields are not undefined.
    output.contact.phone = output.contact.phone || '';
    output.contact.address = output.contact.address || '';
    output.contact.linkedin = output.contact.linkedin || '';
    return output;
  }
);

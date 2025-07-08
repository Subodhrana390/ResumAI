'use server';
/**
 * @fileOverview Generates a professional cover letter.
 *
 * - generateCoverLetter - A function to generate a cover letter.
 * - GenerateCoverLetterInput - The input type for the function.
 * - GenerateCoverLetterOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

export const GenerateCoverLetterInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The full content of the user\'s resume.'),
  jobDescription: z
    .string()
    .describe('The job description the user is applying for.'),
  userName: z.string().describe("The user's full name."),
});
export type GenerateCoverLetterInput = z.infer<
  typeof GenerateCoverLetterInputSchema
>;

export const GenerateCoverLetterOutputSchema = z.object({
  coverLetter: z.string().describe('The generated cover letter text.'),
});
export type GenerateCoverLetterOutput = z.infer<
  typeof GenerateCoverLetterOutputSchema
>;

export async function generateCoverLetter(
  input: GenerateCoverLetterInput
): Promise<GenerateCoverLetterOutput> {
  return generateCoverLetterFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCoverLetterPrompt',
  input: {schema: GenerateCoverLetterInputSchema},
  output: {schema: GenerateCoverLetterOutputSchema},
  prompt: `You are an expert career coach specializing in writing compelling cover letters for students and professionals.
Your task is to write a personalized and professional cover letter based on the provided resume content and the job description.

**Instructions:**
1.  Start with a strong opening that grabs the reader's attention.
2.  Analyze the job description to identify key requirements, skills, and qualifications.
3.  Scan the user's resume to find relevant experiences, skills, and projects that match the job description.
4.  In the body of the cover letter, highlight 2-3 key qualifications from the resume, explaining how they make the candidate a great fit for the role. Use specific examples.
5.  Maintain a professional and enthusiastic tone.
6.  Conclude with a strong closing and a call to action (e.g., requesting an interview).
7.  The cover letter should be addressed generically (e.g., "Dear Hiring Manager,") unless a name is provided.
8.  The user's name is {{{userName}}}. Make sure to sign off with their name.

**User's Name:**
{{{userName}}}

**Resume Content:**
{{{resumeContent}}}

**Job Description:**
{{{jobDescription}}}
`,
});

const generateCoverLetterFlow = ai.defineFlow(
  {
    name: 'generateCoverLetterFlow',
    inputSchema: GenerateCoverLetterInputSchema,
    outputSchema: GenerateCoverLetterOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// src/ai/flows/career-summary-generation.ts
'use server';

/**
 * @fileOverview Generates a professional career summary or objective for a resume.
 *
 * - generateCareerSummary - A function to generate the career summary.
 * - CareerSummaryInput - The input type for the generateCareerSummary function.
 * - CareerSummaryOutput - The return type for the generateCareerSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CareerSummaryInputSchema = z.object({
  experienceLevel: z
    .enum(['student', 'professional', 'executive'])
    .describe('The experience level of the user.'),
  jobTitle: z.string().describe('The job title the user is applying for.'),
  skills: z.string().describe('A list of skills the user possesses.'),
  experienceSummary: z.string().describe('A summary of the user\'s work experience.'),
});
export type CareerSummaryInput = z.infer<typeof CareerSummaryInputSchema>;

const CareerSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated career summary/objective.'),
});
export type CareerSummaryOutput = z.infer<typeof CareerSummaryOutputSchema>;

export async function generateCareerSummary(input: CareerSummaryInput): Promise<CareerSummaryOutput> {
  return generateCareerSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'careerSummaryPrompt',
  input: {schema: CareerSummaryInputSchema},
  output: {schema: CareerSummaryOutputSchema},
  prompt: `You are a professional resume writer. Generate a concise and impactful career summary or objective for a resume based on the user's experience level, job title, skills, and experience summary.

Experience Level: {{{experienceLevel}}}
Job Title: {{{jobTitle}}}
Skills: {{{skills}}}
Experience Summary: {{{experienceSummary}}}

Career Summary:`, // Removed Handlebars await keyword
});

const generateCareerSummaryFlow = ai.defineFlow(
  {
    name: 'generateCareerSummaryFlow',
    inputSchema: CareerSummaryInputSchema,
    outputSchema: CareerSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// use server'
'use server';
/**
 * @fileOverview An AI-powered resume generation flow for fresher.
 *
 * - generateAiResume - A function that generates a resume based on user input.
 * - GenerateAiResumeInput - The input type for the generateAiResume function.
 * - GenerateAiResumeOutput - The return type for the generateAiResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateAiResumeInputSchema = z.object({
  jobTitle: z.string().describe('The target job title for the resume.'),
  skills: z.string().describe('A comma-separated list of skills.'),
  experience: z
    .string()
    .optional()
    .describe('A brief description of any relevant experience.'),
});
export type GenerateAiResumeInput = z.infer<typeof GenerateAiResumeInputSchema>;

const GenerateAiResumeOutputSchema = z.object({
  resumeContent: z.string().describe('The generated resume content.'),
});
export type GenerateAiResumeOutput = z.infer<typeof GenerateAiResumeOutputSchema>;

export async function generateAiResume(input: GenerateAiResumeInput): Promise<GenerateAiResumeOutput> {
  return generateAiResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAiResumePrompt',
  input: {schema: GenerateAiResumeInputSchema},
  output: {schema: GenerateAiResumeOutputSchema},
  prompt: `You are an AI resume writer specializing in creating resumes for freshers.

  Based on the job title, skills, and experience provided, generate a compelling resume.
  The resume should be well-structured and highlight the candidate's strengths.

  Job Title: {{{jobTitle}}}
  Skills: {{{skills}}}
  Experience: {{{experience}}}

  Resume Content:`,
});

const generateAiResumeFlow = ai.defineFlow(
  {
    name: 'generateAiResumeFlow',
    inputSchema: GenerateAiResumeInputSchema,
    outputSchema: GenerateAiResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

// 'use server';

/**
 * @fileOverview Provides suggestions on how to improve the language and impact of the content in a resume, with a focus on ATS compatibility.
 *
 * - getResumeImprovementSuggestions - A function that suggests improvements for resume content.
 * - ResumeImprovementSuggestionsInput - The input type for the getResumeImprovementSuggestions function.
 * - ResumeImprovementSuggestionsOutput - The return type for the getResumeImprovementSuggestions function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeImprovementSuggestionsInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The full text content of the resume to be improved.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to tailor the resume to and check for ATS keywords.'),
});

export type ResumeImprovementSuggestionsInput = z.infer<
  typeof ResumeImprovementSuggestionsInputSchema
>;

const ResumeImprovementSuggestionItemSchema = z.object({
  problem: z.string().describe('A brief description of the identified problem in the resume.'),
  suggestion: z.string().describe('A specific, actionable suggestion to fix the problem.'),
  category: z.enum(['Keyword Optimization', 'Formatting', 'Clarity & Impact', 'Completeness']).describe('The category of the issue.'),
});

const ResumeImprovementSuggestionsOutputSchema = z.object({
  atsScore: z.number().min(0).max(100).int().describe('An estimated ATS compatibility score from 0 to 100, as an integer.'),
  overallFeedback: z.string().describe('A brief, high-level summary of the resume\'s strengths and areas for improvement.'),
  suggestions: z.array(ResumeImprovementSuggestionItemSchema).describe('A list of detailed problems and suggestions for improvement.'),
});


export type ResumeImprovementSuggestionsOutput = z.infer<
  typeof ResumeImprovementSuggestionsOutputSchema
>;

export async function getResumeImprovementSuggestions(
  input: ResumeImprovementSuggestionsInput
): Promise<ResumeImprovementSuggestionsOutput> {
  return resumeImprovementSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeImprovementSuggestionsPrompt',
  input: {
    schema: ResumeImprovementSuggestionsInputSchema,
  },
  output: {
    schema: ResumeImprovementSuggestionsOutputSchema,
  },
  prompt: `You are an AI resume expert specializing in Applicant Tracking System (ATS) optimization and overall resume effectiveness.
Analyze the provided resume content. If a job description is included, pay close attention to it for keyword alignment and relevance.

Resume Content:
{{{resumeContent}}}

{{#if jobDescription}}
Job Description for ATS keyword analysis and tailoring:
{{{jobDescription}}}
{{/if}}

Based on your analysis, provide a response in the required JSON format.
1.  **atsScore**: Calculate an ATS compatibility score as an integer from 0 to 100. This should be based on factors like keyword matching with the job description, resume structure, action verbs, and clarity.
2.  **overallFeedback**: Write a brief, high-level summary of the resume's strengths and main areas for improvement.
3.  **suggestions**: Generate a list of specific, actionable suggestions. For each suggestion, provide:
    *   **problem**: A short description of the issue found.
    *   **suggestion**: A clear recommendation on how to fix it.
    *   **category**: Classify the issue into one of the following: 'Keyword Optimization', 'Formatting', 'Clarity & Impact', or 'Completeness'.
`,
});

const resumeImprovementSuggestionsFlow = ai.defineFlow(
  {
    name: 'resumeImprovementSuggestionsFlow',
    inputSchema: ResumeImprovementSuggestionsInputSchema,
    outputSchema: ResumeImprovementSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

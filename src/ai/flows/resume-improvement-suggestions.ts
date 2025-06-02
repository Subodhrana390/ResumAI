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

const ResumeImprovementSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of actionable suggestions to improve the resume content for ATS and human readability.'),
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

Provide a list of specific, actionable suggestions to improve the resume. Focus on:
1.  ATS Compatibility:
    *   Incorporating relevant keywords from the job description (if provided).
    *   Using standard resume sections and clear, parsable formatting.
    *   Advising on the use of action verbs.
    *   Identifying elements that might be problematic for ATS (e.g., over-reliance on tables, graphics if implied by content structure).
2.  Impact and Clarity:
    *   Enhancing the impact of bullet points and summaries (e.g., quantifying achievements).
    *   Improving conciseness and readability for human reviewers.
    *   Correcting any grammatical errors or awkward phrasing.
3.  Completeness:
    *   Suggesting any missing information that might be crucial (especially if a job description is provided).

Suggestions (as a numbered list of actionable items):
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

// 'use server';

/**
 * @fileOverview Provides suggestions on how to improve the language and impact of the content in a resume.
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
    .describe('The content of the resume to be improved.'),
  jobDescription: z
    .string()
    .optional()
    .describe('The job description to tailor the resume to.'),
});

export type ResumeImprovementSuggestionsInput = z.infer<
  typeof ResumeImprovementSuggestionsInputSchema
>;

const ResumeImprovementSuggestionsOutputSchema = z.object({
  suggestions: z
    .array(z.string())
    .describe('A list of suggestions to improve the resume content.'),
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
  prompt: `You are an AI resume expert. Provide suggestions on how to improve the resume content below to make it more compelling to recruiters. Focus on improving the language and impact of the content.

Resume Content: {{{resumeContent}}}

{% if jobDescription %}
Here is the job description to tailor the resume to:

Job Description: {{{jobDescription}}}
{% endif %}

Suggestions (as a numbered list):
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

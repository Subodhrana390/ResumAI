
'use server';
/**
 * @fileOverview Suggests relevant skills for a resume based on job title and existing skills.
 *
 * - suggestSkills - A function to suggest skills.
 * - SuggestSkillsInput - The input type for the suggestSkills function.
 * - SuggestSkillsOutput - The return type for the suggestSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const SuggestSkillsInputSchema = z.object({
  jobTitle: z.string().describe('The target job title for the resume.'),
  existingSkills: z
    .array(z.string())
    .optional()
    .describe('An optional list of skills the user already has.'),
  jobDescription: z
    .string()
    .optional()
    .describe('An optional job description to extract keywords from.'),
});
export type SuggestSkillsInput = z.infer<typeof SuggestSkillsInputSchema>;

const SuggestSkillsOutputSchema = z.object({
  suggestedSkills: z
    .array(z.string())
    .describe(
      'A list of suggested skills, including technical and soft skills. Duplicates from existing skills should be avoided.'
    ),
});
export type SuggestSkillsOutput = z.infer<typeof SuggestSkillsOutputSchema>;

export async function suggestSkills(input: SuggestSkillsInput): Promise<SuggestSkillsOutput> {
  return suggestSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestSkillsPrompt',
  input: {schema: SuggestSkillsInputSchema},
  output: {schema: SuggestSkillsOutputSchema},
  prompt: `You are an expert career advisor and resume writer.
Based on the provided job title, and optionally existing skills and a job description, suggest a list of 5-10 relevant skills.
These skills should be a mix of technical (hard skills) and soft skills.
Avoid suggesting skills that are already listed in 'existingSkills'.
Prioritize skills commonly found in candidates for the 'jobTitle'.
If a 'jobDescription' is provided, extract relevant keywords and include them as skills.

Job Title: {{{jobTitle}}}

{{#if existingSkills}}
Existing Skills (do not suggest these):
{{#each existingSkills}}
- {{{this}}}
{{/each}}
{{/if}}

{{#if jobDescription}}
Job Description for keyword extraction:
{{{jobDescription}}}
{{/if}}

Suggested Skills (provide a list of strings):
`,
});

const suggestSkillsFlow = ai.defineFlow(
  {
    name: 'suggestSkillsFlow',
    inputSchema: SuggestSkillsInputSchema,
    outputSchema: SuggestSkillsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    // Ensure unique skills and filter out any empty strings just in case
    const uniqueSkills = output?.suggestedSkills
      ? Array.from(new Set(output.suggestedSkills.filter(skill => skill.trim() !== '')))
      : [];
    return { suggestedSkills: uniqueSkills };
  }
);

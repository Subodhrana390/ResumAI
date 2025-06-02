
'use server';
/**
 * @fileOverview Generates impactful bullet points for work experience sections of a resume.
 *
 * - generateExperienceBulletPoints - A function to generate bullet points.
 * - GenerateExperienceBulletPointsInput - The input type for the function.
 * - GenerateExperienceBulletPointsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateExperienceBulletPointsInputSchema = z.object({
  jobTitle: z.string().describe('The job title.'),
  company: z.string().describe('The company name.'),
  existingResponsibilities: z
    .array(z.string())
    .optional()
    .describe(
      'Optional list of existing bullet points for context or refinement.'
    ),
  userPrompt: z
    .string()
    .optional()
    .describe('Optional user prompt for specific focus.'),
});
export type GenerateExperienceBulletPointsInput = z.infer<
  typeof GenerateExperienceBulletPointsInputSchema
>;

const GenerateExperienceBulletPointsOutputSchema = z.object({
  generatedBulletPoints: z
    .array(z.string())
    .describe('A list of generated bullet points for the work experience.'),
});
export type GenerateExperienceBulletPointsOutput = z.infer<
  typeof GenerateExperienceBulletPointsOutputSchema
>;

export async function generateExperienceBulletPoints(
  input: GenerateExperienceBulletPointsInput
): Promise<GenerateExperienceBulletPointsOutput> {
  return generateExperienceBulletPointsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateExperienceBulletPointsPrompt',
  input: {schema: GenerateExperienceBulletPointsInputSchema},
  output: {schema: GenerateExperienceBulletPointsOutputSchema},
  prompt: `You are an expert resume writer. You specialize in crafting impactful bullet points for work experience sections.
Given the following details:
Job Title: {{{jobTitle}}}
Company: {{{company}}}
{{#if existingResponsibilities.length}}
Current bullet points (for context, refinement, or to add to):
{{#each existingResponsibilities}}
- {{{this}}}
{{/each}}
{{else}}
There are no existing bullet points. Please generate a new set.
{{/if}}
{{#if userPrompt}}
Specific focus requested by user: {{{userPrompt}}}
{{/if}}

Please generate 3 to 5 concise, professional, and achievement-oriented bullet points.
Use strong action verbs. Quantify accomplishments where possible.
The output should be a list of bullet points.`,
});

const generateExperienceBulletPointsFlow = ai.defineFlow(
  {
    name: 'generateExperienceBulletPointsFlow',
    inputSchema: GenerateExperienceBulletPointsInputSchema,
    outputSchema: GenerateExperienceBulletPointsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

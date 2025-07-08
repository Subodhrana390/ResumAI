'use server';
/**
 * @fileOverview Optimizes a LinkedIn profile's headline and summary.
 *
 * - optimizeLinkedInProfile - A function to generate profile suggestions.
 * - OptimizeLinkedInProfileInput - The input type for the function.
 * - OptimizeLinkedInProfileOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const OptimizeLinkedInProfileInputSchema = z.object({
  currentSummary: z
    .string()
    .describe("The user's current LinkedIn 'About' section or summary."),
  targetRoles: z
    .string()
    .describe('A comma-separated list of job titles the user is targeting.'),
  skills: z.array(z.string()).optional().describe("A list of the user's top skills."),
});
export type OptimizeLinkedInProfileInput = z.infer<
  typeof OptimizeLinkedInProfileInputSchema
>;

const OptimizeLinkedInProfileOutputSchema = z.object({
  optimizedHeadline: z
    .string()
    .describe(
      'A generated, keyword-rich LinkedIn headline (max 220 characters).'
    ),
  optimizedSummary: z
    .string()
    .describe("A generated, impactful LinkedIn 'About' section summary."),
});
export type OptimizeLinkedInProfileOutput = z.infer<
  typeof OptimizeLinkedInProfileOutputSchema
>;

export async function optimizeLinkedInProfile(
  input: OptimizeLinkedInProfileInput
): Promise<OptimizeLinkedInProfileOutput> {
  return optimizeLinkedInProfileFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeLinkedInProfilePrompt',
  input: {schema: OptimizeLinkedInProfileInputSchema},
  output: {schema: OptimizeLinkedInProfileOutputSchema},
  prompt: `You are a LinkedIn branding expert and career coach. Your task is to rewrite a user's LinkedIn headline and summary to attract recruiters for specific roles.

**Instructions:**
1.  **Headline:** Create a concise, keyword-rich headline (under 220 characters). It should clearly state the user's professional identity and aspirations based on their target roles and skills.
2.  **Summary:** Write a compelling 'About' section summary. It should be written in the first person. Start with a hook, elaborate on the user's key skills and experiences (from their current summary and skills list), and end with a call-to-action (e.g., "Feel free to connect with me..."). The summary should be optimized with keywords from the target roles.

**Target Job Roles:**
{{{targetRoles}}}

**User's Current Summary:**
{{{currentSummary}}}

{{#if skills}}
**User's Top Skills:**
{{#each skills}}
- {{{this}}}
{{/each}}
{{/if}}
`,
});

const optimizeLinkedInProfileFlow = ai.defineFlow(
  {
    name: 'optimizeLinkedInProfileFlow',
    inputSchema: OptimizeLinkedInProfileInputSchema,
    outputSchema: OptimizeLinkedInProfileOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

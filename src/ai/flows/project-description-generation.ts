'use server';
/**
 * @fileOverview Generates impactful bullet points for a project section of a resume.
 *
 * - generateProjectDescriptions - A function to generate bullet points.
 * - GenerateProjectDescriptionsInput - The input type for the function.
 * - GenerateProjectDescriptionsOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateProjectDescriptionsInputSchema = z.object({
  projectName: z.string().describe('The name of the project.'),
  technologies: z
    .array(z.string())
    .describe('A list of technologies used in the project.'),
  existingDescriptions: z
    .array(z.string())
    .optional()
    .describe('Optional list of existing bullet points for context or refinement.'),
});
export type GenerateProjectDescriptionsInput = z.infer<
  typeof GenerateProjectDescriptionsInputSchema
>;

const GenerateProjectDescriptionsOutputSchema = z.object({
  generatedDescriptions: z
    .array(z.string())
    .describe('A list of generated bullet points for the project.'),
});
export type GenerateProjectDescriptionsOutput = z.infer<
  typeof GenerateProjectDescriptionsOutputSchema
>;

export async function generateProjectDescriptions(
  input: GenerateProjectDescriptionsInput
): Promise<GenerateProjectDescriptionsOutput> {
  return generateProjectDescriptionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateProjectDescriptionsPrompt',
  input: {schema: GenerateProjectDescriptionsInputSchema},
  output: {schema: GenerateProjectDescriptionsOutputSchema},
  prompt: `You are an expert resume writer for students and recent graduates. You specialize in framing academic and personal projects to sound like professional experience.
Given the following project details:
Project Name: {{{projectName}}}
Technologies Used: {{#each technologies}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

{{#if existingDescriptions}}
Current bullet points (for context, refinement, or to add to):
{{#each existingDescriptions}}
- {{{this}}}
{{/each}}
{{else}}
There are no existing bullet points. Please generate a new set.
{{/if}}

Please generate 3 to 4 concise, professional, and achievement-oriented bullet points that describe this project.
Focus on the impact and results of the project. Use strong action verbs. Quantify outcomes where possible (e.g., "Improved performance by 15%," "Handled 1000s of data points").
The output should be a list of bullet points.`,
});

const generateProjectDescriptionsFlow = ai.defineFlow(
  {
    name: 'generateProjectDescriptionsFlow',
    inputSchema: GenerateProjectDescriptionsInputSchema,
    outputSchema: GenerateProjectDescriptionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

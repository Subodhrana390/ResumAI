'use server';
/**
 * @fileOverview Provides an automated peer review for a resume.
 *
 * - getAutomatedReview - A function that provides automated feedback.
 * - AutomatedReviewInput - The input type for the function.
 * - AutomatedReviewOutput - The return type for the function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const AutomatedReviewInputSchema = z.object({
  resumeContent: z
    .string()
    .describe('The full text content of the resume to be reviewed.'),
});
export type AutomatedReviewInput = z.infer<typeof AutomatedReviewInputSchema>;

const ReviewFeedbackSchema = z.object({
  positivePoints: z.array(z.string()).describe("A list of positive points and strengths found in the resume."),
  areasForImprovement: z.array(z.string()).describe("A list of actionable suggestions for improvement."),
});

const AutomatedReviewOutputSchema = z.object({
  review: ReviewFeedbackSchema
});
export type AutomatedReviewOutput = z.infer<typeof AutomatedReviewOutputSchema>;


export async function getAutomatedReview(
  input: AutomatedReviewInput
): Promise<AutomatedReviewOutput> {
  return automatedResumeReviewFlow(input);
}

const prompt = ai.definePrompt({
  name: 'automatedResumeReviewPrompt',
  input: {
    schema: AutomatedReviewInputSchema,
  },
  output: {
    schema: AutomatedReviewOutputSchema,
  },
  prompt: `You are an AI career coach acting as a friendly peer reviewer.
Analyze the provided resume content. Your tone should be encouraging and constructive, like a helpful classmate.

Resume Content:
{{{resumeContent}}}

Based on your analysis, provide a response in the required JSON format.
1.  **positivePoints**: Identify 2-3 things the user has done well. Be specific (e.g., "You've used strong action verbs in your experience section," or "Your project descriptions clearly state the technologies used.").
2.  **areasForImprovement**: Provide 2-3 clear, actionable suggestions for improvement. Frame them as friendly advice (e.g., "Maybe you could try to quantify the impact of your work in the first experience bullet point," or "Consider adding a brief summary at the top to quickly grab the recruiter's attention.").
`,
});

const automatedResumeReviewFlow = ai.defineFlow(
  {
    name: 'automatedResumeReviewFlow',
    inputSchema: AutomatedReviewInputSchema,
    outputSchema: AutomatedReviewOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

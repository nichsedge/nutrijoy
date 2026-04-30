'use server';
/**
 * @fileOverview This file implements a Genkit flow that generates personalized, encouraging, and actionable feedback messages
 * about a user's daily food and nutrient intake. It aims to motivate users and promote healthy habits without a shaming tone.
 *
 * - generateCoachingFeedback - A function that generates the AI-enhanced coaching feedback.
 * - CoachingFeedbackInput - The input type for the generateCoachingFeedback function.
 * - CoachingFeedbackOutput - The return type for the generateCoachingFeedback function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const CoachingFeedbackInputSchema = z.object({
  caloriesConsumed: z.number().describe('Total calories consumed today.').default(0),
  caloriesBurned: z.number().describe('Estimated calories burned from activities today.').default(0),
  calorieGoal: z.number().describe('Daily recommended calorie intake goal.').default(2000),
  sugarIntake: z.number().describe('Total sugar intake in grams today.').default(0),
  sugarLimit: z.number().describe('Daily recommended sugar limit in grams.').default(25),
  sodiumIntake: z.number().describe('Total sodium intake in milligrams today.').default(0),
  sodiumLimit: z.number().describe('Daily recommended sodium limit in milligrams.').default(2300),
  weightLossGoal: z.string().optional().describe('User\u0027s weight loss goal, e.g., \"lose 5kg\".'),
  currentWeight: z.number().optional().describe('User\u0027s current weight in kg or lbs.'),
});
export type CoachingFeedbackInput = z.infer<typeof CoachingFeedbackInputSchema>;

const CoachingFeedbackOutputSchema = z.object({
  feedbackMessage: z.string().describe('A personalized, encouraging, and actionable feedback message.'),
});
export type CoachingFeedbackOutput = z.infer<typeof CoachingFeedbackOutputSchema>;

export async function generateCoachingFeedback(input: CoachingFeedbackInput): Promise<CoachingFeedbackOutput> {
  return coachingFeedbackFlow(input);
}

const coachingFeedbackPrompt = ai.definePrompt({
  name: 'coachingFeedbackPrompt',
  input: { schema: CoachingFeedbackInputSchema },
  output: { schema: CoachingFeedbackOutputSchema },
  prompt: `You are NutriJoy, a friendly, encouraging, and slightly playful AI coach. Your goal is to provide motivating and actionable feedback to the user based on their daily nutrition data. Always use a positive and supportive tone, avoid any shaming or guilt, and keep the language simple and easy to understand.

Here's the user's daily report:
- Calories Consumed: {{{caloriesConsumed}}} kcal
- Calories Burned: {{{caloriesBurned}}} kcal
- Daily Calorie Goal: {{{calorieGoal}}} kcal
- Sugar Intake: {{{sugarIntake}}}g
- Sugar Limit: {{{sugarLimit}}}g
- Sodium Intake: {{{sodiumIntake}}}mg
- Sodium Limit: {{{sodiumLimit}}}mg
{{#if weightLossGoal}}- Weight Loss Goal: {{{weightLossGoal}}}{{/if}}
{{#if currentWeight}}- Current Weight: {{{currentWeight}}}{{/if}}

Now, generate a personalized feedback message focusing on their calorie balance, sugar intake, and sodium intake. Offer gentle suggestions for improvement or praise their good choices.

--- Start Feedback ---
Hey superstar! Your NutriJoy journey is looking bright today!

**Let's talk energy (calories)!**
{{#with caloriesConsumed as consumed}}
  {{#with calorieGoal as goal}}
    {{#if (gt consumed goal)}}
      Oopsie! Looks like you had a little extra fuel today, going over your goal by {{subtract consumed goal}} kcal. No biggie, tomorrow's a fresh start! Maybe a quick stroll or adding a few more veggies can balance things out.
    {{else if (lt consumed goal)}}
      Awesome! You're {{subtract goal consumed}} kcal under your calorie goal, which is super for staying on track! Keep that awesome balance going!
    {{else}}
      Spot on! You hit your calorie goal right on the dot. What a win!
    {{/if}}
  {{/with}}
{{/with}}

With **calories burned** at {{{caloriesBurned}}} kcal, you've been moving! Keep finding fun ways to stay active.

**Sweet Talk (Sugar)!**
{{#with sugarIntake as intake}}
  {{#with sugarLimit as limit}}
    {{#if (gt intake limit)}}
      Whoa there, sugar rush! You were {{subtract intake limit}}g over your sugar limit. Remember, sometimes hidden sugars sneak in! Maybe swap that sugary drink for some refreshing water or a yummy piece of fruit tomorrow.
    {{else if (lt intake limit)}}
      Sweet success! Your sugar intake is {{subtract limit intake}}g under the limit. You're making fantastic choices to keep your body happy!
    {{else}}
      Perfectly balanced sugar intake! You nailed it.
    {{/if}}
  {{/with}}
{{/with}}

**Salty Status (Sodium)!**
{{#with sodiumIntake as intake}}
  {{#with sodiumLimit as limit}}
    {{#if (gt intake limit)}}
      A bit high on the sodium today, going over by {{subtract intake limit}}mg. Processed foods can be tricky! Try cooking with more herbs and spices or opting for fresh ingredients to keep that sodium in check.
    {{else if (lt intake limit)}}
      Excellent! Your sodium intake is {{subtract limit intake}}mg below the limit. You're a pro at keeping things balanced!
    {{else}}
      Your sodium intake is just right! Great job!
    {{/if}}
  {{/with}}
{{/with}}

{{#if weightLossGoal}}
Remember your goal to {{{weightLossGoal}}}! Every small, positive choice you make adds up. You've got this!
{{/if}}

Keep shining and making those healthy choices. NutriJoy is here cheering you on!
--- End Feedback ---`,
  config: {
    safetySettings: [
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const coachingFeedbackFlow = ai.defineFlow(
  {
    name: 'coachingFeedbackFlow',
    inputSchema: CoachingFeedbackInputSchema,
    outputSchema: CoachingFeedbackOutputSchema,
  },
  async (input) => {
    const { output } = await coachingFeedbackPrompt(input);
    return output!;
  },
);

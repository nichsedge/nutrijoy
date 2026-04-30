'use server';
/**
 * @fileOverview A Genkit flow for parsing natural language food descriptions into structured data.
 *
 * - naturalLanguageFoodLogging - A function that processes natural language food input.
 * - NaturalLanguageFoodLoggingInput - The input type for the naturalLanguageFoodLogging function.
 * - NaturalLanguageFoodLoggingOutput - The return type for the naturalLanguageFoodLogging function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FoodItemSchema = z.object({
  name: z.string().describe('The name of the food item, e.g., "apple", "yogurt"'),
  quantity: z
    .string()
    .describe('The quantity or size of the food item, e.g., "large", "1 cup", "150g"'),
  estimatedCalories: z.number().describe('Estimated total calories for this food item and quantity.'),
  estimatedSugar: z.number().describe('Estimated sugar content in grams for this food item and quantity.'),
  estimatedSodium: z
    .number()
    .describe('Estimated sodium content in milligrams for this food item and quantity.'),
});

const NaturalLanguageFoodLoggingInputSchema = z
  .string()
  .describe('A natural language description of food items consumed, e.g., "a large apple and a yogurt"');
export type NaturalLanguageFoodLoggingInput = z.infer<typeof NaturalLanguageFoodLoggingInputSchema>;

const NaturalLanguageFoodLoggingOutputSchema = z.array(FoodItemSchema);
export type NaturalLanguageFoodLoggingOutput = z.infer<typeof NaturalLanguageFoodLoggingOutputSchema>;

export async function naturalLanguageFoodLogging(input: NaturalLanguageFoodLoggingInput): Promise<NaturalLanguageFoodLoggingOutput> {
  return naturalLanguageFoodLoggingFlow(input);
}

const naturalLanguageFoodLoggingPrompt = ai.definePrompt({
  name: 'naturalLanguageFoodLoggingPrompt',
  input: {schema: NaturalLanguageFoodLoggingInputSchema},
  output: {schema: NaturalLanguageFoodLoggingOutputSchema},
  prompt: `You are an AI assistant specialized in nutrition tracking for the NutriJoy app.
Your task is to parse natural language descriptions of food intake and extract individual food items, their quantities, and provide reasonable estimations for calories, sugar (in grams), and sodium (in milligrams).

Follow these rules strictly:
1.  **Extract all distinct food items** mentioned in the input.
2.  **Determine the quantity or size** of each food item. If a quantity is ambiguous (e.g., 'a large apple'), represent it descriptively (e.g., 'large'). If no specific quantity is mentioned, assume a standard serving size and describe it (e.g., '1 cup', '1 serving').
3.  **Provide reasonable, common average estimates** for estimatedCalories, estimatedSugar, and estimatedSodium for each food item based on its name and quantity. If nutritional data is not perfectly known, make a well-informed estimate. All values should be numbers.
4.  **Respond ONLY with a JSON array** of objects, where each object represents a food item and strictly adheres to the provided output schema. Do not include any other text, explanations, or formatting outside the JSON.

Here is the natural language input: "{{{input}}}"
`,
});

const naturalLanguageFoodLoggingFlow = ai.defineFlow(
  {
    name: 'naturalLanguageFoodLoggingFlow',
    inputSchema: NaturalLanguageFoodLoggingInputSchema,
    outputSchema: NaturalLanguageFoodLoggingOutputSchema,
  },
  async input => {
    const {output} = await naturalLanguageFoodLoggingPrompt(input);
    return output!;
  }
);

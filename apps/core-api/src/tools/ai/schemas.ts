import z from 'zod';

export const transactionCategoryOutputSchema = z.object({
  transactionType: z.enum(['expense', 'income']).describe('Whether this is an expense or income transaction'),
  transactionDescription: z
    .string()
    .min(1)
    .describe(
      'A brief description of the transaction, suitable for use as a transaction description. This must be provided',
    ),
  transactionAmount: z.number().positive().describe('The monetary amount extracted from the transaction description'),
  transactionDate: z
    .string()
    .describe(
      'The date and time of the transaction in ISO 8601 format (e.g., 2025-10-11T12:00:00.000Z). If you cannot infer the date from the user input, use the current date. Always use noon (12:00:00) as the time component.',
    ),
  suggestedCategory: z.object({
    existingCategoryId: z
      .string()
      .describe('The ID of the existing category that was suggested, empty string if not selected'),
    newCategoryName: z
      .string()
      .describe('The name of the new category that was suggested, empty string if not selected'),
  }),
  newCategorySuggested: z
    .boolean()
    .describe('True if a new category was suggested, false if an existing category was selected'),
});

export type TransactionCategoryResult = z.infer<typeof transactionCategoryOutputSchema>;

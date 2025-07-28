import z from 'zod';

export const transactionCategoryOutputSchema = z.object({
  transactionType: z.enum(['expense', 'income']).describe('Whether this is an expense or income transaction'),
  transactionAmount: z.number().positive().describe('The monetary amount extracted from the transaction description'),
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

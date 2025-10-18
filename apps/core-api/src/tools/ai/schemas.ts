import z from 'zod';

export const transactionCategoryOutputSchema = z
  .object({
    transactionType: z.enum(['expense', 'income']).describe('Whether this is an expense or income transaction'),
    transactionDescription: z
      .string()
      .min(1)
      .max(200)
      .describe(
        'A brief description of the transaction, suitable for use as a transaction description. This must be provided',
      ),
    transactionAmount: z.number().positive().describe('The monetary amount extracted from the transaction description'),
    transactionDate: z
      .string()
      .refine(
        (val) => {
          // Accept ISO 8601 format with milliseconds and Z timezone
          // Example: 2025-10-11T12:00:00.000Z
          return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(val);
        },
        {
          message: 'Date must be in ISO 8601 format with milliseconds and Z timezone (e.g., 2025-10-11T12:00:00.000Z)',
        },
      )
      .describe(
        'The date and time of the transaction in ISO 8601 format (e.g., 2025-10-11T12:00:00.000Z). If you cannot infer the date from the user input, use the current date. Always use noon (12:00:00) as the time component.',
      ),
    suggestedCategory: z.object({
      existingCategoryId: z
        .string()
        .max(100)
        .describe('The ID of the existing category that was suggested, empty string if not selected'),
      newCategoryName: z
        .string()
        .max(100)
        .describe('The name of the new category that was suggested, empty string if not selected'),
    }),
    newCategorySuggested: z
      .boolean()
      .describe('True if a new category was suggested, false if an existing category was selected'),
  })
  .strict();

export type TransactionCategoryResult = z.infer<typeof transactionCategoryOutputSchema>;

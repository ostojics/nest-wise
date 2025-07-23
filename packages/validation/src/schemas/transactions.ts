import {z} from 'zod';

export const TransactionTypeEnum = z.enum(['income', 'expense']);

export const createTransactionSchema = z.object({
  householdId: z.string().uuid('Household ID must be a valid UUID'),
  accountId: z.string().uuid('Account ID must be a valid UUID'),
  categoryId: z.string().uuid('Category ID must be a valid UUID'),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
  type: TransactionTypeEnum,
  description: z.string().max(1000, 'Description must be 1000 characters or less'),
  isReconciled: z.boolean().default(true),
});

export const updateTransactionSchema = z.object({
  categoryId: z.string().uuid('Category ID must be a valid UUID').nullable().optional(),
  amount: z.coerce.number().min(0.01, 'Amount must be greater than 0').optional(),
  type: TransactionTypeEnum.optional(),
  description: z.string().max(1000, 'Description must be 1000 characters or less').nullable().optional(),
  isReconciled: z.boolean().optional(),
});

export const transactionResponseSchema = z.object({
  id: z.string().uuid(),
  householdId: z.string().uuid(),
  accountId: z.string().uuid(),
  categoryId: z.string().uuid().nullable(),
  amount: z.number(),
  type: TransactionTypeEnum,
  description: z.string().nullable(),
  isReconciled: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type TransactionResponseDTO = z.infer<typeof transactionResponseSchema>;

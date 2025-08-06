import {z} from 'zod';

export const TransactionTypeEnum = z.enum(['income', 'expense']);

export const TransactionSortFieldEnum = z.enum([
  'amount',
  '-amount',
  'type',
  '-type',
  'transactionDate',
  '-transactionDate',
  'createdAt',
  '-createdAt',
]);

export const createTransactionSchema = z
  .object({
    householdId: z.string().uuid('Household ID must be valid'),
    accountId: z.string().uuid('Account must be selected'),
    categoryId: z.string().uuid('Category must be selected'),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0'),
    type: TransactionTypeEnum,
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
    transactionDate: z.coerce.date(),
    isReconciled: z.boolean().default(true),
  })
  .strict();

export const createTransactionAiSchema = z
  .object({
    householdId: z.string().uuid('Household ID must be valid'),
    accountId: z.string().uuid('Account must be selected'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  })
  .strict();

export const updateTransactionSchema = z
  .object({
    categoryId: z.string().uuid('Category must be selected').nullable().optional(),
    amount: z.coerce.number().min(0.01, 'Amount must be greater than 0').optional(),
    type: TransactionTypeEnum.optional(),
    description: z.string().max(1000, 'Description must be 1000 characters or less').nullable().optional(),
    transactionDate: z.coerce.date().optional(),
    isReconciled: z.boolean().optional(),
  })
  .strict();

export const getTransactionsQuerySchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(20),
    sort: TransactionSortFieldEnum.optional(),
    householdId: z.string().uuid().optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    type: TransactionTypeEnum.optional(),
    transactionDate_from: z.string().date().optional(),
    transactionDate_to: z.string().date().optional(),
    q: z.string().optional(),
  })
  .strict();

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type CreateTransactionAiDTO = z.infer<typeof createTransactionAiSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsQueryDTO = z.infer<typeof getTransactionsQuerySchema>;
export type TransactionSortField = z.infer<typeof TransactionSortFieldEnum>;

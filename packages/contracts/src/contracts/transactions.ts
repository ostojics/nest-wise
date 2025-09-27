import {z} from 'zod';
import {AccountContract} from './accounts';
import {CategoryContract} from './categories';
import {PaginationMetaContract} from './interfaces/paginated-response';

export enum TransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface TransactionContract {
  id: string;
  householdId: string;
  accountId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  description: string;
  transactionDate: Date;
  isReconciled: boolean;
  createdAt: Date;
  updatedAt: Date;
  account?: AccountContract;
  category?: CategoryContract;
}

export interface GetTransactionsResponseContract {
  data: TransactionContract[];
  meta: PaginationMetaContract;
}

export interface NetWorthTrendPointContract {
  month: string;
  monthShort: string;
  amount: number | null;
  hasData: boolean;
}

export interface AccountSpendingPointContract {
  accountId: string;
  name: string;
  amount: number;
}

export interface SpendingTotalContract {
  total: number;
  count: number;
}

export interface CategorySpendingPointContract {
  categoryId: string | null;
  categoryName: string;
  amount: number;
}

export const getAccountsSpendingQuerySchema = z
  .object({
    transactionDate_from: z.string().date().min(1),
    transactionDate_to: z.string().date().min(1),
  })
  .strict();

// New household-scoped schema with simplified date parameters
export const getAccountsSpendingQueryHouseholdSchema = z
  .object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  })
  .strict();

export type GetAccountsSpendingQueryDTO = z.infer<typeof getAccountsSpendingQuerySchema>;
export type GetAccountsSpendingQueryHouseholdDTO = z.infer<typeof getAccountsSpendingQueryHouseholdSchema>;

// New household-scoped schema for spending aggregations - reusing existing query pattern
export const getSpendingSummaryQueryHouseholdSchema = z
  .object({
    from: z.string().date().optional(),
    to: z.string().date().optional(),
  })
  .strict();

export type GetSpendingSummaryQueryHouseholdDTO = z.infer<typeof getSpendingSummaryQueryHouseholdSchema>;

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
    categoryId: z.string().uuid('Category must be selected').nullable(),
    amount: z.coerce
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(10000000, 'Amount must be less than 10,000,000'),
    type: TransactionTypeEnum,
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
    transactionDate: z.coerce.date(),
    isReconciled: z.boolean().default(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.type === 'income' && val.categoryId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Income transactions must not have a category',
      });
    }
    if (val.type === 'expense' && val.categoryId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Expense transactions must have a category',
      });
    }
  });

// New household-scoped schema without householdId (provided in path)
export const createTransactionHouseholdSchema = z
  .object({
    accountId: z.string().uuid('Account must be selected'),
    categoryId: z.string().uuid('Category must be selected').nullable(),
    amount: z.coerce
      .number()
      .min(0.01, 'Amount must be greater than 0')
      .max(10000000, 'Amount must be less than 10,000,000'),
    type: TransactionTypeEnum,
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
    transactionDate: z.coerce.date(),
    isReconciled: z.boolean().default(true),
  })
  .strict()
  .superRefine((val, ctx) => {
    if (val.type === 'income' && val.categoryId !== null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Income transactions must not have a category',
      });
    }
    if (val.type === 'expense' && val.categoryId === null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['categoryId'],
        message: 'Expense transactions must have a category',
      });
    }
  });

export const createTransactionAiSchema = z
  .object({
    householdId: z.string().uuid('Household ID must be valid'),
    accountId: z.string().uuid('Account must be selected'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
  })
  .strict();

// New household-scoped schema without householdId (provided in path)
export const createTransactionAiHouseholdSchema = z
  .object({
    accountId: z.string().uuid('Account must be selected'),
    description: z.string().min(1, 'Description is required').max(1000, 'Description must be 1000 characters or less'),
    transactionDate: z.coerce.date().optional(),
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
    pageSize: z.coerce.number().min(1).max(100).default(15),
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

// New household-scoped schema without householdId (provided in path) with simplified date parameters
export const getTransactionsQueryHouseholdSchema = z
  .object({
    page: z.coerce.number().min(1).default(1),
    pageSize: z.coerce.number().min(1).max(100).default(15),
    sort: TransactionSortFieldEnum.optional(),
    accountId: z.string().uuid().optional(),
    categoryId: z.string().uuid().optional(),
    type: TransactionTypeEnum.optional(),
    from: z.string().date().optional(),
    to: z.string().date().optional(),
    q: z.string().optional(),
  })
  .strict();

export type CreateTransactionDTO = z.infer<typeof createTransactionSchema>;
export type CreateTransactionHouseholdDTO = z.infer<typeof createTransactionHouseholdSchema>;
export type CreateTransactionAiDTO = z.infer<typeof createTransactionAiSchema>;
export type CreateTransactionAiHouseholdDTO = z.infer<typeof createTransactionAiHouseholdSchema>;
export type UpdateTransactionDTO = z.infer<typeof updateTransactionSchema>;
export type GetTransactionsQueryDTO = z.infer<typeof getTransactionsQuerySchema>;
export type GetTransactionsQueryHouseholdDTO = z.infer<typeof getTransactionsQueryHouseholdSchema>;
export type TransactionSortField = z.infer<typeof TransactionSortFieldEnum>;

import {z} from 'zod';
import {PaginationMetaContract} from './interfaces/paginated-response';
import {AccountContract} from './accounts';

export enum PrivateTransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export interface PrivateTransactionContract {
  id: string;
  householdId: string;
  accountId: string;
  amount: number;
  type: PrivateTransactionType;
  description: string | null;
  transactionDate: string;
  account: Pick<AccountContract, 'id' | 'name'>;
  createdAt: string;
  updatedAt: string;
}

export interface GetPrivateTransactionsResponseContract {
  data: PrivateTransactionContract[];
  meta: PaginationMetaContract;
}

export const createPrivateTransactionSchema = z
  .object({
    householdId: z.string().uuid(),
    accountId: z.string().uuid(),
    amount: z.number().positive(),
    type: z.enum(['income', 'expense']),
    description: z.string().max(2048).nullable().optional(),
    transactionDate: z.string(),
  })
  .strict();

export type CreatePrivateTransactionDTO = z.infer<typeof createPrivateTransactionSchema>;

export const getPrivateTransactionsQuerySchema = z
  .object({
    householdId: z.string().uuid(),
    accountId: z.string().uuid().optional(),
    type: z.enum(['income', 'expense']).optional(),
    transactionDate_from: z.string().optional(),
    transactionDate_to: z.string().optional(),
    sort: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(15),
  })
  .strict();

export type GetPrivateTransactionsQueryDTO = z.infer<typeof getPrivateTransactionsQuerySchema>;
